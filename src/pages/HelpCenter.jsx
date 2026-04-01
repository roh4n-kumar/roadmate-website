import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
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
        <div style={{ background: "#f8fafc", fontFamily: F, color: "#1a1a1a", minHeight: "100vh" }}>
            <style>{`
                .help-input:focus {
                    border-color: ${RED} !important;
                    box-shadow: 0 0 0 4px ${RED}11 !important;
                }
                .category-card:hover {
                    transform: translateY(-5px);
                    border-color: ${RED}33 !important;
                    background: #fff !important;
                }
            `}</style>

            {/* HERO SECTION with SEARCH */}
            <section style={{ 
                padding: "140px 40px 100px", 
                background: "linear-gradient(180deg, #111 0%, #0f172a 100%)", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "60%", height: "200%", background: `radial-gradient(circle, ${RED}11 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "30px", letterSpacing: "-1.5px" }}
                    >
                        How can we <span style={{ color: RED }}>help?</span>
                    </motion.h1>
                    
                    <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
                        <input 
                            type="text" 
                            placeholder="Search for help, articles, or issues..." 
                            style={{ 
                                width: "100%", 
                                padding: "22px 30px 22px 60px", 
                                borderRadius: "20px", 
                                border: "none", 
                                background: "rgba(255,255,255,0.1)", 
                                backdropFilter: "blur(10px)",
                                color: "#fff",
                                fontSize: "16px",
                                outline: "none",
                                border: "1px solid rgba(255,255,255,0.1)"
                            }}
                        />
                        <svg style={{ position: "absolute", left: "22px", top: "50%", transform: "translateY(-50%)" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                </div>
            </section>

            {/* QUICK CATEGORIES */}
            <section style={{ padding: "80px 24px", background: "#fff" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "80px" }}>
                        {[
                            { title: "Bookings", icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" },
                            { title: "Payments", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
                            { title: "Safety", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                            { title: "Accounts", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }
                        ].map((cat, i) => (
                            <div key={i} className="category-card" style={{ padding: "40px", borderRadius: "24px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.04)", textAlign: "center", transition: "all 0.3s", cursor: "pointer" }}>
                                <div style={{ width: "60px", height: "60px", background: "#fff", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={cat.icon}/>
                                        {cat.title === "Bookings" && <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>}
                                        {cat.title === "Accounts" && <circle cx="12" cy="7" r="4"/>}
                                    </svg>
                                </div>
                                <h4 style={{ fontSize: "18px", fontWeight: 800, fontFamily: H, color: SLATE, marginBottom: "8px" }}>{cat.title}</h4>
                                <span style={{ fontSize: "13px", color: "rgba(15,23,42,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Browse Issues</span>
                            </div>
                        ))}
                    </div>

                    {/* ASK A QUESTION FORM */}
                    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px", background: "#f8fafc", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", position: "relative" }}>
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
                                className="help-input"
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
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HelpCenter;
