import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const policyData = [
    {
      category: "1. Information Collection",
      points: [
        { id: "1.1", text: "We collect information you provide directly to us, such as when you create an account, book a vehicle, or communicate with us." },
        { id: "1.2", text: "This includes your name, email, phone number, driving license details, and payment information required for booking." }
      ]
    },
    {
      category: "2. Usage & Purpose",
      points: [
        { id: "2.1", text: "We use your information to provide and improve our services, process your bookings, and verify your identity." },
        { id: "2.2", text: "Your data helps us communicate about your rentals, account notifications, and personalized promotional offers." }
      ]
    },
    {
      category: "3. Sharing & Privacy",
      points: [
        { id: "3.1", text: "We do not sell your personal information. We may share data with verified vehicle partners to facilitate your rental." },
        { id: "3.2", text: "Data may be shared with service providers (like payment processors) who perform essential services on our behalf." }
      ]
    },
    {
      category: "4. Data Security",
      points: [
        { id: "4.1", text: "We implement industry-standard security measures to protect your personal data from unauthorized access, loss, or misuse." },
        { id: "4.2", text: "While we strive for absolute security, no method of transmission over the internet is completely risk-free." }
      ]
    },
    {
      category: "5. User Rights",
      points: [
        { id: "5.1", text: "You have the right to access, update, or delete your personal information through your account settings." },
        { id: "5.2", text: "For dedicated support regarding your data, you can contact our privacy team anytime via the provided contact channels." }
      ]
    }
];

const PrivacyPolicy = () => {
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
                        Legal
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        Privacy <span style={{ color: RED }}>Policy</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        We value your privacy and are committed to protecting your personal data.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {policyData.map((section, sIdx) => (
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
                    
                    <div style={{ marginTop: "60px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.4)" }}>
                            If you have any questions about this Privacy Policy, please contact us at privacy@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
