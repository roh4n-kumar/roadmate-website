import { useState, useEffect, useRef } from "react";
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
const IcoFilter   = () => <Svg><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Svg>;
const IcoX        = () => <Svg><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const IcoChevron  = () => <Svg><polyline points="6 9 12 15 18 9"/></Svg>;


// ── Booking Modal (bottom sheet on mobile) ────────────────────────────────────
const BookingModal = ({ vehicle, totalMins, date, pickup, drop, withHelmet, helmetSizes, withDriver, onClose, onConfirm }) => {
  const isBike = vehicle.category === 'Bike';
  const isCar  = vehicle.category === 'Car';
  
  const baseTotal    = Math.round((vehicle.pricePerHour * totalMins) / 60);
  const gst          = Math.round(baseTotal * 0.18);
  const helmetCharge = (isBike && withHelmet > 0) ? (25 * withHelmet) : 0;
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
            <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap", borderTop: "1px solid rgba(15,23,42,0.05)", paddingTop: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", background: "rgba(15,23,42,0.05)", padding: "4px 10px", borderRadius: "6px" }}>{vehicle.fuel}</span>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", background: "rgba(15,23,42,0.05)", padding: "4px 10px", borderRadius: "6px" }}>{vehicle.seats} Seats</span>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", background: "rgba(15,23,42,0.05)", padding: "4px 10px", borderRadius: "6px" }}>{vehicle.cc}</span>
            </div>
          </div>

          <div style={{ marginBottom: "25px", padding: "0 5px" }}>
            {[
              { label: `Base Fare (₹${vehicle.pricePerHour}/hr × ${Number((totalMins/60).toFixed(1))} hrs)`, val: `₹${baseTotal}` },
              { label: "Taxes & GST (18% on Base)", val: `₹${gst}` },
              ...(helmetCharge > 0 ? [{ label: `Helmet Charges (${withHelmet} ${withHelmet === 1 ? 'Helmet' : 'Helmets'} - ${helmetSizes?.join(', ')})`, val: `₹${helmetCharge}` }] : []),
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
  const rawDate     = params.get("date")   || "";
  const date        = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;
  const pickup      = params.get("pickup") || "";
  const drop        = params.get("drop")   || "";
  const helmetParam = params.get("helmet");
  const countParam  = params.get("count");
  const initialHelmetCount = countParam ? parseInt(countParam) : 0;
  const withDriver  = params.get("driver") === '1' || params.get("driver") === 'true';
  const totalMins   = calcMinutes(pickup, drop);

  const [sortBy,   setSortBy]   = useState("popular");

  const [selected, setSelected] = useState(null);
  const [booked,   setBooked]   = useState(false);
  const [dbVehicles, setDbVehicles] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [errorToast, setErrorToast] = useState("");
  const [showHelmetDropdown, setShowHelmetDropdown] = useState(false);
  const [localHelmetCount, setLocalHelmetCount] = useState(initialHelmetCount);
  const [localHelmetSizes, setLocalHelmetSizes] = useState([]);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // '1' or '2' or '2-H1' or '2-H2'
  
  // ── FILTER STATES ──────────────────────────────────────────────────────────
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selTypes, setSelTypes] = useState([]);
  const [selFuels, setSelFuels] = useState([]);
  const [selTrans, setSelTrans] = useState([]);

  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);
  const helmetRef = useRef(null);



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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (helmetRef.current && !helmetRef.current.contains(e.target)) {
        setShowHelmetDropdown(false);
        setActiveSubMenu(null);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (!date) return;
    const q = query(
      collection(db, "bookings"), 
      where("trip.date", "==", date),
      where("status", "in", ["upcoming", "riding"])
    );
    const unsub = onSnapshot(q, (snap) => {
      setActiveBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [date]);

  const vehicles = dbVehicles.filter(v => {
    if (!pickup || !drop) return true;
    const overlaps = activeBookings.some(b => {
      if (b.vehicle?.id !== v.id) return false;
      const bStart = parseTimeToMins(b.trip?.pickupTime);
      const bEnd   = parseTimeToMins(b.trip?.dropTime);
      const reqStart = parseTimeToMins(pickup);
      const reqEnd   = parseTimeToMins(drop);
      return (reqStart < bEnd) && (reqEnd > bStart);
    });
    return !overlaps;
  });



  const sorted = [...vehicles]
    .filter(v => {
      const p = v.pricePerHour || 0;
      const matchesPrice = p >= priceRange[0] && p <= priceRange[1];
      const matchesType  = selTypes.length === 0 || selTypes.includes(v.type);
      const matchesFuel  = selFuels.length === 0 || selFuels.includes(v.fuel);
      const transmission = v.transmission || (v.category === 'Bike' ? 'Manual' : 'Automatic');
      const matchesTrans = selTrans.length === 0 || selTrans.includes(transmission);
      return matchesPrice && matchesType && matchesFuel && matchesTrans;
    })
    .sort((a, b) => {
      if (sortBy === "price_low")  return a.pricePerHour - b.pricePerHour;
      if (sortBy === "price_high") return b.pricePerHour - a.pricePerHour;
      if (sortBy === "rating")     return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const allTypes = [...new Set(dbVehicles.map(v => v.type))].filter(Boolean);
  const allFuels = [...new Set(dbVehicles.map(v => v.fuel))].filter(Boolean);
  const allTrans = ["Manual", "Automatic"];


  const handleConfirm = async (v, breakdown) => { 
    if (isBike && (params.get("helmet") === '1' || params.get("helmet") === 'true')) {
      if (localHelmetCount === 0) {
        setErrorToast("Please select a Helmet count before booking! ⛑️");
        setTimeout(() => setErrorToast(""), 3000);
        return;
      }
      if (localHelmetSizes.length < localHelmetCount || localHelmetSizes.some(s => !s)) {
        setErrorToast("Please select sizes for all helmets! ⛑️");
        setTimeout(() => setErrorToast(""), 3000);
        return;
      }
    }

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
        addons: {
          helmets: localHelmetCount,
          helmetSizes: localHelmetSizes,
          withDriver: withDriver
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
          withHelmet: localHelmetCount,
          helmetSizes: localHelmetSizes,
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

        /* ── Sidebar ── */
        .sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #fff;
          border-right: 1px solid #e2e8f0;
          padding: 24px;
          height: calc(100vh - 128px);
          position: sticky;
          top: 128px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .sidebar::-webkit-scrollbar { display: none; }
        .filter-section { margin-bottom: 32px; }
        .filter-title { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-option { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; cursor: pointer; }
        .filter-option input { cursor: pointer; accent-color: #be0d0d; width: 16px; height: 16px; }
        .filter-option span { font-size: 14px; color: #64748b; font-weight: 600; }

        /* ── Price Slider ── */
        .price-slider { width: 100%; margin: 10px 0; -webkit-appearance: none; height: 4px; background: #e2e8f0; border-radius: 99px; outline: none; }
        .price-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #be0d0d; border-radius: 50%; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .price-vals { display: flex; justify-content: space-between; margin-top: 12px; }
        .price-vals span { font-size: 13px; font-weight: 800; color: #0f172a; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }


        /* ── Mobile layout ── */
        @media (max-width: 900px) {
          .vr-page      { padding-top: 60px !important; padding-bottom: 70px !important; }
          .vr-subheader { top: 60px !important; padding: 14px 18px !important; height: auto !important; background: #fff !important; }
          .vr-subheader-inner { 
            display: grid !important; 
            grid-template-areas: "left count" "actions actions" !important;
            grid-template-columns: 1fr auto !important;
            height: auto !important; 
            gap: 16px !important; 
            padding: 4px 0 !important;
            align-items: center !important;
          }
          .vr-subheader-left { 
            grid-area: left !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            min-width: 0 !important;
          }
          .vr-subheader-count { 
            grid-area: count !important;
            position: static !important;
            display: flex !important;
            align-items: center !important;
          }
          .vr-subheader-actions { 
            grid-area: actions !important;
            width: 100% !important; 
            justify-content: flex-end !important; 
            gap: 10px !important;
          }
          .vr-helmet-submenu, .vr-helmet-submenu-l2 {
            position: absolute !important;
            left: auto !important;
            right: 100% !important; /* Open to the left on mobile */
            top: 0 !important;
            margin: 0 !important;
            margin-right: 8px !important;
            width: auto !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
            border: 1px solid #f1f5f9 !important;
            display: block !important;
          }
          .vr-helmet-submenu { width: 140px !important; }
          .vr-helmet-submenu-l2 { width: 60px !important; }
          .vr-subheader-actions button, .vr-subheader-actions > div {
            padding: 6px 12px !important;
            font-size: 11px !important;
            border-radius: 8px !important;
          }
          
          .vr-hide-mob  { display: none !important; }
          .vr-content   { padding: 16px 0 30px !important; }
          .vr-content-wrapper { padding: 0 !important; }
          .vr-content-layout { display: block !important; }
          .vr-grid      { grid-template-columns: 1fr !important; gap: 16px !important; padding: 16px !important; }

        }
      `}</style>


      {/* Toast */}
      <AnimatePresence>
        {booked && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", bottom: window.innerWidth <= 900 ? "100px" : "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 4000, padding: "0 20px" }}>
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
          <div className="vr-subheader-inner" style={{ 
            maxWidth: "1250px", 
            margin: "0 auto", 
            height: "64px", 
            display: "grid", 
            gridTemplateColumns: "11fr auto auto", 
            alignItems: "center",
            gap: "24px"
          }}>
            <div className="vr-subheader-left" style={{ display: "flex", alignItems: "center", position: "relative", gap: "10px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", minWidth: 0 }}>
                <h1 style={{ fontSize: "20px", fontWeight: 900, fontFamily: H, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
                  {isAll ? "All Vehicles" : isBike ? "Bikes" : "Cars"}
                </h1>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {date && (
                    <div className="vr-hide-mob" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748b", fontWeight: "700", whiteSpace: "nowrap" }}>
                      <span style={{ color: "rgba(15, 23, 42, 0.1)", margin: "0 4px" }}>·</span>
                      <IcoCalendar /> {fmt(date)}
                    </div>
                  )}
                  {totalMins > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="vr-hide-mob" style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.2)", fontWeight: "500" }}>|</span>
                      <div className="vr-hide-mob" style={{ display: "flex", alignItems: "center", gap: "8px", color: SLATE, fontSize: "14px", fontWeight: "800", background: "rgba(15, 23, 42, 0.04)", padding: "6px 14px", borderRadius: "10px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                        <IcoClock /> {fmtDuration(totalMins)} ({fmtTime(pickup)} – {fmtTime(drop)})
                      </div>
                    </div>
                  )}
                  
                  {isBike && (params.get("helmet") === '1' || params.get("helmet") === 'true') && (
                    <div ref={helmetRef} style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
                      <span style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.2)", fontWeight: "500" }}>|</span>
                      <div 
                        onClick={() => setShowHelmetDropdown(!showHelmetDropdown)}
                        style={{ 
                          display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", 
                          color: localHelmetCount > 0 ? RED : "rgba(15,23,42,0.4)", 
                          fontWeight: "900", background: localHelmetCount > 0 ? `${RED}10` : "rgba(15,23,42,0.05)", 
                          padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.5px", 
                          textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                          border: showHelmetDropdown ? `1.5px solid ${RED}` : "1.5px solid transparent"
                        }}
                      >
                        {localHelmetCount > 0 ? `${localHelmetCount} HELMET${localHelmetCount > 1 ? 'S' : ''}` : "SELECT HELMET"}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showHelmetDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                      </div>

                      {showHelmetDropdown && (
                        <div style={{ 
                          position: "absolute", top: "110%", left: "15px", background: "#fff", 
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", 
                          padding: "8px", zIndex: 1000, width: "160px", border: "1px solid #f1f5f9"
                        }}>
                          {/* Option for 1 Helmet */}
                          <div 
                            onMouseEnter={() => setActiveSubMenu('1')}
                            style={{ 
                              padding: "10px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 800,
                              cursor: "pointer", color: localHelmetCount === 1 ? RED : "#64748b",
                              background: activeSubMenu === '1' ? "#f8fafd" : "transparent",
                              display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative"
                            }}
                          >
                            <span>1 Helmet {localHelmetCount === 1 && localHelmetSizes[0] && `(${localHelmetSizes[0]})`}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                            
                            {activeSubMenu === '1' && (
                              <div className="vr-helmet-submenu" style={{ position: "absolute", left: "100%", top: 0, marginLeft: "8px", background: "#fff", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "8px", width: "80px", border: "1px solid #f1f5f9" }}>
                                {['M', 'L', 'XL'].map(size => (
                                  <div key={size} onClick={(e) => { e.stopPropagation(); setLocalHelmetCount(1); setLocalHelmetSizes([size]); setShowHelmetDropdown(false); setActiveSubMenu(null); }}
                                    style={{ padding: "8px", borderRadius: "6px", textAlign: "center", fontSize: "11px", fontWeight: 800, fontFamily: F, color: localHelmetCount === 1 && localHelmetSizes[0] === size ? RED : SLATE, background: localHelmetCount === 1 && localHelmetSizes[0] === size ? `${RED}05` : "transparent", cursor: "pointer" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafd"} onMouseLeave={e => e.currentTarget.style.background = localHelmetCount === 1 && localHelmetSizes[0] === size ? `${RED}05` : "transparent"}
                                  >
                                    {size}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Option for 2 Helmets */}
                          <div 
                            onMouseEnter={() => setActiveSubMenu('2')}
                            style={{ 
                              padding: "10px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 800,
                              cursor: "pointer", color: localHelmetCount === 2 ? RED : "#64748b",
                              background: activeSubMenu === '2' || activeSubMenu?.startsWith('2-') ? "#f8fafd" : "transparent",
                              display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", marginTop: "4px"
                            }}
                          >
                            <span>2 Helmets {localHelmetCount === 2 && localHelmetSizes.filter(s=>s).length > 0 && `(${localHelmetSizes.filter(s=>s).join(',')})`}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>

                            {(activeSubMenu === '2' || activeSubMenu?.startsWith('2-')) && (
                              <div className="vr-helmet-submenu" style={{ position: "absolute", left: "100%", top: 0, marginLeft: "8px", background: "#fff", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "8px", width: "140px", border: "1px solid #f1f5f9" }}>
                                {['H1', 'H2'].map((h, idx) => (
                                  <div key={h} onMouseEnter={() => setActiveSubMenu(`2-${h}`)} style={{ padding: "8px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: SLATE, background: activeSubMenu === `2-${h}` ? "#f8fafd" : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                                    <span>Helmet {idx+1} {localHelmetCount === 2 && localHelmetSizes[idx] && `(${localHelmetSizes[idx]})`}</span>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>

                                    {activeSubMenu === `2-${h}` && (
                                      <div className="vr-helmet-submenu-l2" style={{ position: "absolute", left: "100%", top: 0, marginLeft: "8px", background: "#fff", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "8px", width: "60px", border: "1px solid #f1f5f9" }}>
                                        {['M', 'L', 'XL'].map(size => (
                                          <div key={size} onClick={(e) => { 
                                            e.stopPropagation(); 
                                            const newSizes = [...localHelmetSizes];
                                            if (newSizes.length !== 2) { newSizes[0] = null; newSizes[1] = null; }
                                            newSizes[idx] = size;
                                            setLocalHelmetSizes(newSizes);
                                            setLocalHelmetCount(2);
                                            // Don't close yet if second size is missing
                                            if (newSizes[0] && newSizes[1]) {
                                              setShowHelmetDropdown(false);
                                              setActiveSubMenu(null);
                                            }
                                          }}
                                            style={{ padding: "8px", borderRadius: "6px", textAlign: "center", fontSize: "11px", fontWeight: 800, fontFamily: F, color: localHelmetCount === 2 && localHelmetSizes[idx] === size ? RED : SLATE, background: localHelmetCount === 2 && localHelmetSizes[idx] === size ? `${RED}05` : "transparent", cursor: "pointer" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#f8fafd"} onMouseLeave={e => e.currentTarget.style.background = localHelmetCount === 2 && localHelmetSizes[idx] === size ? `${RED}05` : "transparent"}
                                          >
                                            {size}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {isCar && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="vr-hide-mob" style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.2)", fontWeight: "500" }}>|</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: withDriver ? RED : "rgba(15,23,42,0.4)", fontWeight: "900", background: withDriver ? `${RED}10` : "rgba(15,23,42,0.05)", padding: "6px 14px", borderRadius: "99px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        {withDriver ? "WITH DRIVER" : "SELF DRIVE"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="vr-subheader-actions" style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Sort Dropdown */}
              <div ref={sortRef} style={{ position: "relative" }}>
                <button 
                  onClick={() => setShowSort(!showSort)}
                  style={{ 
                    display: "flex", alignItems: "center", gap: "8px", background: "rgba(15,23,42,0.05)", 
                    border: "1px solid rgba(15,23,42,0.05)", padding: "8px 16px", borderRadius: "10px", 
                    cursor: "pointer", fontSize: "13px", fontWeight: "800", color: SLATE, transition: "all 0.2s" 
                  }}
                >
                  <Svg size={14}><path d="M11 5L6 9L1 5"/><path d="M11 13L6 17L1 13"/></Svg>
                  SORT: {sortBy.replace("_", " ").toUpperCase()}
                </button>
                <AnimatePresence>
                  {showSort && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ position: "absolute", top: "110%", right: 0, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "8px", zIndex: 1000, width: "180px", border: "1px solid #f1f5f9" }}>
                      {[
                        { id: "popular", label: "Popularity", icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/> },
                        { id: "rating", label: "Top Rated", icon: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></> },
                        { id: "price_low", label: "Price: Low to High", icon: <><path d="M7 10v4h4"/><path d="M15 14l-8-8"/></> },
                        { id: "price_high", label: "Price: High to Low", icon: <><path d="M7 14v-4h4"/><path d="M15 10l-8 8"/></> }

                      ].map(s => (
                        <div key={s.id} onClick={() => { setSortBy(s.id); setShowSort(false); }}
                          style={{ 
                            padding: "10px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, 
                            cursor: "pointer", color: sortBy === s.id ? RED : "#64748b",
                            background: sortBy === s.id ? `${RED}05` : "transparent",
                            display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = sortBy === s.id ? `${RED}10` : "#f8fafd"}
                          onMouseLeave={e => e.currentTarget.style.background = sortBy === s.id ? `${RED}05` : "transparent"}
                        >
                          <Svg size={14}>{s.icon}</Svg>
                          {s.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setShowFilters(true)}
                style={{ 
                  display: "flex", alignItems: "center", gap: "8px", background: "rgba(15,23,42,0.05)", 
                  border: "1px solid rgba(15,23,42,0.05)", padding: "8px 16px", borderRadius: "10px", 
                  cursor: "pointer", fontSize: "13px", fontWeight: "800", color: SLATE, transition: "all 0.2s" 
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(15,23,42,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(15,23,42,0.05)"}
              >
                <IcoFilter /> FILTERS
              </button>
            </div>


            <div className="vr-subheader-count" style={{ justifySelf: "end" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800", flexShrink: 0, fontFamily: H, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {sorted.length} available
              </span>
            </div>
          </div>
        </div>


        <div className="vr-content-wrapper">
          <div style={{ maxWidth: "1250px", margin: "0 auto", display: "flex", gap: "0" }} className="vr-content-layout">
            
            {/* Sidebar Filter - REMOVED static, now in drawer */}


              <div style={{ flexGrow: 1 }}>


              <div className="vr-content" style={{ padding: "24px" }}>
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
                const hCharge = (isBike && localHelmetCount > 0) ? (25 * localHelmetCount) : 0;
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
                          if (isBike && (params.get("helmet") === '1' || params.get("helmet") === 'true')) {
                            if (localHelmetCount === 0) {
                              setErrorToast("Please select a Helmet count! ⛑️");
                              setTimeout(() => setErrorToast(""), 3000);
                              return;
                            }
                            if (localHelmetSizes.length < localHelmetCount || localHelmetSizes.some(s => !s)) {
                              setErrorToast("Please select helmet sizes! ⛑️");
                              setTimeout(() => setErrorToast(""), 3000);
                              return;
                            }
                          }
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
    </div>


      <AnimatePresence>
        {selected && (
          <BookingModal 
            vehicle={selected} 
            totalMins={totalMins} 
            date={date} 
            pickup={pickup} 
            drop={drop} 
            withHelmet={localHelmetCount} 
            helmetSizes={localHelmetSizes}
            withDriver={withDriver}
            onClose={() => setSelected(null)} 
            onConfirm={handleConfirm} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
             style={{ position: "fixed", bottom: window.innerWidth <= 900 ? "100px" : "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 9000, padding: "0 20px" }}>
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
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)", zIndex: 10000, display: "flex", justifyContent: "flex-start" }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "350px", height: "100%", background: "#fff", padding: "32px", boxShadow: "20px 0 60px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "900", fontFamily: H, color: SLATE, margin: 0 }}>Filters</h2>
                  <p style={{ fontSize: "12px", color: "#64748b", fontWeight: 700, margin: "4px 0 0" }}>Narrow down your search</p>
                </div>
                <button onClick={() => setShowFilters(false)} style={{ background: "rgba(15,23,42,0.05)", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: SLATE, cursor: "pointer" }}><IcoX /></button>
              </div>

              <div style={{ flexGrow: 1, overflowY: "auto", paddingRight: "10px", scrollbarWidth: "none" }}>
                <div className="filter-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 className="filter-title" style={{ margin: 0 }}>Price Range</h3>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: RED }}>₹{priceRange[1]}</span>
                  </div>
                  <input type="range" min="0" max="2000" step="50" value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} className="price-slider" />
                  <div className="price-vals">
                    <span>₹0</span>
                    <span>₹2000+</span>
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">Vehicle Type</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {allTypes.map(t => (
                      <button key={t} onClick={() => setSelTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                        style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "1.5px solid", background: selTypes.includes(t) ? RED : "transparent", color: selTypes.includes(t) ? "#fff" : SLATE, borderColor: selTypes.includes(t) ? RED : "#e2e8f0", transition: "all 0.2s" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">Fuel Type</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {allFuels.map(f => (
                      <button key={f} onClick={() => setSelFuels(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                        style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "1.5px solid", background: selFuels.includes(f) ? RED : "transparent", color: selFuels.includes(f) ? "#fff" : SLATE, borderColor: selFuels.includes(f) ? RED : "#e2e8f0", transition: "all 0.2s" }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">Transmission</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {allTrans.map(tr => (
                      <button key={tr} onClick={() => setSelTrans(prev => prev.includes(tr) ? prev.filter(x => x !== tr) : [...prev, tr])}
                        style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "1.5px solid", background: selTrans.includes(tr) ? RED : "transparent", color: selTrans.includes(tr) ? "#fff" : SLATE, borderColor: selTrans.includes(tr) ? RED : "#e2e8f0", transition: "all 0.2s" }}>
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: "20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "12px" }}>
                <button onClick={() => { setSelTypes([]); setSelFuels([]); setSelTrans([]); setPriceRange([0, 2000]); }} style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "rgba(15,23,42,0.05)", color: SLATE, fontSize: "14px", fontWeight: "800", border: "none", cursor: "pointer" }}>Reset</button>
                <button onClick={() => setShowFilters(false)} style={{ flex: 2, padding: "14px", borderRadius: "12px", background: RED, color: "#fff", fontSize: "14px", fontWeight: "900", border: "none", cursor: "pointer", boxShadow: `0 8px 20px ${RED}30` }}>Show {sorted.length} Vehicles</button>
              </div>
            </motion.div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  </div>
);
}
