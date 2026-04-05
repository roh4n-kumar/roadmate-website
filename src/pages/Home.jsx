import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, limit, onSnapshot } from "firebase/firestore";
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const Home = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
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
          .v-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
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

      {/* Featured Fleet */}
      <section style={{ padding: "100px 24px", maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px" }}>
          <div>
            <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Our Pride</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, marginTop: "10px" }}>Featured Fleet</h2>
          </div>
          <button onClick={() => navigate("/vehicles?type=all")} style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(15,23,42,0.05)", border: "none", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
            View All Vehicles →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
          {loading ? (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
              <div style={{ width: "30px", height: "30px", border: "3px solid #f0f0f0", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#64748b", fontWeight: 600 }}>Syncing with fleet...</p>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px", border: "1.5px dashed #f0f0f0", borderRadius: "24px" }}>
              <p style={{ color: "#64748b", fontWeight: 600 }}>No vehicles currently available for booking.</p>
            </div>
          ) : (
            featuredVehicles.map((v, i) => (
              <motion.div
                key={v.id}
                className="v-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/vehicles?type=${v.type}`)}
                style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", border: "1.5px solid #f0f0f0", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer" }}
              >
                <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                  <img src={v.image} alt={v.name} className="v-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                  <div style={{ position: "absolute", top: "15px", left: "15px", background: "#fff", padding: "6px 14px", borderRadius: "10px", fontWeight: 800, fontSize: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
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
                    <button style={{ padding: "10px 18px", borderRadius: "10px", background: RED, color: "#fff", border: "none", fontWeight: 700, fontSize: "14px", transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer", boxShadow: "0 8px 20px rgba(190,13,13,0.3)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(190,13,13,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(190,13,13,0.3)";
                      }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Experience / App Section */}
      <section style={{ background: "#fafafa", padding: "100px 24px", overflow: "hidden", position: "relative" }}>
        <div style={{ maxWidth: "1250px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", alignItems: "center" }}>
          <div>
            <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Next Gen Mobility</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, color: "#0f172a", marginTop: "15px", lineHeight: "1.1" }}>Your Journey, <br/>Our Responsibility</h2>
            <p style={{ color: "#64748b", fontSize: "18px", lineHeight: "1.7", marginTop: "25px", marginBottom: "40px" }}>
              Moving around the city hasn't been this easier. With RoadMate, you get a great experience at an affordable price. Zero paperwork, 100% verified rides.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <button style={{ background: "#fff", color: "#000", padding: "18px 32px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", fontWeight: 800, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" style={{ height: "24px" }} />
              </button>
              <button style={{ background: "transparent", color: "#0f172a", padding: "18px 32px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontWeight: 800, fontSize: "16px", cursor: "pointer" }}>
                Explore More
              </button>
            </div>
          </div>
          <motion.div 
            className="v-card"
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
    </div>
  );
};

export default Home;