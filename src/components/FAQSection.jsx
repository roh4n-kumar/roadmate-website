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
    <section className="faq-section" style={{ padding: "80px 24px 40px", background: "#ffffff" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <style>{`
          @media (max-width: 900px) {
            .faq-section { padding: 40px 16px !important; }
            .faq-heading { font-size: 28px !important; }
            .faq-q-text { font-size: 16px !important; }
          }
        `}</style>
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Help Center</span>
          <h2 className="faq-heading" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, fontFamily: H, marginTop: "10px", color: "#0f172a", lineHeight: "1.2" }}>FAQs related to Vehicle Renting</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                borderBottom: "1.5px solid #f0f1f3", 
                transition: "all 0.3s ease",
              }}
            >
              <button 
                onClick={() => setActive(active === i ? null : i)}
                style={{ 
                  width: "100%", 
                  padding: "20px 0", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span className="faq-q-text" style={{ fontSize: "18px", fontWeight: 700, color: active === i ? RED : "#0f172a", fontFamily: H, transition: "color 0.3s ease" }}>{faq.q}</span>
                <div style={{ 
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: active === i ? "rotate(180deg)" : "rotate(0deg)",
                    color: active === i ? RED : "#94a3b8"
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div style={{ padding: "0 0 30px", color: "#64748b", fontSize: "16px", lineHeight: "1.8", maxWidth: "900px" }}>
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
