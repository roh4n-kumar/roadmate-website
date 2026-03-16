import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const BIKES = [
  { id: "b1", name: "Royal Enfield Classic 350", type: "Cruiser",  cc: "350cc", fuel: "Petrol", seats: 2, pricePerHour: 80,  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", rating: 4.8, reviews: 124 },
  { id: "b2", name: "Honda CB Shine",             type: "Commuter", cc: "125cc", fuel: "Petrol", seats: 2, pricePerHour: 45,  image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80", rating: 4.5, reviews: 89  },
  { id: "b3", name: "Bajaj Pulsar NS200",          type: "Sports",   cc: "200cc", fuel: "Petrol", seats: 2, pricePerHour: 65,  image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80", rating: 4.7, reviews: 201 },
  { id: "b4", name: "TVS Apache RTR 160",          type: "Sports",   cc: "160cc", fuel: "Petrol", seats: 2, pricePerHour: 55,  image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80", rating: 4.6, reviews: 156 },
  { id: "b5", name: "Hero Splendor Plus",          type: "Commuter", cc: "100cc", fuel: "Petrol", seats: 2, pricePerHour: 35,  image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=600&q=80", rating: 4.3, reviews: 67  },
  { id: "b6", name: "KTM Duke 390",                type: "Sports",   cc: "390cc", fuel: "Petrol", seats: 2, pricePerHour: 110, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80", rating: 4.9, reviews: 312 },
];

const CARS = [
  { id: "c1", name: "Maruti Swift",  type: "Hatchback", cc: "1200cc", fuel: "Petrol", seats: 5, pricePerHour: 120, image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=80", rating: 4.6, reviews: 245 },
  { id: "c2", name: "Hyundai i20",   type: "Hatchback", cc: "1200cc", fuel: "Petrol", seats: 5, pricePerHour: 140, image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80", rating: 4.7, reviews: 189 },
  { id: "c3", name: "Toyota Innova", type: "SUV",       cc: "2700cc", fuel: "Diesel", seats: 7, pricePerHour: 200, image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80", rating: 4.8, reviews: 421 },
  { id: "c4", name: "Honda City",    type: "Sedan",     cc: "1500cc", fuel: "Petrol", seats: 5, pricePerHour: 160, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", rating: 4.7, reviews: 334 },
  { id: "c5", name: "Mahindra Thar", type: "SUV",       cc: "2000cc", fuel: "Diesel", seats: 4, pricePerHour: 220, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", rating: 4.9, reviews: 567 },
  { id: "c6", name: "Maruti Ertiga", type: "MPV",       cc: "1500cc", fuel: "Petrol", seats: 7, pricePerHour: 175, image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80", rating: 4.5, reviews: 198 },
];

const calcHours = (pickup, drop) => {
  if (!pickup || !drop) return 0;
  const [ph, pm] = pickup.split(":").map(Number);
  const [dh, dm] = drop.split(":").map(Number);
  const mins = (dh * 60 + dm) - (ph * 60 + pm);
  return mins > 0 ? Math.ceil(mins / 60) : 0;
};
const fmt     = s => { if (!s) return ""; const d = new Date(s); return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };
const fmtTime = t => { if (!t) return ""; const [h, m] = t.split(":"); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

const Svg = ({ children, size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const IcoStar     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoFuel     = () => <Svg><path d="M3 22V8l7-6 7 6v14"/><path d="M10 22v-4h4v4"/><path d="M14 10h2a2 2 0 0 1 2 2v2"/></Svg>;
const IcoSeat     = () => <Svg><path d="M20 9V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v11"/><path d="M6 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H6z"/></Svg>;
const IcoClock    = () => <Svg><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const IcoBack     = () => <Svg size={20}><polyline points="15 18 9 12 15 6"/></Svg>;
const IcoCalendar = () => <Svg><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>;
const IcoTag      = () => <Svg><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></Svg>;

// ── Booking Modal (bottom sheet on mobile) ────────────────────────────────────
const BookingModal = ({ vehicle, hours, date, pickup, drop, onClose, onConfirm }) => {
  const total = vehicle.pricePerHour * hours;
  const gst   = Math.round(total * 0.18);
  const grand = total + gst;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: 'blur(6px)', zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ 
<<<<<<< HEAD
          background: "rgba(255, 255, 255, 0.9)", 
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: "32px 32px 0 0", 
          width: "100%", maxWidth: "550px", 
          maxHeight: "92vh", overflowY: "auto", 
          boxShadow: "0 -20px 60px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          fontFamily: F
=======
          background: "var(--glass-bg)", 
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "var(--glass-border)",
          borderRadius: "32px 32px 0 0", 
          width: "100%", 
          maxWidth: "500px", 
          maxHeight: "92vh", 
          overflowY: "auto", 
          boxShadow: "0 -20px 60px rgba(0,0,0,0.3)" 
>>>>>>> c74f3a9
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.2)" }} />
        </div>

        <div style={{ position: "relative", height: "180px", margin: "15px 15px 0", borderRadius: "20px", overflow: "hidden" }}>
          <img src={vehicle.image} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "15px", left: "20px", right: "50px" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: "700", margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{vehicle.type}</p>
            <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "800", margin: "4px 0 0" }}>{vehicle.name}</h3>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}>
            <Svg size={14}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>
          </button>
        </div>

        <div style={{ padding: "20px 20px 35px" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[{ label: "DATE", val: fmt(date) }, { label: "DURATION", val: `${hours} hr${hours !== 1 ? "s" : ""}` }, { label: "PICKUP", val: fmtTime(pickup) }, { label: "DROP-OFF", val: fmtTime(drop) }].map(({ label, val }) => (
                <div key={label}>
                  <p style={{ fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.2px", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#fff", margin: "4px 0 0" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "25px", padding: '0 5px' }}>
            {[{ label: `Base Fare (₹${vehicle.pricePerHour}/hr × ${hours} hrs)`, val: `₹${total}` }, { label: "Taxes & GST (18%)", val: `₹${gst}` }].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{label}</span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0 0" }}>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>Grand Total</span>
              <span style={{ fontSize: "26px", fontWeight: "900", color: 'var(--brand-primary-light)' }}>₹{grand}</span>
            </div>
          </div>

<<<<<<< HEAD
          <button onClick={() => onConfirm(vehicle, grand)} style={{ width: "100%", padding: "16px", borderRadius: "16px", background: `linear-gradient(135deg,${RED},#ff4d4d)`, border: "none", color: "#fff", fontSize: "16px", fontWeight: "900", cursor: "pointer", boxShadow: `0 12px 30px rgba(190,13,13,0.35)`, fontFamily: F, transition: "all .3s ease" }}>
            Confirm Booking
          </button>
          <p style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", marginTop: "12px", marginBottom: 0, fontWeight: 600 }}>Free cancellation up to 1 hour before pickup</p>
=======
          <button onClick={() => onConfirm(vehicle, grand)} style={{ width: "100%", padding: "18px", borderRadius: "18px", background: `linear-gradient(135deg,var(--brand-primary),var(--brand-primary-light))`, border: "none", color: "#fff", fontSize: "16px", fontWeight: "800", cursor: "pointer", boxShadow: `0 8px 25px rgba(190,13,13,0.35)`, fontFamily: F, transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Confirm Booking
          </button>
          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "15px", marginBottom: 0 }}>Securely powered by RoadMate Payments</p>
>>>>>>> c74f3a9
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
  const hours       = calcHours(pickup, drop);

  const [sortBy,   setSortBy]   = useState("popular");
  const [filterCC, setFilterCC] = useState("all");
  const [selected, setSelected] = useState(null);
  const [booked,   setBooked]   = useState(false);

  const isBike   = vehicleType.toLowerCase().includes("bike");
  const vehicles = isBike ? BIKES : CARS;
  const types    = ["all", ...new Set(vehicles.map(v => v.type))];

  const sorted = [...vehicles]
    .filter(v => filterCC === "all" || v.type === filterCC)
    .sort((a, b) => {
      if (sortBy === "price_low")  return a.pricePerHour - b.pricePerHour;
      if (sortBy === "price_high") return b.pricePerHour - a.pricePerHour;
      if (sortBy === "rating")     return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const handleConfirm = () => { 
    setSelected(null); 
    setBooked(true); 
    setTimeout(() => navigate("/my-bookings"), 2000); 
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: F }}>
      <style>{`
<<<<<<< HEAD
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        .vcard { transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); }
        .vcard:hover { transform: translateY(-8px); boxShadow: 0 30px 60px rgba(0,0,0,0.12) !important; border-color: ${RED}30 !important; }
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
=======
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    
    * { box-sizing: border-box; }
    
    .vr-page { 
      padding-top: 64px; 
      padding-bottom: 40px; 
      background: #f8fafc;
      min-height: 100vh;
      font-family: 'Outfit', sans-serif;
    }

    .vr-subheader { 
      position: sticky; 
      top: 64px; 
      z-index: 100; 
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-bottom: 1px solid var(--glass-border);
      padding: 16px 40px; 
      display: flex; 
      align-items: center; 
      gap: 15px; 
      box-shadow: var(--shadow-sm); 
    }

    .vr-content { 
      max-width: 1250px; 
      margin: 0 auto; 
      padding: 40px 40px 100px; 
    }

    .vr-filterbar { 
      display: flex; 
      gap: 15px; 
      margin-bottom: 30px; 
      align-items: center; 
      background: #fff;
      padding: 12px 20px;
      border-radius: 20px;
      border: 1px solid #f0f0f0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }

    .vr-types { display: flex; gap: 8px; flex-wrap: wrap; }
    
    .filter-btn {
      padding: 8px 18px; 
      border-radius: 99px; 
      border: 1.5px solid #e2e8f0; 
      background: #fff; 
      color: #64748b; 
      fontSize: 13px; 
      font-weight: 700; 
      cursor: pointer; 
      text-transform: capitalize; 
      white-space: nowrap; 
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .filter-btn:hover { border-color: #cbd5e1; color: #334155; transform: translateY(-1px); }
    .filter-btn.active { 
      background: var(--brand-red); 
      border-color: var(--brand-red); 
      color: #fff; 
      box-shadow: 0 4px 12px rgba(190, 13, 13, 0.2);
    }

    .vr-sort { 
      margin-left: auto; 
      display: flex; 
      align-items: center; 
      gap: 10px; 
    }
    
    .sort-select {
      padding: 8px 14px; 
      border-radius: 12px; 
      border: 1.5px solid #e2e8f0; 
      background: #fff; 
      font-size: 13px; 
      font-weight: 700; 
      color: #334155; 
      cursor: pointer; 
      outline: none;
      transition: all 0.2s;
    }
    .sort-select:hover { border-color: #cbd5e1; }
    .sort-select:focus { border-color: var(--brand-red); }

    .vr-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
      gap: 25px; 
    }

    .vcard { 
      background: #fff; 
      border-radius: 24px; 
      overflow: hidden; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.03); 
      border: 1px solid #f0f0f0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
    }
    .vcard:hover { 
      transform: translateY(-8px); 
      box-shadow: 0 20px 40px rgba(0,0,0,0.08); 
      border-color: #ffd5d5;
    }

    .img-wrapper { 
      position: relative; 
      height: 220px; 
      overflow: hidden; 
    }
    .img-wrapper img { transition: transform 0.5s; }
    .vcard:hover .img-wrapper img { transform: scale(1.08); }

    .card-badge {
      position: absolute; 
      top: 15px; 
      left: 15px; 
      background: rgba(255,255,255,0.9); 
      color: #111; 
      font-size: 11px; 
      font-weight: 800; 
      padding: 5px 12px; 
      border-radius: 99px; 
      backdrop-filter: blur(8px);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rating-badge {
      position: absolute; 
      top: 15px; 
      right: 15px; 
      display: flex; 
      align-items: center; 
      gap: 5px; 
      background: rgba(0,0,0,0.5); 
      color: #fbbf24; 
      font-size: 12px; 
      font-weight: 700; 
      padding: 5px 12px; 
      border-radius: 99px; 
      backdrop-filter: blur(8px);
    }

    .book-btn { 
      padding: 12px 24px; 
      border-radius: 14px; 
      background: var(--brand-red); 
      border: none; 
      color: #fff; 
      font-size: 14px; 
      font-weight: 800; 
      cursor: pointer; 
      box-shadow: 0 6px 15px rgba(190,13,13,0.25); 
      white-space: nowrap; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .book-btn:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 10px 20px rgba(190,13,13,0.35); 
      filter: brightness(1.1);
    }
    .book-btn:active { transform: translateY(0); }

    @media (max-width: 900px) {
      .vr-page { padding-top: 56px !important; padding-bottom: 80px !important; }
      .vr-subheader { top: 56px !important; padding: 12px 15px !important; }
      .vr-content { padding: 20px 15px !important; }
      .vr-filterbar { 
        flex-direction: column; 
        align-items: stretch; 
        gap: 15px; 
        background: transparent; 
        padding: 0; 
        border: none; 
        box-shadow: none;
      }
      .vr-types { 
        flex-wrap: nowrap; 
        overflow-x: auto; 
        padding-bottom: 5px;
        -webkit-overflow-scrolling: touch;
      }
      .vr-types::-webkit-scrollbar { display: none; }
      .vr-sort { margin-left: 0 !important; width: 100%; }
      .sort-select { width: 100%; }
      .vr-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
      .img-wrapper { height: 200px; }
    }
>>>>>>> c74f3a9
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
<<<<<<< HEAD
          <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(15, 23, 42, 0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", flexShrink: 0, transition: "all .2s" }}>
            <IcoBack />
          </button>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", flexShrink: 0, fontFamily: H }}>{isBike ? "Bikes" : "Cars"}</span>
            {date && <>
              <span style={{ color: "rgba(15, 23, 42, 0.1)" }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748b", fontWeight: "700", whiteSpace: "nowrap" }}><IcoCalendar /> {fmt(date)}</span>
            </>}
            {hours > 0 && <>
              <span className="vr-hide-mob" style={{ color: "rgba(15, 23, 42, 0.1)" }}>·</span>
              <span className="vr-hide-mob" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748b", fontWeight: "700", whiteSpace: "nowrap" }}><IcoClock /> {hours} hr{hours !== 1 ? "s" : ""} ({fmtTime(pickup)} – {fmtTime(drop)})</span>
            </>}
          </div>

          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800", flexShrink: 0, fontFamily: H, textTransform: "uppercase", letterSpacing: "0.5px" }}>{sorted.length} available</span>
=======
          <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", flexShrink: 0, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}>
            <IcoBack />
          </button>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#111", flexShrink: 0, letterSpacing: '-0.5px' }}>{isBike ? "Bikes" : "Cars"}</span>
            {date && <>
              <span style={{ color: "rgba(0,0,0,0.1)", fontSize: '20px' }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#666", fontWeight: "600", whiteSpace: "nowrap" }}><IcoCalendar /> {fmt(date)}</span>
            </>}
            {hours > 0 && <>
              <span className="desktop-only" style={{ color: "rgba(0,0,0,0.1)", fontSize: '20px' }}>·</span>
              <span className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#666", fontWeight: "600", whiteSpace: "nowrap" }}><IcoClock /> {hours} hr{hours !== 1 ? "s" : ""} ({fmtTime(pickup)} – {fmtTime(drop)})</span>
            </>}
          </div>

          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "700", flexShrink: 0 }}>{sorted.length} available</span>
>>>>>>> c74f3a9
        </div>

        <div className="vr-content">
          {/* Filter + Sort */}
          <div className="vr-filterbar">
            <div className="vr-types">
              {types.map(t => (
                <button key={t} onClick={() => setFilterCC(t)}
                  className={`filter-btn${filterCC === t ? " active" : ""}`}>
                  {t === "all" ? `All ${isBike ? "Bikes" : "Cars"}` : t}
                </button>
              ))}
            </div>
            <div className="vr-sort">
<<<<<<< HEAD
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700", whiteSpace: "nowrap", fontFamily: H, textTransform: "uppercase" }}>Sort By</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "12px", border: "1.5px solid rgba(15, 23, 42, 0.08)", background: "#fff", fontSize: "13px", fontWeight: "700", color: "#0f172a", cursor: "pointer", outline: "none", fontFamily: F }}>
=======
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "700", whiteSpace: "nowrap" }}>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
>>>>>>> c74f3a9
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price_low">Price: Low–High</option>
                <option value="price_high">Price: High–Low</option>
              </select>
            </div>
          </div>

          {hours === 0 && (
            <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#fffbeb", border: "1px solid #fcd34d", fontSize: "13px", color: "#92400e", fontWeight: "600", marginBottom: "18px" }}>
              ⚠ Select valid pickup & drop-off times to see pricing.
            </div>
          )}

          <div className="vr-grid">
            {sorted.map((v, i) => {
              const total = v.pricePerHour * hours;
              const gst   = Math.round(total * 0.18);
              const grand = total + gst;
              return (
                <motion.div key={v.id} className="vcard"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
<<<<<<< HEAD
                  style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1.5px solid rgba(15, 23, 42, 0.05)" }}>

                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)" }} />
                    <span style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(15, 23, 42, 0.8)", color: "#fff", fontSize: "11px", fontWeight: "800", padding: "5px 12px", borderRadius: "99px", backdropFilter: "blur(8px)", fontFamily: H, textTransform: "uppercase" }}>{v.type}</span>
                    <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", alignItems: "center", gap: "4px", background: "rgba(255, 255, 255, 0.9)", color: "#fbbf24", fontSize: "12px", fontWeight: "900", padding: "5px 12px", borderRadius: "99px", backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                      <IcoStar /> {v.rating} <span style={{ color: "#94a3b8", fontWeight: 700 }}>({v.reviews})</span>
                    </div>
                    <div style={{ position: "absolute", bottom: "14px", left: "16px", right: "16px" }}>
                      <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "900", margin: 0, fontFamily: H, letterSpacing: "-0.3px" }}>{v.name}</h3>
=======
                >
                  <div className="img-wrapper">
                    <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                    <span className="card-badge">{v.type}</span>
                    <div className="rating-badge">
                      <IcoStar /> {v.rating} <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>({v.reviews})</span>
                    </div>
                    <div style={{ position: "absolute", bottom: "15px", left: "20px", right: "20px" }}>
                      <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "800", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.3)", letterSpacing: '-0.3px' }}>{v.name}</h3>
>>>>>>> c74f3a9
                    </div>
                  </div>

                  <div style={{ padding: "20px" }}>
<<<<<<< HEAD
                    <div style={{ display: "flex", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}><IcoFuel />{v.fuel}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}><IcoSeat />{v.seats} Seats</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: "700" }}><IcoTag />{v.cc}</span>
=======
                    <div style={{ display: "flex", gap: "15px", marginBottom: "18px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}><IcoFuel />{v.fuel}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}><IcoSeat />{v.seats} Seats</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}><IcoTag />{v.cc}</span>
>>>>>>> c74f3a9
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
<<<<<<< HEAD
                          <span style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", fontFamily: H }}>₹{v.pricePerHour}</span>
                          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800" }}>/hr</span>
                        </div>
                        {hours > 0 && <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", margin: "2px 0 0" }}>₹{grand} total ({hours}hr + GST)</p>}
                      </div>
                      <button className="book-btn" onClick={() => setSelected(v)}
                        style={{ padding: "12px 24px", borderRadius: "14px", background: `linear-gradient(135deg,${RED},#ff4d4d)`, border: "none", color: "#fff", fontSize: "14px", fontWeight: "900", cursor: "pointer", boxShadow: `0 8px 20px rgba(190,13,13,0.3)`, whiteSpace: "nowrap", fontFamily: F }}>
=======
                          <span style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b" }}>₹{v.pricePerHour}</span>
                          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>/hr</span>
                        </div>
                        {hours > 0 && <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", margin: "2px 0 0" }}>₹{grand} incl. GST</p>}
                      </div>
                      <button className="book-btn" onClick={() => setSelected(v)}>
>>>>>>> c74f3a9
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <BookingModal vehicle={selected} hours={hours} date={date} pickup={pickup} drop={drop}
            onClose={() => setSelected(null)} onConfirm={handleConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}