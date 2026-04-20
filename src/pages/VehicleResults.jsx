import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

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
  const helmetCharge = (isBike && withHelmet > 0) ? (50 * withHelmet) : 0;
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
              ...(helmetCharge > 0 ? [{ label: `Helmet Charges (${withHelmet} ${withHelmet === 1 ? 'Helmet' : 'Helmets'})`, val: `₹${helmetCharge}` }] : []),
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

          <button onClick={() => onConfirm(vehicle, { total: grandTotal, baseTotal, gst, helmetCharge, driverCharge })} style={{ width: "100%", padding: "16px", borderRadius: "16px", background: RED, border: "none", color: "#fff", fontSize: "16px", fontWeight: "900", cursor: "pointer", fontFamily: F, transition: "all .3s ease" }}>
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
  const helmetParam = params.get("helmet");
  const helmetCount = (helmetParam === "2") ? 2 : (helmetParam === "1" || helmetParam === "true" ? 1 : 0);
  const withDriver  = params.get("driver") === '1' || params.get("driver") === 'true';
  const totalMins   = calcMinutes(pickup, drop);

  const [sortBy,   setSortBy]   = useState("popular");
  const [filterCC, setFilterCC] = useState("all");
  const [selected, setSelected] = useState(null);
  const [booked,   setBooked]   = useState(false);
  const [dbVehicles, setDbVehicles] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [errorToast, setErrorToast] = useState("");

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

  const handleConfirm = async (v, breakdown) => { 
    if (!auth.currentUser) {
      setErrorToast("Please login to continue with booking.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setLoading(true); // Show loader while checking verification
    try {
      // ── CHECK USER VERIFICATION STATE ──
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      
      const hasPhone = !!userData.phone || !!userData.profile?.phone;
      const isVerified = 
        (userData.dlStatus === "verified" && userData.aadhaarStatus === "verified" && userData.selfieStatus === "verified") ||
        (userData.verification?.status === "verified");

      // Check for DL Expiration
      const dlExp = userData.dlExpiry || userData.verification?.dl?.expiry || userData.verification?.drivingLicence?.expiry;
      const isExpired = dlExp && new Date(dlExp) < new Date();

      if (isExpired) {
        navigate("/?error=expired");
        return;
      }

      if (!hasPhone && !isVerified) {
        navigate("/?error=both");
        return;
      }
      if (!hasPhone) {
        navigate("/?error=phone");
        return;
      }
      if (!isVerified) {
        navigate("/?error=docs");
        return;
      }

      // Create a professional root-level booking document
      const bookingData = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        userEmail: auth.currentUser.email,
        vehicle: {
          id: v.id,
          name: v.name,
          image: v.image,
          type: v.type,
          fuel: v.fuel || v.fuelType || "Petrol",
          pricePerHour: v.pricePerHour,
          category: v.category,
          reviews: v.reviews || 0
        },
        trip: {
          date: date,
          pickupTime: pickup,
          dropTime: drop,
          totalMins: totalMins
        },
        breakdown: {
          baseTotal: breakdown.baseTotal,
          gst: breakdown.gst,
          helmetCharge: breakdown.helmetCharge || 0,
          driverCharge: breakdown.driverCharge || 0,
          grandTotal: breakdown.total
        },
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min window
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      
      setSelected(null); 
      navigate("/payment", { 
        state: { 
          bookingId: docRef.id,
          vehicle: v, 
          ...breakdown,
          date,
          pickup,
          drop,
          totalMins,
          withHelmet: helmetCount,
          withDriver
        } 
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrorToast("Failed to initialize booking. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        .vcard { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
        .vcard:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
        .vcard:hover .v-img { transform: scale(1.1); }

        /* ── Desktop layout ── */
        .vr-page       { padding-top: 64px; padding-bottom: 60px; }
        .vr-subheader  { 
          position: sticky; top: 64px; z-index: 100; 
          background: #ffffff; 
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1.5px solid rgba(15, 23, 42, 0.25); 
          width: 100%;
          padding: 0 24px;
        }
        .vr-content-wrapper { padding: 0 24px; }
        .vr-content    { max-width: 1250px; margin: 0 auto; padding: 24px 0 60px; }
        .vr-filterbar  { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; }
        .vr-types      { display: flex; gap: 8px; flex-wrap: wrap; }
        .vr-sort       { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .vr-grid       { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

        /* ── Mobile layout ── */
        @media (max-width: 900px) {
          .vr-page      { padding-top: 60px !important; padding-bottom: 70px !important; }
          .vr-subheader { top: 60px !important; padding: 12px 16px !important; }
          .vr-hide-mob  { display: none !important; }
          .vr-content   { padding: 16px 0 30px !important; }
          .vr-content-wrapper { padding: 0 16px !important; }
          .vr-filterbar { flex-wrap: nowrap !important; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 2px; }
          .vr-types     { flex-wrap: nowrap !important; }
          .vr-sort      { margin-left: 0 !important; flex-shrink: 0; }
          .vr-grid      { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {booked && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", bottom: "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 4000, padding: "0 20px" }}>
            <div style={{ 
              background: "#f0fff4", 
              color: "#22c55e", 
              padding: "16px 32px", 
              borderRadius: "16px", 
              fontSize: "14px", 
              fontWeight: "900", 
              border: "2px solid #bbf7d0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              fontFamily: H
            }}>
              🎉 Booking confirmed! Redirecting…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="vr-page">
        <div className="vr-subheader">
          <div style={{ 
            maxWidth: "1250px", 
            margin: "0 auto", 
            height: "64px", 
            display: "grid", 
            gridTemplateColumns: "11fr auto auto", 
            alignItems: "center",
            gap: "24px"
          }}>
            <div style={{ display: "flex", alignItems: "center", position: "relative", gap: "10px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", minWidth: 0 }}>
                <h1 style={{ fontSize: "20px", fontWeight: 900, fontFamily: H, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
                  {isAll ? "All Vehicles" : isBike ? "Bikes" : "Cars"}
                </h1>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {date && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748b", fontWeight: "700", whiteSpace: "nowrap" }}>
                      <span style={{ color: "rgba(15, 23, 42, 0.1)", margin: "0 4px" }}>·</span>
                      <IcoCalendar /> {fmt(date)}
                    </div>
                  )}
                  {totalMins > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.2)", fontWeight: "500" }}>|</span>
                      <div className="vr-hide-mob" style={{ display: "flex", alignItems: "center", gap: "8px", color: SLATE, fontSize: "14px", fontWeight: "800", background: "rgba(15, 23, 42, 0.04)", padding: "6px 14px", borderRadius: "10px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                        <IcoClock /> {fmtDuration(totalMins)} ({fmtTime(pickup)} – {fmtTime(drop)})
                      </div>
                    </div>
                  )}
                  
                  {isBike && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.2)", fontWeight: "500" }}>|</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: helmetCount > 0 ? RED : "rgba(15,23,42,0.4)", fontWeight: "900", background: helmetCount > 0 ? `${RED}10` : "rgba(15,23,42,0.05)", padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        {helmetCount > 0 ? `${helmetCount} HELMET${helmetCount > 1 ? 'S' : ''}` : "NO HELMET"}
                      </span>
                    </div>
                  )}
                  {isCar && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.2)", fontWeight: "500" }}>|</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: withDriver ? RED : "rgba(15,23,42,0.4)", fontWeight: "900", background: withDriver ? `${RED}10` : "rgba(15,23,42,0.05)", padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        {withDriver ? "WITH DRIVER" : "SELF DRIVE"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div />

            <div style={{ justifySelf: "end" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800", flexShrink: 0, fontFamily: H, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {sorted.length} available
              </span>
            </div>
          </div>
        </div>


        <div className="vr-content-wrapper">
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
                const hCharge = (isBike && helmetCount > 0) ? (50 * helmetCount) : 0;
                const dCharge = (isCar && withDriver) ? 400 : 0;
                const grand = bTotal + gst + hCharge + dCharge;
                return (
                  <motion.div key={v.id} className="vcard"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", border: "none", boxShadow: "0 0 0 1.5px rgba(15, 23, 42, 0.1), 0 10px 30px rgba(0,0,0,0.08)" }}>

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
                              <span style={{ fontSize: "24px", fontWeight: "900", color: RED, fontFamily: H }}>₹{bTotal}</span>
                              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase" }}>Base Price</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                              <span style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", fontFamily: H }}>₹{v.pricePerHour}</span>
                              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800" }}>/hr</span>
                            </div>
                          )}
                          {totalMins > 0 && <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", margin: "2px 0 0" }}>₹{v.pricePerHour}/hr</p>}
                        </div>
                        <button className="rm-btn-premium" onClick={() => {
                          if (totalMins > 0 && date) {
                            setSelected(v);
                          } else {
                            navigate("/");
                          }
                        }}>
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
      </div>

      <AnimatePresence>
        {selected && (
          <BookingModal vehicle={selected} totalMins={totalMins} date={date} pickup={pickup} drop={drop} 
            withHelmet={helmetCount} withDriver={withDriver}
            onClose={() => setSelected(null)} onConfirm={handleConfirm} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
             style={{ position: "fixed", bottom: "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 9000, padding: "0 20px" }}>
            <div style={{ 
              background: "#fff5f5", 
              color: RED, 
              padding: "16px 32px", 
              borderRadius: "16px", 
              fontSize: "14px", 
              fontWeight: "900", 
              border: "2px solid #feb2b2",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              fontFamily: H
            }}>
              <span style={{ fontSize: "20px" }}>⚠️</span> {errorToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}