import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const partnerData = [
  {
    category: "1. Become a Host: Unlock Your Asset's Potential",
    content: "Turn your idle car or bike into a powerful source of passive income by joining the RoadMate Host community. Whether you are an individual owner with a single vehicle or a professional fleet manager looking to scale your business, we provide the platform and support you need to succeed. Our onboarding process is designed to be streamlined and efficient; simply submit your vehicle's details and photos through our portal, and our dedicated team will reach out for a quick inspection. Once approved, your vehicle can be listed and ready for rent within 24-48 hours, putting you on the fast track to earning from day one."
  },
  {
    category: "2. Host Benefits: Transparency & Growth",
    content: "Partnering with RoadMate offers a range of competitive benefits designed to maximize your revenue and ensure a smooth operational experience. We provide a transparent revenue-sharing model where you earn competitive rates based on real-time market demand, vehicle type, and seasonal trends. Our comprehensive Host Dashboard gives you absolute control, allowing you to track your vehicle's real-time location, monitor usage patterns, manage availability dates, and view detailed earning reports. We believe in mutual growth, providing you with data-driven insights to help you optimize your listings and increase your asset utilization rates consistently."
  },
  {
    category: "3. Safety & Asset Protection",
    content: "We understand that your vehicle is a valuable asset, and we treat it with the utmost care and responsibility. To ensure your peace of mind, every RoadMate user undergoes a strict, multi-layer document verification process before they are allowed to book. This includes verifying permanent driving licenses and official identity documents to build a community of responsible renters. Furthermore, we provide a comprehensive insurance cover for every trip, protecting your asset against accidental damages and theft. Our 24/7 support team and on-ground partners are always available to handle any on-road incidents, ensuring that your vehicle is returned to you in the best possible condition."
  },
  {
    category: "4. Business Partnerships & Affiliate Growth",
    content: "Beyond individual hosting, RoadMate offers robust partnership opportunities for businesses and large-scale entrepreneurs. Our Corporate Tie-up program allows organizations, hotels, and travel agencies to provide high-quality, flexible mobility solutions for their employees and guests. If you are looking to scale, our Affiliate Program offers attractive commissions and incentives for referring new partners to our platform. We also offer specialized support for fleet managers, providing batch onboarding, centralized maintenance coordination, and dedicated account management to help you manage a larger portfolio of vehicles with minimal effort and maximum profitability."
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
                        Join the RoadMate host ecosystem and turn your idle vehicle into a source of guaranteed passive income.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {partnerData.map((section, sIdx) => (
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

                    <div style={{ marginTop: "60px", padding: "50px", background: SLATE, borderRadius: "32px", color: "#fff", textAlign: "center" }}>
                        <h4 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, marginBottom: "15px" }}>Ready to scale your income?</h4>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginBottom: "30px" }}>
                            Join hundreds of successful hosts on RoadMate today. Let's build the future of mobility together.
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
