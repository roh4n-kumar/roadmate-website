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
    // Defense in Depth: Verify ownership in application logic too
    const booking = bookings.find(b => b.id === id);
    if (!booking || booking.userId !== auth.currentUser?.uid) {
      logSuspiciousActivity("UNAUTHORIZED_CANCELLATION_ATTEMPT", { bookingId: id });
      alert("Unauthorized action or booking not found.");
      return;
    }

    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;
    
    try {
      await updateDoc(doc(db, "bookings", id), { status: "cancelled" });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
      setActiveTab("cancelled");
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Failed to cancel booking. Please check your permissions.");
    }
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
    <div style={{ padding: "0 0 100px 0", color: "#111", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: H }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .smooth-entry { animation: slideUpFade 0.4s ease-out forwards; }
        .booking-card { transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); }
        .booking-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1) !important; border-color: ${RED}20 !important; }

        .mb-sticky { padding: 100px 40px 30px; border-bottom: 1px solid rgba(15, 23, 42, 0.05); background: #f8fafc; }
        
        @media (max-width: 900px) {
          .mb-sticky { padding: 80px 20px 25px !important; }
          .mb-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .mb-title { font-size: 28px !important; }
        }
      `}</style>

      <div className="mb-sticky">
          <h2 className="mb-title" style={{ fontSize: "40px", fontWeight: "900", margin: "0", letterSpacing: "-1.5px", fontFamily: H, color: "#0f172a" }}>
            My Bookings
          </h2>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", marginTop: "6px" }}>
            Check your ride schedule and rental history.
          </p>

          <div style={{ display: "flex", gap: "45px", marginTop: "30px" }}>
            {["upcoming", "completed", "cancelled"].map((tab) => (
              <div key={tab} onClick={() => setActiveTab(tab)} style={{ cursor: "pointer", position: "relative", paddingBottom: "12px" }}>
                <div style={{
                  fontWeight: activeTab === tab ? 800 : 600,
                  fontSize: "16px",
                  color: activeTab === tab ? RED : "#94a3b8",
                  textTransform: "capitalize",
                  transition: "all 0.3s ease",
                }}>
                  {tab}
                  <span style={{ 
                    marginLeft: "8px", fontSize: "11px", padding: "2px 8px", 
                    borderRadius: "6px", background: activeTab === tab ? "rgba(190,13,13,0.1)" : "rgba(148,163,184,0.1)",
                    color: activeTab === tab ? RED : "#94a3b8", fontWeight: "800" 
                  }}>
                    {tab === "upcoming" ? upcoming.length : tab === "completed" ? completed.length : cancelled.length}
                  </span>
                </div>
                <div style={{
                  position: "absolute", bottom: 0, left: 0,
                  height: "3px", background: RED, borderRadius: "10px",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  width: activeTab === tab ? "100%" : "0%",
                  boxShadow: activeTab === tab ? `0 0 12px ${RED}40` : "none"
                }} />
              </div>
            ))}
          </div>
      </div>

      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "40px 20px" }}>
        <div key={activeTab} className="smooth-entry">
          {list.length > 0 ? (
            <div className="mb-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
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

                  <div style={{
                    position: "absolute", top: "16px", right: "20px",
                    fontSize: "10px", fontWeight: "800", color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: "1px",
                    fontFamily: H
                  }}>
                    ID: {b.id.slice(-6).toUpperCase()}
                  </div>

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

                  <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "22px", fontWeight: "900", textTransform: "capitalize", fontFamily: H }}>
                    {b.vehicle?.name || b.vehicleType}
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
                        {formatDate(b.trip?.date || b.date || b.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: RED, fontSize: "13px", fontWeight: "800" }}>
                      <FontAwesomeIcon icon={faClock} />
                      <span>{b.trip?.pickupTime || b.pickupTime || "09:00 AM"} – {b.trip?.dropTime || b.dropOffTime || "09:00 PM"}</span>
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "15px", fontWeight: "900", color: "#1e293b" }}>Total: ₹{b.breakdown?.grandTotal || b.totalPrice || "0"}</div>
                  </div>

                  {b.status === "upcoming" ? (
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
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "100px 40px", textAlign: "center", background: "#fff", borderRadius: "32px", border: "1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize: "50px", marginBottom: "20px" }}>
                {activeTab === "upcoming" ? "🛵" : activeTab === "completed" ? "🏁" : "❌"}
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0", fontFamily: H }}>
                {activeTab === "upcoming" ? "No upcoming rides" : activeTab === "completed" ? "No completed rides yet" : "No cancelled bookings"}
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginTop: "8px" }}>
                {activeTab === "upcoming" ? "Your journey with RoadMate hasn't started yet. Book your first ride today!" : "Your past rental history will appear here once you complete a ride."}
              </p>
              {activeTab === "upcoming" && (
                <button onClick={() => window.location.href = '/'} style={{ marginTop: "25px", padding: "12px 30px", borderRadius: "16px", background: RED, color: "#fff", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer", boxShadow: `0 8px 20px ${RED}40`, fontFamily: H }}>
                  Start Exploring
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;