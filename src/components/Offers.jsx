import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RED = "#be0d0d";
const NAVY = "#0f172a"; 
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const categories = [
  "ON 1st BOOKING",
  "Bank Offers",
  "Bike Offers",
  "Car Offers",
  "Long Trips"
];

const offersData = [
  {
    id: 1,
    category: "ON 1st BOOKING",
    title: "Grab FLAT 50% OFF*",
    desc: "on your first bike or car booking with RoadMate.",
    code: "WELCOME50",
    image: "/bike_offer.png",
    tc: "T&C's APPLY"
  },
  {
    id: 2,
    category: "ON 1st BOOKING",
    title: "Get ₹200 Cashback",
    desc: "on your very first ride in Bhubaneswar.",
    code: "FIRST200",
    image: "/adventure_offer.png",
    tc: "T&C's APPLY"
  },
  {
    id: 3,
    category: "Bank Offers",
    title: "Flat 10% Discount",
    desc: "using HDFC Bank Credit/Debit cards on weekdays.",
    code: "HDFCRM10",
    image: "/car_offer.png",
    tc: "T&C's APPLY"
  },
  {
    id: 4,
    category: "Bank Offers",
    title: "Instant 15% OFF",
    desc: "exclusive offer for ICICI Bank users on long trips.",
    code: "ICICIRM15",
    image: "/adventure_offer.png",
    tc: "T&C's APPLY"
  },
  {
    id: 5,
    category: "Bike Offers",
    title: "Weekend Special: 12% OFF",
    desc: "Rent premium bikes like Royal Enfield at low rates.",
    code: "BIKERIDE12",
    image: "/bike_offer.png",
    tc: "T&C's APPLY"
  },
  {
    id: 6,
    category: "Car Offers",
    title: "SUV Summer Sale: 25% OFF",
    desc: "Book any SUV for 3+ days and save big this season.",
    code: "SUVCOOL25",
    image: "/car_offer.png",
    tc: "T&C's APPLY"
  },
  {
    id: 7,
    category: "Long Trips",
    title: "7+ Days: Flat 30% OFF",
    desc: "Plan your long-distance adventure travel with RoadMate.",
    code: "ADVENTURE30",
    image: "/adventure_offer.png",
    tc: "T&C's APPLY"
  }
];

const Offers = () => {
  const [selectedTab, setSelectedTab] = useState(categories[0]);
  const navigate = useNavigate();

  const filteredOffers = offersData.filter(o => o.category === selectedTab);

  // Fallback if no offers for a category (show relevant ones anyway)
  const displayOffers = filteredOffers.length > 0 ? filteredOffers : offersData.slice(0, 4);

  return (
    <section 
      id="offers-slider" 
      style={{ 
        padding: "80px 24px", 
        maxWidth: "1250px", 
        margin: "0 auto", 
        position: "relative", 
        overflow: "hidden", 
        zIndex: 10,
        background: "#ffffff",
        fontFamily: F
      }}
    >
      <style>
        {`
          .tabs-container {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #f0f0f0;
            margin-bottom: 40px;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            gap: 30px;
            padding-bottom: 2px;
          }
          .tabs-container::-webkit-scrollbar { display: none; }
          
          .tab-item {
            padding: 12px 4px;
            font-size: 14px;
            font-weight: 700;
            color: #64748b;
            cursor: pointer;
            white-space: nowrap;
            position: relative;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .tab-item.active { color: ${RED}; }
          .tab-indicator {
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 3px;
            background: ${RED};
            border-radius: 10px;
          }

          .offer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .offer-card {
            display: flex;
            background: #fff;
            border: 1px solid #f0f0f0;
            border-radius: 20px;
            padding: 20px;
            gap: 20px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            align-items: center;
          }
          .offer-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            border-color: #ffd5d5;
          }

          .offer-image-container {
            width: 140px;
            height: 140px;
            flex-shrink: 0;
            border-radius: 16px;
            overflow: hidden;
            background: #f9fafb;
          }
          .offer-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s;
          }
          .offer-card:hover .offer-image { transform: scale(1.1); }

          .offer-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .tc-text {
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            align-self: flex-end;
            margin-bottom: 5px;
          }
          .offer-title {
            font-size: clamp(18px, 1.5vw, 24px);
            font-weight: 900;
            color: #0f172a;
            font-family: ${H};
            margin-bottom: 8px;
            line-height: 1.1;
          }
          .offer-desc {
            font-size: 13px;
            color: #64748b;
            line-height: 1.5;
            margin-bottom: 15px;
            font-weight: 500;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .offer-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dashed #e2e8f0;
            padding-top: 12px;
          }
          .code-badge {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            background: #f1f5f9;
            padding: 4px 10px;
            border-radius: 6px;
            letter-spacing: 0.5px;
          }
          .book-now-link {
            font-size: 13px;
            font-weight: 800;
            color: ${RED};
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: gap 0.2s;
            cursor: pointer;
            text-transform: uppercase;
          }
          .book-now-link:hover { gap: 8px; }

          .nav-arrows {
            display: flex;
            gap: 10px;
          }
          .nav-btn {
            width: 36px;
            height: 36px;
            border: 1.5px solid #e2e8f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
          }
          .nav-btn:hover {
            border-color: ${RED};
            color: ${RED};
            box-shadow: 0 4px 12px rgba(190, 13, 13, 0.15);
          }

          @media (max-width: 900px) {
            .offer-grid {
              grid-template-columns: 1fr;
            }
            .nav-arrows { display: none; }
          }
          @media (max-width: 500px) {
            .offer-card { padding: 15px; gap: 15px; }
            .offer-image-container { width: 100px; height: 100px; }
          }
        `}
      </style>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 900, fontFamily: H, color: NAVY }}>Offers</h2>
          
          {/* NAV ARROWS - Desktop only */}
          <div className="nav-arrows">
            <div className="nav-btn">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <div className="nav-btn">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
           <button 
            onClick={() => navigate("/offers")} 
            style={{ 
              color: "#3b82f6", 
              background: "none", 
              border: "none", 
              fontWeight: 800, 
              cursor: "pointer", 
              fontSize: "14px", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              textTransform: "uppercase"
            }}
          >
            View All <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>

      {/* TABS MENU */}
      <div className="tabs-container">
        {categories.map(cat => (
          <div 
            key={cat} 
            className={`tab-item ${selectedTab === cat ? 'active' : ''}`}
            onClick={() => setSelectedTab(cat)}
          >
            {cat}
            {selectedTab === cat && (
              <motion.div layoutId="tab-underline" className="tab-indicator" />
            )}
          </div>
        ))}
      </div>

      {/* OFFERS GRID */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="offer-grid"
        >
          {displayOffers.map(off => (
            <div key={off.id} className="offer-card">
              <div className="offer-image-container">
                <img src={off.image} alt={off.title} className="offer-image" />
              </div>
              <div className="offer-content">
                <span className="tc-text">{off.tc}</span>
                <h3 className="offer-title">{off.title}</h3>
                <p className="offer-desc">{off.desc}</p>
                <div className="offer-footer">
                  <div className="code-badge">Code: {off.code}</div>
                  <a className="book-now-link" onClick={() => navigate("/vehicles")}>
                    Book Now <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Offers;
