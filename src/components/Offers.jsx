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
  // ON 1st BOOKING (4)
  {
    id: 1,
    category: "ON 1st BOOKING",
    title: "Grab FLAT 50% OFF*",
    desc: "on your first bike or car booking with RoadMate.",
    code: "WELCOME50",
    image: "/assets/offers/car_luxury.png"
  },
  {
    id: 2,
    category: "ON 1st BOOKING",
    title: "Grab FLAT ₹200 Cashback*",
    desc: "on your very first ride in Bhubaneswar.",
    code: "FIRST200",
    image: "/assets/offers/bike_adventure.png"
  },
  {
    id: 3,
    category: "ON 1st BOOKING",
    title: "Grab UPTO ₹500 OFF*",
    desc: "on your first premium vehicle rental today.",
    code: "ROADSTART",
    image: "/assets/offers/suv_forest.png"
  },
  {
    id: 4,
    category: "ON 1st BOOKING",
    title: "Grab FREE HELMET*",
    desc: "on your first bike rental for extra safety.",
    code: "SAFETY1ST",
    image: "/assets/offers/urban_lifestyle.png"
  },

  // Bank Offers (4)
  {
    id: 101,
    category: "Bank Offers",
    title: "Grab FLAT 10% OFF*",
    desc: "using HDFC Bank Credit/Debit cards on weekdays.",
    code: "HDFCRM10",
    image: "/assets/offers/car_luxury.png"
  },
  {
    id: 102,
    category: "Bank Offers",
    title: "Grab FLAT 15% OFF*",
    desc: "exclusive offer for ICICI Bank users on long trips.",
    code: "ICICIRM15",
    image: "/assets/offers/suv_forest.png"
  },
  {
    id: 103,
    category: "Bank Offers",
    title: "Grab ₹300 CASHBACK*",
    desc: "using SBI Yono for all city bike rentals.",
    code: "SBIYONO300",
    image: "/assets/offers/bike_adventure.png"
  },
  {
    id: 104,
    category: "Bank Offers",
    title: "Grab 20% DISCOUNT*",
    desc: "on your first Axis Bank card transaction.",
    code: "AXISRM20",
    image: "/assets/offers/urban_lifestyle.png"
  },

  // Bike Offers (4)
  {
    id: 201,
    category: "Bike Offers",
    title: "Grab FLAT 12% OFF*",
    desc: "Rent premium bikes like Royal Enfield at low rates.",
    code: "BIKERIDE12",
    image: "/assets/offers/bike_adventure.png"
  },
  {
    id: 202,
    category: "Bike Offers",
    title: "Grab WEEKEND 10% OFF*",
    desc: "on all scooty and bike rentals for city rides.",
    code: "WEEKEND10",
    image: "/assets/offers/urban_lifestyle.png"
  },
  {
    id: 203,
    category: "Bike Offers",
    title: "Grab RIDE & SAVE*",
    desc: "Rent for 3+ days and get a special bike discount.",
    code: "RIDE3DAYS",
    image: "/assets/offers/car_luxury.png"
  },
  {
    id: 204,
    category: "Bike Offers",
    title: "Grab NIGHT RIDER*",
    desc: "Special rates for overnight bike rentals this week.",
    code: "NIGHT15",
    image: "/assets/offers/suv_forest.png"
  },

  // Car Offers (4)
  {
    id: 301,
    category: "Car Offers",
    title: "Grab FLAT 15% OFF*",
    desc: "on all premium sedan rentals for city travel.",
    code: "SEDAN15",
    image: "/assets/offers/car_luxury.png"
  },
  {
    id: 302,
    category: "Car Offers",
    title: "Grab SUV SPECIAL*",
    desc: "Get ₹500 off on any SUV rental for 24+ hours.",
    code: "SUVPOWER",
    image: "/assets/offers/suv_forest.png"
  },
  {
    id: 303,
    category: "Car Offers",
    title: "Grab CLEAN CARS*",
    desc: "Enjoy sanitized and fuel-efficient urban cars.",
    code: "HYGIENE10",
    image: "/assets/offers/urban_lifestyle.png"
  },
  {
    id: 304,
    category: "Car Offers",
    title: "Grab LUXURY RENTALS*",
    desc: "Experience high-end cars at unbeatable prices.",
    code: "LUXURY20",
    image: "/assets/offers/bike_adventure.png"
  },

  // Long Trips (4)
  {
    id: 401,
    category: "Long Trips",
    title: "Grab FLAT 20% OFF*",
    desc: "on inter-state rentals above 500 kilometres.",
    code: "LONGTRIP20",
    image: "/assets/offers/suv_forest.png"
  },
  {
    id: 402,
    category: "Long Trips",
    title: "Grab FREE MILEAGE*",
    desc: "Unlimited kms on 3+ day rentals this month.",
    code: "UNLIMITED",
    image: "/assets/offers/car_luxury.png"
  },
  {
    id: 403,
    category: "Long Trips",
    title: "Grab HILL STATION*",
    desc: "Special adventure package for bike expeditions.",
    code: "HILLS25",
    image: "/assets/offers/bike_adventure.png"
  },
  {
    id: 404,
    category: "Long Trips",
    title: "Grab FAMILY SAVER*",
    desc: "Rent a 7-seater SUV and save on your next trip.",
    code: "FAMILYSUV",
    image: "/assets/offers/urban_lifestyle.png"
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
        maxWidth: "1300px", 
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
            border-radius: 12px;
            padding: 16px 45px 50px;
            box-shadow: 0 40px 120px rgba(0,0,0,0.12), 0 10px 40px rgba(0,0,0,0.08);
            border: 1.2px solid #f2f2f2;
            overflow: hidden;
          }
          
          .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            gap: 20px;
          }

          .offers-title {
            font-size: 30px;
            font-weight: 900;
            font-family: ${H};
            color: #111;
          }

          .tabs-wrapper {
            display: flex;
            align-items: center;
            gap: 22px;
            overflow-x: auto;
            scrollbar-width: none;
            position: relative;
            border-bottom: 2px solid #e5e5e5;
            padding: 0 0 2px;
            margin-right: 15px;
          }
          .tabs-wrapper::-webkit-scrollbar { display: none; }

          .tab-link {
            font-size: 13px;
            font-weight: 800;
            color: #64748b;
            cursor: pointer;
            white-space: nowrap;
            padding: 8px 0;
            position: relative;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.4px;
          }
          .tab-link.active { color: ${RED}; }
          .tab-link.active::after {
            content: '';
            position: absolute;
            bottom: -2.5px;
            left: 0;
            right: 0;
            height: 3px;
            background: ${RED};
            border-radius: 2px;
            z-index: 10;
          }

          .nav-controls {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .view-all-btn {
            font-size: 14px;
            font-weight: 900;
            color: ${RED};
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            text-transform: uppercase;
            white-space: nowrap;
          }
          .arrow-btns {
            display: flex;
            gap: 12px;
          }
          .arrow-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1.5px solid #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
          }
          .arrow-btn:hover { border-color: ${RED}; color: ${RED}; box-shadow: 0 4px 12px rgba(190, 13, 13, 0.1); }

          .offer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .o-card {
            display: flex;
            background: #fff;
            border: 1px solid #efefef;
            border-radius: 12px;
            padding: 20px;
            gap: 24px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            min-height: 180px;
            box-shadow: 0 6px 12px -2px rgba(0,0,0,0.08), 0 3px 6px -2px rgba(0,0,0,0.05);
          }
          .o-card:hover { 
            border-color: #e5e5e5; 
          }

          .o-img-box {
            width: 130px;
            height: 130px;
            flex-shrink: 0;
            border-radius: 6px;
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
            text-transform: uppercase;
          }
          .o-title {
            font-size: clamp(18px, 1.5vw, 22px);
            font-weight: 900;
            font-family: ${H};
            color: #111;
            margin: 15px 0 6px;
            line-height: 1.2;
          }
          .o-desc {
            font-size: 13.5px;
            color: #64748b;
            font-weight: 500;
            line-height: 1.5;
            max-width: 95%;
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
          .o-code span { color: #111; font-weight: 900; }
          .o-action {
             font-size: 14px;
             font-weight: 900;
             color: ${RED};
             letter-spacing: 0.5px;
             cursor: pointer;
             text-transform: uppercase;
          }

          @media (max-width: 1000px) {
            .offer-grid { grid-template-columns: 1fr; }
            .top-bar { flex-direction: column; align-items: flex-start; gap: 20px; }
            .nav-controls { width: 100%; justify-content: space-between; }
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
