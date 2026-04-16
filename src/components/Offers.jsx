import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RED = "#be0d0d";
const NAVY = "#0f172a"; 
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

import { offersData } from "../data/offers";

const Offers = () => {
  const navigate = useNavigate();
  
  // We only show the first 6 offers on the homepage
  const featuredOffers = offersData.slice(0, 6);

  return (
    <section 
      id="offers-slider" 
      style={{ 
        padding: "20px 24px 100px", 
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
            max-width: 1250px;
            margin: 0 auto;
            background: #fff;
            border-radius: 24px;
            padding: 25px 0;
            box-shadow: 0 20px 50px rgba(0,0,0,0.05);
            border: 1.2px solid #f2f2f2;
            overflow: hidden;
          }
          
          .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            gap: 20px;
            padding: 0 50px;

          }

          .title-pill {
            color: ${RED};
            background: rgba(190, 13, 13, 0.08);
            padding: 8px 20px;
            border-radius: 100px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1.2px;
            display: inline-block;
            margin-bottom: 18px;
            font-family: ${H};
          }
          .main-heading {
            font-size: clamp(28px, 3.5vw, 36px);

            font-weight: 900;
            font-family: ${H};
            color: #111;
            margin: 0;
            line-height:1.2;
          }

          .nav-controls {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .view-all-btn {
             padding: 10px 20px;
             background: rgba(190, 13, 13, 0.05);
             border: 1.5px solid rgba(190, 13, 13, 0.1);
             border-radius: 12px;
             font-size: 13px;
             font-weight: 800;
             color: ${RED};
             cursor: pointer;
             transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
             display: flex;
             align-items: center;
             gap: 8px;
             font-family: ${H};
          }
          .view-all-btn:hover { 
            background: rgba(190, 13, 13, 0.08); 
            transform: translateY(-2px); 
            box-shadow: 0 10px 20px rgba(190,13,13,0.1); 
            border-color: rgba(190, 13, 13, 0.2); 
          }


          .offer-grid {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 24px;
            padding: 10px 50px 25px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-snap-type: x mandatory;
            scroll-padding-left: 50px;
            -webkit-overflow-scrolling: touch;
          }
          .offer-grid::-webkit-scrollbar { display: none; }
          .offer-grid > * { flex-shrink: 0; }

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
            width: 450px;
            flex-shrink: 0;
            scroll-snap-align: start;
            box-shadow: 0 6px 12px -2px rgba(0,0,0,0.08), 0 3px 6px -2px rgba(0,0,0,0.05);
          }
          .o-card:hover { 
            border-color: #e5e5e5; 
          }

          .offers-section {
            padding: 90px 0 80px;
            background: #fff;
            position: relative;
            overflow: hidden;
            border-bottom: 1.5px solid #f8fafc;
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
            margin: 20px 0 2px;
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

          @media (max-width: 900px) {
            #offers-slider { padding: 40px 16px 60px !important; }
            .outer-card { padding: 30px 0 !important; border-radius: 24px !important; }
            .top-bar { 
              padding: 0 20px !important; 
              flex-direction: column !important; 
              align-items: flex-start !important; 
              gap: 15px !important; 
            }
            .main-heading { font-size: 28px !important; }
            .nav-controls { width: 100% !important; justify-content: flex-start !important; }
            .offer-grid { padding: 10px 20px 25px !important; scroll-padding-left: 20px !important; }
            .o-card { 
              width: 88vw !important; 
              padding: 16px !important; 
              gap: 16px !important; 
              min-height: auto !important;
            }
            .o-img-box { width: 100px !important; height: 100px !important; }
            .o-title { font-size: 18px !important; margin-top: 10px !important; }
            .o-desc { font-size: 12px !important; }
            .o-tc { font-size: 8px !important; top: 15px !important; right: 15px !important; }
            .o-footer { padding-top: 10px !important; }
          }
        `}
      </style>

      <div className="outer-card">
        {/* TOP BAR */}
        <div className="top-bar">
          <div className="title-area" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 className="main-heading">Offers For You</h2>
            <span className="title-pill" style={{ marginBottom: 0 }}>EXCLUSIVE DEALS</span>
          </div>

          <div className="nav-controls">
            <div className="view-all-btn" onClick={() => navigate("/offers")}>
               View All Offers →
            </div>

          </div>
        </div>

        <div style={{ height: '1.2px', background: '#e2e2e2', width: '100%', marginBottom: '20px' }} />

        {/* OFFERS GRID */}
        <AnimatePresence mode="wait">
          <motion.div 
            key="all-offers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="offer-grid"
          >
            {featuredOffers.map(off => (
              <div key={off.id} className="o-card" onClick={() => navigate("/offers", { state: { openOfferId: off.id } })} style={{ cursor: 'pointer' }}>
                <div className="o-tc">T&C's APPLY</div>
                
                <div className="o-img-box">
                   <img src={off.image} alt={off.title} className="o-img" />
                </div>

                <div className="o-content">
                   <h3 className="o-title">{off.title}</h3>
                   <p className="o-desc">{off.desc}</p>
                   
                   <div className="o-footer" style={{ justifyContent: 'center' }}>
                      <div className="o-code">Code: <span>{off.code}</span></div>
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
