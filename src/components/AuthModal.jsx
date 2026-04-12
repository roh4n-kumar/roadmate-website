import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { logAuthEvent } from "../utils/securityLogger";

// Assets
import illustration from "../assets/login_illustration_v2.jpg";
import logo from "../assets/roadMate Red Logo 2.png";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

// Optimized Image Dimensions
const IMG_NATURAL_W = 800;
const IMG_NATURAL_H = 1200;

const getModalDimensions = () => {
  if (typeof window === "undefined") return { width: 400, height: 500 };
  const maxH = window.innerHeight * 0.60;
  const maxW = window.innerWidth * 0.85;
  let targetH = IMG_NATURAL_H;
  let targetW = IMG_NATURAL_W;
  if (targetH > maxH) {
    const hRatio = maxH / targetH;
    targetH = maxH;
    targetW = targetW * hRatio;
  }
  if (targetW * 2 > maxW) {
    const wRatio = maxW / (targetW * 2);
    targetW = maxW / 2;
    targetH = targetH * wRatio;
  }
  return { width: targetW, height: targetH };
};

const AuthModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState(getModalDimensions);

  useEffect(() => {
    const handleResize = () => setDimensions(getModalDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUser(result.user, "google");
      logAuthEvent("SUCCESS", "google");
      onClose();
    } catch (err) {
      console.error("Google Auth Error:", err);
      logAuthEvent("FAILURE", "google", err);
    } finally {
      setLoading(false);
    }
  };

  const syncUser = async (user, provider) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        createdAt: new Date(),
        provider: provider,
        profile: {
          name: user.displayName || "Rider",
          email: user.email || "",
          avatar: user.photoURL || "",
          phone: user.phoneNumber || "",
        },
        verification: { status: "unverified", updatedAt: null },
        notification: { unreadCount: 0, messages: [] }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 11000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <style>
        {`
          .auth-modal-overlay {
            position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
          }
          .auth-modal-card {
            background: #fff; border-radius: 24px; overflow: hidden; position: relative;
            box-shadow: 0 40px 100px rgba(0,0,0,0.25); display: flex;
            max-width: 95vw; max-height: 85vh;
          }
          .left-pane {
            position: relative; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
            background: #fff; 
          }
          .right-pane {
            padding: 40px 30px; display: flex; flex-direction: column;
            justify-content: center; background: #fff; box-sizing: border-box;
          }
          .google-btn {
            width: 100%; padding: 16px; border: 1.5px solid #e2e8f0; border-radius: 12px;
            background: #fff; display: flex; align-items: center; justify-content: center;
            gap: 12px; font-weight: 700; font-size: 15px; cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            color: #1e293b; font-family: ${H};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .google-btn:hover:not(:disabled) {
            background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
          }
          .google-btn:active:not(:disabled) { transform: translateY(0); }
          .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          
          @media (max-width: 850px) {
            .left-pane { display: none; }
            .auth-modal-card { width: 100% !important; height: auto !important; max-width: 400px; }
            .right-pane { width: 100% !important; height: auto !important; padding: 50px 30px; }
          }
        `}
      </style>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="auth-modal-overlay" onClick={onClose} 
      />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="auth-modal-card"
        style={{ 
          width: `${dimensions.width * 2}px`, 
          height: `${dimensions.height}px` 
        }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "20px", border: "none", background: "none", fontSize: "28px", cursor: "pointer", color: "#94a3b8", zIndex: 10 }}>&times;</button>
        
        <div className="left-pane" style={{ width: `${dimensions.width}px`, height: '100%' }}>
           <img 
             src={illustration} 
             style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} 
             alt="" 
           />
        </div>

        <div className="right-pane" style={{ width: `${dimensions.width}px`, height: '100%' }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <img src={logo} alt="RoadMate" style={{ height: "45px", marginBottom: "15px", display: "inline-block" }} />
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: RED, fontFamily: H, margin: "0 0 8px", lineHeight: 1.2 }}>Sign in to start riding!!</h3>
            <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Join RoadMate and explore the smarter <br/> way to travel today.</p>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
            {loading ? (
              <span style={{ fontSize: "14px", color: "#64748b" }}>Connecting...</span>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="22" alt="G" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
            {loading ? (
              <span style={{ fontSize: "14px", color: "#64748b" }}>Connecting...</span>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="22" alt="G" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p style={{ marginTop: "40px", fontSize: "11px", textAlign: "center", color: "#94a3b8", fontWeight: 500, lineHeight: 1.5 }}>
            By continuing, you agree to RoadMate's <br />
            <span style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}>Terms of Service</span> & <span style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}>Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
