import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing and using RoadMate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
    },
    {
        title: "2. User Eligibility",
        content: "Users must be at least 18 years of age and hold a valid driver's license for the category of vehicle being rented. Users are responsible for providing accurate and updated documentation."
    },
    {
        title: "3. Booking and Payments",
        content: "All bookings are subject to availability. Payments must be made through our authorized payment gateways. RoadMate reserves the right to cancel bookings in case of payment failure or fraudulent activity."
    },
    {
        title: "4. Vehicle Usage",
        content: "Vehicles must be used in compliance with all local laws. Speeding, off-roading, and driving under the influence are strictly prohibited and will result in immediate termination of the rental and legal action."
    },
    {
        title: "5. Damages and Liability",
        content: "The user is liable for any damages caused to the vehicle during the rental period. Our comprehensive insurance covers major incidents, but the user may be responsible for the deductible amount."
    }
];

const TermsOfService = () => {
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
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px" }}
                    >
                        Terms of <span style={{ color: RED }}>Service</span>
                    </motion.h1>
                    <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
                        Last Updated: April 2026
                    </p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "80px 24px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    {sections.map((section, index) => (
                        <div key={index} style={{ marginBottom: "50px" }}>
                            <h3 style={{ fontSize: "24px", fontWeight: 900, fontFamily: H, color: SLATE, marginBottom: "15px" }}>{section.title}</h3>
                            <p style={{ fontSize: "16px", color: "rgba(15,23,42,0.7)", lineHeight: "1.8", margin: 0 }}>{section.content}</p>
                        </div>
                    ))}
                    
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "40px", marginTop: "60px" }}>
                        <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontStyle: "italic" }}>
                            For any questions regarding our terms, please reach out to legal@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
