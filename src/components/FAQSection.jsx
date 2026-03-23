import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

const FAQS = [
  {
    q: "Abhi booking ke liye kaunse documents chahiye?",
    a: "Aapko bas apna valid Driving License aur ek ID proof (Aadhar Card/Voter ID) dikhana hoga. Hum zero paperwork system follow karte hain!"
  },
  {
    q: "Pricing kaise calculate hoti hai?",
    a: "Humari pricing minute-by-minute accurate hai. Jitna samay aap gadi rakhenge, sirf utne ka hi charge lagega. Koi chhupa hua charge nahi hai."
  },
  {
    q: "Kya main apni booking extend kar sakta hun?",
    a: "Haan, bilkul! Agar gadi agle slot ke liye khali hai, toh aap admin panel ya call karke easily apni booking extend kar sakte hain."
  },
  {
    q: "Gadi kharab hone par kya hoga?",
    a: "RoadMate Garage network pure sheher mein faila hua hai. Kuch bhi problem hone par humari team turant aapki madad ke liye pahunchegi."
  },
  {
    q: "Security deposit ka kya system hai?",
    a: "Hum minimum security deposit lete hain jo gadi wapas karne ke turant baad aapke account mein refund ho jata hai."
  }
];

const FAQSection = () => {
  const [active, setActive] = useState(null);

  return (
    <section style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Help Center</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, marginTop: "15px", color: "#0f172a" }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                border: "1.5px solid #f0f0f0", 
                borderRadius: "20px", 
                overflow: "hidden", 
                transition: "all 0.3s ease",
                background: active === i ? "#fafafa" : "#fff"
              }}
            >
              <button 
                onClick={() => setActive(active === i ? null : i)}
                style={{ 
                  width: "100%", 
                  padding: "24px 30px", 
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
                <span style={{ 
                  fontSize: "24px", 
                  color: active === i ? RED : "#cbd5e1",
                  transition: "transform 0.3s ease",
                  transform: active === i ? "rotate(45deg)" : "rotate(0deg)"
                }}>+</span>
              </button>
              
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ padding: "0 30px 30px", color: "#64748b", fontSize: "16px", lineHeight: "1.6" }}>
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
