import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { offersData } from "../data/offers";
import Footer from "../components/Footer";
import OfferModal from "../components/OfferModal";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const OffersPage = () => {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);

  const location = useLocation();
 
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check for incoming trigger from Home page
    if (location.state?.openOfferId) {
      const off = offersData.find(x => x.id === location.state.openOfferId);
      if (off) setSelectedOffer(off);
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        .offers-main-wrapper {
          padding-top: 64px; /* Space for the global Navbar (64px) */
          background: #f8fafc;
          min-height: 100vh;
        }

        /* RIBBON BELOW NAVBAR */
        .offers-ribbon {
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          height: 54px;
          display: flex;
          align-items: center;
          padding: 0 40px;
          position: sticky;
          top: 64px; /* Positioned exactly below the 64px navbar */
          z-index: 100;
        }

        .back-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          margin-right: 15px;
        }
        .back-icon-btn:hover { background: #e2e8f0; color: ${RED}; }

        .top-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .page-title {
          font-family: ${H};
          font-weight: 800;
          font-size: 18px;
          color: #0f172a;
          margin: 0;
        }

        .divider { width: 1.5px; height: 16px; background: #e2e8f0; margin: 0 5px; }

        .status-pill {
          background: rgba(190, 13, 13, 0.05);
          color: ${RED};
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .available-count {
          font-family: ${H};
          font-weight: 800;
          font-size: 12px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* GRID: 3 COLUMNS */
        .offers-content {
          max-width: 1250px;
          margin: 0 auto;
          padding: 40px 24px 100px;
        }

        .o-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* Exact 3 columns on desktop */
          gap: 24px;
        }

        .o-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          transition: all 0.3s ease;
          position: relative;
        }
        .o-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
        }

        .o-img-area {
          height: 200px; /* Reduced height for 3rd column layout */
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .o-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .o-cat-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #334155;
          color: #fff;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          z-index: 2;
        }

        .o-rating {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 2;
        }
        .o-rating span { color: #94a3b8; font-weight: 600; }

        .o-name-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px 20px 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: #fff;
          z-index: 2;
        }
        .o-name-overlay h3 {
          margin: 0;
          font-family: ${H};
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        /* CARD BODY */
        .o-body {
          padding: 25px 25px 30px;
        }

        .o-features {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }
        .o-feat-item { display: flex; align-items: center; gap: 6px; }

        .o-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .o-price-box { display: flex; flex-direction: column; }
        .o-price {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          font-family: ${H};
        }
        .o-price span { font-size: 14px; color: #64748b; font-weight: 600; }

        .book-btn {
          background: ${RED};
          color: #fff;
          padding: 14px 30px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          box-shadow: 0 8px 20px rgba(190, 13, 13, 0.2);
        }
        .book-btn:hover { 
          background: #a80a0a;
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(190, 13, 13, 0.3);
        }

        @media (max-width: 900px) {
          .offers-top-nav { padding: 0 20px; }
          .offers-content { padding: 30px 20px 80px; }
          .o-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* TOP STICKY RIBBON (Below Navbar) */}
      <div className="offers-ribbon" style={{ padding: "0 24px" }}>
        <div style={{ maxWidth: "1250px", margin: "0 auto", width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
          <div className="top-info">
            <h2 className="page-title">Exclusive Offers</h2>
            <div className="divider"></div>
            <div className="status-pill">PROMO ACTIVE</div>
          </div>
          <div className="available-count">6 AVAILABLE</div>
        </div>
      </div>

      <div className="offers-main-wrapper" style={{ padding: "0 24px" }}>
        <div className="offers-content" style={{ padding: "40px 0 100px", maxWidth: "1250px", margin: "0 auto" }}>
          <motion.div 
            className="o-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {offersData.slice(0, 6).map((off, idx) => (
              <motion.div 
                key={off.id} 
                className="o-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="o-img-area">
                  <div className="o-cat-badge">{off.category}</div>
                  <div className="o-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    4.8 <span>(120)</span>
                  </div>
                  <img src={off.image} alt={off.title} className="o-image" />
                  <div className="o-name-overlay">
                    <h3>{off.title}</h3>
                  </div>
                </div>

                <div className="o-body">
                  <div className="o-footer">
                    <div className="o-price-box">
                      <div className="o-price">SAVE <span>{off.title.match(/\d+%/)?.[0] || "EXTRA"}</span></div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>{off.desc}</div>
                    </div>
                    <button className="rm-btn-premium" onClick={() => setSelectedOffer(off)} style={{ padding: '10px 20px', fontSize: '12px' }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedOffer && (
            <OfferModal 
              offer={selectedOffer} 
              onClose={() => setSelectedOffer(null)} 
              onBookNow={() => {
                setSelectedOffer(null);
                navigate("/vehicles");
              }} 
            />
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default OffersPage;
