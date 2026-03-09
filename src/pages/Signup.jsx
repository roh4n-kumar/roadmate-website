import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0,0,0,0.03)",
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          background: "#fff",
          padding: "45px 40px",
          borderRadius: "32px",
          width: "90%",
          maxWidth: "420px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontWeight: "900", fontSize: "28px", marginBottom: "8px", color: "#1a1a1a" }}>
          Signup <span style={{ color: RED }}>Account</span>
        </h2>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>
          Join RoadMate for a premium experience
        </p>

        <button
          onClick={handleGoogleSignup}
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
          By signing up, you agree to our <br /> Terms and Conditions.
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;