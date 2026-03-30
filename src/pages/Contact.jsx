import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const DARK_GRADIENT = "linear-gradient(180deg, #111 0%, #0f172a 100%)";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";
const BLUE = "#0f172a";

/* Icons */
const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormState({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    return (
        <div style={{ background: "#fff", fontFamily: F, color: "#1a1a1a", minHeight: "100vh" }}>
            <style>{`
                .contact-input:focus {
                    border-color: ${RED} !important;
                    box-shadow: 0 0 0 4px ${RED}11 !important;
                }
                .glass-card {
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: 32px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.04);
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* HERO SECTION (EXISTING STYLE) */}
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
                        className="animate-box"
                        style={{ 
                            display: "inline-block", 
                            background: `${RED}22`, 
                            color: RED, 
                            fontSize: "14px", 
                            fontWeight: 900, 
                            textTransform: "uppercase", 
                            letterSpacing: "3px", 
                            padding: "10px 24px", 
                            borderRadius: "99px", 
                            marginBottom: "30px",
                            border: `1px solid ${RED}33`
                        }}
                    >
                        Connect With Us
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="animate-box delay-1"
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        We're Here to <span style={{ color: RED }}>Help You</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="animate-box delay-2"
                        style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 30px" }}
                    >
                        Whether you have a question about booking, partnerships, or anything else, our team is ready to answer all your queries.
                    </motion.p>
                </div>
            </section>

            {/* CORPORATE INFO SECTION (ROAD-MATE STYLED) */}
            <section style={{ background: "#ffffff", color: SLATE, padding: "40px 24px 100px" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <div style={{ display: "inline-block", background: `${RED}11`, color: RED, fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", padding: "8px 20px", borderRadius: "99px", marginBottom: "15px" }}>
                            Our Location
                        </div>
                        <h3 style={{ fontSize: "36px", fontWeight: 900, fontFamily: H, color: SLATE, letterSpacing: "-1px" }}>
                            Corporate Head Office<span style={{ color: RED }}>.</span>
                        </h3>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px", alignItems: "start" }}>
                        {/* Address Side */}
                        <div style={{ background: "#f8fafc", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "100%", background: RED }}></div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <div style={{ background: `${RED}15`, width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <MapPinIcon />
                                </div>
                                <h4 style={{ fontSize: "22px", fontWeight: 900, fontFamily: H, textTransform: "uppercase", letterSpacing: "1px", color: SLATE, margin: 0 }}>BHUBANESWAR</h4>
                            </div>
                            
                            <p style={{ fontSize: "16px", color: RED, fontWeight: 800, marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>ROADMATE PRIVATE LIMITED</p>
                            <p style={{ fontSize: "16px", color: "rgba(15,23,42,0.7)", lineHeight: "1.8", fontWeight: 500 }}>
                                Indiqube Leela Galleria,<br/>
                                5th Floor, #No 23, Jayadev Vihar,<br/>
                                Old Airport Road, Biju Patnaik Int'l,<br/>
                                Bhubaneswar, Odisha — 751013.
                            </p>
                        </div>

                        {/* Contacts Side */}
                        <div style={{ background: "#f8fafc", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "30px" }}>
                            
                            <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                <div style={{ background: `${RED}15`, width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <p style={{ fontSize: "13px", fontWeight: 800, color: "rgba(15,23,42,0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Call Us 24/7</p>
                                    <span style={{ fontSize: "18px", color: SLATE, fontWeight: 800 }}>+91 98765 43210<br/>+91 88765 43210</span>
                                </div>
                            </div>

                            <div style={{ width: "100%", height: "1px", background: "rgba(15,23,42,0.08)" }}></div>
                            
                            <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                <div style={{ background: `${RED}15`, width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <MailIcon />
                                </div>
                                <div>
                                    <p style={{ fontSize: "13px", fontWeight: 800, color: "rgba(15,23,42,0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Press & Media</p>
                                    <a href="mailto:press@roadmate.in" style={{ color: RED, textDecoration: "none", fontWeight: 800, fontSize: "16px" }}>press@roadmate.in</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
