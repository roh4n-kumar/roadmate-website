// src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import VehicleResults from "./pages/VehicleResults";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PersonalInfo from "./pages/PersonalInfo";
import DocumentVerification from "./pages/DocumentVerification";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const RED = "#be0d0d";

// ── Mobile Shell — topbar + bottom nav, shown only on mobile ─────────────────
const MobileShell = ({ setIsDrawerOpen }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .rm-mobile-top { display: none; }
        .rm-mobile-bot { display: none; }
        @media (max-width: 900px) {
          .rm-mobile-top {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-bottom: 1px solid var(--glass-border);
            padding: 0 20px;
            height: 56px;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 998;
            box-shadow: var(--shadow-sm);
          }
          .rm-mobile-bot {
            display: flex !important;
            position: fixed;
            bottom: 20px; left: 20px; right: 20px;
            height: 64px;
            background: rgba(11, 11, 11, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 998;
            align-items: center;
            justify-content: space-evenly;
            padding: 0 10px;
          }
          .rm-mob-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'Outfit', sans-serif;
            font-size: 10px;
            font-weight: 700;
            color: rgba(255,255,255,0.5);
            height: 100%;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            flex: 1;
          }
          .rm-mob-btn.active { color: #fff; }
          .rm-mob-btn.active::after {
            content: '';
            position: absolute;
            top: 10px;
            width: 4px;
            height: 4px;
            background: var(--brand-primary);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--brand-primary);
          }
          .rm-mob-btn svg {
            transition: transform 0.2s;
          }
          .rm-mob-btn.active svg {
            transform: translateY(-2px);
          }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="rm-mobile-top">
        <a href="/" style={{ color:"#111", fontSize:"22px", fontWeight:900, textDecoration:"none", letterSpacing:"-0.8px", fontFamily:"'Outfit',sans-serif" }}>
          Road<span style={{ color: RED }}>Mate</span>
        </a>
        <div style={{
          width:36, height:36, borderRadius:"12px",
          background:`var(--brand-primary)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"14px", fontWeight:800, color:"#fff",
          boxShadow:`0 4px 12px rgba(190,13,13,0.3)`,
        }}>
          {user ? (user.displayName?.[0] || user.email?.[0] || "U").toUpperCase() : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="rm-mobile-bot">
        <button className={`rm-mob-btn${isActive("/") ? " active" : ""}`} onClick={() => navigate("/")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </button>
        <button className={`rm-mob-btn${isActive("/my-bookings") ? " active" : ""}`} onClick={() => navigate("/my-bookings")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="m16 10-4 4-2-2"/></svg>
          Bookings
        </button>
        <button className="rm-mob-btn" onClick={() => setIsDrawerOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Account
        </button>
      </div>
    </>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Navbar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <MobileShell setIsDrawerOpen={setIsDrawerOpen} />

      <Routes>
        <Route path="/"                   element={<Home isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />} />
        <Route path="/profile"            element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
        <Route path="/vehicles"           element={<ProtectedRoute><VehicleResults /></ProtectedRoute>} />
        <Route path="/my-bookings"        element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/documents/:docType" element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
        <Route path="/documents"          element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;