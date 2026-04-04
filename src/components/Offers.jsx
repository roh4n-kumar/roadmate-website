import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RED = "#be0d0d";
const NAVY = "#0f172a"; 
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const categories = [
  "ON 1st BOOKING",
  "All Offers",
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
    image: "/bike_offer.png"
  },
  {
    id: 2,
    category: "ON 1st BOOKING",
    title: "Grab FLAT ₹200 Cashback*",
    desc: "on your very first ride in Bhubaneswar.",
    code: "FIRST200",
    image: "/adventure_offer.png"
  },
  {
    id: 3,
    category: "Bank Offers",
    title: "Grab FLAT 10% OFF*",
    desc: "using HDFC Bank Credit/Debit cards on weekdays.",
    code: "HDFCRM10",
    image: "/car_offer.png"
  },
  {
    id: 4,
    category: "Bank Offers",
    title: "Grab FLAT 15% OFF*",
    desc: "exclusive offer for ICICI Bank users on long trips.",
    code: "ICICIRM15",
    image: "/adventure_offer.png"
  },
  {
    id: 5,
    category: "Bike Offers",
    title: "Grab FLAT 12% OFF*",
    desc: "Rent premium bikes like Royal Enfield at low rates.",
    code: "BIKERIDE12",
    image: "/bike_offer.png"
  },
  {
    id: 6,
    category: "Car Offers",
    title: "Grab FLAT 25% OFF*",
    desc: "Book any SUV for 3+ days and save big this season.",
    code: "SUVCOOL25",
    image: "/car_offer.png"
  },
  {
    id: 7,
    category: "Long Trips",
    title: "Grab FLAT 30% OFF*",
    desc: "Plan your long-distance adventure travel with RoadMate.",
    code: "ADVENTURE30",
    image: "/adventure_offer.png"
  }
];

const Offers = () => {
  const [selectedTab, setSelectedTab] = useState(categories[0]);
  const navigate = useNavigate();

  const filteredOffers = offersData.filter(o => o.category === selectedTab || (selectedTab === "All Offers" && o.id <= 4));
  const displayOffers = filteredOffers.length > 0 ? filteredOffers : offersData.slice(0, 4);

  return (
    <section 
      id="offers-slider" 
      style={{ 
        padding: "60px 24px 100px", 
        maxWidth: "1250px", 
        margin: "0 auto", 
        position: "relative", 
        zIndex: 10,
        fontFamily: F
      }}
    >
      <style>
        {`
          .outer-card {
            background: #fff;
            border-radius: 28px;
            padding: 30px 40px 45px;
            box-shadow: 0 40px 120px rgba(0,0,0,0.12), 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid #f0f0f0;
          }
          
          .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .offers-title {
            font-size: 32px;
            font-weight: 900;
            font-family: ${H};
            color: #111;
            margin-right: 40px;
          }

          .tabs-wrapper {
            display: flex;
            align-items: center;
            gap: 24px;
            flex: 1;
            border-bottom: 1px solid #eee;
            padding-bottom: 2px;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .tabs-wrapper::-webkit-scrollbar { display: none; }

          .tab-link {
            font-size: 13.5px;
            font-weight: 700;
            color: #64748b;
            cursor: pointer;
            white-space: nowrap;
            padding: 10px 4px;
            position: relative;
            transition: color 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .tab-link.active { color: ${RED}; }
          .tab-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2.5px;
            background: ${RED};
            border-radius: 4px;
          }

          .nav-controls {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-left: 30px;
          }
          .view-all-btn {
            font-size: 14px;
            font-weight: 800;
            color: ${RED};
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            text-transform: uppercase;
          }
          .arrow-btns {
            display: flex;
            gap: 10px;
          }
          .arrow-btn {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.2s;
          }
          .arrow-btn:hover { border-color: ${RED}; color: ${RED}; }

          .offer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .o-card {
            display: flex;
            background: #fff;
            border: 1.5px solid #f0f0f0;
            border-radius: 20px;
            padding: 20px;
            gap: 24px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            min-height: 180px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          }
          .o-card:hover { 
            border-color: #e2e8f0; 
            transform: translateY(-4px); 
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }

          .o-img-box {
            width: 130px;
            height: 130px;
            flex-shrink: 0;
            border-radius: 12px;
            overflow: hidden;
            background: #f9f9f9;
            align-self: center;
          }
          .o-img { width: 100%; height: 100%; object-fit: cover; }

          .o-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .o-tc {
            font-size: 9px;
            font-weight: 800;
            color: #94a3b8;
            text-align: right;
            position: absolute;
            top: 20px;
            right: 20px;
          }
          .o-title {
            font-size: 20px;
            font-weight: 900;
            font-family: ${H};
            color: #111;
            margin: 15px 0 8px;
            line-height: 1.2;
          }
          .o-desc {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            line-height: 1.4;
            max-width: 90%;
          }

          .o-footer {
            margin-top: auto;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .o-code {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
          }
          .o-code span { color: #111; font-weight: 800; }
          .o-action {
             font-size: 14px;
             font-weight: 900;
             color: ${RED};
             letter-spacing: 0.5px;
             cursor: pointer;
             text-transform: uppercase;
          }

          @media (max-width: 950px) {
            .offer-grid { grid-template-columns: 1fr; }
            .top-bar { flex-direction: column; align-items: flex-start; gap: 20px; }
            .tabs-wrapper { width: 100%; }
            .nav-controls { display: none; }
          }
        `}
      </style>

      <div className="outer-card">
        {/* TOP BAR */}
        <div className="top-bar">
          <h2 className="offers-title">Offers</h2>
          
          <div className="tabs-wrapper">
             {categories.map(cat => (
               <div key={cat} className={`tab-link ${selectedTab === cat ? 'active' : ''}`} onClick={() => setSelectedTab(cat)}>
                 {cat}
               </div>
             ))}
          </div>

          <div className="nav-controls">
            <div className="view-all-btn" onClick={() => navigate("/offers")}>
               VIEW ALL <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
            <div className="arrow-btns">
               <div className="arrow-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></div>
               <div className="arrow-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
            </div>
          </div>
        </div>

        {/* OFFERS GRID */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="offer-grid"
          >
            {displayOffers.map(off => (
              <div key={off.id} className="o-card">
                <div className="o-tc">T&C's APPLY</div>
                
                <div className="o-img-box">
                   <img src={off.image} alt={off.title} className="o-img" />
                </div>

                <div className="o-content">
                   <h3 className="o-title">{off.title}</h3>
                   <p className="o-desc">{off.desc}</p>
                   
                   <div className="o-footer">
                      <div className="o-code">Code: <span>{off.code}</span></div>
                      <div className="o-action" onClick={() => navigate("/vehicles")}>BOOK NOW</div>
                   </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Offers;
