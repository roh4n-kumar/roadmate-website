<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
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

      navigate("/");
    } catch (err) {
      console.error("Google Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f172a",
      fontFamily: F,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Cinematic Background Image */}
      <img 
        src="C:\Users\Rohan Chaudhary\.gemini\antigravity\brain\7ee4f4bd-b786-436b-b918-e239930e0c85\roadmate_premium_auth_bg_1773664596740.png"
        alt="Background"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.4,
          filter: "grayscale(20%) brightness(0.6)"
        }}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          padding: "60px 48px",
          borderRadius: "40px",
          width: "90%",
          maxWidth: "460px",
          position: "relative",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <h2 style={{ fontWeight: "900", fontSize: "36px", marginBottom: "12px", color: "#fff", fontFamily: H, letterSpacing: "-1.5px" }}>
          Create <span style={{ color: RED }}>Account</span>
        </h2>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", marginBottom: "40px", fontWeight: "500" }}>
          Join RoadMate for a premium experience
        </p>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: "#fff",
            border: "none",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            fontWeight: "800",
            fontSize: "16px",
            color: "#0f172a",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            marginTop: "10px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)"; }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="22" alt="G" />
          {loading ? "Creating your account..." : "Continue with Google"}
        </button>

        <p style={{ marginTop: "32px", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", fontWeight: "600" }}>
          By joining, you agree to RoadMate's <br /> 
          <span style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Terms of Service</span> & <span style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const RED = "#be0d0d";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
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

      navigate("/");
    } catch (err) {
      console.error("Google Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Outfit', sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: "absolute", top: "10%", right: "10%", width: "40%", height: "40%", background: "rgba(190,13,13,0.12)", filter: "blur(120px)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "5%", width: "35%", height: "35%", background: "rgba(30,41,59,0.4)", filter: "blur(120px)", borderRadius: "50%" }} />

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "50px 40px",
          borderRadius: "40px",
          width: "90%",
          maxWidth: "440px",
          position: "relative",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Logo or Icon Placeholder */}
        <div style={{ 
          width: "64px", height: "64px", background: RED, borderRadius: "20px", 
          margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 10px 25px ${RED}4D`
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        </div>

        <h2 style={{ fontWeight: "900", fontSize: "32px", marginBottom: "12px", color: "#fff", letterSpacing: "-1px" }}>
          Create <span style={{ color: RED }}>Account</span>
        </h2>
        <p style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "40px", fontWeight: "500" }}>
          Join the elite RoadMate community today.
        </p>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: "#fff",
            border: "none",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            fontWeight: "800",
            fontSize: "16px",
            color: "#0f172a",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"; }}
        >
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ width: "20px", height: "20px", border: "3px solid #f1f5f9", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Creating...
            </div>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="22" alt="G" />
              Continue with Google
            </>
          )}
        </button>

        <div style={{ marginTop: "35px", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>RoadMate Premium</span>
          <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.05)" }} />
        </div>

        <p style={{ marginTop: "25px", fontSize: "13px", color: "#475569", lineHeight: "1.6", fontWeight: "600" }}>
          By signing up, you agree to our <br />
          <span style={{ color: "#94a3b8", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/")}>Terms of Service</span> and <span style={{ color: "#94a3b8", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/")}>Privacy Policy</span>.
        </p>

        <p style={{ marginTop: "30px", fontSize: "15px", color: "#fff", fontWeight: "600" }}>
          Already have an account? <span onClick={() => navigate("/login")} style={{ color: RED, cursor: "pointer", borderBottom: `1px solid ${RED}` }}>Login</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
>>>>>>> c74f3a9
