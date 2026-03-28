import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RED = "#be0d0d";
const NAVY = "#0f172a"; 
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const offersData = [
  {
    id: 1,
    title: "50% OFF",
    subtitle: "WELCOME OFFER",
    desc: "Use code: FIRST50 at checkout",
    color: RED,
    icon: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      </svg>
    ),
    gradient: `linear-gradient(145deg, ${RED} 0%, #7f0b0b 100%)`,
  },
  {
    id: 2,
    title: "NO DEPOSIT",
    subtitle: "ZERO BURDEN",
    desc: "Ride with trust — No hidden security deposits",
    color: "#1e40af",
    icon: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #1e40af 0%, #172554 100%)",
  },
  {
    id: 3,
    title: "REFER ₹500",
    subtitle: "SHARE & EARN",
    desc: "Earn wallet credits for every friend joined",
    color: "#15803d",
    icon: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #15803d 0%, #064e3b 100%)",
  },
  {
    id: 4,
    title: "FREE RIDE",
    subtitle: "NEW MILESTONE",
    desc: "Complete 10 rides to get your 11th free",
    color: "#7c3aed",
    icon: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #7c3aed 0%, #4c1d95 100%)",
  },
  {
    id: 5,
    title: "LONG DRIVE",
    subtitle: "WEEKEND PASS",
    desc: "Flat 20% off on all weekend car rentals",
    color: "#4338ca",
    icon: (
      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20M2 17h20" />
        <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #4338ca 0%, #312e81 100%)",
  }
];

