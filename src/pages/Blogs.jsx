import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const blogData = [
  {
    id: 1,
    tag: "Travel Guide",
    date: "April 11, 2026",
    author: "Rohan Chaudhary",
    title: "Exploring the Golden Triangle: Puri, Konark, and Bhubaneswar",
    excerpt: "Discover the spiritual serenity and architectural marvels of Odisha's most iconic circuit. From the pristine beaches of Puri to the artistic Sun Temple of Konark, here is your ultimate self-drive itinerary...",
    image: "/C:/Users/Rohan Chaudhary/.gemini/antigravity/brain/ce27c1cf-f01b-45a9-a02d-5975b4746e5c/blog_temple_puri_1775948169637.png"
  },
  {
    id: 2,
    tag: "Road Trips",
    date: "April 10, 2026",
    author: "Ankit Gupta",
    title: "Top 5 Scenic Routes in Odisha for Your Next Weekend Escape",
    excerpt: "Odisha's diverse landscape offers everything from coastal highways to lush hill roads. We've curated the top 5 routes that promise breathtaking views and smooth driving experiences for every roadMate user...",
    image: "/C:/Users/Rohan Chaudhary/.gemini/antigravity/brain/ce27c1cf-f01b-45a9-a02d-5975b4746e5c/blog_travel_landscape_1775948138220.png"
  },
  {
    id: 3,
    tag: "Rider Tips",
    date: "April 08, 2026",
    author: "Sagar Panda",
    title: "Choosing Your Perfect Ride: Bike vs Car for Your Odisha Trip",
    excerpt: "Solo expedition or family vacation? Selecting the right vehicle can make or break your road trip. Read our expert comparison to decide whether a premium SUV or a powerful motorcycle fits your soul better...",
    image: "/C:/Users/Rohan Chaudhary/.gemini/antigravity/brain/ce27c1cf-f01b-45a9-a02d-5975b4746e5c/blog_bike_riding_1775948153489.png"
  },
  {
    id: 4,
    tag: "Tech & App",
    date: "April 05, 2026",
    author: "Rohan Chaudhary",
    title: "How to Book a Verified Vehicle in Under 2 Minutes with RoadMate",
    excerpt: "We've re-imagined the rental experience to be tech-first and friction-less. Follow this step-by-step guide to navigate our mobile app, choose your ride, and get it delivered right to your doorstep...",
    image: "/C:/Users/Rohan Chaudhary/.gemini/antigravity/brain/ce27c1cf-f01b-45a9-a02d-5975b4746e5c/blog_roadmate_app_preview_1775948306408.png"
  },
  {
    id: 5,
    tag: "Safety First",
    date: "April 03, 2026",
    author: "Maintenance Team",
    title: "Riding Gear Essentials: How to Stay Safe While Exploring the City",
    excerpt: "Safety is our absolute priority. Beyond providing sanitized and verified vehicles, we emphasize the importance of high-quality riding gear. Discover the essential equipment every renter should carry...",
    image: "/C:/Users/Rohan Chaudhary/.gemini/antigravity/brain/ce27c1cf-f01b-45a9-a02d-5975b4746e5c/blog_safety_gear_preview_1775948324033.png"
  },
  {
    id: 6,
    tag: "Coastal Drive",
    date: "March 31, 2026",
    author: "Local Guide",
    title: "The Puri-Konark Marine Drive: A Paradise for Every Driver",
    excerpt: "Experience the ultimate freedom on one of India's most beautiful coastal stretches. With the Bay of Bengal on one side and cashew forests on the other, this drive is a therapeutic experience every rider deserves...",
    image: "/C:/Users/Rohan Chaudhary/.gemini/antigravity/brain/ce27c1cf-f01b-45a9-a02d-5975b4746e5c/blog_coastal_highway_preview_1775948338485.png"
  }
];

