import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const RED = "#be0d0d";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
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
      console.error("Google Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%",
      height: "100vh",
      background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 11000,
      fontFamily: "'Outfit', sans-serif",
      overflow: "hidden"
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: "rgba(190,13,13,0.15)", filter: "blur(120px)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "40%", background: "rgba(30,41,59,0.5)", filter: "blur(120px)", borderRadius: "50%" }} />

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
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          style={{ 
            position: "absolute", top: "25px", right: "25px", 
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            width: "36px", height: "36px", borderRadius: "12px",
            color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Logo or Icon Placeholder */}
        <div style={{ 
          width: "64px", height: "64px", background: RED, borderRadius: "20px", 
          margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 10px 25px ${RED}4D`
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        </div>

        <h2 style={{ fontWeight: "900", fontSize: "32px", marginBottom: "12px", color: "#fff", letterSpacing: "-1px" }}>
          Welcome <span style={{ color: RED }}>Back</span>
        </h2>
        <p style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "40px", fontWeight: "500" }}>
          Sign in to access your premium RoadMate dashboard.
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
              Connecting...
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
          By continuing, you agree to our <br />
          <span style={{ color: "#94a3b8", textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span> and <span style={{ color: "#94a3b8", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;