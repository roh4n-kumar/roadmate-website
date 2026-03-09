import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const F = "'DM Sans', sans-serif";

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
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: "500px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "#e0e0e0" }} />
        </div>

        <div style={{ position: "relative", height: "165px", margin: "10px 14px 0", borderRadius: "16px", overflow: "hidden" }}>
          <img src={vehicle.image} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "40px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: "600", margin: 0 }}>{vehicle.type}</p>
            <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: "800", margin: "2px 0 0" }}>{vehicle.name}</h3>
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Svg size={13}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>
          </button>
        </div>

        <div style={{ padding: "16px 16px 28px" }}>
          <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "14px", marginBottom: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[{ label: "Date", val: fmt(date) }, { label: "Duration", val: `${hours} hr${hours !== 1 ? "s" : ""}` }, { label: "Pickup", val: fmtTime(pickup) }, { label: "Drop-off", val: fmtTime(drop) }].map(({ label, val }) => (
                <div key={label}>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: ".7px", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#111", margin: "2px 0 0" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            {[{ label: `₹${vehicle.pricePerHour}/hr × ${hours} hrs`, val: `₹${total}` }, { label: "GST (18%)", val: `₹${gst}` }].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#111" }}>Total</span>
              <span style={{ fontSize: "20px", fontWeight: "900", color: RED }}>₹{grand}</span>
            </div>
          </div>

          <button onClick={() => onConfirm(vehicle, grand)} style={{ width: "100%", padding: "15px", borderRadius: "14px", background: `linear-gradient(135deg,${RED},#e84545)`, border: "none", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer", boxShadow: `0 6px 20px rgba(190,13,13,0.35)`, fontFamily: F }}>
            Confirm Booking
          </button>
          <p style={{ textAlign: "center", fontSize: "11px", color: "#bbb", marginTop: "10px", marginBottom: 0 }}>Free cancellation up to 1 hour before pickup</p>
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

  const handleConfirm = () => { setSelected(null); setBooked(true); setTimeout(() => navigate("/my-bookings"), 2000); };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .vcard { transition: transform .2s, box-shadow .2s; }
        .vcard:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.12) !important; }
        .book-btn { transition: all .15s; }
        .book-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }

        /* ── Desktop layout ── */
        .vr-page       { padding-top: 64px; padding-bottom: 40px; }
        .vr-subheader  { position: sticky; top: 64px; z-index: 100; background: #fff; border-bottom: 1px solid #eee; padding: 12px 20px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
        .vr-content    { max-width: 1100px; margin: 0 auto; padding: 20px 16px 60px; }
        .vr-filterbar  { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; }
        .vr-types      { display: flex; gap: 6px; flex-wrap: wrap; }
        .vr-sort       { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .vr-grid       { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }

        /* ── Mobile layout ── */
        @media (max-width: 900px) {
          .vr-page      { padding-top: 56px !important; padding-bottom: 70px !important; }
          .vr-subheader { top: 56px !important; padding: 10px 12px !important; }
          .vr-hide-mob  { display: none !important; }
          .vr-content   { padding: 14px 12px 20px !important; }
          .vr-filterbar { flex-wrap: nowrap !important; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 2px; }
          .vr-filterbar::-webkit-scrollbar { display: none; }
          .vr-types     { flex-wrap: nowrap !important; }
          .vr-sort      { margin-left: 0 !important; flex-shrink: 0; }
          .vr-grid      { grid-template-columns: 1fr !important; gap: 14px !important; }
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
        {/* Sticky subheader */}
        <div className="vr-subheader">
          <button onClick={() => navigate(-1)} style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#f5f5f5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", flexShrink: 0 }}>
            <IcoBack />
          </button>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontSize: "15px", fontWeight: "800", color: "#111", flexShrink: 0 }}>{isBike ? "Bikes" : "Cars"}</span>
            {date && <>
              <span style={{ color: "#ddd" }}>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#666", fontWeight: "600", whiteSpace: "nowrap" }}><IcoCalendar /> {fmt(date)}</span>
            </>}
            {hours > 0 && <>
              <span className="vr-hide-mob" style={{ color: "#ddd" }}>·</span>
              <span className="vr-hide-mob" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#666", fontWeight: "600", whiteSpace: "nowrap" }}><IcoClock /> {hours} hr{hours !== 1 ? "s" : ""} ({fmtTime(pickup)} – {fmtTime(drop)})</span>
            </>}
          </div>

          <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "600", flexShrink: 0 }}>{sorted.length} available</span>
        </div>

        <div className="vr-content">
          {/* Filter + Sort */}
          <div className="vr-filterbar">
            <div className="vr-types">
              {types.map(t => (
                <button key={t} onClick={() => setFilterCC(t)}
                  style={{ padding: "7px 14px", borderRadius: "99px", border: `1.5px solid ${filterCC === t ? RED : "#e0e0e0"}`, background: filterCC === t ? "#fff5f5" : "#fff", color: filterCC === t ? RED : "#555", fontSize: "12px", fontWeight: "700", cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap", flexShrink: 0, transition: "all .12s" }}>
                  {t === "all" ? `All ${isBike ? "Bikes" : "Cars"}` : t}
                </button>
              ))}
            </div>
            <div className="vr-sort">
              <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "600", whiteSpace: "nowrap" }}>Sort:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: "7px 10px", borderRadius: "10px", border: "1.5px solid #e0e0e0", background: "#fff", fontSize: "12px", fontWeight: "700", color: "#333", cursor: "pointer", outline: "none" }}>
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

          {/* Grid */}
          <div className="vr-grid">
            {sorted.map((v, i) => {
              const total = v.pricePerHour * hours;
              const gst   = Math.round(total * 0.18);
              const grand = total + gst;
              return (
                <motion.div key={v.id} className="vcard"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}>

                  <div style={{ position: "relative", height: "185px", overflow: "hidden" }}>
                    <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)" }} />
                    <span style={{ position: "absolute", top: "11px", left: "11px", background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "99px", backdropFilter: "blur(6px)" }}>{v.type}</span>
                    <div style={{ position: "absolute", top: "11px", right: "11px", display: "flex", alignItems: "center", gap: "4px", background: "rgba(0,0,0,0.5)", color: "#fbbf24", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "99px", backdropFilter: "blur(6px)" }}>
                      <IcoStar /> {v.rating} <span style={{ color: "rgba(255,255,255,0.55)" }}>({v.reviews})</span>
                    </div>
                    <div style={{ position: "absolute", bottom: "11px", left: "13px", right: "13px" }}>
                      <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "800", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{v.name}</h3>
                    </div>
                  </div>

                  <div style={{ padding: "13px 14px 15px" }}>
                    <div style={{ display: "flex", gap: "12px", marginBottom: "13px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#777", fontWeight: "600" }}><IcoFuel />{v.fuel}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#777", fontWeight: "600" }}><IcoSeat />{v.seats} seats</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#777", fontWeight: "600" }}><IcoTag />{v.cc}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                          <span style={{ fontSize: "22px", fontWeight: "900", color: "#111" }}>₹{v.pricePerHour}</span>
                          <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "600" }}>/hr</span>
                        </div>
                        {hours > 0 && <p style={{ fontSize: "11px", color: "#aaa", fontWeight: "600", margin: "1px 0 0" }}>₹{grand} total ({hours}hr + GST)</p>}
                      </div>
                      <button className="book-btn" onClick={() => setSelected(v)}
                        style={{ padding: "10px 20px", borderRadius: "12px", background: `linear-gradient(135deg,${RED},#e84545)`, border: "none", color: "#fff", fontSize: "13px", fontWeight: "800", cursor: "pointer", boxShadow: `0 4px 14px rgba(190,13,13,0.3)`, whiteSpace: "nowrap", fontFamily: F }}>
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