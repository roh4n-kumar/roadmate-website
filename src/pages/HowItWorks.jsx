import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const howItWorksData = [
  {
    category: "1. Search & Select",
    content: "Browse our wide range of 100% verified cars and bikes. Filter by type, price, and availability to find your perfect match. Enter your pickup and drop-off dates to get instant pricing. We offer flexible hourly and daily rental plans."
  },
  {
    category: "2. Profile Verification",
    content: "New users need to complete a one-time verification. Upload your valid Driving License and Aadhaar card. Our team typically verifies documents within 30-60 minutes, ensuring a secure community for all travelers."
  },
  {
    category: "3. Secure Payment",
    content: "Confirm your booking by paying through our secure payment gateway. We support UPI, Credit/Debit cards, and Net Banking. Receive an instant booking confirmation via email and SMS with vehicle details and pickup location."
  },
  {
    category: "4. Pickup & Ride",
    content: "Arrive at the designated pickup point or get your vehicle delivered to your doorstep (at select locations). Perform a quick inspection, share the OTP with the partner, and you're ready to hit the road!"
  },
  {
    category: "5. Safe Return",
    content: "Return the vehicle at the scheduled time and location. Ensure fuel levels match the pickup state to avoid extra charges. Once the partner confirms the safe return, your refundable security deposit (if any) is initiated immediately."
  }
];

const HowItWorks = () => {
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
                        Easy Rental
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        How It <span style={{ color: RED }}>Works</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        The simple 5-step process to getting your favorite ride with RoadMate.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {howItWorksData.map((section, sIdx) => (
                           <div key={sIdx} style={{ marginBottom: "60px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    {section.category}
                                </h3>
                                <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.8", margin: 0, fontWeight: 500 }}>
                                    {section.content}
                                </p>
                           </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "60px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.4)" }}>
                            Still have questions? Check our <a href="/help-center" style={{ color: RED, textDecoration: "none", fontWeight: 700 }}>Help Center</a> or contact us at support@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;
