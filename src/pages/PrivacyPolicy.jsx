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
      content: "At roadMate, we collect information you provide directly to us when you create an account, book a vehicle, or communicate with our support team. This primarily includes your legal name, verified email address, phone number, and detailed driving license information. For booking purposes, we also process payment information through secure third-party gateways. Additionally, we may collect technical data such as your IP address, browser type, and device identifiers to ensure a stable and secure session on our platform."
    },
    {
      category: "2. Usage & Purpose",
      content: "We use your personal information to facilitate smooth rental operations, process your bookings efficiently, and verify your eligibility as a safe driver. Your data helps us provide you with real-time notifications about your trip status, promotional offers that match your travel habits, and critical safety updates. Furthermore, we analyze aggregated, non-identifiable usage patterns to improve our app interface, optimize vehicle availability in specific regions, and enhance our overall customer support experience."
    },
    {
      category: "3. Sharing & Privacy",
      content: "We maintain a strict policy against selling your personal information to third parties for marketing. We share your data only with verified vehicle partners and hosts specifically involved in your rental to ensure a seamless handover. We may also collaborate with trusted service providers, such as payment processors and identity verification agencies, who are contractually obligated to protect your data. Disclosure of information may also occur if required by law or to protect the safety and rights of roadMate, our users, and the public."
    },
    {
      category: "4. Data Security",
      content: "Your privacy is paramount. We implement industry-leading encryption and security protocols to safeguard your personal data from unauthorized access, accidental loss, or misuse. This includes the use of Secure Socket Layer (SSL) technology for data transmission and restricted access to personal information by our team. While we strive for the highest level of protection, please be aware that no transmission over the internet or electronic storage is 100% secure, and users are encouraged to maintain strong, unique passwords for their accounts."
    },
    {
      category: "5. User Rights & Data Retention",
      content: "You have the full right to access, update, or request the correction of your personal data through your profile settings. If you wish to delete your account or retract your consent for certain data usage, you can contact our privacy officer. We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or to comply with legal, tax, and accounting requirements. Following this period, your data is either securely deleted or anonymized for long-term analytical use."
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
                        We value your trust and are committed to protecting your personal data with the highest security standards.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {policyData.map((section, sIdx) => (
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
                            If you have further questions about how we handle your data, please contact us at privacy@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
