import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const RED = "#be0d0d";

const Navbar = ({ isDrawerOpen: externalDrawerOpen, setIsDrawerOpen: externalSetDrawerOpen }) => {
  const [_internalDrawerOpen, _setInternalDrawerOpen] = useState(false);
  const isDrawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : _internalDrawerOpen;
  const setIsDrawerOpen = externalSetDrawerOpen || _setInternalDrawerOpen;

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null); // This ref is not used in the new drawer implementation for scroll locking, but kept as it was in the original code.

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignup = async () => {
    setIsLoginOpen(false);
    setIsDrawerOpen(false);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      const userRef = doc(db, "users", loggedUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: loggedUser.displayName,
          email: loggedUser.email,
          uid: loggedUser.uid,
          createdAt: new Date(),
          provider: "google"
        });
      }
      window.location.href = "/";
    } catch (err) {
      console.error("Google Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDrawerOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          transition: "all 0.3s ease",
          height: scrolled ? "70px" : "90px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
          backdropFilter: scrolled ? "blur(15px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.05)" : "none",
        }}
      >
        <div style={{ maxWidth: "1250px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: "24px",
              fontWeight: 900,
              textDecoration: "none",
              color: scrolled ? "#111" : "#fff",
              letterSpacing: "-1px"
            }}
          >
            Road<span style={{ color: RED }}>Mate</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }} className="desktop-only">
            <NavLink
              to="/my-bookings"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
                color: isActive ? RED : (scrolled ? "#555" : "rgba(255,255,255,0.85)"),
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              })}
            >
              <BookingIcon /> My Bookings
            </NavLink>

            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                backgroundColor: scrolled ? "#111" : "#fff",
                color: scrolled ? "#fff" : "#111",
                border: "none",
                padding: "10px 24px",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "transform 0.2s",
                boxShadow: scrolled ? "0 10px 20px rgba(0,0,0,0.1)" : "0 10px 20px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {isLoggedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                    {(user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                   </div>
                   Account
                </div>
              ) : (
                <> <AccountIcon size={18} /> Account </>
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div
            className="mobile-only"
            onClick={() => setIsDrawerOpen(true)}
            style={{ color: scrolled ? "#111" : "#fff", cursor: "pointer" }}
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </div>
        </div>
      </nav>


      {/* DRAWER & MODALS */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 10001 }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "400px", height: "100vh", backgroundColor: "#fff", zIndex: 10002, display: "flex", flexDirection: "column", boxShadow: "-20px 0 50px rgba(0,0,0,0.1)" }}
            >
              <div style={{ padding: "30px", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 900 }}>Account</h2>
                  <button onClick={() => setIsDrawerOpen(false)} style={{ background: "none", border: "none", fontSize: "32px", cursor: "pointer", color: "#ccc" }}>&times;</button>
                </div>

                {!isLoggedIn ? (
                  <div style={{ padding: "30px", borderRadius: "30px", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", marginBottom: "40px" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "20px", color: "#111" }}>Premium Vehicle Rentals</h3>
                    <button
                      onClick={() => { setIsDrawerOpen(false); setIsLoginOpen(true); }}
                      style={{ width: "100%", padding: "16px", background: RED, color: "#fff", border: "none", borderRadius: "18px", fontSize: "16px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(190,13,13,0.2)" }}
                    >
                      <LoginIcon size={20} /> Login / Signup
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "20px", borderRadius: "24px", background: "#f8f9fa", border: "1px solid #eee", marginBottom: "40px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee" }}>
                      <AdminIcon size={24} color={RED} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "18px", fontWeight: 900, margin: 0 }}>{user?.displayName || "RoadMate User"}</h4>
                      <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>{user?.email}</p>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="hide-scrollbar">
                   <DrawerItem icon={<BookingIcon />} label="My Bookings" onClick={() => { setIsDrawerOpen(false); navigate("/my-bookings"); }} />
                   <DrawerItem icon={<ShieldIcon />} label="Document Verification" onClick={() => { setIsDrawerOpen(false); navigate("/documents"); }} />
                   <DrawerItem icon={<NewWalletIcon />} label="Wallet & Payments" onClick={() => { setIsDrawerOpen(false); navigate("/wallet"); }} />
                </div>

                {isLoggedIn && (
                  <div style={{ marginTop: "auto", paddingTop: "40px" }}>
                    <button
                      onClick={handleLogout}
                      style={{ width: "100%", padding: "16px", background: "none", border: "2px solid #fff0f0", color: RED, borderRadius: "18px", fontSize: "15px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                    >
                      <LogoutIcon size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {isLoginOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 11000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsLoginOpen(false)}
               style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
             />
             <motion.div
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               style={{ position: "relative", backgroundColor: "#fff", padding: "50px 40px", borderRadius: "40px", width: "100%", maxWidth: "440px", textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}
             >
                <button onClick={() => setIsLoginOpen(false)} style={{ position: "absolute", top: "25px", right: "25px", border: "none", background: "none", fontSize: "32px", cursor: "pointer", color: "#ccc" }}>&times;</button>
                <div style={{ marginBottom: "30px" }}>
                   <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "10px" }}>Welcome <span style={{ color: RED }}>Mate</span></h2>
                   <p style={{ color: "#888", fontWeight: 500 }}>Bhubaneswar's choice for luxury rentals</p>
                </div>
                <button
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  style={{ width: "100%", padding: "16px", backgroundColor: "#fff", border: "2px solid #f0f0f0", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="24" alt="G" />
                  {loading ? "Connecting..." : "Continue with Google"}
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const DrawerItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "18px", cursor: "pointer", transition: "background 0.2s" }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <div style={{ color: "#aaa" }}>{icon}</div>
      <span style={{ fontSize: "15px", fontWeight: 700, color: "#333" }}>{label}</span>
    </div>
    <span style={{ color: "#ddd", fontSize: "20px" }}>&rsaquo;</span>
  </div>
);

const BookingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="m16 10-4 4-2-2"/></svg>;
const AccountIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LoginIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
const LogoutIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const AdminIcon = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const NewWalletIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="7" y1="15" x2="11" y2="15" /></svg>;

export default Navbar;