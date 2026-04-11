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
    content: "Discover the unparalleled beauty of Odisha and beyond with our comprehensive travel guides. From the spiritual serenity of the Golden Triangle (Bhubaneswar, Puri, and Konark) to the offbeat, lush greenery of the Eastern Ghats, we explore the best weekend getaways and scenic long-drive routes. Our destination features include hidden waterfalls, secluded beaches, and local culinary stops that only true road trippers know about. Whether you're planning a religious pilgrimage, a romantic seaside escape, or a solo mountain trek, our blogs provide the detailed itineraries and insider tips you need to make every journey memorable."
  },
  {
    category: "2. Maintenance & Safety Tips",
    content: "Your safety and the health of your vehicle are our top priorities. In this section, we dive deep into practical advice for every type of traveler. Learn about 'Riding Gear 101'—essential equipment from ECE-certified helmets to armored jackets that every bike enthusiast should invest in. We also provide 'Vehicle Health Checklists' for car renters, teaching you how to monitor tire pressure, understand dashboard warning lights, and maintain cabin hygiene during long trips. Our expert tips on defensive driving and navigating different terrains like coastal highways or hilly tracks ensure that you stay in control and enjoy a worry-free self-drive experience."
  },
  {
    category: "3. roadMate Stories & Community",
    content: "At its heart, roadMate is about the incredible stories our community members create on the open road. Our 'Customer Spotlight' series features real testimonials and travel logs from users who turned a simple rental into a lifetime memory. From cross-state motorcycle expeditions to family reunions facilitated by our premium SUVs, we celebrate the spirit of exploration. We also take you 'Behind the Scenes' to show you how our dedicated team and vehicle partners work tirelessly to verify every asset, maintain peak mechanical standards, and provide localized support, ensuring that every roadMate trip is backed by a community that cares."
  },
  {
    category: "4. The Future of Mobility",
    content: "The world of transportation is evolving rapidly, and roadMate is at the forefront of this transformation. In our mobility-focused articles, we explore the 'Electric Revolution' and how EV technology is reshaping the rental industry with sustainable, cost-effective options. We also discuss 'Smart Travel' trends, from AI-driven route optimization to the rise of 'Van Life' and digital nomadism in India. Stay informed about upcoming vehicle launches, innovative rental models, and how data and connectivity are making self-drive more accessible, affordable, and environmentally conscious for the modern traveler."
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
                        Discover travel guides, maintenance tips, and exciting stories from our community of explorers.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {blogData.map((section, sIdx) => (
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
                            Want to share your personal travel story or contribute to our blog? Reach out to our media team at media@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blogs;
