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
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import HelpCenter from "./pages/HelpCenter";
import Payment from "./pages/Payment";
import SafetyInformation from "./pages/SafetyInformation";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

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
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1.5px solid rgba(15, 23, 42, 0.05);
            padding: 0 20px;
            height: 60px;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 998;
          }
          .rm-mobile-bot {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            height: 70px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 998;
            align-items: center;
            justify-content: space-around;
            padding: 0 10px;
          }
          .rm-mob-btn {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            background: none; border: none; cursor: pointer;
            font-family: ${F}; font-size: 11px; font-weight: 700;
            color: rgba(255, 255, 255, 0.5); padding: 8px 12px; border-radius: 12px;
            transition: all .2s ease;
          }
          .rm-mob-btn.active { color: #fff; transform: translateY(-2px); }
          .rm-mob-btn.active svg { stroke: ${RED}; stroke-width: 3; }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="rm-mobile-top">
        <a href="/" style={{ color:"#0f172a", fontSize:"22px", fontWeight:900, textDecoration:"none", letterSpacing:"-0.8px", fontFamily:H }}>
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
        <Route path="/payment"            element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/my-bookings"        element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/documents/:docType" element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
        <Route path="/documents"          element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
        <Route path="/about"               element={<About />} />
        <Route path="/contact"             element={<Contact />} />
        <Route path="/pricing"             element={<Pricing />} />
        <Route path="/help-center"         element={<HelpCenter />} />
        <Route path="/safety-information"  element={<SafetyInformation />} />
        <Route path="/terms-of-service"    element={<TermsOfService />} />
        <Route path="/privacy-policy"      element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}

export default App;