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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faCar, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    if (dateInput.toDate) {
      const d = dateInput.toDate();
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
    if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const [year, month, day] = dateInput.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateInput;
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
    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;
    await updateDoc(doc(db, "bookings", id), { status: "cancelled" });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    setActiveTab("cancelled");
  };

  if (loading) {
    return (
      <div style={{ padding: "100px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(190,13,13,0.1)", borderTopColor: RED, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: "15px", fontSize: "14px", fontWeight: "700", color: "#666" }}>Loading your rides...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const upcoming  = bookings.filter((b) => !b.status || b.status === "upcoming");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const list = activeTab === "upcoming" ? upcoming : activeTab === "completed" ? completed : cancelled;

  return (
    <div style={{ padding: "0 0 100px 0", color: "#111", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>

      <style>{`
<<<<<<< HEAD
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .smooth-entry { animation: slideUpFade 0.4s ease-out forwards; }
        .booking-card { transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); }
        .booking-card:hover { transform: translateY(-6px); boxShadow: 0 20px 50px rgba(0,0,0,0.1) !important; border-color: ${RED}20 !important; }
=======
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .booking-card { animation: slideUp 0.5s ease forwards; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .booking-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        
        .mb-subheader {
          position: sticky;
          top: 64px;
          z-index: 100;
          background: #f8fafc; /* Replaced var(--glass-bg) */
          backdrop-filter: blur(10px); /* Replaced var(--glass-blur) */
          -webkit-backdrop-filter: blur(10px); /* Replaced var(--glass-blur) */
          border-bottom: 1px solid #e2e8f0; /* Replaced var(--glass-border) */
          padding: 30px 40px 0;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Replaced var(--shadow-sm) */
        }
>>>>>>> c74f3a9

        .tab-btn {
          padding: 0 0 12px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 800;
          color: #94a3b8;
          cursor: pointer;
          position: relative;
          text-transform: capitalize;
          transition: all 0.3s;
        }
        .tab-btn.active { color: ${RED}; }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: ${RED};
          border-radius: 10px;
          box-shadow: 0 -2px 10px rgba(190, 13, 13, 0.3);
        }

<<<<<<< HEAD
          .mb-sticky { padding-top: 20px !important; }
          @media (max-width: 900px) {
            .mb-outer { padding: 0 16px 0 16px !important; }
            .mb-title  { font-size: 28px !important; }
            .mb-subtitle { font-size: 14px !important; }
            .mb-tabs   { gap: 24px !important; }
            .mb-tab-label { font-size: 14px !important; }
            .mb-grid   { grid-template-columns: 1fr !important; gap: 16px !important; }
            .mb-sticky { padding-top: 24px !important; }
          }
      `}</style>

      <div className="mb-outer" style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "10px",
        borderBottom: "1.5px solid rgba(15, 23, 42, 0.05)",
        fontFamily: F
      }}>
        <div className="mb-sticky" style={{ textAlign: "left", marginBottom: "24px" }}>
          <h2 className="mb-title" style={{ fontSize: "40px", fontWeight: "900", margin: "0", letterSpacing: "-1.5px", fontFamily: H, color: "#0f172a" }}>
            My Bookings
          </h2>
          <p className="mb-subtitle" style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginTop: "6px" }}>
            Check your ride schedule and rental history.
          </p>
        </div>

        <div className="mb-tabs" style={{ display: "flex", gap: "45px", marginBottom: "10px", paddingBottom: "0" }}>
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ cursor: "pointer", position: "relative", display: "inline-block", paddingBottom: "12px" }}>
              <div className="mb-tab-label" style={{
                fontWeight: activeTab === tab ? 800 : 600,
                fontSize: "16px",
                color: activeTab === tab ? RED : "#94a3b8",
                textTransform: "capitalize",
                padding: "0 2px",
                transition: "all 0.3s ease",
                fontFamily: H
              }}>
                {tab}
              </div>
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                height: "3px", background: RED, borderRadius: "10px",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                width: activeTab === tab ? "100%" : "0%",
                boxShadow: activeTab === tab ? `0 0 12px ${RED}40` : "none"
              }} />
            </div>
