import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";



const parseTimeToMins = (t) => {
  if (!t) return 0;
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    const [h, m] = t.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const calcMinutes = (pickup, drop) => {
  if (!pickup || !drop) return 0;
  const pMins = parseTimeToMins(pickup);
  const dMins = parseTimeToMins(drop);
  const diff = dMins - pMins;
  return diff > 0 ? diff : 0;
};
const fmt     = s => { if (!s) return ""; const d = new Date(s); return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };
const fmtTime = t => {
  if (!t) return "";
  if (t.includes("AM") || t.includes("PM")) return t;
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};
const fmtDuration = m => {
  if (m <= 0) return "";
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}m`;
  if (rem === 0) return `${h}h`;
  return `${h}h ${rem}m`;
};

const Svg = ({ children, size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const IcoStar     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoFuel     = () => <Svg><path d="M3 22V8l7-6 7 6v14"/><path d="M10 22v-4h4v4"/><path d="M14 10h2a2 2 0 0 1 2 2v2"/></Svg>;
const IcoSeat     = () => <Svg><path d="M20 9V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v11"/><path d="M6 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H6z"/></Svg>;
const IcoClock    = () => <Svg><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const IcoBack     = () => <Svg size={20}><polyline points="15 18 9 12 15 6"/></Svg>;
const IcoCalendar = () => <Svg><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>;
const IcoTag      = () => <Svg><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></Svg>;

// ── Booking Modal (bottom sheet on mobile) ────────────────────────────────────
const BookingModal = ({ vehicle, totalMins, date, pickup, drop, withHelmet, withDriver, onClose, onConfirm }) => {
  const isBike = vehicle.category === 'Bike';
  const isCar  = vehicle.category === 'Car';
  
  const baseTotal    = Math.round((vehicle.pricePerHour * totalMins) / 60);
  const gst          = Math.round(baseTotal * 0.18);
  const helmetCharge = (isBike && withHelmet) ? 50 : 0;
  const driverCharge = (isCar && withDriver) ? 400 : 0;
  const grandTotal   = baseTotal + gst + helmetCharge + driverCharge;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ 
          background: "rgba(255, 255, 255, 0.9)", 
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: "32px 32px 0 0", 
          width: "100%", maxWidth: "550px", 
          maxHeight: "92vh", overflowY: "auto", 
          boxShadow: "0 -20px 60px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          fontFamily: F
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.2)" }} />
        </div>

        <div style={{ position: "relative", height: "180px", margin: "15px 15px 0", borderRadius: "20px", overflow: "hidden" }}>
          <img src={vehicle.image} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "15px", left: "20px", right: "50px" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: "700", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>{vehicle.type}</p>
            <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "800", margin: "4px 0 0" }}>{vehicle.name}</h3>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.6)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}>
            <Svg size={14}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>
          </button>
        </div>

        <div style={{ padding: "20px 20px 35px" }}>
          <div style={{ background: "rgba(15,23,42,0.03)", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1px solid rgba(15,23,42,0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[{ label: "DATE", val: fmt(date) }, { label: "DURATION", val: fmtDuration(totalMins) }, { label: "PICKUP", val: fmtTime(pickup) }, { label: "DROP-OFF", val: fmtTime(drop) }].map(({ label, val }) => (
                <div key={label}>
                  <p style={{ fontSize: "10px", fontWeight: "800", color: "rgba(15,23,42,0.4)", textTransform: "uppercase", letterSpacing: "1.2px", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: SLATE, margin: "4px 0 0" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "25px", padding: "0 5px" }}>
            {[
              { label: `Base Fare (₹${vehicle.pricePerHour}/hr × ${Number((totalMins/60).toFixed(1))} hrs)`, val: `₹${baseTotal}` },
              { label: "Taxes & GST (18% on Base)", val: `₹${gst}` },
              ...(helmetCharge > 0 ? [{ label: "Helmet Charges", val: "₹50" }] : []),
              ...(driverCharge > 0 ? [{ label: "Driver Charges", val: "₹400" }] : [])
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(15,23,42,0.05)" }}>
                <span style={{ fontSize: "14px", color: "rgba(15,23,42,0.6)" }}>{label}</span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: SLATE }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0 0" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: SLATE }}>Grand Total</span>
              <span style={{ fontSize: "26px", fontWeight: "900", color: RED }}>₹{grandTotal}</span>
            </div>
          </div>

          <button onClick={() => onConfirm(vehicle, grandTotal)} style={{ width: "100%", padding: "16px", borderRadius: "16px", background: RED, border: "none", color: "#fff", fontSize: "16px", fontWeight: "900", cursor: "pointer", fontFamily: F, transition: "all .3s ease" }}>
            Confirm Booking
          </button>
          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(15,23,42,0.4)", marginTop: "16px", marginBottom: 0, fontWeight: 700, letterSpacing: "0.3px" }}>Free cancellation up to 1 hour before pickup</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VehicleResults() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();

  const vehicleType = params.get("type")   || "bike";
  const date        = params.get("date")   || "";
  const pickup      = params.get("pickup") || "";
  const drop        = params.get("drop")   || "";
  const withHelmet  = params.get("helmet") === '1' || params.get("helmet") === 'true';
  const withDriver  = params.get("driver") === '1' || params.get("driver") === 'true';
  const totalMins   = calcMinutes(pickup, drop);

  const [sortBy,   setSortBy]   = useState("popular");
  const [filterCC, setFilterCC] = useState("all");
  const [selected, setSelected] = useState(null);
  const [booked,   setBooked]   = useState(false);
  const [dbVehicles, setDbVehicles] = useState([]);
  const [loading, setLoading]       = useState(true);

  const isAll    = vehicleType.toLowerCase() === "all";
  const isBike   = vehicleType.toLowerCase().includes("bike");
  const isCar    = vehicleType.toLowerCase().includes("car");
  // Multi-plural support for DB matching
  const targetCategory = isBike ? "Bike" : "Car";
  const pluralCategory = isBike ? "Bikes" : "Cars";

  useEffect(() => {
    let q;
    if (isAll) {
      q = query(collection(db, "vehicles"));
    } else {
      q = query(collection(db, "vehicles"), where("category", "in", [targetCategory, pluralCategory]));
    }
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDbVehicles(docs);
      setLoading(false);
    });
    return () => unsub();
  }, [targetCategory, isAll]);

  const vehicles = dbVehicles;
  const types    = ["all", ...new Set(vehicles.map(v => v.type))];

  const sorted = [...vehicles]
    .filter(v => filterCC === "all" || v.type === filterCC)
    .sort((a, b) => {
      if (sortBy === "price_low")  return a.pricePerHour - b.pricePerHour;
      if (sortBy === "price_high") return b.pricePerHour - a.pricePerHour;
      if (sortBy === "rating")     return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const handleConfirm = (v, total) => { 
    setSelected(null); 
    navigate("/payment", { 
      state: { 
        vehicle: v, 
        total: total,
        date,
        pickup,
        drop,
        totalMins,
        withHelmet,
        withDriver
      } 
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        .vcard { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
        .vcard:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
        .vcard:hover .v-img { transform: scale(1.1); }
        .book-btn { transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); }
        .book-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(190,13,13,0.3); }

        /* ── Desktop layout ── */
        .vr-page       { padding-top: 70px; padding-bottom: 60px; }
        .vr-subheader  { 
          position: sticky; top: 70px; z-index: 100; 
          background: rgba(255, 255, 255, 0.8); 
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1.5px solid rgba(15, 23, 42, 0.05); 
          padding: 14px 24px; display: flex; align-items: center; gap: 16px; 
        }
        .vr-content    { max-width: 1250px; margin: 0 auto; padding: 24px 24px 60px; }
        .vr-filterbar  { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; }
        .vr-types      { display: flex; gap: 8px; flex-wrap: wrap; }
        .vr-sort       { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .vr-grid       { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

        /* ── Mobile layout ── */
        @media (max-width: 900px) {
          .vr-page      { padding-top: 60px !important; padding-bottom: 70px !important; }
          .vr-subheader { top: 60px !important; padding: 12px 16px !important; }
          .vr-hide-mob  { display: none !important; }
          .vr-content   { padding: 16px 16px 30px !important; }
          .vr-filterbar { flex-wrap: nowrap !important; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 2px; }
          .vr-types     { flex-wrap: nowrap !important; }
          .vr-sort      { margin-left: 0 !important; flex-shrink: 0; }
          .vr-grid      { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {booked && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: "72px", left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "11px 22px", borderRadius: "99px", fontSize: "13px", fontWeight: "700", zIndex: 2000, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
            🎉 Booking confirmed! Redirecting…
          </motion.div>
        )}
      </AnimatePresence>

      <div className="vr-page">
        <div className="vr-subheader">
          <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(15, 23, 42, 0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", flexShrink: 0, transition: "all .2s" }}>
            <IcoBack />
          </button>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", flexShrink: 0, fontFamily: H }}>{isAll ? "All Vehicles" : isBike ? "Bikes" : "Cars"}</span>
            {date && <>
              <span style={{ color: "rgba(15, 23, 42, 0.1)" }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748b", fontWeight: "700", whiteSpace: "nowrap" }}><IcoCalendar /> {fmt(date)}</span>
            </>}
            {totalMins > 0 && <>
              <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.4)", fontWeight: "500" }}>|</span>
              <span className="vr-hide-mob" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "14px", fontWeight: "700", background: "rgba(15, 23, 42, 0.04)", padding: "8px 16px", borderRadius: "12px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                <IcoClock /> {fmtDuration(totalMins)} ({fmtTime(pickup)} – {fmtTime(drop)})
              </span>
            </>}
            {isBike && (withHelmet ? (
              <>
                <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.4)", fontWeight: "500" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: RED, fontWeight: "800", background: `${RED}10`, padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.4px" }}>
                  <svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
                    <path d="M294.396 52.127c-17.944.066-35.777 1.834-52.886 4.746-86.727 14.76-135.612 53.467-161.99 107.824 31.215-2.434 62.002-5.024 91.966-4.838 24.114.15 47.696 2.097 70.54 7.37 15.15 3.5 24.652 16.647 27.607 31.735 2.954 15.088.858 32.92-5.055 51.553l-.287.904-.468.826c-7.762 13.64-24.263 24.498-45.295 35.994-21.032 11.497-46.695 22.693-72.27 32.428-25.574 9.735-51.012 17.98-71.575 23.437-7.254 1.925-13.85 3.48-19.735 4.657 2.275 31.13 6.562 63.38 12.008 95.98 140.118-38.25 273.5-79.888 403.51-123.254 25.935-44.457 29.927-86.448 16.967-126.734-22.393-69.605-60.9-107.048-105.215-126.168-27.696-11.95-57.913-16.57-87.82-16.46zM130.184 179.205c-9.06.51-18.265 1.156-27.532 1.836L59.31 329.386c3.384-.79 6.936-1.663 10.754-2.676 4.004-1.063 8.27-2.27 12.66-3.554 10.022-31.07 43.3-131.415 47.46-143.95zm-46.7 3.262c-10.868.826-21.824 1.654-32.908 2.37-.32.445-.714.947-1.318 2.267-1.58 3.45-3.375 9.418-4.912 16.724-3.075 14.612-5.37 34.727-6.705 54.877-1.333 20.15-1.73 40.438-1.193 55.582.268 7.572.79 13.905 1.442 17.96.048.306.078.312.13.59.46-.01 1.033-.044 1.546-.064l43.918-150.306zM224 183c-15.596 0-28.66 12.582-28.66 28.152s13.064 28.155 28.66 28.155 28.66-12.584 28.66-28.155c0-15.57-13.064-28.152-28.66-28.152zm0 18c6.12 0 10.66 4.567 10.66 10.152 0 5.586-4.54 10.155-10.66 10.155s-10.66-4.57-10.66-10.155c0-5.585 4.54-10.152 10.66-10.152zm230.19 144.865C330.383 386.852 203.285 426.23 70.054 462.56c.413 2.317.81 4.63 1.232 6.948 147.607-26.65 255.974-68.965 371.36-109.164 4.118-4.857 7.947-9.68 11.546-14.48z"></path>
                  </svg>
                  WITH HELMET
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.4)", fontWeight: "500" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: RED, fontWeight: "800", background: `${RED}10`, padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.4px" }}>
                  <svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
                    <path d="M294.396 52.127c-17.944.066-35.777 1.834-52.886 4.746-86.727 14.76-135.612 53.467-161.99 107.824 31.215-2.434 62.002-5.024 91.966-4.838 24.114.15 47.696 2.097 70.54 7.37 15.15 3.5 24.652 16.647 27.607 31.735 2.954 15.088.858 32.92-5.055 51.553l-.287.904-.468.826c-7.762 13.64-24.263 24.498-45.295 35.994-21.032 11.497-46.695 22.693-72.27 32.428-25.574 9.735-51.012 17.98-71.575 23.437-7.254 1.925-13.85 3.48-19.735 4.657 2.275 31.13 6.562 63.38 12.008 95.98 140.118-38.25 273.5-79.888 403.51-123.254 25.935-44.457 29.927-86.448 16.967-126.734-22.393-69.605-60.9-107.048-105.215-126.168-27.696-11.95-57.913-16.57-87.82-16.46zM130.184 179.205c-9.06.51-18.265 1.156-27.532 1.836L59.31 329.386c3.384-.79 6.936-1.663 10.754-2.676 4.004-1.063 8.27-2.27 12.66-3.554 10.022-31.07 43.3-131.415 47.46-143.95zm-46.7 3.262c-10.868.826-21.824 1.654-32.908 2.37-.32.445-.714.947-1.318 2.267-1.58 3.45-3.375 9.418-4.912 16.724-3.075 14.612-5.37 34.727-6.705 54.877-1.333 20.15-1.73 40.438-1.193 55.582.268 7.572.79 13.905 1.442 17.96.048.306.078.312.13.59.46-.01 1.033-.044 1.546-.064l43.918-150.306zM224 183c-15.596 0-28.66 12.582-28.66 28.152s13.064 28.155 28.66 28.155 28.66-12.584 28.66-28.155c0-15.57-13.064-28.152-28.66-28.152zm0 18c6.12 0 10.66 4.567 10.66 10.152 0 5.586-4.54 10.155-10.66 10.155s-10.66-4.57-10.66-10.155c0-5.585 4.54-10.152 10.66-10.152zm230.19 144.865C330.383 386.852 203.285 426.23 70.054 462.56c.413 2.317.81 4.63 1.232 6.948 147.607-26.65 255.974-68.965 371.36-109.164 4.118-4.857 7.947-9.68 11.546-14.48z"></path>
                  </svg>
                  WITHOUT HELMET
                </span>
              </>
            ))}
            {isCar && (withDriver ? (
              <>
                <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.4)", fontWeight: "500" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: RED, fontWeight: "800", background: `${RED}10`, padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.4px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  WITH DRIVER
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.4)", fontWeight: "500" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: RED, fontWeight: "800", background: `${RED}10`, padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.4px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  SELF DRIVE
                </span>
              </>
            ))}
          </div>

          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800", flexShrink: 0, fontFamily: H, textTransform: "uppercase", letterSpacing: "0.5px" }}>{sorted.length} available</span>
        </div>

        <div className="vr-content">
          {/* Filter + Sort */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Fetching available {isAll ? "vehicles" : isBike ? "bikes" : "cars"}...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: "24px", border: "1.5px dashed #e2e8f0" }}>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#64748b" }}>No {isAll ? "vehicles" : isBike ? "bikes" : "cars"} available right now.</p>
              <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>Try changing your filters or searching for another type.</p>
            </div>
          ) : (
            <div className="vr-grid">
              {sorted.map((v, i) => {
                const bTotal = Math.round((v.pricePerHour * totalMins) / 60);
                const gst    = Math.round(bTotal * 0.18);
                const isBike = v.category === 'Bike';
                const isCar  = v.category === 'Car';
                const hCharge = (isBike && withHelmet) ? 50 : 0;
                const dCharge = (isCar && withDriver) ? 400 : 0;
                const grand = bTotal + gst + hCharge + dCharge;
                return (
                  <motion.div key={v.id} className="vcard"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 0 20px rgba(0,0,0,0.08)" }}>

                    <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                      <img src={v.image} alt={v.name} className="v-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)" }} />
                      <span style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(15, 23, 42, 0.8)", color: "#fff", fontSize: "11px", fontWeight: "800", padding: "5px 12px", borderRadius: "99px", backdropFilter: "blur(8px)", fontFamily: H, textTransform: "uppercase" }}>{v.type}</span>
                      <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", alignItems: "center", gap: "4px", background: "rgba(255, 255, 255, 0.9)", color: "#fbbf24", fontSize: "12px", fontWeight: "900", padding: "5px 12px", borderRadius: "99px", backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                        <IcoStar /> {v.rating || 4.5} <span style={{ color: "#94a3b8", fontWeight: 700 }}>({v.reviews || 0})</span>
                      </div>
                      <div style={{ position: "absolute", bottom: "14px", left: "16px", right: "16px" }}>
                        <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "900", margin: 0, fontFamily: H, letterSpacing: "-0.3px" }}>{v.name}</h3>
                      </div>
                    </div>

                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}><IcoFuel />{v.fuel}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}><IcoSeat />{v.seats} Seats</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}><IcoTag />{v.cc}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                        <div>
                          {totalMins > 0 ? (
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                              <span style={{ fontSize: "24px", fontWeight: "900", color: RED, fontFamily: H }}>₹{grand}</span>
                              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase" }}>Total</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                              <span style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", fontFamily: H }}>₹{v.pricePerHour}</span>
                              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800" }}>/hr</span>
                            </div>
                          )}
                          {totalMins > 0 && <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", margin: "2px 0 0" }}>₹{v.pricePerHour}/hr + GST</p>}
                        </div>
                        <button className="book-btn" onClick={() => setSelected(v)}
                          style={{ padding: "12px 24px", borderRadius: "14px", background: RED, border: "none", color: "#fff", fontSize: "14px", fontWeight: "900", cursor: "pointer", boxShadow: "0 8px 20px rgba(190,13,13,0.3)", whiteSpace: "nowrap", fontFamily: F }}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <BookingModal vehicle={selected} totalMins={totalMins} date={date} pickup={pickup} drop={drop} 
            withHelmet={withHelmet} withDriver={withDriver}
            onClose={() => setSelected(null)} onConfirm={handleConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}