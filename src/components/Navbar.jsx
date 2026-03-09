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

  // Use external state if provided, else internal
  const isDrawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : _internalDrawerOpen;
  const setIsDrawerOpen = externalSetDrawerOpen || _setInternalDrawerOpen;
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) { setIsLoggedIn(true); setUser(currentUser); }
      else { setIsLoggedIn(false); setUser(null); }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      setShowWarning(false);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isDrawerOpen]);

  const handleGoogleSignup = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(false);
    setIsDrawerOpen(false);

    setTimeout(async () => {
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
    }, 300);
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

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    } else {
      if (path) navigate(path);
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          /* ── Hide desktop navbar on mobile ── */
          @media (max-width: 900px) { .desktop-navbar { display: none !important; } .roadmate-drawer { width: 100% !important; } }
          .google-auth-btn {
            width: 100%; padding: 14px; background: #fff;
            border: 1.5px solid #e0e0e0; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            gap: 12px; font-weight: 700; font-size: 16px; color: #333;
            cursor: pointer; transition: all 0.2s ease; margin-top: 10px;
          }
          .google-auth-btn:hover { background: #f9f9f9; border-color: #ccc; }
          .google-auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          .premium-logout-btn {
            background: ${RED}; color: white; border: none; padding: 14px;
            border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 16px;
            width: 100%; display: flex; align-items: center; justify-content: center;
            gap: 10px; transition: 0.3s;
          }
          .premium-logout-btn:hover { opacity: 0.9; transform: translateY(-2px); }
          .mybookings-btn { background: transparent; }
          .mybookings-btn:hover { background: #e8e8e8 !important; }
          .mybookings-btn.selected { background: #be0d0d !important; color: white !important; }
          .mybookings-btn:active { background: #a50b0b !important; }
          .account-btn { background: transparent; }
          .account-btn:hover { background: #e8e8e8 !important; }
          .account-btn.selected { background: #be0d0d !important; color: white !important; }
          .account-btn:active { background: #a50b0b !important; }
        `}
      </style>

      {/* NAVBAR — desktop only */}
      <nav className="desktop-navbar" style={navStyle}>
        <div style={containerStyle}>
          <Link to="/" style={logoStyle}>Road<span style={{ color: RED }}>Mate</span></Link>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <NavLink
              to="/my-bookings"
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
              className={({ isActive }) => `mybookings-btn${isActive ? " selected" : ""}`}
              style={({ isActive }) => ({
                ...linkStyle,
                backgroundColor: isActive ? RED : "",
                color: isActive ? "white" : "#1a1a1a",
                display: "flex", alignItems: "center", gap: "8px",
              })}
            >
              <BookingIcon />
              My Bookings
            </NavLink>
            <div onClick={() => setIsDrawerOpen(true)} className={`account-btn${isDrawerOpen ? " selected" : ""}`} style={{...accountBtnStyle, background: ""}}>
              {isLoggedIn ? (
                <>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: isDrawerOpen ? "rgba(255,255,255,0.25)" : `linear-gradient(135deg, ${RED}, #e84545)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "900", color: "white",
                    fontFamily: "'Arial Black', Arial, sans-serif",
                    flexShrink: 0,
                    boxShadow: isDrawerOpen ? "none" : "0 2px 8px rgba(190,13,13,0.35)",
                  }}>
                    {(user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase()}
                  </div>
                  {user?.displayName || user?.email || "User"}
                </>
              ) : (
                <><AccountIcon size={18} /> Account</>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* DRAWER OVERLAY */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)} style={overlayStyle} />
        )}
      </AnimatePresence>

      {/* SIDEBAR DRAWER */}
      <div className="roadmate-drawer" style={{ ...drawerStyle, right: isDrawerOpen ? 0 : "-450px", visibility: isDrawerOpen ? "visible" : "hidden" }}>
        <div style={drawerHeaderStyle}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a1a" }}>Account</h2>
          <span onClick={() => setIsDrawerOpen(false)} style={closeBtnStyle}>&times;</span>
        </div>

        <div ref={scrollRef} style={scrollAreaStyle} className="hide-scrollbar">
          <div style={{ padding: "24px 24px" }}>
            {!isLoggedIn ? (
              <>
                <h3 style={ctaTitleStyle}>Log in to manage your bookings</h3>
                <button onClick={() => { setIsDrawerOpen(false); setIsLoginOpen(true); }} style={loginBtnStyle}>
                  <LoginIcon size={20} /> Log in
                </button>
                <p style={signupTextStyle}>
                  Don't have an account?{" "}
                  <span onClick={() => { setIsDrawerOpen(false); setIsSignupOpen(true); }} style={{ color: RED, fontWeight: "700", cursor: "pointer" }}>
                    Sign up
                  </span>
                </p>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px 0" }}>
                <div style={{ background: "#f0f0f0", padding: "12px", borderRadius: "50%", display: "flex" }}>
                  <AdminIcon size={30} color={RED} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#1a1a1a" }}>{user?.displayName || "Roadmate User"}</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>{user?.email}</p>
                </div>
              </div>
            )}
          </div>

          <hr style={dividerStyle} />

          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  margin: "0 24px 16px 24px", padding: "12px 16px",
                  background: "#fff5f5", border: "1.5px solid #fcc",
                  borderRadius: "12px", display: "flex", alignItems: "center",
                  gap: "10px", fontSize: "13px", fontWeight: "600", color: RED,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Please login to view these details.
              </motion.div>
            )}
          </AnimatePresence>

          <DrawerSection title="My details">
            <DrawerItem icon={<BookingIcon />} label="My Bookings" onClick={() => handleProtectedClick("/my-bookings")} />
            <DrawerItem icon={<UserIcon />} label="Personal information" onClick={() => handleProtectedClick("/profile")} />
          </DrawerSection>

          <DrawerSection title="Document Verification">
            <DrawerItem icon={<ShieldIcon />} label="DL, Aadhaar & Selfie" subLabel="Upload & verify your documents" onClick={() => handleProtectedClick("/documents")} />
          </DrawerSection>

          <DrawerSection title="Payments">
            <DrawerItem icon={<NewWalletIcon />} label="RoadMate Wallet" onClick={() => handleProtectedClick("/wallet")} />
          </DrawerSection>

          <DrawerSection title="More">
            <DrawerItem icon={<HelpIcon />} label="Help" />
            <DrawerItem icon={<OffersIcon />} label="Offers" />
            <DrawerItem icon={<InfoIcon />} label="Know about RoadMate" />
            <DrawerItem icon={<LangIcon />} label="Language" subLabel="English" />
          </DrawerSection>

          {isLoggedIn && (
            <div style={{ padding: "10px 24px 40px" }}>
              <button onClick={handleLogout} className="premium-logout-btn">
                <LogoutIcon size={18} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SIGNUP MODAL */}
      <AnimatePresence>
        {isSignupOpen && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={modalContentStyle}>
              <span onClick={() => setIsSignupOpen(false)} style={closeModalStyle}>&times;</span>
              <h2 style={{ fontWeight: "900", fontSize: "28px", marginBottom: "8px" }}>
                Signup <span style={{ color: RED }}>Account</span>
              </h2>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>Join RoadMate for a premium experience</p>
              <button onClick={handleGoogleSignup} className="google-auth-btn" disabled={loading}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="G" />
                {loading ? "Connecting..." : "Continue with Google"}
              </button>
              <p style={{ marginTop: "25px", fontSize: "12px", color: "#999", lineHeight: "1.4" }}>
                By signing up, you agree to our <br/> Terms and Conditions.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {isLoginOpen && (
          <div style={modalOverlayStyle}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={modalContentStyle}>
              <span onClick={() => setIsLoginOpen(false)} style={closeModalStyle}>&times;</span>
              <h2 style={{ fontWeight: "900", fontSize: "28px", marginBottom: "8px" }}>
                Login <span style={{ color: RED }}>Account</span>
              </h2>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>Join RoadMate for a premium experience</p>
              <button onClick={handleGoogleSignup} className="google-auth-btn" disabled={loading}
                style={{ background: "#be0d0d", color: "#fff", border: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#a50b0b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#be0d0d"; }}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="G" />
                {loading ? "Connecting..." : "Continue with Google"}
              </button>
              <p style={{ marginTop: "25px", fontSize: "12px", color: "#999", lineHeight: "1.4" }}>
                By logging in, you agree to our <br/> Terms and Conditions.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 11000 };
const modalContentStyle = { background: "#fff", padding: "45px 40px", borderRadius: "32px", width: "90%", maxWidth: "420px", position: "relative", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" };
const closeModalStyle = { position: "absolute", top: "20px", right: "25px", fontSize: "32px", cursor: "pointer", color: "#ccc" };
const navStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "64px", zIndex: 1000, background: "#ffffff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", borderBottom: "2px solid #e0e0e0", display: "flex", alignItems: "center" };
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 24px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" };
const logoStyle = { color: "#1a1a1a", fontSize: "22px", fontWeight: 800, textDecoration: "none", letterSpacing: "-0.5px" };
const linkStyle = { textDecoration: "none", fontSize: "14px", fontWeight: 700, padding: "8px 18px", borderRadius: "10px", transition: "all 0.3s ease" };
const accountBtnStyle = { textDecoration: "none", fontSize: "14px", fontWeight: 700, padding: "8px 12px", borderRadius: "10px", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#1a1a1a", border: "none" };
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

const DrawerSection = ({ title, children }) => (<div style={{ marginBottom: "20px" }}><h4 style={sectionTitleStyle}>{title}</h4><div style={{ display: "flex", flexDirection: "column" }}>{children}</div></div>);
const DrawerItem = ({ icon, label, subLabel, onClick }) => (<div style={drawerItemStyle} onClick={onClick} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}><div style={{ display: "flex", alignItems: "center", gap: "16px" }}><div style={{ color: "#555", display: "flex", alignItems: "center" }}>{icon}</div><div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>{label}</span>{subLabel && <span style={{ fontSize: "12px", color: "#888" }}>{subLabel}</span>}</div></div><span style={{ color: "#ccc", fontSize: "20px" }}>&rsaquo;</span></div>);

const NewWalletIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="7" y1="15" x2="11" y2="15" /></svg>);
const LoginIcon = ({ size }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>);
const LogoutIcon = ({ size }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
const AdminIcon = ({ size, color }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const AccountIcon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const BookingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="m16 10-4 4-2-2"></path></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const HelpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>;
const OffersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const InfoIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12" y1="8" y2="8"></line></svg>;
const LangIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

export default Navbar;