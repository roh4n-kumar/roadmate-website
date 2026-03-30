import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const BLUE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

/* Reuse SVG Icons */
const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mocking API call
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
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card:hover {
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* HERO SECTION */}
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
                        transition={{ duration: 0.6 }}
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
                        style={{ 
                            fontSize: "56px", 
                            fontWeight: 900, 
                            fontFamily: H, 
                            marginBottom: "20px", 
                            letterSpacing: "-1.5px",
                            lineHeight: 1.1
                        }}
                    >
                        Let's Talk <span style={{ color: RED }}>RoadMate</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="animate-box delay-2"
                        style={{ 
                            fontSize: "18px", 
                            color: "rgba(255,255,255,0.7)", 
                            lineHeight: 1.6, 
                            maxWidth: "600px", 
                            margin: "0 auto 30px" 
                        }}
                    >
                        Have questions about our fleet or services? Our team is here to help you get on the road faster.
                    </motion.p>
                </div>
            </section>

            {/* CONTACT CONTENT */}
            <section style={{ padding: "80px 24px", maxWidth: "1250px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "50px", alignItems: "flex-start" }}>
                    
                    {/* INFO COLUMN */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ fontSize: "32px", fontWeight: 900, fontFamily: H, marginBottom: "40px" }}>Contact Information</h2>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
                            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                                <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "rgba(190,13,13,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <MapPinIcon />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", color: RED, marginBottom: "8px", letterSpacing: "1px" }}>Our Office</h4>
                                    <p style={{ fontSize: "18px", fontWeight: 600, color: BLUE, lineHeight: "1.5" }}>Jayadev Vihar, Bhubaneswar,<br/>Odisha 751013</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                                <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "rgba(190,13,13,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", color: RED, marginBottom: "8px", letterSpacing: "1px" }}>Call Us</h4>
                                    <p style={{ fontSize: "18px", fontWeight: 600, color: BLUE }}>+91 98765 43210</p>
                                    <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", marginTop: "4px" }}>Mon - Fri, 9am - 6pm</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                                <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "rgba(190,13,13,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <MailIcon />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", color: RED, marginBottom: "8px", letterSpacing: "1px" }}>Email Us</h4>
                                    <p style={{ fontSize: "18px", fontWeight: 600, color: BLUE }}>support@roadmate.in</p>
                                    <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", marginTop: "4px" }}>We'll reply within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* MAP PLACEHOLDER */}
                        <div style={{ marginTop: "60px", height: "300px", borderRadius: "32px", background: "#f8f9fa", overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)", position: "relative" }}>
                            <img src="/puri_marine_drive.jpg" alt="Map Location" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
                            <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", background: `linear-gradient(180deg, transparent 0%, ${BLUE}88 100%)`, display: "flex", alignItems: "flex-end", padding: "30px" }}>
                                <div style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>Bhubaneswar, Odisha</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* FORM COLUMN */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-card"
                    >
                        {submitted ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{ width: "80px", height: "80px", borderRadius: "40px", background: RED, margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <h2 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, marginBottom: "15px" }}>Message Sent!</h2>
                                <p style={{ color: "rgba(15,23,42,0.6)", fontSize: "16px", marginBottom: "30px" }}>Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    style={{ background: BLUE, color: "#fff", border: "none", padding: "14px 30px", borderRadius: "14px", fontWeight: 700, cursor: "pointer" }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{ fontSize: "24px", fontWeight: 900, fontFamily: H, marginBottom: "10px" }}>Send a Message</h3>
                                <p style={{ color: "rgba(15,23,42,0.5)", marginBottom: "35px" }}>Fill out the form below and we'll get back to you.</p>
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="contact-input"
                                            placeholder="Rohan Chaudhary"
                                            value={formState.name}
                                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                                            style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#f8f9fa", outline: "none", transition: "all 0.2s" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            className="contact-input"
                                            placeholder="rohan@example.com"
                                            value={formState.email}
                                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                                            style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#f8f9fa", outline: "none", transition: "all 0.2s" }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Subject</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="contact-input"
                                        placeholder="How can we help?"
                                        value={formState.subject}
                                        onChange={(e) => setFormState({...formState, subject: e.target.value})}
                                        style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#f8f9fa", outline: "none", transition: "all 0.2s" }}
                                    />
                                </div>

                                <div style={{ marginBottom: "35px" }}>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 800, color: BLUE, marginBottom: "10px", paddingLeft: "4px" }}>Message</label>
                                    <textarea 
                                        required
                                        rows="5"
                                        className="contact-input"
                                        placeholder="Tell us more about your inquiry..."
                                        value={formState.message}
                                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                                        style={{ width: "100%", padding: "16px 20px", borderRadius: "16px", border: "1.5px solid #eee", background: "#f8f9fa", outline: "none", transition: "all 0.2s", resize: "none" }}
                                    />
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    style={{ 
                                        width: "100%", 
                                        background: RED, 
                                        color: "#fff", 
                                        border: "none", 
                                        padding: "20px", 
                                        borderRadius: "20px", 
                                        fontWeight: 800, 
                                        fontSize: "16px", 
                                        cursor: "pointer",
                                        boxShadow: `0 15px 30px ${RED}33`,
                                        transition: "all 0.3s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "12px"
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = "translateY(-3px)"}
                                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                                >
                                    {isSubmitting ? (
                                        <div style={{ width: "20px", height: "20px", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                        </>
                                    )}
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
