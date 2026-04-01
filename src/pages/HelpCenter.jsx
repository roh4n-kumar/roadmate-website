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
            <div style={{ flex: 1, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px 20px 80px" }}>
                <div style={{ maxWidth: "1200px", width: "100%", display: "flex", flexWrap: "wrap", gap: "60px", alignItems: "stretch", justifyContent: "center" }}>
                    
                    {/* LEFT CARD (Stretched to match Right Side height) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ 
                            background: "#fff", 
                            width: "100%", 
                            maxWidth: "450px", 
                            borderRadius: "28px", 
                            boxShadow: "0 40px 100px rgba(15, 23, 42, 0.08)", 
                            border: "1px solid rgba(15, 23, 42, 0.05)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%"
                        }}
                    >
                        <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: "22px", fontWeight: 900, fontFamily: H, margin: 0, color: SLATE, letterSpacing: "-0.8px" }}>Help</h2>
                            <div style={{ padding: "6px", borderRadius: "8px", background: `${RED}11`, cursor: "pointer" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12V11a8 8 0 0 1 16 0v1" />
                                    <rect x="2" y="12" width="4" height="8" rx="2" />
                                    <rect x="18" y="12" width="4" height="8" rx="2" />
                                    <path d="M19 17c0 2-2 3-5 3" />
                                    <circle cx="14" cy="20" r="1.2" fill={RED} stroke="none" />
                                </svg>
                            </div>
                        </div>

                        <div style={{ padding: "20px 30px", maxHeight: "500px", overflowY: "auto" }}>
                            
                            {/* Trip Help Section (Compact) */}
                            <div style={{ marginBottom: "25px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, fontFamily: H, color: SLATE, margin: 0 }}>Need help with this ride?</h4>
                                    <a href="#" style={{ color: RED, textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>View all</a>
                                </div>
                                <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                    <div style={{ marginBottom: "12px" }}>
                                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                                            {/* Shadow/Ground */}
                                            <ellipse cx="12" cy="19.5" rx="8" ry="1.5" fill="rgba(15,23,42,0.05)" />
                                            {/* Body Top - Red Tints */}
                                            <path d="M6 10l1.5-4h9L18 10" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            {/* Main Body - Brand Red */}
                                            <path d="M3 10h18a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" fill={RED} />
                                            {/* Windows - Slate Tints */}
                                            <path d="M7 10h10v-2.5l-1-1h-8l-1 1v2.5z" fill={SLATE} fillOpacity="0.2" />
                                            {/* Wheels - Slate with white rim */}
                                            <circle cx="7" cy="17" r="2.5" fill={SLATE} />
                                            <circle cx="7" cy="17" r="1" fill="#fff" />
                                            <circle cx="17" cy="17" r="2.5" fill={SLATE} />
                                            <circle cx="17" cy="17" r="1" fill="#fff" />
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 500, margin: 0 }}>No recent rides found</p>
                                </div>
                            </div>

                            {/* Recent Issues Section (Compact) */}
                            <div style={{ marginBottom: "25px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, fontFamily: H, color: SLATE, margin: 0 }}>Recent issues</h4>
                                    <a href="#" style={{ color: RED, textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>View all</a>
                                </div>
                                <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                    <div style={{ marginBottom: "12px" }}>
                                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                                            {/* Folder Body - Brand Red */}
                                            <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={RED} />
                                            {/* Accent Line */}
                                            <path d="M2 10.5h20" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                                            {/* Inner Tab Detail */}
                                            <path d="M7 8h10v1H7V8z" fill="#fff" opacity="0.2" />
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
                                    { 
                                        name: "Car FAQ", 
                                        renderIcon: () => (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <ellipse cx="12" cy="19.5" rx="8" ry="1.5" fill="rgba(15,23,42,0.05)" />
                                                <path d="M6 10l1.5-4h9L18 10" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 10h18a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" fill={RED} />
                                                <path d="M7 10h10v-2.5l-1-1h-8l-1 1v2.5z" fill={SLATE} fillOpacity="0.2" />
                                                <circle cx="7" cy="17" r="2.5" fill={SLATE} />
                                                <circle cx="7" cy="17" r="1" fill="#fff" />
                                                <circle cx="17" cy="17" r="2.5" fill={SLATE} />
                                                <circle cx="17" cy="17" r="1" fill="#fff" />
                                            </svg>
                                        )
                                    },
                                    { 
                                        name: "Bike FAQ", 
                                        renderIcon: () => (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <ellipse cx="12" cy="19.5" rx="8" ry="1.2" fill="rgba(15,23,42,0.05)" />
                                                {/* Fork/Handlebar - Slate */}
                                                <path d="M7 16l2.5-9h2.5" stroke={SLATE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                {/* Engine/Exhaust - Slate */}
                                                <rect x="10" y="14" width="6" height="2" rx="1" fill={SLATE} fillOpacity="0.8" />
                                                {/* Main Body/Tank - Brand Red */}
                                                <path d="M9 7.5h5.5l3.5 6.5h-9l-1-3z" fill={RED} />
                                                {/* Seat - Slate */}
                                                <path d="M12.5 10.5h5.5c.5 0 1 .5 1 1v1h-6.5z" fill={SLATE} />
                                                {/* Detailed Wheels */}
                                                <circle cx="6" cy="16.5" r="3.5" fill={SLATE} />
                                                <circle cx="6" cy="16.5" r="1.5" fill="#fff" />
                                                <circle cx="18" cy="16.5" r="3.5" fill={SLATE} />
                                                <circle cx="18" cy="16.5" r="1.5" fill="#fff" />
                                            </svg>
                                        )
                                    },
                                    { 
                                        name: "Payments", 
                                        renderIcon: () => (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="11" fill={`${RED}11`} />
                                                <path d="M7 8h10M7 11h10M13.5 11c0 0-6.5 0-6.5 4s6.5 5 6.5 5M12 11l4 9" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )
                                    }
                                ].map((cat, i) => (
                                    <div key={i} style={{ 
                                        padding: "24px 15px", 
                                        background: "#fff", 
                                        borderRadius: "16px", 
                                        border: "1px solid rgba(0,0,0,0.08)", 
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        gridColumn: i === 2 ? "span 2" : "span 1"
                                    }}>
                                        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center" }}>
                                            {cat.renderIcon()}
                                        </div>
                                        <span style={{ fontSize: "14px", fontWeight: 800, color: SLATE, fontFamily: H, letterSpacing: "-0.2px" }}>{cat.name}</span>
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

                    {/* RIGHT SIDE (Symmetry & Precise Alignment) */}
                    <div style={{ width: "100%", maxWidth: "500px", color: SLATE, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div style={{ marginTop: "80px" }}>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ fontSize: "44px", fontWeight: 900, fontFamily: H, marginBottom: "5px", letterSpacing: "-1.5px", marginTop: 0 }}
                            >
                                <span style={{ color: SLATE }}>Road</span><span style={{ color: RED }}>Mate</span> Help
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{ fontSize: "17px", color: "rgba(15, 23, 42, 0.5)", marginBottom: "20px", fontWeight: 600 }}
                            >
                                Your support partner on every journey
                            </motion.p>
                        </div>
                        
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                        <div style={{ marginTop: "20px" }}>
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
                                    backdropFilter: "blur(8px)",
                                    marginBottom: 0
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
