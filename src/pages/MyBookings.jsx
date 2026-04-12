import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { logSuspiciousActivity } from "../utils/securityLogger";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const IcoCalendar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoClock    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoTrash    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const formatPrettyDate = (dInput) => {
    if (!dInput) return "";
    let d = dInput;
    if (dInput.toDate) d = dInput.toDate();
    else if (typeof dInput === 'string') d = new Date(dInput);
    
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);
      const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const fetchedData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const sortedData = fetchedData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setBookings(sortedData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCancel = async (id) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking || booking.userId !== auth.currentUser?.uid) {
      logSuspiciousActivity("UNAUTHORIZED_CANCELLATION_ATTEMPT", { bookingId: id });
      return;
    }

    const ok = window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
    if (!ok) return;
    
    try {
      await updateDoc(doc(db, "bookings", id), { status: "cancelled" });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
      setActiveTab("cancelled");
    } catch (error) {
      console.error("Cancellation error:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "100px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", background: "#f8fafc" }}>
        <motion.div 
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: "40px", height: "40px", border: "4px solid rgba(190,13,13,0.1)", borderTopColor: RED, borderRadius: "50%" }} 
        />
        <p style={{ marginTop: "20px", fontSize: "16px", fontWeight: "700", color: SLATE, fontFamily: H }}>Loading your journey...</p>
      </div>
    );
  }

  const upcoming  = bookings.filter((b) => b.status === "upcoming" || b.status === "pending" || !b.status);
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const list = activeTab === "upcoming" ? upcoming : activeTab === "completed" ? completed : cancelled;

  return (
    <div className="mb-page" style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        
        /* ── Desktop layout ── */
        .mb-page { padding-top: 64px; }
        .mb-ribbon {
          position: sticky; top: 64px; z-index: 999;
          background: #fff;
          border-bottom: 1.5px solid rgba(15, 23, 42, 0.25);
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: center;
        }
        .mb-inner { max-width: 1250px; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .mb-header-left { display: flex; flex-direction: column; min-width: 0; }
        .mb-tabs { display: flex; gap: 32px; height: 64px; align-items: center; }
        .mb-tab { 
          position: relative; cursor: pointer; height: 100%; display: flex; align-items: center;
          font-size: 14px; font-weight: 800; color: #94a3b8; transition: all 0.3s;
          font-family: H; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .mb-tab.active { color: ${RED}; }
        .mb-tab-indicator { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: ${RED}; border-radius: 10px 10px 0 0; z-index: 1001; }
        
        .mb-content { max-width: 1250px; margin: 0 auto; padding: 24px 24px 80px; }
        .mb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 32px; }
        .mb-card { 
          background: #fff; border-radius: 28px; overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1.5px solid rgba(15,23,42,0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mb-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px rgba(0,0,0,0.1); border-color: ${RED}20; }
        .mb-card:hover .mb-img { transform: scale(1.05); }

        @media (max-width: 1000px) {
           .mb-inner { flex-direction: column; align-items: flex-start; height: auto; padding: 16px 0; gap: 16px; }
           .mb-ribbon { height: auto !important; }
           .mb-tabs { height: 40px !important; width: 100%; overflow-x: auto; scrollbar-width: none; }
           .mb-tabs::-webkit-scrollbar { display: none; }
        }
        
        @media (max-width: 900px) {
          .mb-page { padding-top: 60px !important; }
          .mb-ribbon { top: 60px !important; padding: 0 16px !important; }
          .mb-content { padding: 16px 16px 40px !important; }
          .mb-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .mb-title-main { font-size: 20px !important; }
        }
      `}</style>

      {/* Sticky Tabs Ribbon */}
      <div className="mb-ribbon">
        <div className="mb-inner">
          <div className="mb-header-left">
            <h1 className="mb-title-main" style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", fontFamily: H, margin: 0, letterSpacing: "-0.5px" }}>
              My Bookings
            </h1>
          </div>
          
          <div className="mb-tabs">
            {["upcoming", "completed", "cancelled"].map((tab) => (
              <div 
                key={tab} 
                className={`mb-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span style={{ marginLeft: "8px", opacity: 0.5, fontSize: "11px", background: activeTab === tab ? `${RED}15` : "rgba(15,23,42,0.05)", padding: "2px 8px", borderRadius: "99px" }}>
                  {tab === "upcoming" ? upcoming.length : tab === "completed" ? completed.length : cancelled.length}
                </span>
                {activeTab === tab && <motion.div layoutId="mb-tab-indicator" className="mb-tab-indicator" />}
              </div>
            ))}
          </div>
          
          <div className="mb-header-right vr-hide-mob" style={{ justifySelf: "end" }}>
            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "800", flexShrink: 0, fontFamily: H, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Roadmate Account
            </span>
          </div>
        </div>
      </div>

      <div className="mb-content">
        <div className="mb-grid">
          <AnimatePresence mode="popLayout">
            {list.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px 20px", background: "#fff", borderRadius: "32px", border: "1.5px dashed rgba(15,23,42,0.1)" }}>
                <p style={{ fontSize: "18px", fontWeight: "800", color: "#64748b", fontFamily: H }}>No bookings found in {activeTab}</p>
                <button onClick={() => navigate("/")} className="rm-btn-premium" style={{ marginTop: "20px", padding: "12px 24px", background: RED, color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer" }}>Book your first ride</button>
              </motion.div>
            ) : (
              list.map((b, i) => (
                <motion.div key={b.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} className="mb-card">
                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    <img src={b.vehicle?.image || "https://images.unsplash.com/photo-1558981403-c5f91cbcf523?auto=format&fit=crop&q=80&w=800"} className="mb-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} alt={b.vehicle?.name} />
                    <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(15, 23, 42, 0.8)", color: "#fff", fontSize: "10px", fontWeight: "900", padding: "4px 10px", borderRadius: "99px", backdropFilter: "blur(8px)", fontFamily: H, textTransform: "uppercase" }}>
                      ID: {b.id.slice(0, 6).toUpperCase()}
                    </div>
                    <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", padding: "20px 24px" }}>
                      <h3 style={{ color: "#fff", margin: 0, fontSize: "20px", fontWeight: "900", fontFamily: H }}>{b.vehicle?.name || b.vehicleType}</h3>
                    </div>
                  </div>

                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                      <div>
                        <p style={{ margin: "0 0 6px 0", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                          <IcoCalendar /> Booking Date
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: SLATE, fontFamily: H }}>{formatPrettyDate(b.trip?.date || b.date || b.createdAt)}</p>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 6px 0", fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                          <IcoClock /> Duration
                        </p>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: SLATE, fontFamily: H }}>{b.trip?.pickupTime || "09:00 AM"} – {b.trip?.dropTime || "09:00 PM"}</p>
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", border: "1px solid rgba(15,23,42,0.05)" }}>
                       <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                         <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Total Paid</span>
                         <span style={{ fontSize: "22px", fontWeight: "950", color: RED, fontFamily: H }}>₹{b.breakdown?.grandTotal || b.totalPrice || "0"}</span>
                       </div>
                       <span style={{ fontSize: "10px", fontWeight: "900", background: b.status === "cancelled" ? "#fff1f2" : "#fffbeb", color: b.status === "cancelled" ? "#e11d48" : "#d97706", padding: "5px 12px", borderRadius: "99px", textTransform: "uppercase" }}>
                         {b.status || "Paid"}
                       </span>
                    </div>

                        Booking Cancelled
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: "1/-1", padding: "100px 20px", textAlign: "center", background: "#fff", borderRadius: "32px", border: "1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize: "60px", marginBottom: "24px" }}>
                {activeTab === "upcoming" ? "🏝️" : activeTab === "completed" ? "🏁" : "🔄"}
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: "900", color: SLATE, margin: "0", fontFamily: H, letterSpacing: "-0.5px" }}>
                No {activeTab} bookings found
              </h3>
              <p style={{ color: "#64748b", fontSize: "16px", fontWeight: "600", marginTop: "12px", maxWidth: "400px", margin: "12px auto 0" }}>
                {activeTab === "upcoming" ? "You don't have any active rides scheduled. Why not plan your next trip now?" : "Your ride history is empty. Start your journey with RoadMate today!"}
              </p>
              {activeTab === "upcoming" && (
                <button onClick={() => window.location.href = '/'} style={{ 
                  marginTop: "30px", padding: "14px 40px", borderRadius: "16px", background: RED, color: "#fff", border: "none", 
                  fontWeight: "900", fontSize: "15px", cursor: "pointer", boxShadow: `0 10px 25px ${RED}40`, fontFamily: H, transition: "all 0.3s" 
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  Book a Vehicle
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyBookings;