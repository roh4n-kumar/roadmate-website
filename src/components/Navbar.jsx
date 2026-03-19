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
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @media (max-width: 900px) { 
            .desktop-nav { display: none !important; } 
            .mobile-trigger { display: flex !important; }
          }
          @media (min-width: 901px) {
            .mobile-trigger { display: none !important; }
          }
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
          .desktop-link { transition: all 0.2s ease; font-family: ${F}; text-decoration: none; font-size: 15px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; padding: 10px 0; }
          .desktop-link:hover { color: ${RED} !important; transform: translateY(-1px); }
          .desktop-link.active { color: ${RED} !important; border-bottom: 3px solid ${RED}; }
          .account-premium-btn {
            background: #0f172a; color: #fff; border: none;
            padding: 10px 20px; border-radius: 12px;
            font-weight: 800; font-size: 14px; cursor: pointer;
            display: flex; align-items: center; gap: 10px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: ${F};
          }
          .account-premium-btn:hover { background: ${RED}; transform: translateY(-2px); box-shadow: 0 10px 25px ${RED}30; }
          .drawer-icon-wrapper { color: ${RED}; opacity: 0.9 !important; display: flex; align-items: center; justify-content: center; background: ${RED}08; padding: 8px; border-radius: 14px; margin-right: 2px; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          .drawer-item-hover:hover .drawer-icon-wrapper { background: ${RED}15; transform: scale(1.1); }
          .drawer-chevron { color: #cbd5e1; font-size: 18px; font-weight: 400; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          .drawer-item-hover:hover .drawer-chevron { transform: translateX(4px); color: ${RED}; }
        `}
      </style>

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
          backgroundColor: "rgba(255, 255, 255, 1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1.5px solid rgba(15, 23, 42, 0.05)",
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
              color: "#0f172a",
              letterSpacing: "-1px",
              fontFamily: H
            }}
          >
            Road<span style={{ color: RED }}>Mate</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }} className="desktop-nav">
            <NavLink
              to="/my-bookings"
              className={({ isActive }) => `desktop-link${isActive ? " active" : ""}`}
            >
              <BookingIcon /> My Bookings
            </NavLink>

            <button onClick={() => setIsDrawerOpen(true)} className="account-premium-btn">
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
              ) : (
                <> <AccountIcon size={18} /> Account </>
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div
            className="mobile-trigger"
            onClick={() => setIsDrawerOpen(true)}
            style={{ color: "#0f172a", cursor: "pointer", display: "none" }}
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
              style={{ position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "400px", height: "100vh", backgroundColor: "#fff", zIndex: 10002, display: "flex", flexDirection: "column", boxShadow: "-20px 0 50px rgba(0,0,0,0.1)", borderLeft: "1px solid rgba(0,0,0,0.05)" }}
            >
                <div style={{ padding: "20px 25px 15px", borderBottom: "1px solid rgba(15, 23, 42, 0.08)", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: 900, fontFamily: H, margin: 0 }}>Account</h2>
                    <button onClick={() => setIsDrawerOpen(false)} style={{ background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}>&times;</button>
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ padding: "0 25px" }}>
                    {!isLoggedIn ? (
                      <div style={{ padding: "30px", borderRadius: "30px", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", marginBottom: "40px" }}>
                        <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "20px", color: "#111", fontFamily: H }}>Premium Vehicle Rentals</h3>
                        <button
                          onClick={() => { setIsDrawerOpen(false); setIsLoginOpen(true); }}
                          style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg, ${RED}, #ff4d4d)`, color: "#fff", border: "none", borderRadius: "18px", fontSize: "16px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(190,13,13,0.2)", fontFamily: F }}
                        >
                          <LoginIcon size={20} /> Login / Signup
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "20px", borderRadius: "24px", background: "#f8f9fa", border: "1px solid #eee", marginBottom: "40px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "16px", background: `linear-gradient(135deg, ${RED}, #ff4d4d)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", fontWeight: 900, fontFamily: H }}>
                          {(user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase()}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                          <h4 style={{ fontSize: "18px", fontWeight: 900, margin: 0, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontFamily: H }}>{user?.displayName || "RoadMate User"}</h4>
                          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontWeight: 600 }}>{user?.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                <div style={{ height: "1px", background: "rgba(15, 23, 42, 0.08)", marginBottom: "15px", marginTop: "0px" }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: "0", overflowY: "auto", paddingBottom: "120px" }} className="hide-scrollbar">
                    {/* Section Headers with padding */}
                    <div style={{ padding: "10px 25px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginBottom: "12px", padding: "0 0", fontFamily: H }}>My details</h3>
                      <DrawerItem icon={<BookingIcon />} label="My Bookings" onClick={() => { setIsDrawerOpen(false); navigate("/my-bookings"); }} />
                      <DrawerItem icon={<UserIcon size={20} />} label="Personal information" onClick={() => { setIsDrawerOpen(false); navigate("/profile"); }} />
                    </div>

                    <div style={{ padding: "10px 25px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginBottom: "12px", padding: "0 0", fontFamily: H }}>Document Verification</h3>
                      <DrawerItem 
                        icon={<ShieldIcon />} 
                        label="DL, Aadhaar & Selfie" 
                        subtitle="Upload & verify your documents"
                        onClick={() => { setIsDrawerOpen(false); navigate("/documents"); }} 
                      />
                    </div>

                    <div style={{ padding: "10px 25px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginBottom: "12px", padding: "0 0", fontFamily: H }}>Payments</h3>
                      <DrawerItem icon={<CreditCardIcon size={20} />} label="RoadMate Wallet" onClick={() => { setIsDrawerOpen(false); navigate("/wallet"); }} />
                    </div>

                    <div style={{ padding: "10px 25px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginBottom: "12px", padding: "0 0", fontFamily: H }}>More</h3>
                      <DrawerItem icon={<HelpCircleIcon size={20} />} label="Help" onClick={() => { setIsDrawerOpen(false); /* help */ }} />
                      <DrawerItem icon={<TagIcon size={20} />} label="Offers" onClick={() => { setIsDrawerOpen(false); /* offers */ }} />
                      <DrawerItem icon={<InfoIcon size={20} />} label="Know about RoadMate" onClick={() => { setIsDrawerOpen(false); /* about */ }} />
                      <DrawerItem 
                        icon={<GlobeIcon size={20} />} 
                        label="Language" 
                        subtitle="English"
                        onClick={() => { setIsDrawerOpen(false); /* language */ }} 
                      />
                    </div>

                   {isLoggedIn && (
                     <div style={{ marginTop: "40px", padding: "10px 25px 40px" }}>
                       <button
                         onClick={handleLogout}
                         className="premium-logout-btn"
                       >
                         <LogoutIcon size={18} /> Logout
                       </button>
                     </div>
                   )}
                </div>
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
                   <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "10px", fontFamily: H }}>Welcome <span style={{ color: RED }}>Mate</span></h2>
                   <p style={{ color: "#64748b", fontWeight: 600, fontFamily: F }}>Bhubaneswar's choice for luxury rentals</p>
                </div>
                <button
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="google-auth-btn"
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

const DrawerItem = ({ icon, label, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className="drawer-item-hover"
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#f8f9fa";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <div className="drawer-icon-wrapper">{icon}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", fontFamily: F }}>{label}</span>
        {subtitle && <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, marginTop: "1px" }}>{subtitle}</span>}
      </div>
    </div>
    <span className="drawer-chevron">&rsaquo;</span>
  </div>
);

const BookingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const AccountIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const UserIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const CreditCardIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const HelpCircleIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const TagIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const InfoIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const GlobeIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const LoginIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
const LogoutIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

export default Navbar;
