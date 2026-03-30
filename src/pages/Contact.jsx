import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const DARK_GRADIENT = "linear-gradient(180deg, #111 0%, #0f172a 100%)";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

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
                        Get In Touch
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="animate-box delay-1"
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        Let's Talk <span style={{ color: RED }}>RoadMate</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="animate-box delay-2"
                        style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 30px" }}
                    >
                        Have questions about our fleet or services? Our team is here to help you get on the road faster.
                    </motion.p>
                </div>
            </section>

            {/* MAP HERO SECTION (REDBUS STYLE) */}
            <section style={{ height: "450px", position: "relative", width: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img 
                    src="/puri_marine_drive.jpg" 
                    alt="Map Background" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "grayscale(1) brightness(1.2)" }} 
                />
                <div style={{ position: "absolute", textAlign: "center" }}>
                    <div style={{ background: "#fff", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
                        <MapPinIcon />
                    </div>
                    <h2 style={{ fontSize: "52px", fontWeight: 900, fontFamily: H, color: BLUE, textTransform: "capitalize" }}>Contact Us</h2>
                </div>
            </section>

            {/* OFFICE INFO SECTION (DARK RIBBON STYLE) */}
            <section style={{ background: DARK_GRADIENT, color: "#fff", padding: "100px 24px" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <h3 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, textAlign: "center", marginBottom: "60px", letterSpacing: "-0.5px" }}>Corporate Head Office — Bhubaneswar</h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px" }}>
                        {/* Address Side */}
                        <div>
                            <h4 style={{ fontSize: "18px", fontWeight: 800, fontFamily: H, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>BHUBANESWAR</h4>
                            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", fontWeight: 700, marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>ROADMATE PRIVATE LIMITED</p>
                            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", fontWeight: 500 }}>
                                Indiqube Leela Galleria,<br/>
                                5th Floor, #No 23, Jayadev Vihar,<br/>
                                Old Airport Road, Biju Patnaik Int'l,<br/>
                                Bhubaneswar, Odisha — 751013.
                            </p>
                        </div>

                        {/* Contacts Side */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                <PhoneIcon />
                                <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Ph: +91 98765 43210, +91 88765 43210</span>
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>For any Support or Complaints:</p>
                                <a href="#" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 700, fontSize: "16px" }}>Chat with Us</a>
                                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Support Time: 24*7</p>
                            </div>
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
                                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>For Media enquiries:</p>
                                <a href="mailto:press@roadmate.in" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 700 }}>press@roadmate.in</a>
                                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px", fontStyle: "italic" }}>Only for Press/Media enquiries</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FORM SECTION (PRESERVED) */}
            <section style={{ padding: "100px 24px", background: "#f8f9fa" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card"
                    >
                        {submitted ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{ width: "80px", height: "80px", borderRadius: "40px", background: RED, margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <h2 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, marginBottom: "15px" }}>Message Sent!</h2>
                                <p style={{ color: "rgba(15,23,42,0.6)", fontSize: "16px", marginBottom: "30px" }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} style={{ background: BLUE, color: "#fff", border: "none", padding: "14px 30px", borderRadius: "14px", fontWeight: 700, cursor: "pointer" }}>Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, marginBottom: "10px", textAlign: "center" }}>Quick Message</h3>
                                <p style={{ color: "rgba(15,23,42,0.5)", marginBottom: "40px", textAlign: "center" }}>Drop us a line and we'll reply within 24 hours.</p>
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Full Name</label>
                                        <input required type="text" className="contact-input" placeholder="Rohan Chaudhary" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#fff", outline: "none", transition: "all 0.2s" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Email Address</label>
                                        <input required type="email" className="contact-input" placeholder="rohan@example.com" value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#fff", outline: "none", transition: "all 0.2s" }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Subject</label>
                                    <input required type="text" className="contact-input" placeholder="How can we help?" value={formState.subject} onChange={(e) => setFormState({...formState, subject: e.target.value})} style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#fff", outline: "none", transition: "all 0.2s" }} />
                                </div>

                                <div style={{ marginBottom: "35px" }}>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Message</label>
                                    <textarea required rows="5" className="contact-input" placeholder="Tell us more about your inquiry..." value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#fff", outline: "none", transition: "all 0.2s", resize: "none" }} />
                                </div>

                                <button disabled={isSubmitting} style={{ width: "100%", background: RED, color: "#fff", border: "none", padding: "20px", borderRadius: "20px", fontWeight: 800, fontSize: "16px", cursor: "pointer", boxShadow: `0 15px 30px ${RED}33`, transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }} onMouseEnter={(e) => e.target.style.transform = "translateY(-3px)"} onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}>
                                    {isSubmitting ? <div style={{ width: "20px", height: "20px", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <span>Send Message</span>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
