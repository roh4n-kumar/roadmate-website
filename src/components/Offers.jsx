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
      opacity: 0.6, 
      zIndex: 7, 
      rotateY: 20,
      filter: "blur(4px) brightness(0.85)",
    },
    right: { 
      x: "55%", 
      scale: 0.85, 
      opacity: 0.6, 
      zIndex: 7, 
      rotateY: -20,
      filter: "blur(4px) brightness(0.85)",
    },
    farLeft: { 
      x: "-100%", 
      scale: 0.7, 
      opacity: 0.3, 
      zIndex: 5, 
      rotateY: 35,
      filter: "blur(8px) brightness(0.7)",
    },
    farRight: { 
      x: "100%", 
      scale: 0.7, 
      opacity: 0.3, 
      zIndex: 5, 
      rotateY: -35,
      filter: "blur(8px) brightness(0.7)",
    },
    hidden: { 
      scale: 0.5, 
      opacity: 0, 
      zIndex: 0, 
      filter: "blur(12px) brightness(0)",
    },
  };

  return (
    <section 
      id="offers-slider"
      className="offers-slider-section" 
      style={{ 
        padding: "100px 24px", // Matched with Home.jsx sections
        background: "#ffffff", 
        overflow: "visible", 
        position: "relative",
        zIndex: 10,
        maxWidth: "1250px",
        margin: "0 auto"
      }}
    >
      <style>
        {`
          .card-glass {
            position: absolute; top: 0; left: 0; right: 0; height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.1) 100%);
            pointer-events: none;
          }
          .view-all-btn {
            padding: 12px 24px; borderRadius: 12px; background: rgba(15,23,42,0.05);
            border: none; fontWeight: 700; cursor: pointer; transition: all 0.2s;
            fontFamily: ${F};
          }
          .view-all-btn:hover { background: rgba(15,23,42,0.1); transform: translateX(5px); }
        `}
      </style>

      {/* EXACT MATCHED HEADER FROM HOME.JSX (FEATURED FLEET SECTION) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px" }}>
        <div>
          <span style={{ 
            color: RED, 
            background: "rgba(190, 13, 13, 0.08)", // Exact matching Home.jsx transparency
            padding: "8px 20px", 
            borderRadius: "100px", 
            fontWeight: 800, 
            textTransform: "uppercase", 
            fontSize: "12px", 
            letterSpacing: "1.5px", // Exact match from Home.jsx inline style
            display: "inline-block",
            fontFamily: F
          }}>
            Offers For You
          </span>
          <h2 style={{ 
            fontSize: "clamp(32px, 4vw, 48px)", // Exact matching Home.jsx title clamp
            fontWeight: 900, 
            fontFamily: H, 
            color: "#0f172a", // Exact match for deep navy headings
            marginTop: "10px" 
          }}>
            Exclusive Deals
          </h2>
        </div>
        <button 
          onClick={() => navigate("/offers")} 
          className="view-all-btn"
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            background: "rgba(15,23,42,0.05)",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: F
          }}
        >
          View All Offers →
        </button>
      </div>

      {/* 5-Card 3D Stack Carousel */}
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
