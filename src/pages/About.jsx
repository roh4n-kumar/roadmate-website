// src/pages/About.jsx
import React, { useEffect } from "react";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const BLUE = "#0f172a";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        { icon: "🌍", title: "Our Mission", desc: "To revolutionize local transport by making vehicle rentals as simple as checking your phone. We're starting in Bhubaneswar to empower every traveler with freedom and accessibility." },
        { icon: "🛡️", title: "Trust & Safety", desc: "Every vehicle on RoadMate undergoes a rigorous 50-point inspection. We partner with local experts to ensure your ride is safe, clean, and reliable." },
        { icon: "⚡", title: "Instant Access", desc: "No more long queues or endless paperwork. Our digital-first approach means you can go from browsing to riding in under 2 minutes." },
        { icon: "🤝", title: "Community First", desc: "RoadMate isn't just a rental service; it's a community. We believe in providing value to both our riders and our local partners." }
    ];

    const steps = [
        { num: "01", title: "Search", desc: "Find the perfect bike or car for your needs." },
        { num: "02", title: "Book", desc: "Confirm your dates and pay securely online." },
        { num: "03", title: "Ride", desc: "Pick up your keys and enjoy your journey!" }
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
                padding: "120px 40px 70px", 
                background: "linear-gradient(180deg, #111 0%, #0f172a 100%)", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
             }}>
                <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "60%", height: "200%", background: `radial-gradient(circle, ${RED}11 0%, transparent 70%)`, pointerEvents: "none" }} />
                
                <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <div className="animate-box" style={{ 
                        display: "inline-block", 
                        background: `${RED}22`, 
                        color: RED, 
                        fontSize: "14px", 
                        fontWeight: 900, 
                        textTransform: "uppercase", 
                        letterSpacing: "3px", 
                        padding: "10px 24px", 
                        borderRadius: "99px", 
                        marginBottom: "30px",
                        border: `1px solid ${RED}33`
                    }}>
                        Discover RoadMate
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
                        fontSize: "18px", 
                        color: "rgba(255,255,255,0.7)", 
                        lineHeight: 1.6, 
                        maxWidth: "600px", 
                        margin: "0 auto 30px" 
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
                        RoadMate was born from a simple yet powerful observation: the freedom of movement shouldn't be a luxury or a bureaucratic hurdle. In a fast-evolving city like Bhubaneswar, we noticed that while the need for local travel was growing, the means to access reliable, clean, and well-maintained vehicles remained surprisingly difficult. Whether you are a student striving for a better commute, a professional navigating a busy schedule, or a traveler eager to explore the hidden joys of Odisha, RoadMate is here to ensure that your journey starts on the right note.
                    </p>
                    <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "40px", textAlign: "justify" }}>
                        We didn't just want to build a rental service; we wanted to create a travel ecosystem where convenience meets trust. Our platform bridges the gap between high-quality local vehicles and the modern rider who values efficiency, fair pricing, and absolute transparency. We are committed to empowering every individual with the freedom they deserve, making every trip—whether it's a few miles or a few hundred—a memory to cherish. At RoadMate, your journey is our pride, and your satisfaction is our mission.
                    </p>
                 </div>

                 {/* MANAGEMENT TEAM SECTION */}
                 <div className="animate-box delay-1">
                    <h2 style={{ fontSize: "22px", fontWeight: 800, fontFamily: H, marginBottom: "30px" }}>
                        <span style={{ color: BLUE }}>Management</span> <span style={{ color: RED }}>Team</span>
                    </h2>
                    
                    <div style={{ display: "flex", gap: "30px", marginBottom: "40px", alignItems: "flex-start" }}>
                        <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#f0f0f0", flexShrink: 0, overflow: 'hidden', border: "4px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                            <img src="/Founder & CEO.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Founder & CEO" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "19px", fontWeight: 800, fontFamily: H, marginBottom: "8px" }}>
                                <span style={{ color: BLUE }}>Rohan Chaudhary</span>, <span style={{ color: RED }}>Founder & CEO</span>
                            </h3>
                            <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, textAlign: "justify" }}>
                                Rohan Chaudhary is the visionary behind RoadMate. With a deep passion for improving urban mobility and a background in strategic development, he founded RoadMate to bridge the gap in Bhubaneswar's local transport. He is dedicated to transforming the rental experience into a seamless, trust-driven journey for every rider.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
                        <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#f0f0f0", flexShrink: 0, overflow: 'hidden', border: "4px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                           <img src="/Co-Founder.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Co-Founder" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "19px", fontWeight: 800, fontFamily: H, marginBottom: "8px" }}>
                                <span style={{ color: BLUE }}>Ankit Gupta</span>, <span style={{ color: RED }}>Co-Founder</span>
                            </h3>
                            <p style={{ fontSize: "14px", color: "#4a4a4a", lineHeight: 1.7, textAlign: "justify" }}>
                                Ankit Gupta is the Co-Founder of RoadMate and has been an integral part of the journey since its very inception. Working side-by-side with Rohan from day one, his dedication and strategic insight have been crucial in building the foundation of RoadMate. He continues to drive our mission forward with a shared vision of transforming urban mobility.
                            </p>
                        </div>
                    </div>
                 </div>
             </div>

             {/* FEATURE GRID */}
             <div style={{ padding: "80px 40px", background: "#f8f9fa" }}>
                 <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "70px" }}>
                         <h2 style={{ fontSize: "42px", fontWeight: 900, fontFamily: H }}>The RoadMate <span style={{ color: RED }}>Difference</span></h2>
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
             </div>

             {/* HOW IT WORKS */}
             <div style={{ padding: "100px 40px" }}>
                <div style={{ maxWidth: "1250px", margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "42px", fontWeight: 900, fontFamily: H, marginBottom: "70px" }}>Experience the <span style={{ color: RED }}>Ease</span></h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", position: "relative" }}>
                        {steps.map((s, i) => (
                            <div key={i} className="animate-box" style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "80px", fontWeight: 900, color: "#f0f0f0", marginBottom: "-40px", position: "relative", zIndex: 1 }}>{s.num}</div>
                                <div style={{ position: "relative", zIndex: 2 }}>
                                    <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "15px", fontFamily: H }}>{s.title}</h3>
                                    <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* CTA */}
             <div style={{ padding: "100px 40px" }}>
                 <div style={{ 
                    maxWidth: "1250px", 
                    margin: "0 auto", 
                    background: "linear-gradient(135deg, #111 0%, #0f172a 100%)", 
                    borderRadius: "40px", 
                    padding: "80px 40px", 
                    textAlign: "center",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden"
                 }}>
                    <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "40%", height: "100%", background: `radial-gradient(circle, ${RED}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                    <h2 style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "30px", letterSpacing: "-1px" }}>Ready to hit the <span style={{ color: RED }}>road?</span></h2>
                    <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.7)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
                        Join thousands of smart riders in Bhubaneswar who choose RoadMate for their daily commute and weekend trips.
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
