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
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const Navbar = ({ isDrawerOpen: externalDrawerOpen, setIsDrawerOpen: externalSetDrawerOpen }) => {
  const [_internalDrawerOpen, _setInternalDrawerOpen] = useState(false);
  const isDrawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : _internalDrawerOpen;
  const setIsDrawerOpen = externalSetDrawerOpen || _setInternalDrawerOpen;

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null); // This ref is not used in the new drawer implementation for scroll locking, but kept as it was in the original code.

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
<<<<<<< HEAD
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @media (max-width: 900px) { .desktop-navbar { display: none !important; } .roadmate-drawer { width: 100% !important; } }
          .google-auth-btn {
            width: 100%; padding: 14px; background: #fff;
            border: 1.5px solid rgba(15, 23, 42, 0.1); border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            gap: 12px; font-weight: 800; font-size: 16px; color: #0f172a;
            cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); margin-top: 10px;
            font-family: ${F};
          }
          .google-auth-btn:hover { background: #f8fafc; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
          .premium-logout-btn {
            background: #0f172a; color: white; border: none; padding: 16px;
            border-radius: 16px; font-weight: 800; cursor: pointer; font-size: 16px;
            width: 100%; display: flex; align-items: center; justify-content: center;
            gap: 10px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: ${F};
          }
          .premium-logout-btn:hover { background: ${RED}; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(190,13,13,0.3); }
          .desktop-link { transition: all 0.2s ease; font-family: ${F}; }
          .desktop-link:hover { color: ${RED} !important; transform: translateY(-1px); }
          .desktop-link.selected { background: transparent !important; color: ${RED} !important; border-bottom: 3px solid ${RED}; border-radius: 0; }
          .account-premium-btn {
            background: #0f172a; color: #fff; border: none;
            padding: 10px 20px; border-radius: 12px;
            font-weight: 800; font-size: 14px; cursor: pointer;
            display: flex; align-items: center; gap: 10px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: ${F};
          }
          .account-premium-btn:hover { background: ${RED}; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(190,13,13,0.3); }
        `}
      </style>
=======
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          transition: "all 0.3s ease",
          height: "70px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          backgroundColor: "#fff",
          backdropFilter: "blur(15px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
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
              color: "#111",
              letterSpacing: "-1px"
            }}
          >
            Road<span style={{ color: RED }}>Mate</span>
          </Link>
>>>>>>> c74f3a9

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }} className="desktop-only">
            <NavLink
              to="/my-bookings"
<<<<<<< HEAD
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setIsDrawerOpen(true);
                  setTimeout(() => {
                    setShowWarning(true);
                    setTimeout(() => setShowWarning(false), 3000);
                  }, 400);
                }
              }}
              className={({ isActive }) => `desktop-link${isActive ? " selected" : ""}`}
              style={{
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 700,
                color: "#0f172a",
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 0",
              }}
=======
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
                color: isActive ? RED : "#111",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              })}
>>>>>>> c74f3a9
            >
              <BookingIcon /> My Bookings
            </NavLink>
<<<<<<< HEAD
            <div onClick={() => setIsDrawerOpen(true)} className="account-premium-btn">
              {isLoggedIn ? (
                <>
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "8px",
                    background: `linear-gradient(135deg, ${RED}, #ff4040)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "900", color: "white",
                    fontFamily: H, flexShrink: 0,
                    boxShadow: "0 4px 10px rgba(190,13,13,0.3)",
                  }}>
                    {(user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase()}
                  </div>
                  Account
                </>
=======

            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                backgroundColor: "#111",
                color: "#fff",
                border: "none",
                padding: "12px 28px",
                borderRadius: "18px",
                fontSize: "15px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "transform 0.2s",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
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
>>>>>>> c74f3a9
              ) : (
                <> <AccountIcon size={18} /> Account </>
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div
            className="mobile-only"
            onClick={() => setIsDrawerOpen(true)}
            style={{ color: "#111", cursor: "pointer" }}
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
                   <DrawerItem icon={<AccountIcon size={20} />} label="Personal Profile" onClick={() => { setIsDrawerOpen(false); navigate("/profile"); }} />
                   <DrawerItem icon={<BookingIcon />} label="My Bookings" onClick={() => { setIsDrawerOpen(false); navigate("/my-bookings"); }} />
                   <DrawerItem icon={<ShieldIcon />} label="Document Verification" onClick={() => { setIsDrawerOpen(false); navigate("/documents"); }} />
                   <DrawerItem icon={<NewWalletIcon />} label="Wallet & Payments" onClick={() => { setIsDrawerOpen(false); navigate("/wallet"); }} />
                   <DrawerItem icon={<SupportIcon />} label="Customer Support" onClick={() => { setIsDrawerOpen(false); /* support logic */ }} />
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

<<<<<<< HEAD
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 11000 };
const modalContentStyle = { background: "#fff", padding: "45px 40px", borderRadius: "32px", width: "90%", maxWidth: "420px", position: "relative", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" };
const closeModalStyle = { position: "absolute", top: "20px", right: "25px", fontSize: "32px", cursor: "pointer", color: "#ccc" };
const navStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "70px", zIndex: 1000, background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1.5px solid rgba(15, 23, 42, 0.05)", display: "flex", alignItems: "center" };
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 24px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" };
const logoStyle = { color: "#0f172a", fontSize: "24px", fontWeight: 900, textDecoration: "none", letterSpacing: "-1px", fontFamily: H };
const linkStyle = { textDecoration: "none", fontSize: "14px", fontWeight: 700, padding: "8px 18px", borderRadius: "10px", transition: "all 0.3s ease", fontFamily: F };
const accountBtnStyle = { textDecoration: "none", fontSize: "14px", fontWeight: 700, padding: "8px 12px", borderRadius: "10px", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#0f172a", border: "none", fontFamily: F };
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(2px)", zIndex: 10001 };
const drawerStyle = { position: "fixed", top: 0, width: "400px", height: "100vh", background: "white", zIndex: 10002, transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" };
const drawerHeaderStyle = { padding: "0 24px", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" };
const dividerStyle = { margin: "0 24px 20px 24px", border: "none", borderTop: "1px solid #eee" };
const closeBtnStyle = { cursor: "pointer", fontSize: "28px", color: "#888" };
const ctaTitleStyle = { fontSize: "24px", fontWeight: "900", color: "#1a1a1a", marginBottom: "16px", lineHeight: "1.2" };
const loginBtnStyle = { background: RED, color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "16px", marginBottom: "12px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" };
const signupTextStyle = { fontSize: "14px", color: "#666" };
const scrollAreaStyle = { flex: 1, overflowY: "auto", paddingBottom: "40px" };
const sectionTitleStyle = { fontSize: "18px", fontWeight: "800", color: "#1a1a1a", padding: "10px 24px", margin: "10px 0 5px 0" };
const drawerItemStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", cursor: "pointer", transition: "0.2s" };
=======
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
>>>>>>> c74f3a9

const BookingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="m16 10-4 4-2-2"/></svg>;
const AccountIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LoginIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
const LogoutIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const AdminIcon = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const NewWalletIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="7" y1="15" x2="11" y2="15" /></svg>;
const SupportIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

export default Navbar;
