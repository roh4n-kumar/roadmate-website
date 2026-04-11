import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const safetyData = [
    {
      category: "1. Vehicle Standards",
      points: [
        { id: "1.1", text: "Always inspect the vehicle before starting your trip. Check for any pre-existing damages, tire pressure, and fuel levels." },
        { id: "1.2", text: "Our fleet undergoes regular maintenance checks to ensure peak performance and safety for every user." }
      ]
    },
    {
      category: "2. Driving Conduct",
      points: [
        { id: "2.1", text: "Follow all local traffic rules and strictly adhere to speed limits. roadMate promotes responsible city and highway driving." },
        { id: "2.2", text: "Wearing mandatory safety gear (Helmets for bikes, Seatbelts for cars) is non-negotiable and required by law." }
      ]
    },
    {
      category: "3. Emergency protocols",
      points: [
        { id: "3.1", text: "In case of an accident or breakdown, contact our 24/7 support immediately through the app or helpline." },
        { id: "3.2", text: "We provide on-spot assistance and insurance guidance to ensure your safety is never compromised." }
      ]
    },
    {
      category: "4. Trust & Verification",
      points: [
        { id: "4.1", text: "All our partners and users are 100% verified to ensure a safe and trustworthy community environment." },
        { id: "4.2", text: "We maintain a rating system to ensure high standards of vehicle upkeep and user responsibility." }
      ]
    }
];

const SafetyInformation = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: "#ffffff", fontFamily: F, color: "#1a1a1a", minHeight: "100vh" }}>
            
            {/* HERO SECTION */}
            <section style={{ 
                padding: "120px 40px 60px", 
                background: "#000000", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                            display: "inline-block", 
                            background: "#ffffff", 
                            color: RED, 
                            fontSize: "14px", 
                            fontWeight: 900, 
                            textTransform: "uppercase", 
                            letterSpacing: "3px", 
                            padding: "10px 24px", 
                            borderRadius: "99px", 
                            marginBottom: "20px",
                            border: "none"
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
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        Our commitment to your safety is our top priority. Learn how we keep you protected on every journey.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {safetyData.map((section, sIdx) => (
                           <div key={sIdx} style={{ marginBottom: "60px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: SLATE, marginBottom: "25px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    {section.category}
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {section.points.map((point, pIdx) => (
                                        <div key={pIdx} style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 800, color: RED, fontFamily: H, minWidth: "30px", paddingTop: "2px" }}>
                                                {point.id}
                                            </span>
                                            <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.8", margin: 0, fontWeight: 500 }}>
                                                {point.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                           </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "80px", padding: "50px", background: SLATE, borderRadius: "32px", color: "#fff", position: "relative", overflow: "hidden" }}>
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
