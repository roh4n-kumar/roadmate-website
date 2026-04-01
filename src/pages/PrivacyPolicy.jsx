import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const policySections = [
    {
        title: "Information We Collect",
        content: "We collect information you provide directly to us, such as when you create an account, book a vehicle, or communicate with us. This includes your name, email, phone number, driving license details, and payment information."
    },
    {
        title: "How We Use Your Information",
        content: "We use your information to provide and improve our services, process your bookings, verify your identity, and communicate with you about your rentals and promotional offers."
    },
    {
        title: "Data Sharing and Disclosure",
        content: "We do not sell your personal information. We may share your data with verified vehicle partners to facilitate your rental, and with service providers who perform services on our behalf (like payment processing)."
    },
    {
        title: "Data Security",
        content: "We implement industry-standard security measures to protect your personal data from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure."
    },
    {
        title: "Your Rights",
        content: "You have the right to access, update, or delete your personal information. You can manage your account settings within the app or contact our support team for assistance."
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
                        Legal
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px" }}
                    >
                        Privacy <span style={{ color: RED }}>Policy</span>
                    </motion.h1>
                    <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
                        We value your privacy and are committed to protecting your personal data.
                    </p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "80px 24px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div style={{ background: "#f8fafc", padding: "50px", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
                        {policySections.map((section, index) => (
                            <div key={index} style={{ marginBottom: index === policySections.length - 1 ? 0 : "40px" }}>
                                <h3 style={{ fontSize: "22px", fontWeight: 800, fontFamily: H, color: SLATE, marginBottom: "12px" }}>{section.title}</h3>
                                <p style={{ fontSize: "15px", color: "rgba(15,23,42,0.7)", lineHeight: "1.7", margin: 0 }}>{section.content}</p>
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
