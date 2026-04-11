// src/pages/About.jsx
import React, { useEffect } from "react";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const BLUE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const IconMission = () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gradMission" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#gradMission)" opacity="0.2" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#gradMission)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="url(#gradMission)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="url(#gradMission)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const IconSafety = () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gradSafety" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#gradSafety)" opacity="0.2" />
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="url(#gradSafety)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12L11 14L15 10" stroke="url(#gradSafety)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const IconAccess = () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gradAccess" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
            </defs>
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#gradAccess)" opacity="0.2" />
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="url(#gradAccess)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const IconCommunity = () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gradCommunity" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="url(#gradCommunity)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="url(#gradCommunity)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2522 22.1614 16.5523C21.6184 15.8524 20.8581 15.3516 20 15.13" stroke="url(#gradCommunity)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11703 19.0078 7.005C19.0078 7.89297 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="url(#gradCommunity)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const features = [
        { icon: <IconMission />, title: "Our Mission", desc: "To revolutionize local transport by making vehicle rentals as simple as checking your phone. We're starting in Bhubaneswar to empower every traveler with freedom and accessibility." },
        { icon: <IconSafety />, title: "Trust & Safety", desc: "Every vehicle on roadMate undergoes a rigorous 50-point inspection. We partner with local experts to ensure your ride is safe, clean, and reliable." },
        { icon: <IconAccess />, title: "Instant Access", desc: "No more long queues or endless paperwork. Our digital-first approach means you can go from browsing to riding in under 2 minutes." },
        { icon: <IconCommunity />, title: "Community First", desc: "roadMate isn't just a rental service; it's a community. We believe in providing value to both our riders and our local partners." }
    ];



    return (
        <div style={{ background: "#fff", fontFamily: F, color: "#111", overflowX: "hidden" }}>
             <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-box { animation: fadeInUp 0.8s ease forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.2s; }
                .delay-2 { animation-delay: 0.4s; }
                .delay-3 { animation-delay: 0.6s; }
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: 32px;
                    padding: 40px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.08);
                    border-color: ${RED}22;
                }
             `}</style>

             {/* HERO SECTION */}
             <div style={{ 
                padding: "120px 40px 60px", 
                background: "#000000", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
             }}>
                
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <div style={{ 
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
                        }}>
                        Discover roadMate
                    </div>
                    <h1 className="animate-box delay-1" style={{ 
                        fontSize: "56px", 
                        fontWeight: 900, 
                        fontFamily: H, 
                        marginBottom: "20px", 
                        letterSpacing: "-1.5px",
                        lineHeight: 1.1
                    }}>
                        Your Journey, <span style={{ color: RED }}>Our Pride</span>
                    </h1>
                    <p className="animate-box delay-2" style={{ 
                        fontSize: "16px", 
                        color: "rgba(255,255,255,0.6)", 
                        lineHeight: 1.6, 
                        maxWidth: "600px", 
                        margin: "0 auto" 
                    }}>
                        We're on a mission to simplify vehicle rentals in Bhubaneswar, providing every explorer with the freedom they deserve.
                    </p>
                </div>
             </div>

             {/* OUR STORY / MISSION */}
             <div style={{ padding: "40px 40px 80px", maxWidth: "1200px", margin: "0 auto", textAlign: "left" }}>
                 {/* ABOUT US */}
                 <div className="animate-box">
                    <h2 style={{ fontSize: "22px", fontWeight: 800, fontFamily: H, marginBottom: "20px" }}>
                        <span style={{ color: BLUE }}>About</span> <span style={{ color: RED }}>Us</span>
                    </h2>
                    <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "20px", textAlign: "justify" }}>
                        roadMate was born from a simple yet powerful observation: the freedom of movement shouldn't be a luxury or a bureaucratic hurdle. In a fast-evolving city like Bhubaneswar, we noticed that while the need for local travel was growing, the means to access reliable, clean, and well-maintained vehicles remained surprisingly difficult. Whether you are a student striving for a better commute, a professional navigating a busy schedule, or a traveler eager to explore the hidden joys of Odisha, roadMate is here to ensure that your journey starts on the right note.
                    </p>
                    <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "40px", textAlign: "justify" }}>
                        We didn't just want to build a rental service; we wanted to create a travel ecosystem where convenience meets trust. Our platform bridges the gap between high-quality local vehicles and the modern rider who values efficiency, fair pricing, and absolute transparency. We are committed to empowering every individual with the freedom they deserve, making every trip—whether it's a few miles or a few hundred—a memory to cherish. At roadMate, your journey is our pride, and your satisfaction is our mission.
                    </p>
                 </div>

                 {/* OUR MISSION */}
                 <div className="animate-box">
                    <h2 style={{ fontSize: "22px", fontWeight: 800, fontFamily: H, marginBottom: "20px" }}>
                        <span style={{ color: BLUE }}>Our</span> <span style={{ color: RED }}>Mission</span>
                    </h2>
                    <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "40px", textAlign: "justify" }}>
                        At roadMate, our mission is to redefine the landscape of urban mobility through a localized, high-fidelity lens. We believe that everyone deserves the freedom to move without boundaries, regardless of their destination or duration. By combining cutting-edge technology with a customer-first approach, we are building a seamless rental experience that is as instinctive as it is reliable. Our journey begins in Bhubaneswar, where we aim to set a new benchmark for trust, cleanliness, and accessibility, eventually scaling this vision to empower explorers across the nation. Through transparent pricing, verified fleets, and 24/7 support, we are turning transit into a frictionless experience, one ride at a time.
                    </p>
                 </div>

                 {/* MANAGEMENT TEAM SECTION */}
                 <div className="animate-box delay-1">
                    <h2 style={{ fontSize: "22px", fontWeight: 800, fontFamily: H, marginBottom: "30px" }}>
                        <span style={{ color: BLUE }}>Management</span> <span style={{ color: RED }}>Team</span>
                    </h2>
                    
                    <div style={{ display: "flex", gap: "30px", marginBottom: "40px", alignItems: "flex-start" }}>
                        <div style={{ width: "180px", height: "180px", borderRadius: "50%", background: "#f0f0f0", flexShrink: 0, overflow: 'hidden', border: "4px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                            <img src="/Founder%20%26%20CEO.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} alt="Founder & CEO" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "19px", fontWeight: 800, fontFamily: H, marginBottom: "8px" }}>
                                <span style={{ color: BLUE }}>Rohan Chaudhary</span>, <span style={{ color: RED }}>Founder & CEO</span>
                            </h3>
                            <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, textAlign: "justify" }}>
                                Rohan Chaudhary is the visionary behind roadMate. With a deep passion for improving urban mobility and a background in strategic development, he founded roadMate to bridge the gap in Bhubaneswar's local transport. He is dedicated to transforming the rental experience into a seamless, trust-driven journey for every rider.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
                        <div style={{ width: "180px", height: "180px", borderRadius: "50%", background: "#f0f0f0", flexShrink: 0, overflow: 'hidden', border: "4px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                           <img src="/Co-Founder.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} alt="Co-Founder" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "19px", fontWeight: 800, fontFamily: H, marginBottom: "8px" }}>
                                <span style={{ color: BLUE }}>Ankit Gupta</span>, <span style={{ color: RED }}>Co-Founder</span>
                            </h3>
                            <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, textAlign: "justify" }}>
                                Ankit Gupta is the Co-Founder of roadMate and has been an integral part of the journey since its very inception. Working side-by-side with Rohan from day one, his dedication and strategic insight have been crucial in building the foundation of roadMate. He continues to drive our mission forward with a shared vision of transforming urban mobility.
                            </p>
                        </div>
                    </div>
                 </div>
             </div>

             {/* FEATURE GRID */}
             <section style={{ padding: "40px 24px", background: "#f8f9fa" }}>
                 <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "70px" }}>
                         <h2 style={{ fontSize: "42px", fontWeight: 900, fontFamily: H }}>The <span style={{ color: BLUE }}>roadMate</span> <span style={{ color: RED }}>Difference</span></h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
                        {features.map((f, i) => (
                            <div key={i} className={`glass-card animate-box delay-${i+1}`}>
                                <div style={{ fontSize: "40px", marginBottom: "25px" }}>{f.icon}</div>
                                <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "15px", fontFamily: H }}>{f.title}</h3>
                                <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
             </section>



             {/* CTA */}
             <div style={{ padding: "100px 40px" }}>
                 <div style={{ 
                    maxWidth: "1250px", 
                    margin: "0 auto", 
                    background: "#000000", 
                    borderRadius: "40px", 
                    padding: "80px 40px", 
                    textAlign: "center",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden"
                 }}>
                    <h2 style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "30px", letterSpacing: "-1px" }}>Ready to hit the <span style={{ color: RED }}>road?</span></h2>
                    <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.7)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
                        Join thousands of smart riders in Bhubaneswar who choose roadMate for their daily commute and weekend trips.
                    </p>
                    <button 
                        onClick={() => window.location.href = "/"}
                        style={{ 
                            background: RED, 
                            color: "#fff", 
                            border: "none", 
                            padding: "20px 60px", 
                            borderRadius: "20px", 
                            fontSize: "18px", 
                            fontWeight: 800, 
                            cursor: "pointer",
                            boxShadow: `0 20px 40px rgba(190,13,13,0.3)`,
                            transition: "all 0.3s",
                            fontFamily: H
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(1)'; }}
                    >
                        Start Your Journey
                    </button>
                 </div>
             </div>

             <Footer />
        </div>
    );
};

export default About;
