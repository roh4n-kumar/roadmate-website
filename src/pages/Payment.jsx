import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, onSnapshot, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { logSuspiciousActivity, logApiError } from "../utils/securityLogger";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F = "'Inter', sans-serif";
const H = "'Outfit', sans-serif";

const Svg = ({ children, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const IcoShield = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const IcoQR = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
        <rect x="7" y="7" width="0.1" height="0.1"></rect>
        <rect x="17" y="7" width="0.1" height="0.1"></rect>
        <rect x="17" y="17" width="0.1" height="0.1"></rect>
        <rect x="7" y="17" width="0.1" height="0.1"></rect>
    </svg>
);

const PaymentMethodItem = ({ id, active, icon, title, subtitle, onClick, children }) => (
    <motion.div 
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => onClick(id)}
        initial={false}
        animate={{
            background: active ? `${RED}05` : "#fff",
            border: `1.5px solid ${active ? RED : "rgba(15, 23, 42, 0.12)"}`,
            boxShadow: active 
                ? `0 20px 40px ${RED}15` 
                : "0 8px 30px rgba(15, 23, 42, 0.04)"
        }}
        style={{ 
            padding: "24px", 
            borderRadius: "32px", 
            cursor: "pointer",
            overflow: "hidden"
        }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ 
                width: "56px", height: "56px", borderRadius: "18px", 
                background: active ? RED : "rgba(15, 23, 42, 0.04)",
                display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#fff" : SLATE,
                transition: "all 0.3s ease"
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: "16px", color: SLATE, fontFamily: H }}>{title}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(15, 23, 42, 0.5)", fontWeight: 700 }}>{subtitle}</p>
            </div>
            <motion.div 
                animate={{ rotate: active ? 180 : 0 }}
                style={{ color: "rgba(15, 23, 42, 0.2)" }}
            >
                <Svg size={20}><polyline points="6 9 12 15 18 9"/></Svg>
            </motion.div>
        </div>

        <AnimatePresence>
            {active && (
                <motion.div
                    key="accordion-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                >
                    <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1.5px dashed rgba(15, 23, 42, 0.08)" }}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        bookingId, 
        vehicle: passedVehicle = null, 
        total = 0, 
        date = null, 
        pickup = "", 
        drop = "", 
        totalMins = 0, 
        baseTotal = 0, 
        gst: passedGst = 0, 
        helmetCharge = 0, 
        driverCharge = 0 
    } = location.state || {}; // Safe destructuring with defaults

    const [coupon, setCoupon] = useState("");
    const [activeSection, setActiveSection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [showExpiredModal, setShowExpiredModal] = useState(false);
    const [dbBooking, setDbBooking] = useState(null);
    const [toast, setToast] = useState(null); // { msg, type }

    // ── SYNC WITH FIRESTORE BOOKING ──
    useEffect(() => {
        if (!bookingId || !auth.currentUser) return;

        const unsub = onSnapshot(doc(db, "bookings", bookingId), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                
                // CRITICAL SECURITY: IDOR PREVENTION
                // Ensure the booking belongs to the current authenticated user
                if (data.userId !== auth.currentUser?.uid) {
                    logSuspiciousActivity("UNAUTHORIZED_PAYMENT_ACCESS", { bookingId });
                    console.error("Unauthorized access attempt detected.");
                    navigate("/my-bookings");
                    return;
                }

                setDbBooking(data);
                
                // If payment was already completed elsewhere
                if (data.status === "upcoming" || data.status === "completed") {
                    setSuccess(true);
                    setTimeout(() => navigate("/my-bookings"), 2000);
                }

                // Sync Timer with server-side createdAt
                if (data.createdAt) {
                    const createdNode = data.createdAt.toDate();
                    const expiryTime = createdNode.getTime() + (10 * 60 * 1000);
                    
                    const updateTimer = () => {
                        const now = Date.now();
                        const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
                        setTimeLeft(remaining);

                        if (remaining <= 0) {
                            setShowExpiredModal(true);
                            // We could also update Firestore status to "expired" here
                            updateDoc(doc(db, "bookings", bookingId), { status: "expired" }).catch(() => {});
                        }
                    };

                    updateTimer();
                    const interval = setInterval(updateTimer, 1000);
                    return () => clearInterval(interval);
                }
            }
        });

        return () => unsub();
    }, [bookingId, navigate]);

    // Fallback for non-Firestore legacy flow (if any)
    useEffect(() => {
        if (bookingId) return; // Skip if using Firestore

        if (sessionStorage.getItem("roadmate_is_expired") === "true") {
            setShowExpiredModal(true);
            setTimeLeft(0);
            return;
        }
        let expiry = sessionStorage.getItem("roadmate_expiry");
        if (!expiry) {
            expiry = Date.now() + 600 * 1000;
            sessionStorage.setItem("roadmate_expiry", expiry);
        }
        const remaining = Math.max(0, Math.floor((parseInt(expiry) - Date.now()) / 1000));
        setTimeLeft(remaining);

        const timerCount = setInterval(() => {
            const now = Date.now();
            const newRemaining = Math.max(0, Math.floor((parseInt(expiry) - now) / 1000));
            setTimeLeft(newRemaining);
            if (newRemaining <= 0) {
                setShowExpiredModal(true);
                sessionStorage.setItem("roadmate_is_expired", "true");
                clearInterval(timerCount);
            }
        }, 1000);
        return () => clearInterval(timerCount);
    }, [bookingId]);

    // Helper to clear session
    const clearPaymentSession = () => {
        sessionStorage.removeItem("roadmate_expiry");
        sessionStorage.removeItem("roadmate_is_expired");
    };

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!location.state) navigate("/vehicles");
        window.scrollTo(0, 0);
    }, [location.state, navigate]);

    const vehicle = dbBooking?.vehicle || passedVehicle;
    if (!vehicle) return null;

    const tripData  = dbBooking?.trip || { date, pickupTime: pickup, dropTime: drop, totalMins };
    const costs     = dbBooking?.breakdown || { baseTotal, gst: passedGst, helmetCharge, driverCharge, grandTotal: total };
    const grand     = costs.grandTotal || costs.total || total || 0;

    // ── RAZORPAY INTEGRATION ──
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePay = async () => {
        setLoading(true);
        
        try {
            // 1. Load Razorpay SDK
            const res = await loadRazorpayScript();
            if (!res) {
                setToast({ msg: "Razorpay SDK failed to load. Check internet.", type: "error" });
                setLoading(false);
                return;
            }

            // 2. Create Order via Backend (Vercel Function)
            // SECURITY: No amount sent from frontend in production. 
            // Here we pass it for test purposes, but real logic should fetch from DB.
            const orderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId,
                    amount: grand,
                    userId: auth.currentUser?.uid
                })
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

            // 3. Launch Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: orderData.amount,
                currency: "INR",
                name: "RoadMate",
                description: `Booking for ${vehicle?.name}`,
                image: "/logo.png", // Or your logo path
                order_id: orderData.id,
                handler: async (response) => {
                    // This function runs after successful payment
                    try {
                        await updateDoc(doc(db, "bookings", bookingId), {
                            status: "upcoming",
                            paymentStatus: "paid",
                            paidAt: serverTimestamp(),
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            paymentMethod: "Razorpay"
                        });

                        // Add Booking Confirmation Notification
                        await addDoc(collection(db, "users", auth.currentUser.uid, "notifications"), {
                            type: "booking_confirmed",
                            bookingId: bookingId,
                            message: `Booking Confirmed! Your ride for ${fmtDate(tripData.date)} (${vehicle?.name}) is ready. 🚗`,
                            read: false,
                            at: new Date()
                        });
                        
                        setLoading(false);
                        setSuccess(true);
                        clearPaymentSession();
                        setTimeout(() => navigate("/my-bookings"), 3000);
                    } catch (err) {
                        logApiError(err, { bookingId, step: "DB_SYNC" });
                        setToast({ msg: "Payment success but sync failed. Contact Support.", type: "error" });
                        setLoading(false);
                    }
                },
                prefill: {
                    name: auth.currentUser?.displayName || "",
                    email: auth.currentUser?.email || "",
                },
                theme: {
                    color: RED
                },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            logApiError(error, { bookingId });
            console.error("Payment flow failed:", error);
            setLoading(false);
            setToast({ msg: error.message || "Something went wrong.", type: "error" });
            setTimeout(() => setToast(null), 5000);
        }
    };

    const fmtDate = s => { if (!s) return ""; const d = new Date(s); return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };

    return (
                <div style={{ minHeight: "100vh", background: "#f9fafbd7", paddingTop: "64px", paddingBottom: "100px", fontFamily: F }}>
            
            {/* Sticky Ribbon Header */}
            <div style={{ 
                position: "sticky", 
                top: "64px", 
                zIndex: 100, 
                background: "#ffffff", 
                backdropFilter: "blur(20px)",
                borderBottom: "1.5px solid rgba(15, 23, 42, 0.25)", 
                width: "100%",
                padding: "0 24px"
            }}>
                <div style={{ 
                    maxWidth: "1250px", 
                    margin: "0 auto", 
                    height: "64px", 
                    display: "grid", 
                    gridTemplateColumns: "1fr auto 1fr", 
                    alignItems: "center" 
                }}>
                <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <h1 style={{ fontSize: "20px", fontWeight: 900, fontFamily: H, color: SLATE, margin: 0, letterSpacing: "-0.5px" }}>Payment</h1>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(15,23,42,0.03)", padding: "4px 10px", borderRadius: "8px" }}>
                                <Svg size={14} color={RED}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></Svg>
                                <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(15,23,42,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Safe & Encrypted</span>
                            </div>
                        </div>
                    </div>
                    <div />
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                        <span style={{ 
                            fontFamily: H, 
                            fontSize: "20px", 
                            fontWeight: "500", 
                            color: RED,
                            minWidth: "65px",
                            textAlign: "right",
                            letterSpacing: "-0.5px",
                            fontVariantNumeric: "tabular-nums"
                        }}>
                            {formatTimer(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ padding: "0 24px" }}>
                <div style={{ maxWidth: "1250px", margin: "40px auto 0" }}>


                <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", alignItems: "start" }}>
                    
                    {/* LEFT: Payment Methods Selection */}
                    <motion.div layout transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        
                        {/* Coupon Code Card */}
                        <PaymentMethodItem 
                            id="coupon" title="Have a Coupon Code?" subtitle="Apply code to get extra discounts" active={activeSection === "coupon"}
                            icon={<Svg size={24}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/></Svg>}
                            onClick={(id) => setActiveSection(activeSection === id ? null : id)}
                        >
                            <div style={{ display: "flex", gap: "12px" }}>
                                <input 
                                    type="text" 
                                    placeholder="Enter code" 
                                    value={coupon}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setCoupon(e.target.value?.toUpperCase() || "")}
                                    style={{ flex: 1, padding: "14px 20px", borderRadius: "12px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "14px", fontWeight: 700, outline: "none", background: "#fcfcfc" }}
                                />
                                <button 
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ padding: "12px 24px", borderRadius: "12px", background: SLATE, color: "#fff", border: "none", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}
                                >
                                    Apply
                                </button>
                            </div>
                        </PaymentMethodItem>

                        <motion.div layout transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 900, color: SLATE, fontFamily: H, marginBottom: "4px" }}>Payment Methods</h3>
                            
                            <PaymentMethodItem 
                                id="upi" title="UPI Payment" subtitle="Pay via Google Pay, PhonePe, or Paytm" active={activeSection === "upi"}
                                icon={<img src="/upi_official.svg" alt="UPI" style={{ width: "24px", height: "24px", filter: activeSection === "upi" ? "brightness(0) invert(1)" : "none" }} />}
                                onClick={(id) => setActiveSection(activeSection === id ? null : id)}
                            >
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {["Google Pay", "PhonePe", "Paytm", "Any UPI ID"].map(u => (
                                            <div key={u} style={{ padding: "8px 16px", borderRadius: "10px", border: "1.5px solid rgba(15,23,42,0.06)", fontWeight: 800, fontSize: "12px", color: "rgba(15,23,42,0.6)", background: "rgba(15,23,42,0.02)" }}>{u}</div>
                                        ))}
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "10px", fontWeight: 900, color: SLATE, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block" }}>Enter UPI ID</label>
                                        <input 
                                            type="text" 
                                            placeholder="username@bank" 
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ width: "100%", padding: "14px 20px", borderRadius: "12px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "14px", fontWeight: 600, outline: "none", background: "#fff" }}
                                        />
                                    </div>
                                </div>
                            </PaymentMethodItem>
                            
                            <PaymentMethodItem 
                                id="qr" title="Scan & Pay / QR" subtitle="Generate a dynamic QR to pay via any UPI app" active={activeSection === "qr"}
                                icon={<IcoQR />}
                                onClick={(id) => setActiveSection(activeSection === id ? null : id)}
                            >
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "10px 0" }}>
                                    <div style={{ 
                                        width: "180px", height: "180px", background: "#fff", padding: "15px", borderRadius: "24px", 
                                        border: "1.5px solid rgba(15,23,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                                        position: "relative", overflow: "hidden"
                                    }}>
                                        <div style={{ opacity: 0.1, position: "absolute" }}>
                                            <IcoQR size={120} />
                                        </div>
                                        <div style={{ textAlign: "center", zIndex: 1 }}>
                                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${RED}08`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: RED }}>
                                                <Svg size={20}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></Svg>
                                            </div>
                                            <p style={{ fontSize: "12px", fontWeight: 800, color: SLATE, margin: 0 }}>ID: RM-PAY-4492</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ textAlign: "center" }}>
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ 
                                                background: SLATE, color: "#fff", border: "none", padding: "14px 28px", borderRadius: "14px", 
                                                fontWeight: 800, fontSize: "14px", cursor: "pointer", boxShadow: "0 10px 30px rgba(15,23,42,0.2)" 
                                            }}
                                        >
                                            Generate Payment QR
                                        </button>
                                        <p style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 700, marginTop: "16px", maxWidth: "250px", lineHeight: 1.5 }}>
                                            Scan this QR using Google Pay, PhonePe, or Paytm to complete your booking securely.
                                        </p>
                                    </div>
                                </div>
                            </PaymentMethodItem>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Order Summary Sidebar */}
                    <div style={{ position: "sticky", top: "100px" }}>
                        <div style={{ background: "#fff", borderRadius: "28px", padding: "30px", color: SLATE, border: "1.5px solid rgba(15, 23, 42, 0.12)", boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, margin: "0 0 25px", color: SLATE }}>Order Details</h3>
                            
                            {/* Vehicle Inline Summary */}
                            <div style={{ display: "flex", gap: "20px", paddingBottom: "25px", borderBottom: "1.5px dashed rgba(15,23,42,0.08)", marginBottom: "25px" }}>
                                <div style={{ width: "100px", height: "75px", borderRadius: "16px", overflow: "hidden", background: "#f8fafc", border: "1px solid rgba(15,23,42,0.05)" }}>
                                    <img src={vehicle?.image} alt={vehicle?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 900, fontFamily: H, color: SLATE }}>{vehicle?.name || passedVehicle?.name || "Vehicle"}</h4>
                                    <p style={{ margin: "4px 0", fontSize: "12px", color: "rgba(15,23,42,0.5)", fontWeight: 800 }}>
                                        {((vehicle?.type || passedVehicle?.type || "Standard")).toUpperCase()} · {((vehicle?.fuel || passedVehicle?.fuel || "Petrol")).toUpperCase()}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: RED }} />
                                        <span style={{ fontSize: "13px", fontWeight: 800, color: RED }}>{fmtDate(tripData.date)} · {tripData.pickupTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Overview */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontWeight: 600 }}>Rental Duration</span>
                                    <span style={{ fontSize: "14px", fontWeight: 800 }}>{Math.floor((tripData.totalMins || 0)/60)}h {(tripData.totalMins || 0)%60}m</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontWeight: 600 }}>Base Fare</span>
                                    <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{costs.baseTotal || 0}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontWeight: 600 }}>Taxes & GST (18%)</span>
                                    <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{costs.gst || 0}</span>
                                </div>
                                {(costs.helmetCharge > 0) && (
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontWeight: 600 }}>Helmet Charges</span>
                                        <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{costs.helmetCharge}</span>
                                    </div>
                                )}
                                {(costs.driverCharge > 0) && (
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontWeight: 600 }}>Driver Charges</span>
                                        <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{costs.driverCharge}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "20px", borderTop: "1.5px dashed rgba(15,23,42,0.08)" }}>
                                    <span style={{ fontSize: "18px", fontWeight: 900, color: SLATE, fontFamily: H }}>Payable Amount</span>
                                    <span style={{ fontSize: "32px", fontWeight: 900, color: RED, fontFamily: H }}>₹{grand}</span>
                                </div>
                            </div>

                            {/* Execution CTA */}
                            <button 
                                onClick={handlePay}
                                disabled={loading}
                                style={{ 
                                    width: "100%", padding: "20px", borderRadius: "20px", 
                                    background: RED, 
                                    color: "#fff", border: "none", fontSize: "18px", fontWeight: 900, 
                                    cursor: loading ? "default" : "pointer", 
                                    boxShadow: `0 15px 40px rgba(190, 13, 13, 0.4)`,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "14px",
                                    opacity: loading ? 0.7 : 1, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", fontFamily: F
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{ width: "22px", height: "22px", border: "3.5px solid rgba(255,255,255,0.2)", borderTop: "3.5px solid #fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                                        Processing Securely...
                                    </>
                                ) : (
                                    <>Pay Securely ₹{grand}</>
                                )}
                            </button>
                            
                            <div style={{ marginTop: "30px", textAlign: "center" }}>
                                <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(15,23,42,0.4)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Fully PCI DSS Compliant</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

            {/* Premium Success Celebration Overlay */}
            <AnimatePresence>
                {success && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#fff" }}
                    >
                        <motion.div initial={{ scale: 0.8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}>
                            <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 35px", boxShadow: "0 25px 60px rgba(16, 185, 129, 0.45)" }}>
                                <Svg size={55} color="#fff"><polyline points="20 6 9 17 4 12"/></Svg>
                            </div>
                            <h2 style={{ fontSize: "42px", fontWeight: 900, fontFamily: H, margin: "0 0 10px", letterSpacing: "-1px" }}>Payment Successful!</h2>
                            <p style={{ fontSize: "19px", color: "rgba(255,255,255,0.6)", fontWeight: 700, margin: 0 }}>Your RoadMate journey has officially begun.</p>
                            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 800, marginTop: "25px", textTransform: "uppercase" }}>Redirecting to your bookings...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expiry Modal */}
            <AnimatePresence>
                {showExpiredModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ 
                            position: "fixed", inset: 0, zIndex: 10000,
                            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
                            display: "flex", alignItems: "flex-end", justifyContent: "center"
                        }}
                        onClick={() => navigate("/")}
                    >
                        <motion.div 
                            initial={{ y: "100%" }} 
                            animate={{ y: 0 }} 
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            style={{ 
                                background: "rgba(255, 255, 255, 0.9)", 
                                backdropFilter: "blur(30px)",
                                WebkitBackdropFilter: "blur(30px)",
                                borderRadius: "32px 32px 0 0", 
                                width: "100%", maxWidth: "550px", 
                                maxHeight: "92vh", overflowY: "auto",
                                boxShadow: "0 -20px 60px rgba(0,0,0,0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                fontFamily: F
                            }}
                        >
                            <div style={{ position: "relative", height: "350px", width: "100%", overflow: "hidden", borderRadius: "32px 32px 0 0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img 
                                    src="/payment/clock timer.jpeg" 
                                    alt="Time Out" 
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                                />
                            </div>

                            <div style={{ padding: "32px 24px 35px" }}>
                                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                    <p style={{ color: RED, fontSize: "12px", fontWeight: "800", margin: 0, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>SESSION EXPIRED</p>
                                    <h3 style={{ color: SLATE, fontSize: "28px", fontWeight: "900", margin: 0, fontFamily: H, letterSpacing: "-1px" }}>You ran out of time</h3>
                                </div>

                                <div style={{ background: "rgba(15,23,42,0.03)", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1.5px solid rgba(15,23,42,0.15)", textAlign: "center" }}>
                                    <p style={{ fontSize: "15px", fontWeight: "500", color: "rgba(15, 23, 42, 0.6)", lineHeight: 1.6, margin: 0 }}>
                                        Payment time has expired.<br/>Please select your vehicle and try again.
                                    </p>
                                </div>

                                <button 
                                    onClick={() => {
                                        clearPaymentSession();
                                        navigate("/");
                                    }}
                                    style={{ 
                                        width: "100%", padding: "16px", borderRadius: "16px", 
                                        background: RED, border: "none", color: "#fff", 
                                        fontSize: "16px", fontWeight: "900", cursor: "pointer", 
                                        fontFamily: F, transition: "all .3s ease",
                                        boxShadow: `0 10px 30px ${RED}40`
                                    }}
                                >
                                    Back to search
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(15,23,42,0.3); font-weight: 500; }
            `}</style>

            {/* Global Styled Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: "fixed", bottom: "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 11000, padding: "0 20px", pointerEvents: "none" }}>
                        <div style={{ 
                            background: toast.type === "error" ? "#fff5f5" : "#f0fff4", 
                            color: toast.type === "error" ? RED : "#22c55e", 
                            padding: "16px 32px", 
                            borderRadius: "16px", 
                            fontSize: "14px", 
                            fontWeight: "900", 
                            border: toast.type === "error" ? "2px solid #feb2b2" : "2px solid #bbf7d0",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "12px",
                            fontFamily: H,
                            pointerEvents: "auto"
                        }}>
                            <span style={{ fontSize: "20px" }}>{toast.type === "error" ? "⚠️" : "✅"}</span> {toast.msg}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
