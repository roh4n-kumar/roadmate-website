import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const blogData = [
  {
    category: "1. Travel & Destinations",
    points: [
      { id: "1.1", text: "Best Weekend Getaways from Bhubaneswar: Exploring Puri, Konark, and Chilika Lake by road." },
      { id: "1.2", text: "Offbeat Trails: Discovering the hidden waterfalls and scenic routes of Odisha." }
    ]
  },
  {
    category: "2. Maintenance & Safety",
    points: [
      { id: "2.1", text: "Riding Gear 101: Essential safety equipment every bike enthusiast should own." },
      { id: "2.2", text: "Vehicle Health: Tips to ensure your rental car is in top condition for long-distance travel." }
    ]
  },
  {
    category: "3. roadMate Stories",
    points: [
      { id: "3.1", text: "Customer Spotlight: How a weekend trip with roadMate turned into a lifetime memory." },
      { id: "3.2", text: "Behind the Scenes: How our team verifies every vehicle to ensure your safety." }
    ]
  },
  {
    category: "4. Future of Mobility",
    points: [
      { id: "4.1", text: "Electric Revolutions: Understanding the impact of EV technology on the rental industry." },
      { id: "4.2", text: "Smart Travel: Using data and connectivity to improve your road trip experience." }
    ]
  }
];

const Blogs = () => {
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
                        Stories & Guides
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        RoadMate <span style={{ color: RED }}>Blogs</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        Discover travel guides, maintenance tips, and exciting stories from our community.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {blogData.map((section, sIdx) => (
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
                                            <div>
                                                <p style={{ fontSize: "16px", color: "#1a1a1a", fontWeight: 700, margin: "0 0 5px 0" }}>
                                                    {point.text.split(":")[0]}
                                                </p>
                                                <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.8", margin: 0, fontWeight: 500 }}>
                                                    {point.text.split(":")[1]?.trim()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                           </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "60px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.4)" }}>
                            Want to share your travel story? Reach out to us at media@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blogs;