=======
        @media (max-width: 900px) {
          .mb-subheader { top: 56px !important; padding: 25px 20px 0 !important; }
          .mb-content { padding: 25px 20px !important; }
          .mb-tabs { gap: 20px !important; }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="mb-subheader">
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "900", margin: "0", letterSpacing: "-1px", color: "#1e293b" }}>
            My Bookings
          </h2>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginTop: "6px" }}>
            Manage your rides and rental history
          </p>
        </div>

        {/* TABS */}
        <div className="mb-tabs" style={{ display: "flex", gap: "40px" }}>
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <button key={tab} className={`tab-btn${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab}
              <span style={{ marginLeft: "6px", fontSize: "11px", padding: "1px 6px", borderRadius: "6px", background: activeTab === tab ? "rgba(190,13,13,0.1)" : "rgba(148,163,184,0.1)", color: activeTab === tab ? RED : "#94a3b8", fontWeight: "800" }}>
                {tab === "upcoming" ? upcoming.length : tab === "completed" ? completed.length : cancelled.length}
              </span>
            </button>
>>>>>>> c74f3a9
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* GRID */}
      <div className="mb-outer">
        <div key={activeTab} className="smooth-entry">
          {list.length > 0 ? (
            <div className="mb-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}>
              {list.map((b) => (
                <div key={b.id} className="booking-card" style={{
                  padding: "40px 24px 28px 24px",
                  borderRadius: "28px",
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  border: "1.5px solid rgba(15, 23, 42, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  fontFamily: F
                }}>

                  {activeTab !== "cancelled" && (
                    <div style={{
                      position: "absolute", top: "16px", right: "20px",
                      fontSize: "10px", fontWeight: "800", color: "#94a3b8",
                      textTransform: "uppercase", letterSpacing: "1px",
                      fontFamily: H
                    }}>
                      ID: {b.id.slice(-6)}
                    </div>
                  )}

                  {/* Icon */}
                  <div style={{
                    width: "56px", height: "56px",
                    backgroundColor: "rgba(190,13,13,0.07)",
                    borderRadius: "18px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "14px",
                  }}>
                    <FontAwesomeIcon
                      icon={b.vehicleType?.toLowerCase() === 'bike' ? faMotorcycle : faCar}
                      style={{ color: RED, fontSize: "26px" }}
                    />
                  </div>

                  {/* Vehicle name */}
                  <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "22px", fontWeight: "900", textTransform: "capitalize", fontFamily: H }}>
                    {b.vehicleType}
                  </h3>

                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "8px", marginBottom: "24px", padding: "14px 20px",
                    backgroundColor: "#f8fafc", borderRadius: "16px",
                    border: "1px solid rgba(15, 23, 42, 0.05)", width: "100%",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ color: RED, fontSize: "14px" }} />
                      <span style={{ fontWeight: "800", color: "#0f172a", fontSize: "15px" }}>
                        {formatDate(b.date || b.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: RED, fontSize: "13px", fontWeight: "800" }}>
                      <FontAwesomeIcon icon={faClock} />
                      <span>{b.pickupTime || "09:00 AM"} – {b.dropOffTime || "09:00 PM"}</span>
                    </div>
                  </div>

                  {/* Action */}
                  {activeTab === "upcoming" ? (
                    <button onClick={() => handleCancel(b.id)} style={{
                      width: "100%", padding: "14px",
                      background: "transparent", border: `1.5px solid ${RED}`,
                      color: RED, borderRadius: "14px",
                      fontWeight: "900", fontSize: "14px", cursor: "pointer", transition: "all .3s ease",
                      fontFamily: F
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = RED; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = RED; }}
                    >
                      Cancel Booking
                    </button>
                  ) : activeTab === "completed" ? (
                    <div style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "#f0fdf4", color: "#16a34a", fontWeight: "900", fontSize: "14px" }}>
                      Ride Completed ✓
                    </div>
                  ) : (
                    <div style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "#fef2f2", color: RED, fontWeight: "900", fontSize: "14px" }}>
                      Cancelled
                    </div>
                  )}
=======
      {/* CONTENT GRID */}
      <div className="mb-content" style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px" }}>
        {list.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "25px" }}>
            {list.map((b, i) => (
              <div key={b.id} className="booking-card" style={{
                background: "#fff",
                borderRadius: "24px",
                border: "1px solid #f0f0f0",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                animationDelay: `${i * 0.05}s`
              }}>
                {/* Card Top */}
                <div style={{ padding: "24px", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(190,13,13,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FontAwesomeIcon icon={b.vehicleType?.toLowerCase() === 'bike' ? faMotorcycle : faCar} style={{ color: RED, fontSize: "22px" }} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>BOOKING ID</p>
                      <p style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", margin: "2px 0 0" }}>#{b.id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>

                  <h3 style={{ margin: "0 0 4px 0", color: "#1e293b", fontSize: "20px", fontWeight: "800" }}>{b.vehicleType} <span style={{ fontWeight: "500", color: "#64748b", fontSize: "14px" }}>• {b.fuel || "Petrol"}</span></h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: "12px" }} />
                    {formatDate(b.date || b.createdAt)}
                  </div>
>>>>>>> c74f3a9
                </div>

                {/* Card Info */}
                <div style={{ padding: "0 24px 24px" }}>
                  <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>TIMING</p>
                        <p style={{ fontSize: "13px", fontWeight: "700", color: RED, margin: "4px 0 0", display: "flex", alignItems: "center", gap: "5px" }}>
                          <FontAwesomeIcon icon={faClock} style={{ fontSize: "11px" }} />
                          {b.pickupTime || "09:00 AM"} – {b.dropOffTime || "09:00 PM"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>TOTAL</p>
                        <p style={{ fontSize: "16px", fontWeight: "900", color: "#1e293b", margin: "4px 0 0" }}>₹{b.totalPrice || "0"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div style={{ marginTop: "20px" }}>
                    {activeTab === "upcoming" ? (
                      <button onClick={() => handleCancel(b.id)} style={{ width: "100%", padding: "13px", background: "#fff", border: "2.5px solid #f1f5f9", color: "#f43f5e", borderRadius: "14px", fontWeight: "800", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#fecdd3'; e.currentTarget.style.background = '#fff1f2'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fff'; }}>
                        Cancel Booking
                      </button>
                    ) : activeTab === "completed" ? (
                      <div style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#f0fdf4", color: "#16a34a", fontWeight: "800", fontSize: "13px", textAlign: "center", border: "1px solid #dcfce7" }}>
                        Ride Completed ✓
                      </div>
                    ) : (
                      <div style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#fff1f2", color: "#f43f5e", fontWeight: "800", fontSize: "13px", textAlign: "center", border: "1px solid #ffe4e6" }}>
                        Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "100px 40px", textAlign: "center", background: "#fff", borderRadius: "32px", border: "1px dashed #e2e8f0" }}>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>
              {activeTab === "upcoming" ? "🛵" : activeTab === "completed" ? "🏁" : "❌"}
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: "0" }}>
              {activeTab === "upcoming" ? "No upcoming rides" : activeTab === "completed" ? "No completed rides yet" : "No cancelled bookings"}
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginTop: "8px" }}>
              {activeTab === "upcoming" ? "Your journey with RoadMate hasn't started yet. Book your first ride today!" : "Your past rental history will appear here once you complete a ride."}
            </p>
            {activeTab === "upcoming" && (
              <button onClick={() => window.location.href = '/'} style={{ marginTop: "25px", padding: "12px 25px", borderRadius: "14px", background: RED, color: "#fff", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer", boxShadow: "0 8px 20px rgba(190,13,13,0.25)" }}>
                Start Exploring
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;