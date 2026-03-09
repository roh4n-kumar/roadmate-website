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
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .smooth-entry { animation: slideUpFade 0.4s ease-out forwards; }
        .booking-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.08) !important; }

        .mb-outer { padding: 0 10% 0 10%; }

          .mb-sticky { padding-top: 70px !important; }
          @media (max-width: 900px) {
            .mb-outer { padding: 0 16px 0 16px !important; }
            .mb-title  { font-size: 26px !important; }
            .mb-subtitle { font-size: 14px !important; }
            .mb-tabs   { gap: 24px !important; }
            .mb-tab-label { font-size: 14px !important; }
            .mb-grid   { grid-template-columns: 1fr !important; gap: 16px !important; }
            .mb-sticky { padding-top: 80px !important; }
          }
      `}</style>

      {/* STICKY HEADER */}
      <div className="mb-outer" style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "#fcfcfc",
        paddingTop: "80px", paddingBottom: "10px",
      }}>
        <div className="mb-sticky" style={{ textAlign: "left", marginBottom: "32px" }}>
          <h2 className="mb-title" style={{ fontSize: "36px", fontWeight: "900", margin: "0", letterSpacing: "-1px" }}>
            My Bookings
          </h2>
          <p className="mb-subtitle" style={{ fontSize: "16px", fontWeight: "600", color: "#666", marginTop: "8px" }}>
            Check your ride schedule and rental history.
          </p>
        </div>

        {/* TABS */}
        <div className="mb-tabs" style={{ display: "flex", gap: "45px", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ cursor: "pointer", position: "relative", display: "inline-block" }}>
              <div className="mb-tab-label" style={{
                fontWeight: activeTab === tab ? 800 : 500,
                fontSize: "16px",
                color: activeTab === tab ? RED : "#888",
                textTransform: "capitalize",
                padding: "0 2px",
                transition: "color 0.3s ease",
              }}>
                {tab}
              </div>
              <div style={{
                position: "absolute", bottom: "-8px", left: 0,
                height: "4px", background: RED, borderRadius: "10px",
                transition: "width 0.3s ease-in-out",
                width: activeTab === tab ? "100%" : "0%",
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
                  padding: "36px 20px 24px 20px",
                  borderRadius: "20px",
                  background: "#ffffff",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                  border: "1px solid #f0f0f0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}>

                  {activeTab !== "cancelled" && (
                    <div style={{
                      position: "absolute", top: "14px", right: "16px",
                      fontSize: "10px", fontWeight: "700", color: "#bbb",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      Booked: {formatDate(b.createdAt)}
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
                  <h3 style={{ margin: "0 0 12px 0", color: "#1a1a1a", fontSize: "20px", fontWeight: "900", textTransform: "capitalize" }}>
                    {b.vehicleType}
                  </h3>

                  {/* Date & Time */}
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "6px", marginBottom: "16px", padding: "10px 16px",
                    backgroundColor: "#f9f9f9", borderRadius: "12px",
                    border: "1px solid #eee", width: "100%",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ color: RED, fontSize: "13px" }} />
                      <span style={{ fontWeight: "700", color: "#333", fontSize: "14px" }}>
                        {formatDate(b.date || b.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: RED, fontSize: "12px", fontWeight: "700" }}>
                      <FontAwesomeIcon icon={faClock} />
                      <span>{b.pickupTime || "09:00 AM"} – {b.dropOffTime || "09:00 PM"}</span>
                    </div>
                  </div>

                  {/* Action */}
                  {activeTab === "upcoming" ? (
                    <button onClick={() => handleCancel(b.id)} style={{
                      width: "100%", padding: "13px",
                      background: "transparent", border: `2px solid ${RED}`,
                      color: RED, borderRadius: "12px",
                      fontWeight: "800", fontSize: "14px", cursor: "pointer", transition: "0.2s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = RED; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = RED; }}
                    >
                      Cancel Booking
                    </button>
                  ) : activeTab === "completed" ? (
                    <div style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#f0fdf4", color: "#16a34a", fontWeight: "800", fontSize: "13px" }}>
                      Ride Completed ✓
                    </div>
                  ) : (
                    <div style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#fef2f2", color: RED, fontWeight: "800", fontSize: "13px" }}>
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