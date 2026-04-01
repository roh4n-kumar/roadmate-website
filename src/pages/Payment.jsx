import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

const PaymentMethodItem = ({ id, active, icon, title, subtitle, onClick }) => (
    <div 
        onClick={() => onClick(id)}
        style={{ 
            padding: "20px", 
            borderRadius: "20px", 
            background: active ? `${RED}08` : "#fff",
            border: `2px solid ${active ? RED : "rgba(15, 23, 42, 0.05)"}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            transition: "all 0.3s ease",
            position: "relative"
        }}
    >
        <div style={{ 
            width: "52px", height: "52px", borderRadius: "14px", 
            background: active ? RED : "rgba(15, 23, 42, 0.05)",
            display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#fff" : SLATE,
            transition: "all 0.3s ease"
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "16px", color: SLATE, fontFamily: H }}>{title}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "rgba(15, 23, 42, 0.5)", fontWeight: 700 }}>{subtitle}</p>
        </div>
        {active && (
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Svg size={12} color="#fff"><polyline points="20 6 9 17 4 12"/></Svg>
            </div>
        )}
    </div>
);

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { vehicle, total, date, pickup, drop, totalMins } = location.state || {};

    const [method, setMethod] = useState("upi");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!location.state) navigate("/vehicles");
        window.scrollTo(0, 0);
    }, [location.state, navigate]);

    if (!vehicle) return null;

    const gst = Math.round(total * 0.18);
    const grand = total + gst;

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate("/my-bookings"), 3000);
        }, 3500);
    };

    const fmtDate = s => { if (!s) return ""; const d = new Date(s); return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "100px", paddingBottom: "100px", fontFamily: F }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
                
                {/* Header with Security Branding */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <button 
                            onClick={() => navigate(-1)}
                            style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#fff", border: "1px solid rgba(15, 23, 42, 0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
                        >
                            <Svg size={20} color={SLATE}><polyline points="15 18 9 12 15 6"/></Svg>
                        </button>
                        <div>
                            <h1 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, color: SLATE, margin: 0, letterSpacing: "-0.5px" }}>Secure Checkout</h1>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                                <IcoShield />
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(15,23,42,0.4)" }}>Safe & Encrypted Payments</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src="/upi_official.svg" alt="UPI" style={{ height: "18px", opacity: 0.6 }} />
                        <img src="/rupay_official.svg" alt="RuPay" style={{ height: "14px", opacity: 0.6 }} />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", alignItems: "start" }}>
                    
                    {/* LEFT: Payment Methods Selection */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 900, color: SLATE, fontFamily: H, marginBottom: "4px" }}>Payment Methods</h3>
                            
                            <PaymentMethodItem 
                                id="upi" title="UPI Payment" subtitle="Pay via Google Pay, PhonePe, or Paytm" active={method === "upi"}
                                icon={<img src="/upi_official.svg" alt="UPI" style={{ width: "24px", height: "24px", filter: method === "upi" ? "brightness(0) invert(1)" : "none" }} />}
                                onClick={setMethod}
                            />
                            
                            <PaymentMethodItem 
                                id="card" title="Credit / Debit Card" subtitle="All major cards accepted including RuPay" active={method === "card"}
                                icon={<Svg size={24}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Svg>}
                                onClick={setMethod}
                            />
                            
                            <PaymentMethodItem 
                                id="net" title="Net Banking" subtitle="Pay via your bank's secure portal" active={method === "net"}
                                icon={<Svg size={24}><path d="M3 21v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" /><path d="M12 3v18" /></Svg>}
                                onClick={setMethod}
                            />
                        </div>

                        {/* Interactive Payment Detail View */}
                        <motion.div 
                            layout
                            style={{ 
                                background: "#fff", 
                                borderRadius: "28px", 
                                padding: "35px", 
                                border: "1px solid rgba(15,23,42,0.05)", 
                                boxShadow: "0 25px 60px rgba(15,23,42,0.04)" 
                            }}
                        >
                            {method === "upi" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "5px" }}>
                                        {["Google Pay", "PhonePe", "Paytm", "Any UPI ID"].map(u => (
                                            <div key={u} style={{ padding: "10px 18px", borderRadius: "12px", border: "1.5px solid rgba(15,23,42,0.06)", fontWeight: 800, fontSize: "13px", color: "rgba(15,23,42,0.6)", background: "rgba(15,23,42,0.02)" }}>{u}</div>
                                        ))}
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "11px", fontWeight: 900, color: SLATE, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", display: "block" }}>Enter UPI ID</label>
                                        <input 
                                            type="text" 
                                            placeholder="username@bank" 
                                            style={{ width: "100%", padding: "18px 24px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "16px", fontWeight: 600, outline: "none", background: "#fcfcfc" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {method === "card" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    <div>
                                        <label style={{ fontSize: "11px", fontWeight: 900, color: SLATE, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", display: "block" }}>Card Number</label>
                                        <div style={{ position: "relative" }}>
                                            <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={{ width: "100%", padding: "18px 24px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "16px", fontWeight: 600, outline: "none", background: "#fcfcfc" }} />
                                            <div style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "10px", alignItems: "center" }}>
                                                <img src="/rupay_official.svg" alt="RuPay" style={{ height: "12px" }} />
                                                <span style={{ fontSize: "11px", fontWeight: 900, color: RED, letterSpacing: "1px" }}>VISA</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                        <div>
                                            <label style={{ fontSize: "11px", fontWeight: 900, color: SLATE, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", display: "block" }}>Valid Thru</label>
                                            <input type="text" placeholder="MM/YY" style={{ width: "100%", padding: "18px 24px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "16px", fontWeight: 600, outline: "none", background: "#fcfcfc" }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "11px", fontWeight: 900, color: SLATE, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px", display: "block" }}>CVV</label>
                                            <input type="password" placeholder="***" style={{ width: "100%", padding: "18px 24px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "16px", fontWeight: 600, outline: "none", background: "#fcfcfc" }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {method === "net" && (
                                <div>
                                    <label style={{ fontSize: "11px", fontWeight: 900, color: SLATE, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "15px", display: "block" }}>Popular Banks</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                                        {["SBI", "HDFC", "ICICI", "AXIS", "KOTAK", "PNB"].map(b => (
                                            <div key={b} style={{ padding: "16px", borderRadius: "14px", border: "1.5px solid rgba(15,23,42,0.06)", textAlign: "center", fontWeight: 900, color: SLATE, fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = RED} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.06)"}>
                                                {b}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* RIGHT: Order Summary Sidebar */}
                    <div style={{ position: "sticky", top: "100px" }}>
                        <div style={{ background: SLATE, borderRadius: "28px", padding: "30px", color: "#fff", boxShadow: "0 30px 70px rgba(15, 23, 42, 0.25)" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, margin: "0 0 25px", color: "#fff" }}>Order Details</h3>
                            
                            {/* Vehicle Inline Summary */}
                            <div style={{ display: "flex", gap: "20px", paddingBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "25px" }}>
                                <div style={{ width: "100px", height: "75px", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
                                    <img src={vehicle.image} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 900, fontFamily: H, color: "#fff" }}>{vehicle.name}</h4>
                                    <p style={{ margin: "4px 0", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 800 }}>{vehicle.type.toUpperCase()} · {vehicle.fuel.toUpperCase()}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: RED }} />
                                        <span style={{ fontSize: "13px", fontWeight: 800, color: RED }}>{fmtDate(date)} · {pickup}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Overview */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Rental Duration</span>
                                    <span style={{ fontSize: "14px", fontWeight: 800 }}>{Math.floor(totalMins/60)}h {totalMins%60}m</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Base Fare</span>
                                    <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{total}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Taxes & GST (18%)</span>
                                    <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{gst}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                                    <span style={{ fontSize: "18px", fontWeight: 900, color: "#fff", fontFamily: H }}>Payable Amount</span>
                                    <span style={{ fontSize: "32px", fontWeight: 900, color: RED, fontFamily: H }}>₹{grand}</span>
                                </div>
                            </div>

                            {/* Execution CTA */}
                            <button 
                                onClick={handlePay}
                                disabled={loading}
                                style={{ 
                                    width: "100%", padding: "20px", borderRadius: "20px", 
                                    background: `linear-gradient(135deg, ${RED}, #ff4d4d)`, 
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
                                <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Fully PCI DSS Compliant</p>
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

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(15,23,42,0.3); font-weight: 500; }
            `}</style>
        </div>
    );
}
