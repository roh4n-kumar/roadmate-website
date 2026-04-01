import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const HelpCenter = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [question, setQuestion] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleAsk = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setQuestion("");
        }, 3000);
    };

    return (
        <div style={{ background: "#fff", fontFamily: F, color: "#1a1a1a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            
            {/* HERO SECTION (Standard Cover) */}
            <section style={{ 
                padding: "120px 40px 70px", 
                background: "linear-gradient(180deg, #111 0%, #0f172a 100%)", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "60%", height: "200%", background: `radial-gradient(circle, ${RED}11 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ 
                                display: "inline-block", 
                                background: "rgba(190, 13, 13, 0.12)", 
                                color: RED, 
                                fontSize: "12px", 
                                fontWeight: 900, 
                                textTransform: "uppercase", 
                                letterSpacing: "4px", 
                                padding: "12px 36px", 
                                borderRadius: "99px", 
                                marginBottom: "30px",
                                border: `1.5px solid rgba(190, 13, 13, 0.3)`,
                                backdropFilter: "blur(4px)"
                            }}
                        >
                            24/7 Support
                        </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        Help <span style={{ color: RED }}>Center</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        Welcome to RoadMate Support. We're here to ensure your journey is smooth and worry-free.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION (White Background) */}
            <div style={{ flex: 1, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
                <div style={{ maxWidth: "1200px", width: "100%", display: "flex", flexWrap: "wrap", gap: "60px", alignItems: "stretch", justifyContent: "center" }}>
                    
                    {/* LEFT CARD (Restored Width, Reduced Height) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ 
                            background: "#fff", 
                            width: "100%", 
                            maxWidth: "400px", 
                            borderRadius: "28px", 
                            boxShadow: "0 40px 100px rgba(15, 23, 42, 0.08)", 
                            border: "1px solid rgba(15, 23, 42, 0.05)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            height: "fit-content"
                        }}
                    >
                        <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: "22px", fontWeight: 900, fontFamily: H, margin: 0, color: SLATE, letterSpacing: "-0.8px" }}>Help</h2>
                            <div style={{ padding: "6px", borderRadius: "8px", background: `${RED}11` }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                        </div>

                        <div style={{ padding: "20px 30px", maxHeight: "500px", overflowY: "auto" }}>
                            
                            {/* Trip Help Section (Compact) */}
                            <div style={{ marginBottom: "25px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, fontFamily: H, color: SLATE, margin: 0 }}>Need help with this trip?</h4>
                                    <a href="#" style={{ color: RED, textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>View all</a>
                                </div>
                                <div style={{ textAlign: "center", padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                    <div style={{ marginBottom: "8px", color: "rgba(15,23,42,0.1)" }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 500, margin: 0 }}>No recent trips found</p>
                                </div>
                            </div>

                            {/* Recent Issues Section (Compact) */}
                            <div style={{ marginBottom: "25px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, fontFamily: H, color: SLATE, margin: 0 }}>Recent issues</h4>
                                    <a href="#" style={{ color: RED, textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>View all</a>
                                </div>
                                <div style={{ textAlign: "center", padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                    <div style={{ marginBottom: "8px", color: "rgba(15,23,42,0.1)" }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 500, margin: 0 }}>No recent issues found</p>
                                </div>
                            </div>

                            {/* FAQ Categories Section */}
                            <div>
                                <h4 style={{ fontSize: "16px", fontWeight: 800, fontFamily: H, color: SLATE, marginBottom: "20px" }}>FAQ</h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    {[
                                        { name: "Car FAQ", icon: "M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
                                        { name: "Bike FAQ", icon: "M5.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 15h12M12 6l-3 7h10" },
                                        { name: "Payments", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }
                                    ].map((cat, i) => (
                                        <div key={i} style={{ 
                                            padding: "20px 15px", 
                                            background: "#fff", 
                                            borderRadius: "16px", 
                                            border: "1px solid rgba(0,0,0,0.08)", 
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            gridColumn: i === 2 ? "span 2" : "span 1"
                                        }}>
                                            <div style={{ marginBottom: "10px", color: RED }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d={cat.icon}/>
                                                </svg>
                                            </div>
                                            <span style={{ fontSize: "14px", fontWeight: 700, color: SLATE }}>{cat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ask a Question trigger (Compact Button) */}
                        <div style={{ padding: "20px 30px" }}>
                            <button 
                                onClick={() => document.getElementById('ask-form').scrollIntoView({ behavior: 'smooth' })}
                                style={{ width: "100%", padding: "14px", background: SLATE, color: "#fff", border: "none", borderRadius: "14px", fontSize: "13px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                Ask a Question
                            </button>
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE (Symmetry & Logic) */}
                    <div style={{ flex: 1, minWidth: "400px", color: SLATE, textAlign: "center", display: "flex", flexDirection: "column" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ fontSize: "44px", fontWeight: 900, fontFamily: H, marginBottom: "5px", letterSpacing: "-1.5px", color: SLATE }}
                            >
                                RoadMate Help
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{ fontSize: "17px", color: "rgba(15, 23, 42, 0.5)", marginBottom: "25px", fontWeight: 600 }}
                            >
                                Your support partner on every journey
                            </motion.p>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{ maxWidth: "380px", width: "100%", margin: "0 auto", position: "relative" }}
                            >
                                <img 
                                    src="/customer_support_illustration.png" 
                                    alt="Support Agent" 
                                    style={{ 
                                        width: "100%", 
                                        height: "auto", 
                                        borderRadius: "28px",
                                        boxShadow: `0 30px 80px rgba(190, 13, 13, 0.15)`,
                                        filter: "brightness(1.02)",
                                        border: `1px solid rgba(190, 13, 13, 0.1)`
                                    }} 
                                />
                            </motion.div>
                        </div>

                        {/* Aligned with Card Bottom */}
                        <div style={{ marginTop: "30px" }}>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{ 
                                    display: "inline-block", 
                                    background: "rgba(190, 13, 13, 0.08)", 
                                    color: RED, 
                                    fontSize: "12px", 
                                    fontWeight: 900, 
                                    textTransform: "uppercase", 
                                    letterSpacing: "4px", 
                                    padding: "12px 36px", 
                                    borderRadius: "99px", 
                                    border: `1.5px solid rgba(190, 13, 13, 0.25)`,
                                    backdropFilter: "blur(8px)"
                                }}
                            >
                                24/7 Customer Support
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Hidden/Separate Question Form Section for the button to scroll to */}
            <section id="ask-form" style={{ padding: "100px 24px", background: "#f8fafc" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px", background: "#fff", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}>
                    <div style={{ textAlign: "center", marginBottom: "40px" }}>
                        <h3 style={{ fontSize: "32px", fontWeight: 900, fontFamily: H, color: SLATE, marginBottom: "10px" }}>Ask a <span style={{ color: RED }}>Question</span></h3>
                        <p style={{ fontSize: "16px", color: "rgba(15,23,42,0.6)" }}>Can't find what you're looking for? Type your question below and our expert team will respond within 15 minutes.</p>
                    </div>

                    <form onSubmit={handleAsk}>
                        <textarea 
                            required
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your question here details..."
                            style={{ 
                                width: "100%", 
                                minHeight: "150px", 
                                padding: "24px", 
                                borderRadius: "18px", 
                                border: "1px solid rgba(0,0,0,0.1)", 
                                background: "#fff",
                                fontSize: "16px",
                                fontFamily: F,
                                outline: "none",
                                transition: "all 0.2s",
                                resize: "none",
                                marginBottom: "24px"
                            }}
                        />
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            style={{ 
                                width: "100%", 
                                padding: "20px", 
                                background: RED, 
                                color: "#fff", 
                                border: "none", 
                                borderRadius: "18px", 
                                fontSize: "16px", 
                                fontWeight: 800, 
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                boxShadow: `0 10px 25px ${RED}33`
                            }}
                        >
                            {submitted ? "Sending..." : "Submit Question"}
                            {!submitted && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                            )}
                        </motion.button>
                    </form>

                    {submitted && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ 
                                marginTop: "20px", 
                                padding: "15px", 
                                background: "#10b981", 
                                color: "#fff", 
                                borderRadius: "12px", 
                                textAlign: "center", 
                                fontSize: "14px", 
                                fontWeight: 700 
                            }}
                        >
                            Your question has been sent! We'll get back to you shortly.
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HelpCenter;
