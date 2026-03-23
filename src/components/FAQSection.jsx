import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

const FAQS = [
  {
    q: "What documents are required for booking?",
    a: "You only need a valid Driving License and a secondary ID proof (such as an Aadhar Card or Voter ID). We follow a 100% digital, zero-paperwork process for your convenience."
  },
  {
    q: "How is the rental price calculated?",
    a: "Our pricing is remarkably accurate, calculated minute-by-minute. You are charged only for the exact duration the vehicle is with you, ensuring no unfair rounding up or hidden costs."
  },
  {
    q: "Can I extend my booking during the trip?",
    a: "Yes, extensions are seamless! If the vehicle is available for the next slot, you can easily extend your trip through the website or by calling our support team."
  },
  {
    q: "What happens if the vehicle breaks down?",
    a: "With our extensive network of RoadMate Garages spread across the city, help is never far away. In case of any technical issues, our roadside assistance team will reach you immediately."
  },
  {
    q: "How does the security deposit refund work?",
    a: "We collect a minimal security deposit which is automatically initiated for refund as soon as you return the vehicle in its original condition. The amount typically reflects in your account within 24-48 business hours."
  }
];

const FAQSection = () => {
  const [active, setActive] = useState(null);

  return (
    <section style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Help Center</span>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, fontFamily: H, marginTop: "15px", color: "#0f172a", lineHeight: "1.2" }}>FAQs related to Vehicle Renting</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                border: "1.5px solid #f1f5f9", 
                borderRadius: "24px", 
                overflow: "hidden", 
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                background: active === i ? "#fafafa" : "#fff",
                boxShadow: active === i ? "0 10px 30px rgba(0,0,0,0.03)" : "none"
              }}
            >
              <button 
                onClick={() => setActive(active === i ? null : i)}
                style={{ 
                  width: "100%", 
                  padding: "26px 34px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", fontFamily: H }}>{faq.q}</span>
                <div style={{ 
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: active === i ? "rotate(180deg)" : "rotate(0deg)",
                    color: active === i ? RED : "#94a3b8"
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </div>
              </button>
              
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div style={{ padding: "0 34px 30px", color: "rgba(100, 116, 139, 0.9)", fontSize: "16px", lineHeight: "1.7" }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