const BlogCard = ({ post, index }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            style={{ 
                background: "#ffffff", 
                borderRadius: "20px", 
                overflow: "hidden", 
                display: "flex", 
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                height: "100%"
            }}
            onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <div style={{ width: "100%", height: "240px", overflow: "hidden", position: "relative" }}>
                <img 
                    src={post.image} 
                    alt={post.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} 
                />
            </div>
            
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
                    <span style={{ 
                        background: RED, 
                        color: "#fff", 
                        fontSize: "11px", 
                        fontWeight: 900, 
                        textTransform: "uppercase", 
                        padding: "4px 12px", 
                        borderRadius: "4px",
                        letterSpacing: "0.5px"
                    }}>
                        {post.tag}
                    </span>
                    <span style={{ fontSize: "12px", color: "rgba(15,23,42,0.4)", fontWeight: 600 }}>
                        {post.date} — {post.author}
                    </span>
                </div>

                <h3 style={{ 
                    fontSize: "20px", 
                    fontWeight: 800, 
                    fontFamily: H, 
                    color: SLATE, 
                    marginBottom: "12px", 
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}>
                    {post.title}
                </h3>

                <p style={{ 
                    fontSize: "14.5px", 
                    color: "rgba(15,23,42,0.6)", 
                    lineHeight: 1.7, 
                    marginBottom: "20px", 
                    flexGrow: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textAlign: "justify"
                }}>
                    {post.excerpt}
                </p>

                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    color: RED, 
                    fontSize: "14px", 
                    fontWeight: 800, 
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    transition: "gap 0.3s ease"
                }}
                onMouseOver={e => e.currentTarget.style.gap = "12px"}
                onMouseOut={e => e.currentTarget.style.gap = "6px"}
                >
                    Discover 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
            </div>
        </motion.div>
    );
};

const Blogs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: "#ffffff", fontFamily: F, color: "#1a1a1a", minHeight: "100vh" }}>
            
            {/* HERO SECTION */}
            <section style={{ 
                padding: "120px 40px 80px", 
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
                            background: "rgba(255,255,255,0.05)", 
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: RED, 
                            fontSize: "12px", 
                            fontWeight: 900, 
                            textTransform: "uppercase", 
                            letterSpacing: "3px", 
                            padding: "8px 20px", 
                            borderRadius: "99px", 
                            marginBottom: "20px"
                        }}
                    >
                        RoadMate Insights
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        The RoadMate <span style={{ color: RED }}>Blogs</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        Your ultimate guide to local travel, vehicle care, and community stories from across the city.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT GRID SECTION */}
            <section style={{ padding: "80px 24px", background: "#fcfcfc" }}>
                <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
                        gap: "40px",
                        marginBottom: "80px"
                    }}>
                        {blogData.map((post, idx) => (
                            <BlogCard key={post.id} post={post} index={idx} />
                        ))}
                    </div>

                    {/* PAGINATION UI */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                        <div style={{ 
                            width: "40px", height: "40px", borderRadius: "10px", 
                            display: "flex", alignItems: "center", justifyContent: "center", 
                            background: RED, color: "#fff", fontWeight: 800, fontSize: "14px", cursor: "pointer" 
                        }}>1</div>
                        <div style={{ 
                            width: "40px", height: "40px", borderRadius: "10px", 
                            display: "flex", alignItems: "center", justifyContent: "center", 
                            background: "transparent", color: SLATE, fontWeight: 700, fontSize: "14px", 
                            border: "1.5px solid rgba(15,23,42,0.05)", cursor: "pointer", transition: "all 0.3s ease" 
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = RED}
                        onMouseOut={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.05)"}
                        >2</div>
                        <div style={{ 
                            width: "40px", height: "40px", borderRadius: "10px", 
                            display: "flex", alignItems: "center", justifyContent: "center", 
                            background: "transparent", color: SLATE, fontWeight: 700, fontSize: "14px", 
                            border: "1.5px solid rgba(15,23,42,0.05)", cursor: "pointer" 
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = RED}
                        onMouseOut={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.05)"}
                        >3</div>
                        <div style={{ 
                            width: "40px", height: "40px", borderRadius: "10px", 
                            display: "flex", alignItems: "center", justifyContent: "center", 
                            background: "transparent", color: SLATE, fontWeight: 700, fontSize: "14px", 
                            border: "1.5px solid rgba(15,23,42,0.05)", cursor: "pointer" 
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = RED}
                        onMouseOut={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.05)"}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blogs;