const Offers = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % offersData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const getPos = (i) => {
    const len = offersData.length;
    const diff = (i - index + len) % len;
    
    if (diff === 0) return "active";
    if (diff === 1) return "right";
    if (diff === 2) return "farRight";
    if (diff === len - 2) return "farLeft";
    if (diff === len - 1) return "left";
    return "hidden";
  };

  const variants = {
    active: { 
      x: 0, 
      scale: 1, 
      opacity: 1, 
      zIndex: 10,
      rotateY: 0,
      filter: "blur(0px) brightness(1)",
    },
    left: { 
      x: "-55%", 
      scale: 0.85, 
      opacity: 1, 
      zIndex: 7, 
      rotateY: 0,
      filter: "blur(4px) saturate(0.8) brightness(0.9)",
    },
    right: { 
      x: "55%", 
      scale: 0.85, 
      opacity: 1, 
      zIndex: 7, 
      rotateY: 0,
      filter: "blur(4px) saturate(0.8) brightness(0.9)",
    },
    farLeft: { 
      x: "-100%", 
      scale: 0.7, 
      opacity: 1, 
      zIndex: 5, 
      rotateY: 0,
      filter: "blur(12px) saturate(0.5) brightness(0.8)",
    },
    farRight: { 
      x: "100%", 
      scale: 0.7, 
      opacity: 1, 
      zIndex: 5, 
      rotateY: 0,
      filter: "blur(12px) saturate(0.5) brightness(0.8)",
    },
    hidden: { 
      scale: 0.5, 
      opacity: 0, 
      zIndex: 0, 
      filter: "blur(20px) brightness(0)",
    },
  };

  return (
    <section 
      id="offers-slider" 
      className="offers-slider-section"
      style={{ 
        padding: "100px 24px", 
        maxWidth: "1250px", 
        margin: "0 auto", 
        position: "relative", 
        overflow: "visible", 
        zIndex: 10 
      }}
    >
      {/* 5-Card 3D Stack Carousel */}
      <style>
        {`
          .offers-slider-section {
            background-color: #ffffff;
            /* Stitch-Inspired Premium Automotive Doodle Pattern */
            /* High-fidelity thin lines, luxury vehicle silhouettes, and journey paths */
            background-image: url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23be0d0d' stroke-opacity='0.04' stroke-width='0.8' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Luxury Car --%3E%3Cpath d='M20 180h40l8-12h60l8 12h40v-20l-20-20h-100l-20 20v20z' /%3E%3Ccircle cx='45' cy='185' r='6' /%3E%3Ccircle cx='125' cy='185' r='6' /%3E%3C!-- Sport Bike --%3E%3Ccircle cx='180' cy='60' r='10' /%3E%3Ccircle cx='220' cy='60' r='10' /%3E%3Cpath d='M180 60l15-20h15l10 20' /%3E%3Cpath d='M195 40l5-10h10' /%3E%3C!-- Winding Travel Paths (Curly) --%3E%3Cpath d='M30 150c30-60 90-20 120-100' stroke-dasharray='4,8' /%3E%3Cpath d='M210 100c-40 50-80 10-140 80' stroke-dasharray='4,8' /%3E%3Cpath d='M50 40c60 20 20 80 150 120' stroke-dasharray='4,8' /%3E%3C!-- Decorative Arrows --%3E%3Cpolyline points='145 55 150 50 145 45' /%3E%3Cpolyline points='75 175 70 180 75 185' /%3E%3C!-- Map Pins --%3E%3Cpath d='M110 30c0 8-8 16-8 16s-8-8-8-16a8 8 0 1 1 16 0z' /%3E%3Ccircle cx='102' cy='30' r='2' /%3E%3Cpath d='M40 90c0 8-8 16-8 16s-8-8-8-16a8 8 0 1 1 16 0z' /%3E%3C/g%3E%3C/svg%3E");
          }
          .card-glass {
            position: absolute; top: 0; left: 0; right: 0; height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.1) 100%);
            pointer-events: none;
          }
        `}
      </style>

      {/* HEADER SECTION - 100% IDENTICAL TO USER SNIPPET */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px" }}>
        <div>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Offers For You</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, marginTop: "10px" }}>Exclusive Deals</h2>
        </div>
        <button onClick={() => navigate("/offers")} style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(15,23,42,0.05)", border: "none", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          View All Offers →
        </button>
      </div>

      <div style={{ 
        position: "relative", 
        height: "440px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        perspective: "1500px", 
        margin: "0 auto",
        width: "100%"
      }}>
        <AnimatePresence mode="popLayout">
          {offersData.map((off, i) => {
            const pos = getPos(i);
            if (pos === "hidden") return null;

            return (
              <motion.div
                key={off.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={variants[pos]}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  width: "min(340px, 80vw)",
                  height: "420px", 
                  borderRadius: "36px",
                  background: off.gradient,
                  padding: "45px 35px",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end", 
                  boxShadow: pos === "active" ? "0 40px 100px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.1)",
                  cursor: pos === "active" ? "default" : "pointer",
                  overflow: "hidden"
                }}
                onClick={() => pos !== "active" && setIndex(i)}
              >
                <div className="card-glass" />
                
                {/* Background Icon */}
                <div style={{ 
                  position: "absolute", 
                  top: "10%", 
                  left: "50%", 
                  transform: "translateX(-50%)",
                  opacity: 0.15,
                  color: "#fff",
                }}>
                  {off.icon}
                </div>

                {pos === "active" && (
                   <div style={{ 
                    position: "absolute", 
                    top: "45%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)",
                    width: "70px", height: "70px",
                    background: "rgba(15,23,42,0.8)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "10px", fontWeight: 900,
                    letterSpacing: "1.5px", border: "1.5px solid rgba(255,255,255,0.2)",
                    zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                  }}>
                    <div style={{ textAlign: "center" }}>
                      ‹ DRAG ›
                    </div>
                  </div>
                )}
                
                <div style={{ position: "relative", zIndex: 10 }}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span style={{ 
                      fontSize: "12px", 
                      fontWeight: 800, 
                      letterSpacing: "2px",
                      opacity: 0.8,
                      fontFamily: H,
                      display: "block",
                      marginBottom: "8px"
                    }}>
                      {off.subtitle}
                    </span>
                    
                    <h3 style={{ 
                      fontSize: "clamp(32px, 3.5vw, 44px)", 
                      fontWeight: 900, 
                      margin: "0 0 12px", 
                      fontFamily: H, 
                      lineHeight: 1,
                      letterSpacing: "-0.5px"
                    }}>
                      {off.title}
                    </h3>
                    
                    <p style={{ 
                      fontSize: "14px", 
                      fontWeight: 500, 
                      opacity: 0.7, 
                      fontFamily: F,
                      maxWidth: "220px",
                      lineHeight: 1.5,
                      marginBottom: "20px"
                    }}>
                      {off.desc}
                    </p>
                    
                    <button style={{ 
                      marginTop: "10px", 
                      padding: "14px 30px", 
                      borderRadius: "14px", 
                      background: "#fff", 
                      color: index === i ? "#000" : "#111", 
                      border: "none", 
                      fontWeight: 800, 
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontFamily: H,
                      transition: "transform 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      Claim Now 
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div style={{
                  position: "absolute",
                  bottom: "-5%",
                  right: "-5%",
                  width: "140px",
                  height: "140px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "50%",
                  filter: "blur(50px)",
                  zIndex: 1
                }} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Offers;
