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

    const values = [
        { icon: <IconMission />, title: "Innovation", desc: "We are committed to redefining urban mobility by leveraging technology to solve real-world transit challenges." },
        { icon: <IconSafety />, title: "Integrity", desc: "Trust is our foundation. We maintain the highest standards of transparency and reliability in every interaction." },
        { icon: <IconAccess />, title: "Customer Centricity", desc: "Our riders are at the heart of roadMate. We design every feature and service to ensure a seamless user experience." },
        { icon: <IconCommunity />, title: "Shared Value", desc: "We grow together. By empowering local partners and riders, we create a sustainable ecosystem for urban transit." }
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
                padding: "120px 24px 60px", 
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
             <section style={{ padding: "0 24px", width: "100%" }}>
                <div style={{ padding: "40px 0 80px", maxWidth: "1250px", margin: "0 auto", textAlign: "left" }}>
                    {/* ABOUT US */}
                    <div className="animate-box">
                        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            About Us
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
                        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Our Mission
                        </h2>
                        <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "40px", textAlign: "justify" }}>
                            At roadMate, our mission is to redefine the landscape of urban mobility through a localized, high-fidelity lens. We believe that everyone deserves the freedom to move without boundaries, regardless of their destination or duration. By combining cutting-edge technology with a customer-first approach, we are building a seamless rental experience that is as instinctive as it is reliable. Our journey begins in Bhubaneswar, where we aim to set a new benchmark for trust, cleanliness, and accessibility, eventually scaling this vision to empower explorers across the nation. Through transparent pricing, verified fleets, and 24/7 support, we are turning transit into a frictionless experience, one ride at a time. We strive to not just provide a service but to become an integral part of your daily life, ensuring that every time you need to move, roadMate is your most trusted companion, making the complex simple and the impossible attainable.
                        </p>
                    </div>

                    {/* MANAGEMENT TEAM SECTION */}
                    <div className="animate-box delay-1">
                        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "30px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Our Leaders
                        </h2>
                        
                        <div style={{ display: "flex", gap: "30px", marginBottom: "40px", alignItems: "flex-start" }}>
                            <div style={{ width: "250px", height: "250px", borderRadius: "0", background: "#f0f0f0", flexShrink: 0, overflow: 'hidden', border: "none" }}>
                                <img src="/founder_ceo.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} alt="Founder & CEO" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "20px", fontWeight: 900, fontFamily: H, marginTop: "8px", marginBottom: "2px", color: "#000", lineHeight: 1.1 }}>
                                    Rohan Chaudhary
                                </h3>
                                <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: H, color: RED, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Founder & CEO
                                </div>
                                <p style={{ fontSize: "15.5px", color: "#4a4a4a", lineHeight: 1.7, textAlign: "justify" }}>
                                    Rohan Chaudhary is the visionary behind roadMate. A B.Tech student with a Computer Science background, he founded roadMate with a deep passion for improving urban mobility. The spark for roadMate came when Rohan personally struggled to rent a bike in Bhubaneswar—facing endless paperwork, poorly maintained vehicles, and a lack of transparency. This frustrating experience stayed with him, leading to the observation that local transport needed a trust-driven, tech-first solution. His goal is to bridge this gap by transforming the rental experience into a seamless, reliable journey for every rider.
                                </p>
                                <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                                    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "#000", color: "#fff", transition: "all 0.3s ease" }} 
                                       onMouseOver={e => { e.currentTarget.style.background = "#0077b5"; }} 
                                       onMouseOut={e => { e.currentTarget.style.background = "#000"; }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                    </a>
                                    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "#000", color: "#fff", transition: "all 0.3s ease" }} 
                                       onMouseOver={e => { e.currentTarget.style.background = RED; }} 
                                       onMouseOut={e => { e.currentTarget.style.background = "#000"; }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
                            <div style={{ width: "250px", height: "250px", borderRadius: "0", background: "#f0f0f0", flexShrink: 0, overflow: 'hidden', border: "none" }}>
                            <img src="/co_founder.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} alt="Co-Founder" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "20px", fontWeight: 900, fontFamily: H, marginTop: "8px", marginBottom: "2px", color: "#000", lineHeight: 1.1 }}>
                                    Ankit Gupta
                                </h3>
                                <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: H, color: RED, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Co-Founder
                                </div>
                                <p style={{ fontSize: "15.5px", color: "#4a4a4a", lineHeight: 1.7, textAlign: "justify" }}>
                                    Ankit Gupta is the Co-Founder of roadMate and has been an integral part of the journey since its very inception. A B.Tech student with an Electrical and Computer Science background, he has worked side-by-side with Rohan from day one, turning a shared vision into a functional reality. Ankit’s technical dedication and hands-on approach have been crucial in building the platform's foundation, navigating early obstacles to ensure ultimate reliability. His strategic insight continues to drive roadMate's mission forward, aiming to redefine transit into a frictionless experience across the city.
                                </p>
                                <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                                    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "#000", color: "#fff", transition: "all 0.3s ease" }} 
                                       onMouseOver={e => { e.currentTarget.style.background = "#0077b5"; }} 
                                       onMouseOut={e => { e.currentTarget.style.background = "#000"; }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                    </a>
                                    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "#000", color: "#fff", transition: "all 0.3s ease" }} 
                                       onMouseOver={e => { e.currentTarget.style.background = RED; }} 
                                       onMouseOut={e => { e.currentTarget.style.background = "#000"; }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    {/* VISION */}
                    <div className="animate-box">
                        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Our Vision
                        </h2>
                        <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "40px", textAlign: "justify" }}>
                            To become the pulse of urban mobility, transforming every commute into a seamless, reliable, and empowering journey for everyone. By pioneering a trust-driven travel ecosystem in Bhubaneswar and beyond, we envision a future where accessibility is effortless and every traveler moves with confidence and pride.
                        </p>
                    </div>

                    {/* VALUES */}
                    <div className="animate-box">
                        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Our Values
                        </h2>
                        <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "40px", textAlign: "justify" }}>
                            Our core values are the heartbeat of everything we do at roadMate. We are driven by Innovation, constantly leveraging technology to solve real-world urban mobility challenges and redefine the transit experience for a modern audience. Integrity is our foundation; we uphold the highest standards of transparency, safety, and reliability in every interaction we have with our riders and partners. We are obsessively Customer Centric, designing every feature to ensure a seamless, empowering, and reliable journey that puts the rider's needs first. Finally, we believe in Shared Value, growing together with our local communities and partners to build a sustainable, thriving ecosystem for urban transit that benefits everyone involved.
                        </p>
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
