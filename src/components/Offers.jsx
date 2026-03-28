import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const NAVY = "#0f172a"; // Premium Navy
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
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    gradient: "linear-gradient(145deg, #15803d 0%, #064e3b 100%)",
  },
  {
    id: 4,
    title: "LONG DRIVE",
    subtitle: "WEEKEND PASS",
    desc: "Flat 20% off on all weekend car rentals",
    color: "#4338ca",
    icon: (
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % offersData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const getPos = (i) => {
    const diff = (i - index + offersData.length) % offersData.length;
    if (diff === 0) return "active";
    if (diff === 1) return "right";
    if (diff === offersData.length - 1) return "left";
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
      x: "-70%", 
      scale: 0.8, 
      opacity: 0.5, 
      zIndex: 5, 
      rotateY: 25,
      filter: "blur(4px) brightness(0.8)",
    },
    right: { 
      x: "70%", 
      scale: 0.8, 
      opacity: 0.5, 
      zIndex: 5, 
      rotateY: -25,
      filter: "blur(4px) brightness(0.8)",
    },
    hidden: { 
      scale: 0.5, 
      opacity: 0, 
      zIndex: 0, 
      filter: "blur(10px) brightness(0)",
    },
  };

  return (
    <section 
      id="offers-slider"
      className="offers-slider-section" 
      style={{ 
        padding: "60px 20px 100px", 
        background: "#ffffff", 
        overflow: "visible", 
        position: "relative",
        zIndex: 10
      }}
    >
      <style>
        {`
          .off-tab:hover { background: rgba(15,23,42,0.1) !important; transform: translateY(-2px); }
          .off-active { box-shadow: 0 10px 25px rgba(190,13,13,0.3) !important; }
          .card-glass {
            position: absolute; top: 0; left: 0; right: 0; height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.1) 100%);
            pointer-events: none;
          }
        `}
      </style>

      {/* Tabs / Selection - Centered like mockup */}
      <div style={{ maxWidth: "1250px", margin: "0 auto", textAlign: "center", marginBottom: "60px" }}>
        <div style={{ display: "inline-flex", background: "rgba(15,23,42,0.04)", padding: "6px", borderRadius: "100px", gap: "6px" }}>
          {offersData.map((off, i) => (
            <button
              key={off.id}
              onClick={() => setIndex(i)}
              className={`off-tab ${index === i ? "off-active" : ""}`}
              style={{
                padding: "10px 24px",
                borderRadius: "100px",
                border: "none",
                background: index === i ? RED : "transparent",
                color: index === i ? "#fff" : "#111",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                fontFamily: H,
              }}
            >
              {off.subtitle}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Stack Carousel */}
      <div style={{ 
        position: "relative", 
        height: "500px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        perspective: "1200px" // Crucial for 3D rotation
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
                  width: "min(380px, 85vw)",
                  height: "540px", 
                  borderRadius: "40px",
                  background: off.gradient,
                  padding: "60px 40px",
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
                
                {/* Large Background SVG */}
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
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)",
                    width: "80px", height: "80px",
                    background: "rgba(15,23,42,0.8)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "11px", fontWeight: 900,
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
                      fontSize: "13px", 
                      fontWeight: 800, 
                      letterSpacing: "2.5px",
                      opacity: 0.8,
                      fontFamily: H,
                      display: "block",
                      marginBottom: "10px"
                    }}>
                      {off.subtitle}
                    </span>
                    
                    <h3 style={{ 
                      fontSize: "clamp(34px, 4vw, 48px)", 
                      fontWeight: 900, 
                      margin: "0 0 15px", 
                      fontFamily: H, 
                      lineHeight: 1,
                      letterSpacing: "-1px"
                    }}>
                      {off.title}
                    </h3>
                    
                    <p style={{ 
                      fontSize: "15px", 
                      fontWeight: 500, 
                      opacity: 0.7, 
                      fontFamily: F,
                      maxWidth: "240px",
                      lineHeight: 1.6
                    }}>
                      {off.desc}
                    </p>
                    
                    <button style={{ 
                      marginTop: "35px", 
                      padding: "16px 36px", 
                      borderRadius: "16px", 
                      background: "#fff", 
                      color: index === i ? "#000" : "#111", 
                      border: "none", 
                      fontWeight: 800, 
                      fontSize: "15px",
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div style={{
                  position: "absolute",
                  bottom: "-5%",
                  right: "-5%",
                  width: "180px",
                  height: "180px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "50%",
                  filter: "blur(60px)",
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
