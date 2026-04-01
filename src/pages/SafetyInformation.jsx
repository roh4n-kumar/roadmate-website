import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const safetyTips = [
    {
        title: "Vehicle Inspection",
        desc: "Always inspect the vehicle before starting your trip. Check for any pre-existing damages, tire pressure, and fuel levels."
    },
    {
        title: "Safe Driving",
        desc: "Follow all local traffic rules and speed limits. Wear your seatbelt (or helmet for bikes) at all times."
    },
    {
        title: "Emergency Support",
        desc: "In case of an accident or breakdown, contact our 24/7 emergency support immediately through the app or our helpline."
    },
    {
        title: "Verified Community",
        desc: "All our partners and users are 100% verified to ensure a safe and trustworthy environment for everyone."
    }
];

const SafetyInformation = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: "#f8fafc", fontFamily: F, color: "#1a1a1a", minHeight: "100vh" }}>
            
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
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
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
                        Your Safety First
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        Safety <span style={{ color: RED }}>Information</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 30px" }}
                    >
                        Our commitment to your safety is our top priority. Learn how we keep you protected on every journey.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ background: "#ffffff", padding: "80px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
                        {safetyTips.map((tip, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                style={{ 
                                    padding: "40px", 
                                    background: "#fff", 
                                    borderRadius: "24px",
                                    border: "1px solid rgba(15, 23, 42, 0.08)",
                                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)"
                                }}
                            >
                                <div style={{ 
                                    width: "50px", 
                                    height: "50px", 
                                    borderRadius: "15px", 
                                    background: `${RED}11`, 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    marginBottom: "25px"
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <h4 style={{ fontSize: "20px", fontWeight: 800, fontFamily: H, margin: "0 0 15px 0", color: SLATE }}>{tip.title}</h4>
                                <p style={{ fontSize: "15px", color: "rgba(15,23,42,0.7)", lineHeight: "1.7", margin: 0 }}>{tip.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ marginTop: "80px", padding: "50px", background: SLATE, borderRadius: "32px", color: "#fff", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: "-20%", right: "-5%", width: "40%", height: "80%", background: `radial-gradient(circle, ${RED}22 0%, transparent 70%)` }} />
                        <h4 style={{ fontSize: "24px", fontWeight: 900, fontFamily: H, marginBottom: "15px" }}>Incident Reporting</h4>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.6", maxWidth: "600px", marginBottom: "0" }}>
                            If you encounter any issues during your trip, our support team is available at <strong>+91 98765 43210</strong>. 
                            We take all safety reports seriously and will investigate immediately.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SafetyInformation;
