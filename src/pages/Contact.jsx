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
                        Contact <span style={{ color: RED }}>Us</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="animate-box delay-2"
                        style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 30px" }}
                    >
                        Find our corporate office address and direct contact lines below. Reach out to our team for any assistance or inquiries.
                    </motion.p>
                </div>
            </section>

            {/* CORPORATE INFO SECTION (WHITE STYLE) */}
            <section style={{ background: "#ffffff", color: SLATE, padding: "40px 24px" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <h3 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, textAlign: "center", marginBottom: "60px", letterSpacing: "-0.5px", color: SLATE }}>Corporate Head Office — <span style={{ color: RED }}>Bhubaneswar</span></h3>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px" }}>
                        {/* Address Side */}
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: "350px" }}>
                            <div>
                                <h4 style={{ fontSize: "18px", fontWeight: 800, fontFamily: H, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 20px 0", color: RED }}>BHUBANESWAR</h4>
                                <p style={{ fontSize: "15px", color: SLATE, fontWeight: 800, marginBottom: 0, textTransform: "uppercase", letterSpacing: "1px", marginTop: 0 }}>ROADMATE PRIVATE LIMITED</p>
                            </div>
                            <p style={{ fontSize: "15px", color: "rgba(15,23,42,0.7)", lineHeight: "1.8", fontWeight: 500, margin: 0 }}>
                                Indiqube Leela Galleria,<br/>
                                5th Floor, #No 23, Jayadev Vihar,<br/>
                                Old Airport Road, Biju Patnaik Int'l,<br/>
                                Bhubaneswar, Odisha — 751013.
                            </p>
                        </div>

                        {/* Contacts Side */}
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: "350px", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <PhoneIcon />
                                <span style={{ fontSize: "15px", color: SLATE, fontWeight: 600 }}>Ph: +91 98765 43210</span>
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.6)", marginBottom: "8px", marginTop: 0 }}>For any Support or Complaints:</p>
                                <a href="#" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 700, fontSize: "16px" }}>Chat with Us</a>
                                <p style={{ fontSize: "13px", color: "rgba(15,23,42,0.5)", marginTop: "4px", marginBottom: 0 }}>Support Time: 24x7</p>
                            </div>
                            <div style={{ width: "100%" }}>
                                <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.6)", marginBottom: 0, marginTop: 0 }}>For any enquiries:</p>
                                <a href="mailto:enquiry@roadmate.in" style={{ display: "block", color: SLATE, textDecoration: "none", fontWeight: 500, fontSize: "15px", lineHeight: "1.8" }}>enquiry@roadmate.in</a>
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
