import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const partnerData = [
  {
    category: "1. Become a Host",
    points: [
      { id: "1.1", text: "List your car or bike on RoadMate and start earning immediately. We welcome individual owners and small fleet managers." },
      { id: "1.2", text: "Our simple onboarding process ensures your vehicle is ready for rent within 24-48 hours of inspection." }
    ]
  },
  {
    category: "2. Host Benefits",
    points: [
      { id: "2.1", text: "Guaranteed Revenue: Earn high competitive rates based on vehicle demand and seasonal trends." },
      { id: "2.2", text: "Real-time Tracking: Monitor your vehicle's location and usage through our host dashboard." }
    ]
  },
  {
    category: "3. Safety & Assurance",
    points: [
      { id: "3.1", text: "Verified Renters: Every user on RoadMate undergoes strict document verification before they can book." },
      { id: "3.2", text: "Insurance Cover: We provide comprehensive insurance protection for every trip to secure your asset." }
    ]
  },
  {
    category: "4. Business Partnerships",
    points: [
      { id: "4.1", text: "Corporate Tie-ups: Partner with us to provide mobility solutions for your employees or guests." },
      { id: "4.2", text: "Affiliate Program: Refer partners to RoadMate and earn a commission on every successful onboarding." }
    ]
  }
];

const PartnerWithUs = () => {
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
                        Grow With Us
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        Partner <span style={{ color: RED }}>With Us</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        Learn how you can turn your idle vehicle into a source of income or scale your rental business.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {partnerData.map((section, sIdx) => (
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

                    <div style={{ marginTop: "60px", padding: "50px", background: SLATE, borderRadius: "32px", color: "#fff", textAlign: "center" }}>
                        <h4 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, marginBottom: "15px" }}>Ready to list?</h4>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginBottom: "30px" }}>
                            Join hundreds of successful hosts on RoadMate today.
                        </p>
                        <button 
                            onClick={() => window.location.href = "mailto:partners@roadmate.in"}
                            style={{ padding: "16px 40px", borderRadius: "16px", background: RED, color: "#fff", border: "none", fontWeight: 800, fontSize: "16px", cursor: "pointer", fontFamily: H }}
                        >
                            Become a Host
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PartnerWithUs;
