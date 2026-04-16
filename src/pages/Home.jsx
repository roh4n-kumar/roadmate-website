import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Offers from "../components/Offers";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";


const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const Home = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check for validation errors from redirection
    const errorType = params.get("error");
    if (errorType) {
      const msgs = {
        both: "Please verify your mobile number and documents before booking.",
        phone: "Please verify your mobile number first.",
        docs: "Please verify your documents first.",
        expired: "Your Driving License has expired. Please update it in the verification tab to continue."
      };
      setToast(msgs[errorType] || "Verification required.");
      // Clear param
      window.history.replaceState({}, document.title, "/");
      setTimeout(() => setToast(""), 5000);
    }

    if (params.get("scroll") === "offers") {
      setTimeout(() => {
        const el = document.getElementById("offers-slider");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          // Optional: clear the query param after scrolling
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 800);
    } else {
      window.scrollTo(0, 0);
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Dynamic sync with Firestore 'vehicles' collection
    const q = query(
      collection(db, "vehicles"),
      limit(6)
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name,
          type: data.category,
          price: data.pricePerHour,
          image: data.image,
          rating: data.rating || 4.5
        };
      });
      setFeaturedVehicles(docs);
      setLoading(false);
    });

    return () => unsub();
  }, [location]);

  return (
    <div className="home-container" style={{ overflowX: "hidden", background: "#fff" }}>
      <style>
        {`
          body::-webkit-scrollbar { display: none !important; }
          body { -ms-overflow-style: none !important; scrollbar-width: none !important; margin: 0; padding: 0; }
          .v-card:hover .v-img { transform: scale(1.1); }
          
          /* FLEET OUTER CARD */
          .fleet-outer-card {
            max-width: 1250px;
            margin: 0 auto;
            background: #fff;
            border-radius: 24px;
            padding: 25px 0;
            box-shadow: 0 0 25px rgba(0,0,0,0.04);
            border: 1px solid #e0e0e0;
            overflow: hidden;
          }

          .fleet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 0 50px;
          }

          .fleet-scroll-grid {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 24px;
            padding: 10px 50px 30px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-snap-type: x mandatory;
            scroll-padding-left: 50px;
            -webkit-overflow-scrolling: touch;
          }
          .fleet-scroll-grid::-webkit-scrollbar { display: none; }
          .fleet-scroll-grid > * { flex-shrink: 0; width: 340px; scroll-snap-align: start; }

          .fleet-title-pill {
            color: ${RED};
            background: rgba(190, 13, 13, 0.08);
            padding: 8px 20px;
            border-radius: 100px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1.2px;
            display: inline-block;
            margin-bottom: 12px;
            font-family: ${H};
          }
          .fleet-main-heading {
            font-size: clamp(28px, 3.5vw, 36px);
            font-weight: 900;
            font-family: ${H};
            color: #111;
            margin: 0;
            line-height: 1.2;
          }
          @media (max-width: 900px) {
            .fleet-outer-card { margin: 0 16px !important; padding: 30px 0 !important; border-radius: 20px !important; }
            .fleet-header { padding: 0 20px !important; flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
            .fleet-scroll-grid { padding: 10px 20px 30px !important; scroll-padding-left: 20px !important; }
            .fleet-scroll-grid > * { width: 280px !important; }
            .fleet-main-heading { font-size: 28px !important; }
            
            .exp-section { padding: 60px 20px !important; }
            .exp-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
            .exp-image-box { height: 350px !important; border-radius: 24px !important; }
            .exp-btns { justify-content: center !important; }
          }
        `}
      </style>

      {/* Hero Section */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
        >
          <Hero isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
        </motion.div>
      </div>

      {/* OFFERS SECTION - Reordered between Ribbon and WhyChooseUs */}
      <Offers />

      {/* Trust & Process Sections */}
      <HowItWorks />
      <WhyChooseUs />

      {/* Featured Fleet (Offers Style) */}
      <section style={{ padding: "100px 24px 40px", maxWidth: "1350px", margin: "0 auto", position: 'relative', zIndex: 10 }}>
        <div className="fleet-outer-card">
          <div className="fleet-header">
            <div>
              <span className="fleet-title-pill">OUR PRIDE</span>
              <h2 className="fleet-main-heading">Featured Fleet</h2>
            </div>
            
            <button 
              onClick={() => navigate("/vehicles?type=all")} 
              style={{ 
                padding: '10px 20px', 
                fontSize: '12px', 
                background: 'rgba(190, 13, 13, 0.05)', 
                color: RED, 
                border: '1.5px solid rgba(190, 13, 13, 0.1)', 
                borderRadius: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: H,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(190, 13, 13, 0.1)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(190,13,13,0.1)";
                e.currentTarget.style.borderColor = "rgba(190, 13, 13, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(190, 13, 13, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(190, 13, 13, 0.1)";
              }}
            >
              View All Vehicles →
            </button>
          </div>

          <div style={{ height: '1.2px', background: '#e2e2e2', width: '100%', marginBottom: '20px' }} />

          <div className="fleet-scroll-grid">
            {loading ? (
              <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
                <div style={{ width: "30px", height: "30px", border: "3px solid #f0f0f0", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                <p style={{ color: "#64748b", fontWeight: 600 }}>Syncing with fleet...</p>
              </div>
            ) : featuredVehicles.length === 0 ? (
              <div style={{ textAlign: "center", width: "100%", padding: "40px", border: "1.5px dashed #f0f0f0", borderRadius: "24px" }}>
                <p style={{ color: "#64748b", fontWeight: 600 }}>No vehicles currently available.</p>
              </div>
            ) : (
              featuredVehicles.map((v, i) => (
                <motion.div
                  key={v.id}
                  className="v-card vcard-premium"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => navigate(`/vehicles?type=${v.type}`)}
                  style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", border: "1px solid #f1f5f9", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer", boxShadow: "0 6px 12px -2px rgba(0,0,0,0.08), 0 3px 6px -2px rgba(0,0,0,0.05)" }}
                >
                  <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                    <img src={v.image} alt={v.name} className="v-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                    <div style={{ position: "absolute", top: "15px", left: "15px", background: "#334155", color: "#fff", padding: "5px 12px", borderRadius: "8px", fontWeight: 800, fontSize: "10px", textTransform: "uppercase" }}>
                      {v.type}
                    </div>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, fontFamily: H }}>{v.name}</h3>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#fbbf24" }}>★ {v.rating}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>₹{v.price}</span>
                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>/hr</span>
                      </div>
                      <button 
                        className="rm-btn-premium" 
                        style={{ padding: '8px 16px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Experience / App Section */}
      <section className="exp-section" style={{ background: "#ffffff", padding: "40px 24px 100px", overflow: "hidden", position: "relative" }}>
        <div className="exp-grid" style={{ maxWidth: "1250px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", alignItems: "center" }}>
          <div>
            <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Next Gen Mobility</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, color: "#0f172a", marginTop: "15px", lineHeight: "1.1" }}>Your Journey, <br/>Our Responsibility</h2>
            <p style={{ color: "#64748b", fontSize: "18px", lineHeight: "1.7", marginTop: "25px", marginBottom: "40px" }}>
              Moving around the city hasn't been this easier. With RoadMate, you get a great experience at an affordable price. Zero paperwork, 100% verified rides.
            </p>
            <div className="exp-btns" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <button style={{ background: "#fff", color: "#000", padding: "18px 32px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", fontWeight: 800, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" style={{ height: "24px" }} />
              </button>
              <button style={{ background: "transparent", color: "#0f172a", padding: "18px 32px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontWeight: 800, fontSize: "16px", cursor: "pointer" }}>
                Explore More
              </button>
            </div>
          </div>
          <motion.div 
            className="v-card exp-image-box"
            style={{ position: "relative", background: "#fff", borderRadius: "40px", overflow: "hidden", border: "1.5px solid #f0f0f0", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
             <div style={{ width: "100%", height: "500px", overflow: "hidden", position: "relative" }}>
                <img src="/puri_marine_drive.jpg" alt="Puri Konark Marine Drive" className="v-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Network Map Section */}
      <MapSection />

      {/* FAQ Section */}
      <FAQSection />

      <Footer />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", bottom: "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 4000, padding: "0 20px" }}>
            <div style={{ 
              background: "#fff5f5", 
              color: RED, 
              padding: "16px 32px", 
              borderRadius: "16px", 
              fontSize: "14px", 
              fontWeight: "900", 
              border: `2px solid #feb2b2`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              fontFamily: H
            }}>
              <span style={{ fontSize: "20px" }}>⚠️</span> {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;