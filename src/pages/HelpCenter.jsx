import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [activeCategory, setActiveCategory] = useState(null);
    const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

    const faqData = {
        "Car FAQ": [
            { q: "How do I book a luxury car?", a: "Choose your car, select dates, and complete the secure payment." },
            { q: "Insurance requirements?", a: "All cars include basic comprehensive coverage; no extra paperwork needed." },
            { q: "Can I extend my rental?", a: "Yes, you can extend via the app 4 hours before your drop-off time." },
            { q: "Breakdown support?", a: "Contact our 24/7 Roadside Assistance via the app immediately." }
        ],
        "Bike FAQ": [
            { q: "What documents are needed?", a: "A valid Aadhaar card and a permanent Driving License are mandatory." },
            { q: "Do you provide helmets?", a: "We provide one ISI-marked helmet per bike for free." },
            { q: "What is the fuel policy?", a: "Bikes come with a full tank; please return them full or pay for the difference." },
            { q: "Minimum age?", a: "The minimum age for bike rentals is 18 years." }
        ],
        "Payments FAQ": [
            { q: "What methods are accepted?", a: "We accept all major Credit/Debit Cards, UPI, and Net Banking." },
            { q: "How do refunds work?", a: "Refunds are processed within 5-7 business days of cancellation." },
            { q: "Is my payment secure?", a: "Yes, all transactions are encrypted via 256-bit SSL security." },
            { q: "Transaction declined?", a: "Verify your limit or contact your bank regarding international usage." }
        ]
    };

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

                        <div style={{ height: "550px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            <AnimatePresence mode="wait">
                                {!activeCategory ? (
                                    <motion.div 
                                        key="dashboard"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ flex: 1, padding: "20px 30px", overflowY: "auto" }}
                                    >
                                        {/* Trip Help Section */}
                                        <div style={{ marginBottom: "25px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                                <h4 style={{ fontSize: "14px", fontWeight: 800, fontFamily: H, color: SLATE, margin: 0 }}>Need help with this ride?</h4>
                                                <a href="#" style={{ color: RED, textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>View all</a>
                                            </div>
                                            <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                                <div style={{ marginBottom: "12px" }}>
                                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                                                        <ellipse cx="12" cy="19.5" rx="8" ry="1.5" fill="rgba(15,23,42,0.05)" />
                                                        <path d="M6 10l1.5-4h9L18 10" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M3 10h18a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" fill={RED} />
                                                        <path d="M7 10h10v-2.5l-1-1h-8l-1 1v2.5z" fill={SLATE} fillOpacity="0.2" />
                                                        <circle cx="7" cy="17" r="2.5" fill={SLATE} />
                                                        <circle cx="7" cy="17" r="1" fill="#fff" />
                                                        <circle cx="17" cy="17" r="2.5" fill={SLATE} />
                                                        <circle cx="17" cy="17" r="1" fill="#fff" />
                                                    </svg>
                                                </div>
                                                <p style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 500, margin: 0 }}>No recent rides found</p>
                                            </div>
                                        </div>

                                        {/* Recent Issues Section */}
                                        <div style={{ marginBottom: "25px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                                <h4 style={{ fontSize: "14px", fontWeight: 800, fontFamily: H, color: SLATE, margin: 0 }}>Recent issues</h4>
                                                <a href="#" style={{ color: RED, textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>View all</a>
                                            </div>
                                            <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                                                <div style={{ marginBottom: "12px" }}>
                                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                                                        <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={RED} />
                                                        <path d="M2 10.5h20" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                                                        <path d="M7 8h10v1H7V8z" fill="#fff" opacity="0.2" />
                                                    </svg>
                                                </div>
                                                <p style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 500, margin: 0 }}>No recent issues found</p>
                                            </div>
                                        </div>

                                        {/* FAQ Categories Grid */}
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
                                                    <svg width="48" height="36" viewBox="-2 -2 126.88 86.71" fill="none">
                                                        <g fillRule="evenodd" clipRule="evenodd">
                                                            <path fill={SLATE} d="M50.7,36.7l-0.16-0.68c-2.39,0.65-4.79,0.86-7.21,0.78c-2.76-0.09-5.52-0.56-8.28-1.19 c-1.35-0.31-2.53-0.64-3.65-0.96c-2.52-0.71-4.74-1.33-7.8-1.36c-0.03,0-0.05,0-0.08,0l0,0l-11.07-0.94l-2.18,3.14 c6.36,2.46,14.26,4.18,21.86,4.85c7.17,0.63,14.04,0.34,19.05-1.14L50.7,36.7L50.7,36.7z M104.65,46.26 c10.07,0,18.23,8.16,18.23,18.23c0,10.07-8.16,18.23-18.23,18.23c-10.07,0-18.23-8.16-18.23-18.23c0-6.08,2.97-11.46,7.54-14.77 l-5.29-10.4l-9.71,29.2h-4.29c0,0.12,0,0.24-0.02,0.35c-0.36,1.98-0.97,3.58-1.83,4.78c-0.96,1.34-2.21,2.2-3.76,2.57 c-1.89,0.45-7.19-0.4-10.65-0.95c-0.92-0.15-1.71-0.27-2.22-0.34l-11.41-1.53l-0.05,0.18c-0.27,1.08-1.32,1.79-2.44,1.61 l-7.08-1.16c-0.76,1.2-1.66,2.3-2.67,3.29c-3.35,3.28-7.99,5.31-13.1,5.31c-5.11,0-9.74-2.03-13.1-5.31 c-3.36-3.29-5.44-7.83-5.44-12.84c0-5.01,2.08-9.55,5.44-12.84c3.35-3.28,7.99-5.31,13.1-5.31c5.11,0,9.74,2.03,13.1,5.31 c3.36,3.29,5.44,7.83,5.44,12.84c0,0.56-0.03,1.11-0.08,1.65l6.17,1.71c1.06,0.29,1.72,1.34,1.56,2.4l10.97,1.47 c0.57,0.08,1.37,0.2,2.31,0.35c3.2,0.51,8.11,1.29,9.4,0.99c0.76-0.18,1.38-0.62,1.87-1.3c0.56-0.78,0.97-1.87,1.24-3.25H45.37 C37.45,41.52,17.65,37.82,6.29,47.48L0,47.4c1.88-4.56,6.3-7.52,11.67-9.11c-1.19-0.41-2.33-0.84-3.43-1.3 c-0.09-0.03-0.17-0.07-0.25-0.13c-0.49-0.34-0.61-1.01-0.27-1.5l3.29-4.74c0.21-0.32,0.59-0.52,1-0.49l11.69,0.99v0 c3.33,0.05,5.65,0.7,8.29,1.44c1.1,0.31,2.26,0.63,3.55,0.93c2.64,0.61,5.27,1.06,7.86,1.14c2.49,0.08,4.97-0.17,7.42-0.96 c0.8-0.71,1.61-1.39,2.45-2.04c0.87-0.68,1.79-1.34,2.77-1.99c2.61-1.74,5.29-3.13,8.12-4.08c2.85-0.95,5.84-1.45,9.07-1.39 c1.99,0.04,3.92,0.34,5.75,0.97c1.26,0.44,2.48,1.03,3.64,1.79c0.01-0.2,0.08-0.4,0.2-0.56l-5.77-4.33h-9.02 c-1.05,0-1.89-0.85-1.89-1.89c0-1.05,0.85-1.89,1.89-1.89h8.31v-7.54h0.01l0-0.04c0.01-0.25,0-0.48-0.03-0.68 c-0.02-0.17-0.06-0.33-0.11-0.49c-0.16-0.49-0.5-0.7-0.96-0.98c-0.03-0.01-0.05-0.03-0.08-0.04c-0.05-0.03-0.1-0.06-0.22-0.13 l-0.08,1.3c-0.05,0.77-0.71,1.36-1.49,1.31c-0.77-0.05-1.36-0.71-1.31-1.49l0.52-8.19c0.05-0.77,0.71-1.36,1.49-1.31 c0.77,0.05,1.36,0.71,1.31,1.49l-0.24,3.73l1.05,0.64l0.39,0.23c0.03,0.01,0.05,0.03,0.07,0.05c1,0.58,1.73,1.04,2.22,2.53 c0.1,0.3,0.17,0.63,0.22,1c0.04,0.33,0.06,0.69,0.05,1.07h0v8.19l3.66,2.74l0.33-0.38l-0.86-0.62c-0.48-0.35-0.59-1.03-0.24-1.51 c0.03-0.04,0.06-0.08,0.09-0.11l3.37-3.93c0.39-0.45,1.07-0.51,1.52-0.12l0.02,0.02l3.15,2.59c0.46,0.38,0.53,1.06,0.15,1.52 l-0.02,0.03h0l-3.29,3.75c-0.13,0.15-0.29,0.25-0.46,0.31l0,0l-1.17,0.4l1.07,0.8l0.03,0.03l0.32-0.16 c0.53-0.26,1.18-0.04,1.45,0.49l0.02,0.03l1.54,2.94c0.74-1.66,2.39-2.8,3.83-3.8c0.3-0.21,0.6-0.42,0.86-0.61 c1.13-0.84,2.18-1.38,3.13-1.62c1.05-0.27,2-0.19,2.81,0.21c0.81,0.41,1.44,1.12,1.85,2.13c0.37,0.91,0.57,2.06,0.57,3.44v3.98 c0,0.05,0,0.11-0.01,0.16c-0.11,1.76-0.51,3.03-1.14,3.89c-0.39,0.53-0.85,0.9-1.38,1.14c-0.53,0.24-1.1,0.33-1.7,0.3 c-1.29-0.07-2.74-0.74-4.24-1.85l-1.15-0.85l6.79,12.58C101.51,46.46,103.06,46.26,104.65,46.26L104.65,46.26z" />
                                                            <path fill={RED} d="M50.7,36.7l-0.16-0.68c-2.39,0.65-4.79,0.86-7.21,0.78c-2.76-0.09-5.52-0.56-8.28-1.19 c-1.35-0.31-2.53-0.64-3.65-0.96c-2.52-0.71-4.74-1.33-7.8-1.36c-0.03,0-0.05,0-0.08,0l0,0l-11.07-0.94l-2.18,3.14 c6.36,2.46,14.26,4.18,21.86,4.85c7.17,0.63,14.04,0.34,19.05-1.14L50.7,36.7L50.7,36.7z" />
                                                            <path fill={RED} d="M54,42h18v4h-18z M56,48h14v2h-14z" opacity="0.8" />
                                                            <circle cx="104.65" cy="64.49" r="10" fill={RED} />
                                                            <circle cx="19.1" cy="64.5" r="10" fill={RED} />
                                                            <path fill={RED} d="M82.56,32l-0.11-2.51c-1.3-1.04-2.7-1.79-4.18-2.29c-1.63-0.56-3.33-0.83-5.09-0.86c-2.97-0.06-5.73,0.4-8.35,1.28 c-2.64,0.88-5.15,2.19-7.6,3.83c-0.89,0.59-1.77,1.23-2.64,1.91c-0.7,0.54-1.37,1.09-2.01,1.66l0.22,1.14l0.65,2.74l24.76,0.09 c0.03,0,0.07,0,0.1,0v0c0.66,0.06,1.23,0.02,1.72-0.11c0.44-0.13,0.82-0.34,1.13-0.62c1.6-1.46,1.5-3.96,1.41-6.14L82.56,32z" />
                                                        </g>
                                                    </svg>
                                                )
                                            },
                                            { 
                                                name: "Payments FAQ", 
                                                renderIcon: () => (
                                                    <svg width="42" height="22" viewBox="0 0 512 265.788" fill="none">
                                                        <path fill={RED} d="M0 0h512v265.789H0z"/>
                                                        <path fill="#fff" fillOpacity="0.9" d="M427.35 41.011c-.271 19.77 17.153 37.654 37.661 37.9v105.161c-21.602-.271-39.482 17.153-39.728 40.706H84.65c.271-21.603-17.157-39.487-37.662-39.733V79.884c21.685.246 39.58-17.167 39.826-38.873H427.35z"/>
                                                        <path fill={RED} d="M184.56 94.866c21.004-39.459 70.01-54.415 109.468-33.412 39.458 21 54.415 70.01 33.411 109.469-21 39.457-70.009 54.414-109.467 33.411-39.459-21.004-54.415-70.01-33.412-109.468z"/>
                                                        <path fill="#fff" d="M227.768 87.669h56.52c.484 0 .881.406.881.905l-.001 8.613a.895.895 0 01-.881.903h-17.652c2.783 3.237 4.771 7.137 5.673 11.422h11.98c.484 0 .88.404.88.903v8.614c0 .497-.396.905-.88.905h-11.98c-1.081 5.131-3.724 9.715-7.421 13.263-4.843 4.647-11.51 7.529-18.838 7.529v.03h-.815l31.703 36.151c.857.978-.644 3.153-1.317 3.156l-14.657.083-33.844-38.593a1.18 1.18 0 01-.23-1.142v-14.134h19.16v.028c3.445 0 6.568-1.346 8.829-3.512a11.857 11.857 0 002.197-2.859h-29.307c-.484 0-.879-.408-.879-.905v-8.614c0-.499.396-.903.879-.903l29.307-.001a11.781 11.781 0 00-2.197-2.858c-2.261-2.169-5.384-3.514-8.829-3.514v.027l-19.16.001V88.574c0-.499.395-.905.878-.905h.001z"/>
                                                    </svg>
                                                )
                                            }
                                        ].map((cat, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setActiveCategory(cat.name)}
                                                style={{ 
                                                    padding: "24px 15px", 
                                                    background: "#fff", 
                                                    borderRadius: "16px", 
                                                    border: "1px solid rgba(0,0,0,0.08)", 
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    gridColumn: i === 2 ? "span 2" : "span 1"
                                                }}
                                            >
                                                <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center" }}>
                                                    {cat.renderIcon()}
                                                </div>
                                                <span style={{ fontSize: "14px", fontWeight: 800, color: SLATE, fontFamily: H, letterSpacing: "-0.2px" }}>{cat.name}</span>
                                            </div>
                                        ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="drawer"
                                        initial={{ x: 10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 10, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ 
                                            flex: 1,
                                            background: "#fff", 
                                            zIndex: 10,
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: "0 30px"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px 0", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "8px" }}>
                                            <div onClick={() => setActiveCategory(null)} style={{ cursor: "pointer" }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={SLATE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
                                                </svg>
                                            </div>
                                            <h4 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: SLATE, margin: 0 }}>{activeCategory}</h4>
                                        </div>
                                        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
                                            {(faqData[activeCategory] || []).map((faq, idx) => {
                                                const isExpanded = expandedFaqIndex === idx;
                                                return (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                                                        style={{ padding: "18px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                            <div style={{ minWidth: "22px" }}>
                                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={SLATE} strokeWidth="1.8">
                                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                                                </svg>
                                                            </div>
                                                            <p style={{ flex: 1, margin: 0, fontSize: "15px", fontWeight: 700, color: SLATE, fontFamily: H }}>{faq.q}</p>
                                                            <motion.div
                                                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(15,23,42,0.3)" strokeWidth="2.5">
                                                                    <polyline points="9 18 15 12 9 6"/>
                                                                </svg>
                                                            </motion.div>
                                                        </div>
                                                        
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    style={{ overflow: "hidden", paddingLeft: "38px" }}
                                                                >
                                                                    <p style={{ margin: 0, fontSize: "13.5px", color: "rgba(15,23,42,0.6)", lineHeight: 1.6 }}>{faq.a}</p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
