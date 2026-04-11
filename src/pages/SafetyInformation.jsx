import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const safetyData = [
    {
      category: "1. Vehicle Hygiene & Maintenance",
      content: "At roadMate, we believe a safe journey begins with a well-maintained vehicle. Every car and bike in our fleet undergoes a rigorous 50-point safety inspection before being handed over to a user. This includes checking tire tread depth, brake responsiveness, oil levels, and electronic system health. We also maintain strict hygiene standards; every vehicle is professionally deep-cleaned and sanitized after every rental to ensure you have a fresh and safe environment for your trip. We encourage users to perform their own external inspection and record a quick walkaround video at the start of the trip for their own records."
    },
    {
      category: "2. Road Conduct & Responsibility",
      content: "Safety on the road is a shared responsibility. We expect our users to strictly adhere to all local traffic regulations, including following speed limits and respecting road signs. roadMate promotes a culture of responsible driving; therefore, any form of reckless driving, off-roading, or stunts is strictly prohibited. Wearing mandatory safety gear—such as ISI-certified helmets for two-wheelers and seatbelts for cars—is non-negotiable and essential for your protection. By maintaining discipline on the road, you not only ensure your own safety but also contribute to the well-being of the entire community."
    },
    {
      category: "3. 24/7 Breakdown & Emergency Support",
      content: "We understand that unforeseen situations can happen, and we are prepared to support you around the clock. In the event of a mechanical breakdown, flat tire, or any technical issue, our dedicated support team is just a call away. We provide comprehensive Roadside Assistance (RSA) in most major operating regions to get you back on your way or provide a replacement vehicle where possible. In the case of an accident, our priority is your physical safety; please contact local emergency services first, then notify our support team within 2 hours to initiate insurance guidance and documentation support."
    },
    {
      category: "4. Trust, Verification & Ratings",
      content: "Building a trustworthy ecosystem is core to the roadMate experience. Every user and vehicle partner on our platform undergoes a thorough verification process to ensure authenticity and reliability. We use advanced ID verification technology to confirm driving licenses and identity documents, creating a community of responsible travelers. Additionally, our dual-rating system allows users to rate their vehicle's condition and hosts to rate the user's driving conduct. This transparency ensures that high standards of safety and maintenance are consistently maintained across the platform, weeding out any substandard experiences."
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
                        Our commitment to your safety is our top priority. Learn how we keep you protected on every journey with RoadMate.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {safetyData.map((section, sIdx) => (
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

                    <div style={{ marginTop: "80px", padding: "50px", background: SLATE, borderRadius: "32px", color: "#fff", position: "relative", overflow: "hidden" }}>
                        <h4 style={{ fontSize: "24px", fontWeight: 900, fontFamily: H, marginBottom: "15px" }}>Incident & Support Channel</h4>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: "1.6", maxWidth: "600px", marginBottom: "0" }}>
                            If you encounter any safety issues, mechanical concerns, or require immediate assistance during your trip, our support team is available at <strong>+91 98765 43210</strong>. 
                            We take all reporting seriously and provide on-ground support where possible to ensure your journey is never compromised.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SafetyInformation;
