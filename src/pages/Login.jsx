import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    // ✅ Same overlay background as Signup modal
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 11000,
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        style={{
          background: "#fff",
          padding: "45px 40px",
          borderRadius: "32px",
          width: "90%",
          maxWidth: "420px",
          position: "relative",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* ✅ Close button — wapas home par */}
        <span
          onClick={() => navigate("/")}
          style={{ position: "absolute", top: "20px", right: "25px", fontSize: "32px", cursor: "pointer", color: "#ccc" }}
        >
          &times;
        </span>

        <h2 style={{ fontWeight: "900", fontSize: "28px", marginBottom: "8px", color: "#1a1a1a" }}>
          Login <span style={{ color: RED }}>Account</span>
        </h2>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>
          Join RoadMate for a premium experience
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#fff",
            border: "1.5px solid #e0e0e0",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontWeight: "700",
            fontSize: "16px",
            color: "#333",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.2s ease",
            marginTop: "10px",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#f9f9f9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="G" />
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <p style={{ marginTop: "25px", fontSize: "12px", color: "#999", lineHeight: "1.4" }}>
          By logging in, you agree to our <br /> Terms and Conditions.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;