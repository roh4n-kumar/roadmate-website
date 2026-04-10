import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Assets
import illustration from "../assets/login_illustration_v2.jpg";
import logo from "../assets/roadMate Red Logo 2.png";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

// Optimized Image Dimensions (Standardized to 800x1200 for calculation)
const IMG_NATURAL_W = 800;
const IMG_NATURAL_H = 1200;

// Pure function to calculate dimensions instantly without state lag
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [mode, setMode] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // Initialize with pre-calculated dimensions to PREVENT flicker on first load
  const [dimensions, setDimensions] = useState(getModalDimensions);

  // Handle Dynamic Resizing
  useEffect(() => {
    const handleResize = () => setDimensions(getModalDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset modal state
  useEffect(() => {
    if (isOpen) {
      setMode("phone");
      setError("");
      setPhoneNumber("");
      setOtp(["", "", "", "", "", ""]);
      // Refresh dimensions just in case window size changed while modal was closed
      setDimensions(getModalDimensions());
    }
  }, [isOpen]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {}
      });
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    setLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const formatPhone = `+91${phoneNumber}`;
    try {
      const result = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setConfirmationResult(result);
      setMode("otp");
    } catch (err) {
      console.error("Phone Auth Error:", err);
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpValue) => {
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(otpValue);
      await syncUser(result.user, "phone");
      onClose();
    } catch (err) {
      console.error("OTP Error:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
    const otpString = newOtp.join("");
    if (otpString.length === 6) verifyOtp(otpString);
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUser(result.user, "google");
      onClose();
    } catch (err) {
      console.error("Google Auth Error:", err);
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
            padding: 40px; display: flex; flex-direction: column;
            justify-content: center; background: #fff;
          }
          .phone-input-group {
            display: flex; align-items: center; border: 1.2px solid #cbd5e1;
            border-radius: 12px; margin: 25px 0 15px; overflow: hidden;
          }
          .country-code-box {
            padding: 12px 15px; border-right: 1.2px solid #cbd5e1; background: #fff;
            color: #111; font-weight: 700; font-size: 14px;
          }
          .phone-input {
            flex: 1; padding: 12px 15px; border: none; outline: none;
            font-size: 14px; font-weight: 600; color: #111;
          }
          .cta-btn {
            width: 100%; padding: 16px; background: ${RED}; color: #fff;
            border: none; border-radius: 12px; font-size: 14px; font-weight: 800;
            cursor: pointer; transition: all 0.2s; margin-top: 10px;
            text-transform: uppercase; letter-spacing: 0.8px;
          }
          .google-btn {
            width: 100%; padding: 13px; border: 1.2px solid #cbd5e1; border-radius: 12px;
            background: #fff; display: flex; align-items: center; justify-content: center;
            gap: 10px; font-weight: 700; font-size: 13px; cursor: pointer;
            margin-top: 15px;
          }
          
          @media (max-width: 850px) {
            .left-pane { display: none; }
            .auth-modal-card { width: 100% !important; height: auto !important; max-width: 420px; }
            .right-pane { width: 100% !important; height: auto !important; padding: 40px 30px; }
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
          <div id="recaptcha-container"></div>
          
          <div style={{ textAlign: "center" }}>
            <img src={logo} alt="RoadMate" style={{ height: "42px", marginBottom: "15px" }} />
            <h3 style={{ fontSize: "19px", fontWeight: 800, color: RED, fontFamily: H, margin: "0 0 5px", lineHeight: 1.3 }}>Sign in to avail exciting <br/> discounts and cashbacks!!</h3>
          </div>

          <AnimatePresence mode="wait">
            {mode === "phone" ? (
              <motion.div key="phone">
                <div className="phone-input-group">
                  <div className="country-code-box">+ 91</div>
                  <input
                    autoFocus
                    type="tel"
                    className="phone-input"
                    placeholder="Enter your mobile number"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                {error && <p style={{ color: RED, fontSize: "12px", fontWeight: 600 }}>{error}</p>}
                
                <button 
                  className="cta-btn" 
                  onClick={handlePhoneSubmit}
                  disabled={loading || phoneNumber.length < 10}
                >
                  {loading ? "Sending..." : "GENERATE OTP"}
                </button>
              </motion.div>
            ) : (
              <motion.div key="otp" style={{ textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "15px 0" }}>
                  OTP sent to <span style={{ color: "#000", fontWeight: 700 }}>+91 {phoneNumber}</span>
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "20px 0" }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      style={{ 
                        width: "40px", height: "45px", border: "1.2px solid #cbd5e1", borderRadius: "8px",
                        textAlign: "center", fontSize: "18px", fontWeight: 700
                      }}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleBackspace(idx, e)}
                    />
                  ))}
                </div>
                <button className="cta-btn" onClick={() => verifyOtp(otp.join(""))} disabled={loading}>
                  Verify & Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ margin: "20px 0", textAlign: "center", position: "relative" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>OR</span>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G" />
            <span style={{ color: "#475569" }}>Connect with Google</span>
          </button>

          <p style={{ marginTop: "auto", paddingTop: "20px", fontSize: "10px", textAlign: "center", color: "#94a3b8", fontWeight: 500 }}>
            By signing up, you agree to our <br />
            <span style={{ color: "#3b82f6", cursor: "pointer" }}>Terms</span> & <span style={{ color: "#3b82f6", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
