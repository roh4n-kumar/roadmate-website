import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const BLUE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const IconCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Pricing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState("hourly"); // "hourly" | "daily"

    const pricingData = [
        {
            id: 1,
            title: "Commuter Bikes",
            desc: "Ideal for daily travel and high mileage.",
            hourly: 30,
            daily: 300,
            features: [
                "2 Helmets Included",
                "Third-party Insurance",
                "No Security Deposit",
                "Roadside Assistance"
            ],
            type: "bike",
            highlight: false
        },
        {
            id: 2,
            title: "Premium Sedans",
            desc: "Experience luxury and comfort on long trips.",
            hourly: 150,
            daily: 1400,
            features: [
                "Zero Cancellation Fee",
                "Full Insurance Cover",
                "Air Conditioned",
                "Free Airport Delivery"
            ],
            type: "car",
            highlight: true
        },
        {
            id: 3,
            title: "Sports Bikes",
            desc: "For the thrill-seekers and weekend rides.",
            hourly: 80,
            daily: 800,
            features: [
                "1 Premium Helmet",
                "Performance Tuned",
                "Comprehensive Insurance",
                "Priority Support"
            ],
            type: "bike",
            highlight: false
        }
    ];

    return (
        <div style={{ background: "#f8f9fa", fontFamily: F, color: "#111", minHeight: "100vh", overflowX: "hidden" }}>
            <style>{`
                .pricing-card {
                    background: #fff;
                    border: 1.5px solid rgba(0,0,0,0.05);
                    border-radius: 32px;
                    padding: 50px 40px;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                }
                .pricing-card.highlight {
                    border-color: ${RED}33;
                    box-shadow: 0 30px 60px rgba(190, 13, 13, 0.1);
                    transform: translateY(-15px);
                }
                .pricing-card:not(.highlight):hover {
                    border-color: rgba(0,0,0,0.1);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                    transform: translateY(-5px);
                }
                
                .billing-toggle {
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.1);
                    padding: 6px;
                    border-radius: 99px;
                    margin: 0 auto;
                    width: fit-content;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .toggle-btn {
                    padding: 12px 30px;
                    border-radius: 99px;
                    font-size: 15px;
                    font-weight: 800;
                    font-family: ${H};
                    cursor: pointer;
                    transition: all 0.3s;
                    border: none;
                }
                .toggle-btn.active {
                    background: #fff;
                    color: ${BLUE};
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .toggle-btn.inactive {
                    background: transparent;
                    color: rgba(255,255,255,0.7);
                }
            `}</style>

            {/* HERO SECTION */}
            <section style={{ 
                padding: "120px 40px 30px", 
                background: "#000000", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                
                <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ 
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
                        }}
                    >
                        Transparent Pricing
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ 
                            fontSize: "56px", 
                            fontWeight: 900, 
                            fontFamily: H, 
                            marginBottom: "20px", 
                            letterSpacing: "-1.5px",
                            lineHeight: 1.1
                        }}
                    >
                        Flexible Plans for <span style={{ color: RED }}>Every Ride</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ 
                            fontSize: "18px", 
                            color: "rgba(255,255,255,0.7)", 
                            lineHeight: 1.6, 
                            maxWidth: "600px", 
                            margin: "0 auto 40px" 
                        }}
                    >
                        Whether you need a quick run across town or a weekend getaway, we have the perfect pricing for your journey. No hidden fees.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="billing-toggle"
                    >
                        <button 
                            className={`toggle-btn ${billingCycle === "hourly" ? "active" : "inactive"}`}
                            onClick={() => setBillingCycle("hourly")}
                        >
                            Hourly Billing
                        </button>
                        <button 
                            className={`toggle-btn ${billingCycle === "daily" ? "active" : "inactive"}`}
                            onClick={() => setBillingCycle("daily")}
                        >
                            Daily Billing <span style={{ background: RED, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", marginLeft: "6px", verticalAlign: "middle" }}>SAVE 20%</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* PRICING CARDS */}
            <section style={{ padding: "40px 24px 120px", maxWidth: "1250px", margin: "-20px auto 0", position: "relative", zIndex: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
                    {pricingData.map((plan, i) => (
                        <motion.div 
                            key={plan.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}
                        >
                            {plan.highlight && (
                                <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: RED, color: "#fff", padding: "6px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", boxShadow: `0 10px 20px ${RED}44` }}>
                                    Most Popular
                                </div>
                            )}
                            
                            <h3 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, marginBottom: "15px", color: BLUE }}>{plan.title}</h3>
                            <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "30px", lineHeight: "1.6" }}>{plan.desc}</p>
                            
                            <div style={{ marginBottom: "40px" }}>
                                <span style={{ fontSize: "52px", fontWeight: 900, fontFamily: H, color: BLUE, letterSpacing: "-2px" }}>
                                    ₹{billingCycle === "hourly" ? plan.hourly : plan.daily}
                                </span>
                                <span style={{ fontSize: "16px", color: "#64748b", fontWeight: 600 }}>
                                    /{billingCycle === "hourly" ? "hour" : "day"}
                                </span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "40px" }}>
                                {plan.features.map((feat, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `${RED}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <IconCheck />
                                        </div>
                                        <span style={{ fontSize: "15px", fontWeight: 600, color: "#334155" }}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => navigate(`/vehicles?type=${plan.type}`)}
                                style={{ 
                                    width: "100%", 
                                    padding: "20px", 
                                    borderRadius: "18px", 
                                    border: plan.highlight ? "none" : `1.5px solid ${BLUE}`, 
                                    background: plan.highlight ? RED : "transparent", 
                                    color: plan.highlight ? "#fff" : BLUE, 
                                    fontWeight: 800, 
                                    fontSize: "16px",
                                    fontFamily: H,
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                    boxShadow: plan.highlight ? `0 15px 30px ${RED}33` : "none"
                                }}
                                onMouseEnter={(e) => {
                                    if(!plan.highlight) {
                                        e.target.style.background = BLUE;
                                        e.target.style.color = "#fff";
                                    } else {
                                        e.target.style.transform = "translateY(-3px)";
                                        e.target.style.boxShadow = `0 20px 40px ${RED}55`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if(!plan.highlight) {
                                        e.target.style.background = "transparent";
                                        e.target.style.color = BLUE;
                                    } else {
                                        e.target.style.transform = "translateY(0)";
                                        e.target.style.boxShadow = `0 15px 30px ${RED}33`;
                                    }
                                }}
                            >
                                View {plan.title}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ BANNER OR TRUST SECTION */}
            <section style={{ padding: "80px 24px", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ fontSize: "36px", fontWeight: 900, fontFamily: H, marginBottom: "20px", color: BLUE }}>Have questions about pricing?</h2>
                    <p style={{ fontSize: "18px", color: "#64748b", marginBottom: "40px" }}>Our transparent pricing policy ensures you never pay more than you should.</p>
                    <button 
                        onClick={() => navigate("/contact")}
                        style={{ padding: "16px 40px", borderRadius: "16px", background: "#f8f9fa", border: "1.5px solid #e2e8f0", color: BLUE, fontWeight: 800, fontSize: "16px", cursor: "pointer", fontFamily: H }}
                    >
                        Contact Support
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Pricing;
