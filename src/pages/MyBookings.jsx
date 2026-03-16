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
    return <div style={{ padding: "80px", color: "black", textAlign: "center", fontWeight: "700" }}>Loading...</div>;
  }

  const upcoming  = bookings.filter((b) => !b.status || b.status === "upcoming");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const list = activeTab === "upcoming" ? upcoming : activeTab === "completed" ? completed : cancelled;

  return (
    <div style={{ padding: "0 0 80px 0", color: "black", minHeight: "100vh", backgroundColor: "#fcfcfc" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .smooth-entry { animation: slideUpFade 0.4s ease-out forwards; }
        .booking-card { transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); }
        .booking-card:hover { transform: translateY(-6px); boxShadow: 0 20px 50px rgba(0,0,0,0.1) !important; border-color: ${RED}20 !important; }

        .mb-outer { padding: 0 10% 0 10%; }

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
          ))}
        </div>
      </div>

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
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "left", marginTop: "40px" }}>
              <p style={{ fontWeight: "500", color: "#999", fontSize: "18px" }}>
                {activeTab === "upcoming"  && "No booking found."}
                {activeTab === "completed" && "No bookings have been completed yet."}
                {activeTab === "cancelled" && "No cancellation found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;