import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
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

      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "#0f172a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 11000,
      fontFamily: F,
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
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
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
        {/* Close button with hover */}
        <div
          onClick={() => navigate("/")}
          style={{ 
            position: "absolute", 
            top: "24px", 
            right: "24px", 
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer", 
            color: "#fff",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = RED; e.currentTarget.style.borderColor = RED; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>

        <h2 style={{ fontWeight: "900", fontSize: "36px", marginBottom: "12px", color: "#fff", fontFamily: H, letterSpacing: "-1.5px" }}>
          Welcome <span style={{ color: RED }}>Back</span>
        </h2>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", marginBottom: "40px", fontWeight: "500" }}>
          Join RoadMate for a hassle-free experience
        </p>

        <button
          onClick={handleGoogleLogin}
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
          {loading ? "Establishing connection..." : "Sign in with Google"}
        </button>

        <p style={{ marginTop: "32px", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", fontWeight: "600" }}>
          By continuing, you agree to RoadMate's <br /> 
          <span style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Terms of Service</span> & <span style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
