import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const faqs = [
    {
        q: "How do I book a vehicle?",
        a: "Booking a vehicle is easy. Simply select your desired dates, choose from our verified fleet, and complete the payment process securely online."
    },
    {
        q: "What documents are required?",
        a: "You need a valid driver's license, an Aadhar card or Passport for identity proof, and a valid payment method."
    },
    {
        q: "What is the cancellation policy?",
        a: "You can cancel your booking up to 24 hours before the trip to receive a full refund. Cancellations made within 24 hours may incur a small fee."
    },
    {
        q: "Are the vehicles insured?",
        a: "Yes, all our verified vehicles come with comprehensive insurance coverage for your peace of mind."
    }
];

const HelpCenter = () => {
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
                        Support
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
                        style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 30px" }}
                    >
                        How can we help you today? Browse our frequently asked questions or contact support.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ background: "#ffffff", padding: "80px 24px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <h3 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, textAlign: "center", marginBottom: "50px", color: SLATE, letterSpacing: "-0.5px" }}>Frequently Asked Questions</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {faqs.map((faq, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                style={{ 
                                    padding: "30px", 
                                    background: "#f8fafc", 
                                    borderRadius: "16px",
                                    border: "1px solid rgba(0,0,0,0.05)"
                                }}
                            >
                                <h4 style={{ fontSize: "18px", fontWeight: 800, fontFamily: H, margin: "0 0 10px 0", color: SLATE }}>{faq.q}</h4>
                                <p style={{ fontSize: "15px", color: "rgba(15,23,42,0.7)", lineHeight: "1.6", margin: 0 }}>{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ marginTop: "60px", textAlign: "center", padding: "40px", background: `${RED}08`, borderRadius: "24px", border: `1px solid ${RED}15` }}>
                        <h4 style={{ fontSize: "20px", fontWeight: 800, fontFamily: H, color: SLATE, marginBottom: "15px" }}>Still need help?</h4>
                        <p style={{ fontSize: "15px", color: "rgba(15,23,42,0.7)", marginBottom: "25px" }}>Our support team is available 24/7 to assist you.</p>
                        <a href="/contact" style={{ display: "inline-block", background: RED, color: "#fff", padding: "14px 32px", borderRadius: "99px", textDecoration: "none", fontWeight: 700, fontSize: "15px", transition: "transform 0.2s" }}>Contact Support</a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HelpCenter;
