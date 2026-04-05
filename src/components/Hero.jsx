import { useNavigate } from "react-router-dom";
import TimePopup from "./TimePopup";
import { useState, useRef, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { FaGift, FaCreditCard, FaIdCard, FaSun } from "react-icons/fa";
import Offers from "./Offers";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

// ── Custom Calendar (no external dependency) ──────────────────────────────────
const DAYS_SHORT = ["SU","MO","TU","WE","TH","FR","SA"];
const MONTHS_FULL = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay    = (y, m) => new Date(y, m, 1).getDay();

const CalendarInline = ({ selected, onSelect }) => {
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const [vy, setVy] = useState(selected ? selected.getFullYear() : todayY);
  const [vm, setVm] = useState(selected ? selected.getMonth()    : todayM);

  const dim      = getDaysInMonth(vy, vm);
  const firstDay = getFirstDay(vy, vm);

  const prevM = () => { if (vm === 0) { setVm(11); setVy(y => y-1); } else setVm(m => m-1); };
  const nextM = () => { if (vm === 11) { setVm(0); setVy(y => y+1); } else setVm(m => m+1); };

  const isToday = d => d === todayD && vm === todayM && vy === todayY;
  const isSel   = d => selected && d === selected.getDate() && vm === selected.getMonth() && vy === selected.getFullYear();
  const isPast  = d => new Date(vy, vm, d) < new Date(todayY, todayM, todayD);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);

  return (
    <div style={{ fontFamily: F, width: 320, padding: "10px" }}>
      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:"12px", borderBottom:"1px solid #f0f0f0", marginBottom:"10px" }}>
        <span style={{ fontSize:"15px", fontWeight:800, color:"#111" }}>
          {MONTHS_FULL[vm]} <span style={{ color:RED }}>{vy}</span>
        </span>
        <div style={{ display:"flex", gap:"4px" }}>
          {[["‹", prevM],["›", nextM]].map(([lbl, fn]) => (
            <button key={lbl} onClick={fn} style={{
              width:30, height:30, borderRadius:"8px",
              border:"1.5px solid #eee", background:"#fff",
              color:"#555", fontSize:"16px", fontWeight:700,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:"4px" }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{
            textAlign:"center", fontSize:"10px", fontWeight:700,
            letterSpacing:"1px", padding:"4px 0",
            color: "#bbb",
          }}>{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const col  = (firstDay + day - 1) % 7;
          const wknd = col === 0 || col === 6;
          const sel  = isSel(day);
          const tod  = isToday(day);
          const past = isPast(day);
          return (
            <button key={day} disabled={past} onClick={() => onSelect(new Date(vy, vm, day))}
              style={{
                aspectRatio:"1", borderRadius:"9px", border:"none",
                outline: sel ? `2px solid ${RED}` : tod ? `2px solid ${RED}50` : "2px solid transparent",
                background: sel ? RED : tod ? `${RED}12` : "transparent",
                color: past ? "#ddd" : sel ? "#fff" : "#222",
                fontSize:"13px", fontWeight: sel ? 700 : tod ? 600 : 400,
                cursor: past ? "default" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .12s", fontFamily: F,
                boxShadow: sel ? `0 4px 12px rgba(190,13,13,0.35)` : "none",
              }}
              onMouseEnter={e => { if (!sel && !past) e.currentTarget.style.background = `${RED}15`; }}
              onMouseLeave={e => { if (!sel && !past) e.currentTarget.style.background = tod ? `${RED}12` : "transparent"; }}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
};

// ── Hero Component ──────────────────────────────────────────────────────────

const Hero = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: "Bike", 
    withHelmet: true,
    withDriver: false,
    selectedDate: new Date(),
    dateDisplay: "5 Apr'26", 
    dayName: "Sunday",
    pickupTime: "09:00 AM",
    dropoffTime: "09:00 PM",
  });

  const [showCat,      setShowCat]      = useState(false);
  const [showCal,      setShowCal]      = useState(false);
  const [showPickTime, setShowPickTime] = useState(false);
  const [showDropTime, setShowDropTime] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowCat(false);
        setShowCal(false);
        setShowPickTime(false);
        setShowDropTime(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = (type) => {
    setShowCat(type === 'cat' ? !showCat : false);
    setShowCal(type === 'cal' ? !showCal : false);
    setShowPickTime(type === 'pick' ? !showPickTime : false);
    setShowDropTime(type === 'drop' ? !showDropTime : false);
  };

  const formatPrettyDate = (d) => {
    const day   = d.getDate().toString();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year  = d.getFullYear().toString().slice(-2);
    return `${day} ${month}'${year}`;
  };

  const getDayName = (d) => d.toLocaleDateString("en-US", { weekday: "long" });

  const handleSearch = () => {
    const { vehicleType, selectedDate, pickupTime, withHelmet, withDriver } = formData;
    if (!vehicleType || !selectedDate) {
      alert("Please complete the search criteria!");
      return;
    }
    const helmetParam = vehicleType === 'Bike' ? `&helmet=${withHelmet}` : "";
    const driverParam = vehicleType === 'Car' ? `&driver=${withDriver}` : "";
    navigate(`/vehicles?type=${encodeURIComponent(vehicleType)}${helmetParam}${driverParam}`);
  };

  const IconVerified = () => (
    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fdf2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#be0d0d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
    </div>
  );

  const IconCharges = () => (
    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff9f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
    </div>
  );

  const IconSupport = () => (
    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </div>
  );

  const IconRocket = () => (
    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#be0d0d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.71-2.13l-1.58-1.58s-1.29 0-2.13.71z"/><path d="M12 18l-3.5-1.5-1.5-3.5c0 0 2.5-3 5.5-3.5s7-4.5 7-4.5 4.5 4 4.5 7-3.5 5.5-3.5 5.5l-3.5-1.5-1.5-3.5z"/><circle cx="16.5" cy="7.5" r=".75"/></svg>
    </div>
  );

  const featureCards = [
    { icon: <IconVerified />, title: "100% Verified Vehicles", desc: "Every bike and car is thoroughly inspected and verified before listing." },
    { icon: <IconCharges />,  title: "No Hidden Charges",       desc: "Transparent pricing with GST included. What you see is what you pay." },
    { icon: <IconSupport />,  title: "24/7 Support",            desc: "Round-the-clock customer support for a hassle-free rental experience." },
    { icon: <IconRocket />,   title: "Instant Booking",         desc: "Book your ride in under 2 minutes. No paperwork, no waiting." },
  ];

  const css = `
    .hero-section { font-family: 'Inter', sans-serif; background: #fff; position: relative; }
    
    .search-ribbon-v2 {
      background: linear-gradient(rgba(1, 8, 26, 0.25), rgba(1, 8, 26, 0.6)), url('/XUV.jpeg');
      background-size: cover;
      background-position: center top;
      padding: 100px 20px 140px;
      position: relative;
    }

    .hero-header-block {
      max-width: 1240px;
      margin: 0 auto 50px;
      text-align: center;
    }
    .hero-title {
      font-size: 56px;
      font-weight: 900;
      color: #fff;
      font-family: 'Outfit', sans-serif;
      margin-bottom: 12px;
      letter-spacing: -1px;
      line-height: 1.1;
    }
    .hero-subtitle {
      font-size: 20px;
      color: rgba(255,255,255,0.7);
      font-weight: 500;
    }

    .trip-type-row {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 25px;
    }
    
    .trip-option {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #1e293b;
      font-size: 14px;
      font-weight: 600;
      opacity: 0.6;
      transition: all 0.2s;
    }
    .trip-option:hover { opacity: 1; }
    .trip-option.active { opacity: 1; color: ${RED}; }

    .trip-radio {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(0,0,0,0.1);
      border-radius: 50%;
      position: relative;
      transition: all 0.2s;
    }
    .trip-option.active .trip-radio { border-color: ${RED}; background: ${RED}; }
    .trip-radio::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0;
    }
    .trip-option.active .trip-radio::after { opacity: 1; }

    /* MASTER CONTAINER - WHITE SQUARISH */
    .search-master-card {
      max-width: 1240px;
      margin: 0 auto;
      background: #ffffff;
      border: 1.2px solid #f2f2f2;
      border-radius: 12px;
      padding: 30px 40px;
      box-shadow: 0 40px 100px rgba(0,0,0,0.06), 0 10px 30px rgba(0,0,0,0.04);
      position: relative;
      z-index: 20;
    }

    .search-main-card {
      width: 100%;
      background: #fff;
      border: 1.5px solid #cbd5e1; /* Darkened from #edf2f7 */
      border-radius: 16px;
      display: flex;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
      position: relative;
      margin-bottom: 30px;
      min-height: 130px;
    }

    .search-col {
      flex: 1;
      padding: 28px 30px 48px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .search-col:hover { 
      background: ${RED}12 !important; 
    }
    .search-col:not(:last-child) { border-right: 1.5px solid #cbd5e1; } /* Darkened from #edf2f7 */

    .col-label {
      font-size: 14px;
      font-weight: 600;
      color: ${RED};
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .col-label svg {
      transition: transform 0.3s ease;
    }
    .col-value {
      font-size: 32px;
      font-weight: 900;
      color: #1a202c;
      font-family: ${H};
      margin-bottom: 4px;
      line-height: 1;
    }
    .col-sub {
      font-size: 13px;
      color: #718096;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .swap-btn {
      position: absolute;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: #fff;
      border: 1.5px solid #edf2f7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: all 0.2s;
    }
    .swap-btn:hover { border-color: ${RED}; color: ${RED}; transform: translateY(-50%) rotate(180deg); }

    .special-fares-row {
      display: flex;
      align-items: flex-start;
      gap: 25px;
    }
    .fares-label {
      font-size: 12px;
      font-weight: 900;
      color: #718096;
      text-transform: uppercase;
      margin-top: 18px;
      white-space: nowrap;
      letter-spacing: 1.2px;
    }
    .fares-list { display: flex; gap: 12px; flex-wrap: wrap; }
    .fare-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 18px;
      cursor: pointer;
      min-width: 140px;
    }
    .fare-card:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); }
    .fare-card.active { border-color: #be0d0d; background: #be0d0d15; }
    .f-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
    .fare-card.active .f-title { color: #be0d0d; }
    .f-sub { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; }

    .floating-search-btn {
      display: block;
      margin: 30px auto 0;
      width: 400px;
      max-width: 96%;
      height: 64px;
      padding: 0 60px;
      background: linear-gradient(90deg, #be0d0d 0%, #990a0a 100%);
      color: #fff;
      border: none;
      border-radius: 99px;
      font-size: 20px;
      font-weight: 900;
      font-family: 'Outfit', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      box-shadow: 0 15px 30px rgba(190,13,13,0.4);
      transition: all 0.3s;
      z-index: 20;
    }
    .floating-search-btn:hover { transform: translateX(-50%) translateY(-3px) scale(1.02); box-shadow: 0 20px 40px rgba(190,13,13,0.5); }

    .cal-box {
      position: absolute;
      top: 48px; /* Starts just below the label */
      left: 0;
      background: #fff;
      z-index: 1000;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 0 1.5px rgba(0,0,0,0.05);
      border-radius: 14px;
      min-width: 100%;
      width: max-content;
      overflow: visible !important;
      animation: dropdownFade 0.15s ease-out;
      transform-origin: top left;
    }
    @keyframes dropdownFade {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 900px) {
      .search-ribbon { padding: 20px 20px 60px; }
      .search-inner { flex-direction: column; gap: 10px; align-items: stretch; }
      .search-field { flex: none; border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
      .search-btn { width: 100%; justify-content: center; border-radius: 14px; height: 50px; }
      .search-btn:hover { transform: none; }
      .offer-section { padding: 40px 20px 30px; }
      .why-section { padding: 20px 20px 50px; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .how-section { padding: 30px 20px 50px; }
      .steps-grid { grid-template-columns: repeat(2, 1fr); }
      .steps-grid::before { display: none; }
      .cal-popup { left: 0; right: 0; width: auto !important; }
      .hero-banner { display: none !important; }
      .hero-section { margin-top: 56px !important; padding-bottom: 70px; }
      .search-ribbon { padding-top: 16px !important; }
    }

    /* ORIGINAL HIGH-FIDELITY RESTORATION */
    .why-section { padding: 40px 40px 100px; background: #fff; }
    .why-inner { max-width: 1250px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 60px; }
    .section-tag { 
      display: inline-block; 
      background: #fff0f0; 
      color: ${RED}; 
      font-size: 12px; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      padding: 8px 18px; 
      border-radius: 99px; 
      margin-bottom: 18px; 
    }
    .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #111; margin: 0 0 15px; line-height: 1.1; letter-spacing: -0.5px; font-family: ${H}; }
    .section-sub { font-size: 17px; color: #666; font-weight: 400; max-width: 550px; margin: 0 auto; }
    
    .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .feature-card { 
      background: #fff; 
      border-radius: 28px; 
      padding: 40px 30px; 
      border: 1px solid #f0f0f0; 
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      cursor: default; 
      position: relative; 
      overflow: hidden; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.02);
    }
    .feature-card::before { 
      content: ''; 
      position: absolute; 
      bottom: 0; left: 0; right: 0; height: 4px; 
      background: ${RED}; 
      transform: scaleX(0); 
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      transform-origin: center; 
    }
    .feature-card:hover { 
      transform: translateY(-10px); 
      box-shadow: 0 25px 50px rgba(0,0,0,0.07); 
      border-color: #ffd5d5; 
    }
    .feature-card:hover::before { transform: scaleX(1); }
    .feature-icon { 
      width: 64px; 
      height: 64px; 
      background: #fff5f5; 
      border-radius: 20px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 28px; 
      margin-bottom: 24px; 
      transition: transform 0.3s;
    }
    .feature-card:hover .feature-icon { transform: rotate(10deg) scale(1.1); }
    .feature-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 12px; font-family: ${H}; }
    .feature-desc { font-size: 14px; color: #777; line-height: 1.7; margin: 0; font-weight: 450; }

    .how-section { padding: 80px 40px 100px; background: #fafafa; position: relative; overflow: hidden; }
    .how-inner { max-width: 1250px; margin: 0 auto; position: relative; z-index: 1; }
    .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 30px; position: relative; }
    .steps-grid-connector { 
      position: absolute; 
      top: 40px; 
      left: 15%; 
      right: 15%; 
      height: 2px; 
      background: repeating-linear-gradient(to right, transparent, transparent 10px, rgba(190,13,13,0.2) 10px, rgba(190,13,13,0.2) 20px);
      z-index: 0;
    }
    .step-card { text-align: center; position: relative; z-index: 1; }
    .step-num { 
      width: 80px; 
      height: 80px; 
      background: #fff; 
      border: 3px solid ${RED}; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      margin: 0 auto 24px; 
      font-size: 28px; 
      font-weight: 900; 
      color: ${RED}; 
      box-shadow: 0 10px 25px rgba(190,13,13,0.15); 
      transition: all 0.3s;
    }
    .step-card:hover .step-num { background: ${RED}; color: #fff; transform: scale(1.1); }
    .step-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 10px; font-family: ${H}; }
    .step-desc { font-size: 14px; color: #777; line-height: 1.6; font-weight: 400; max-width: 220px; margin: 0 auto; }
  `;

  return (
    <section className="hero-section">
      <style>{css}</style>
      
      <div className="search-ribbon-v2">
        {/* HEADER BLOCK */}
        <div className="hero-header-block">
           <h1 className="hero-title">Self-Drive <span style={{ color: RED }}>Rentals</span> in Bhubaneswar</h1>
           <p className="hero-subtitle">Start renting vehicles in simple and accessible way.</p>
        </div>

        {/* MAIN SEARCH AREA */}
        <div ref={searchRef} style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto' }}>
          <div className="search-main-card">
            {/* 1. Vehicle Category */}
            <div className="search-col" onClick={() => openDropdown('cat')} 
              style={{ zIndex: showCat ? 50 : 1, background: showCat ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showCat ? 'active' : ''}`}>Vehicle Category <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showCat ? 'rotate(180deg)' : 'rotate(90deg)' }}><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {formData.vehicleType === 'Bike' ? 
                    <svg width="42" height="42" viewBox="0 0 122.88 82.71" fill={RED}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M50.7,36.7l-0.16-0.68c-2.39,0.65-4.79,0.86-7.21,0.78c-2.76-0.09-5.52-0.56-8.28-1.19 c-1.35-0.31-2.53-0.64-3.65-0.96c-2.52-0.71-4.74-1.33-7.8-1.36c-0.03,0-0.05,0-0.08,0l0,0l-11.07-0.94l-2.18,3.14 c6.36,2.46,14.26,4.18,21.86,4.85c7.17,0.63,14.04,0.34,19.05-1.14L50.7,36.7L50.7,36.7z M104.65,46.26 c10.07,0,18.23,8.16,18.23,18.23c0,10.07-8.16,18.23-18.23,18.23c-10.07,0-18.23-8.16-18.23-18.23c0-6.08,2.97-11.46,7.54-14.77 l-5.29-10.4l-9.71,29.2h-4.29c0,0.12,0,0.24-0.02,0.35c-0.36,1.98-0.97,3.58-1.83,4.78c-0.96,1.34-2.21,2.2-3.76,2.57 c-1.89,0.45-7.19-0.4-10.65-0.95c-0.92-0.15-1.71-0.27-2.22-0.34l-11.41-1.53l-0.05,0.18c-0.27,1.08-1.32,1.79-2.44,1.61 l-7.08-1.16c-0.76,1.2-1.66,2.3-2.67,3.29c-3.35,3.28-7.99,5.31-13.1,5.31c-5.11,0-9.74-2.03-13.1-5.31 c-3.36-3.29-5.44-7.83-5.44-12.84c0-5.01,2.08-9.55,5.44-12.84c3.35-3.28,7.99-5.31,13.1-5.31c5.11,0,9.74,2.03,13.1,5.31 c3.36,3.29,5.44,7.83,5.44,12.84c0,0.56-0.03,1.11-0.08,1.65l6.17,1.71c1.06,0.29,1.72,1.34,1.56,2.4l10.97,1.47 c0.57,0.08,1.37,0.2,2.31,0.35c3.2,0.51,8.11,1.29,9.4,0.99c0.76-0.18,1.38-0.62,1.87-1.3c0.56-0.78,0.97-1.87,1.24-3.25H45.37 C37.45,41.52,17.65,37.82,6.29,47.48L0,47.4c1.88-4.56,6.3-7.52,11.67-9.11c-1.19-0.41-2.33-0.84-3.43-1.3 c-0.09-0.03-0.17-0.07-0.25-0.13c-0.49-0.34-0.61-1.01-0.27-1.5l3.29-4.74c0.21-0.32,0.59-0.52,1-0.49l11.69,0.99v0 c3.33,0.05,5.65,0.7,8.29,1.44c1.1,0.31,2.26,0.63,3.55,0.93c2.64,0.61,5.27,1.06,7.86,1.14c2.49,0.08,4.97-0.17,7.42-0.96 c0.8-0.71,1.61-1.39,2.45-2.04c0.87-0.68,1.79-1.34,2.77-1.99c2.61-1.74,5.29-3.13,8.12-4.08c2.85-0.95,5.84-1.45,9.07-1.39 c1.99,0.04,3.92,0.34,5.75,0.97c1.26,0.44,2.48,1.03,3.64,1.79c0.01-0.2,0.08-0.4,0.2-0.56l-5.77-4.33h-9.02 c-1.05,0-1.89-0.85-1.89-1.89c0-1.05,0.85-1.89,1.89-1.89h8.31v-7.54h0.01l0-0.04c0.01-0.25,0-0.48-0.03-0.68 c-0.02-0.17-0.06-0.33-0.11-0.49c-0.16-0.49-0.5-0.7-0.96-0.98c-0.03-0.01-0.05-0.03-0.08-0.04c-0.05-0.03-0.1-0.06-0.22-0.13 l-0.08,1.3c-0.05,0.77-0.71,1.36-1.49,1.31c-0.77-0.05-1.36-0.71-1.31-1.49l0.52-8.19c0.05-0.77,0.71-1.36,1.49-1.31 c0.77,0.05,1.36,0.71,1.31,1.49l-0.24,3.73l1.05,0.64l0.39,0.23c0.03,0.01,0.05,0.03,0.07,0.05c1,0.58,1.73,1.04,2.22,2.53 c0.1,0.3,0.17,0.63,0.22,1c0.04,0.33,0.06,0.69,0.05,1.07h0v8.19l3.66,2.74l0.33-0.38l-0.86-0.62c-0.48-0.35-0.59-1.03-0.24-1.51 c0.03-0.04,0.06-0.08,0.09-0.11l3.37-3.93c0.39-0.45,1.07-0.51,1.52-0.12l0.02,0.02l3.15,2.59c0.46,0.38,0.53,1.06,0.15,1.52 l-0.02,0.03h0l-3.29,3.75c-0.13,0.15-0.29,0.25-0.46,0.31l0,0l-1.17,0.4l1.07,0.8l0.03,0.03l0.32-0.16 c0.53-0.26,1.18-0.04,1.45,0.49l0.02,0.03l1.54,2.94c0.74-1.66,2.39-2.8,3.83-3.8c0.3-0.21,0.6-0.42,0.86-0.61 c1.13-0.84,2.18-1.38,3.13-1.62c1.05-0.27,2-0.19,2.81,0.21c0.81,0.41,1.44,1.12,1.85,2.13c0.37,0.91,0.57,2.06,0.57,3.44v3.98 c0,0.05,0,0.11-0.01,0.16c-0.11,1.76-0.51,3.03-1.14,3.89c-0.39,0.53-0.85,0.9-1.38,1.14c-0.53,0.24-1.1,0.33-1.7,0.3 c-1.29-0.07-2.74-0.74-4.24-1.85l-1.15-0.85l6.79,12.58C101.51,46.46,103.06,46.26,104.65,46.26z"/></svg> :
                    <svg width="42" height="42" viewBox="0 0 122.88 92.02" fill={RED}>
                      <path fillRule="evenodd" d="M10.17,34.23c-10.98-5.58-9.72-11.8,1.31-11.15l2.47,4.63l5.09-15.83C21.04,5.65,24.37,0,30.9,0H96 c6.53,0,10.29,5.54,11.87,11.87l3.82,15.35l2.2-4.14c11.34-0.66,12.35,5.93,0.35,11.62l1.95,2.99c7.89,8.11,7.15,22.45,5.92,42.48 v8.14c0,2.04-1.67,3.71-3.71,3.71h-15.83c-2.04,0-3.71-1.67-3.71-3.71v-4.54H24.04v4.54c0,2.04-1.67,3.71-3.71,3.71H4.5 c-2.04,0-3.71-1.67-3.71-3.71V78.2c0-0.2,0.02-0.39,0.04-0.58C-0.37,62.25-2.06,42.15,10.17,34.23L10.17,34.23z M30.38,58.7 l-14.06-1.77c-3.32-0.37-4.21,1.03-3.08,3.89l1.52,3.69c0.49,0.95,1.14,1.64,1.9,2.12c0.89,0.55,1.96,0.82,3.15,0.87l12.54,0.1 c3.03-0.01,4.34-1.22,3.39-4C34.96,60.99,33.18,59.35,30.38,58.7L30.38,58.7z M54.38,52.79h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0 c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0C52.82,53.49,53.52,52.79,54.38,52.79L54.38,52.79z M89.96,73.15 h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0 C88.41,73.85,89.1,73.15,89.96,73.15L89.96,73.15z M92.5,58.7l14.06-1.77c3.32-0.37,4.21,1.03,3.08,3.89l-1.52,3.69 c-0.49,0.95-1.14,1.64-1.9,2.12c-0.89,0.55,1.96,0.82,3.15,0.87l-12.54,0.1c-3.03-0.01-4.34-1.22-3.39-4 C87.92,60.99,89.7,59.35,92.5,58.7L92.5,58.7z M18.41,73.15h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4 c-0.85,0-1.55-0.7-1.55-1.55l0,0C16.86,73.85,17.56,73.15,18.41,73.15L18.41,73.15z M19.23,31.2h86.82l-3.83-15.92 c-1.05-4.85-4.07-9.05-9.05-9.05H33.06c-4.97,0-7.52,4.31-9.05,9.05L19.23,31.2v0.75V31.2L19.23,31.2z"/>
                    </svg>
                  }
                  <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1 }}>
                    {formData.vehicleType}
                  </span>
                </div>
              </div>
              <div className="col-sub" style={{ color: '#718096' }}>
                {formData.vehicleType === 'Bike' ? (formData.withHelmet ? 'With Helmet' : 'No Helmet') : (formData.withDriver ? 'Choice: Driver' : 'Self Drive')}
              </div>
              {showCat && (
                <div className="cal-box" style={{ padding: "8px", width: "240px" }}>
                  {[
                    { label: 'Bike With Helmet', type: 'Bike', helmet: true, driver: false, 
                      icon: <svg width="20" height="20" viewBox="0 0 122.88 82.71" fill="currentColor">
                              <path fillRule="evenodd" clipRule="evenodd" d="M50.7,36.7l-0.16-0.68c-2.39,0.65-4.79,0.86-7.21,0.78c-2.76-0.09-5.52-0.56-8.28-1.19 c-1.35-0.31-2.53-0.64-3.65-0.96c-2.52-0.71-4.74-1.33-7.8-1.36c-0.03,0-0.05,0-0.08,0l0,0l-11.07-0.94l-2.18,3.14 c6.36,2.46,14.26,4.18,21.86,4.85c7.17,0.63,14.04,0.34,19.05-1.14L50.7,36.7L50.7,36.7z M104.65,46.26 c10.07,0,18.23,8.16,18.23,18.23c0,10.07-8.16,18.23-18.23,18.23c-10.07,0-18.23-8.16-18.23-18.23c0-6.08,2.97-11.46,7.54-14.77 l-5.29-10.4l-9.71,29.2h-4.29c0,0.12,0,0.24-0.02,0.35c-0.36,1.98-0.97,3.58-1.83,4.78c-0.96,1.34-2.21,2.2-3.76,2.57 c-1.89,0.45-7.19-0.4-10.65-0.95c-0.92-0.15-1.71-0.27-2.22-0.34l-11.41-1.53l-0.05,0.18c-0.27,1.08-1.32,1.79-2.44,1.61 l-7.08-1.16c-0.76,1.2-1.66,2.3-2.67,3.29c-3.35,3.28-7.99,5.31-13.1,5.31c-5.11,0-9.74-2.03-13.1-5.31 c-3.36-3.29-5.44-7.83-5.44-12.84c0-5.01,2.08-9.55,5.44-12.84c3.35-3.28,7.99-5.31,13.1-5.31c5.11,0,9.74,2.03,13.1,5.31 c3.36,3.29,5.44,7.83,5.44,12.84c0,0.56-0.03,1.11-0.08,1.65l6.17,1.71c1.06,0.29,1.72,1.34,1.56,2.4l10.97,1.47 c0.57,0.08,1.37,0.2,2.31,0.35c3.2,0.51,8.11,1.29,9.4,0.99c0.76-0.18,1.38-0.62,1.87-1.3c0.56-0.78,0.97-1.87,1.24-3.25H45.37 C37.45,41.52,17.65,37.82,6.29,47.48L0,47.4c1.88-4.56,6.3-7.52,11.67-9.11c-1.19-0.41-2.33-0.84-3.43-1.3 c-0.09-0.03-0.17-0.07-0.25-0.13c-0.49-0.34-0.61-1.01-0.27-1.5l3.29-4.74c0.21-0.32,0.59-0.52,1-0.49l11.69,0.99v0 c3.33,0.05,5.65,0.7,8.29,1.44c1.1,0.31,2.26,0.63,3.55,0.93c2.64,0.61,5.27,1.06,7.86,1.14c2.49,0.08,4.97-0.17,7.42-0.96 c0.8-0.71,1.61-1.39,2.45-2.04c0.87-0.68,1.79-1.34,2.77-1.99c2.61-1.74,5.29-3.13,8.12-4.08c2.85-0.95,5.84-1.45,9.07-1.39 c1.99,0.04,3.92,0.34,5.75,0.97c1.26,0.44,2.48,1.03,3.64,1.79c0.01-0.2,0.08-0.4,0.2-0.56l-5.77-4.33h-9.02 c-1.05,0-1.89-0.85-1.89-1.89c0-1.05,0.85-1.89,1.89-1.89h8.31v-7.54h0.01l0-0.04c0.01-0.25,0-0.48-0.03-0.68 c-0.02-0.17-0.06-0.33-0.11-0.49c-0.16-0.49-0.5-0.7-0.96-0.98c-0.03-0.01-0.05-0.03-0.08-0.04c-0.05-0.03-0.1-0.06-0.22-0.13 l-0.08,1.3c-0.05,0.77-0.71,1.36-1.49,1.31c-0.77-0.05-1.36-0.71-1.31-1.49l0.52-8.19c0.05-0.77,0.71-1.36,1.49-1.31 c0.77,0.05,1.36,0.71,1.31,1.49l-0.24,3.73l1.05,0.64l0.39,0.23c0.03,0.01,0.05,0.03,0.07,0.05c1,0.58,1.73,1.04,2.22,2.53 c0.1,0.3,0.17,0.63,0.22,1c0.04,0.33,0.06,0.69,0.05,1.07h0v8.19l3.66,2.74l0.33-0.38l-0.86-0.62c-0.48-0.35-0.59-1.03-0.24-1.51 c0.03-0.04,0.06-0.08,0.09-0.11l3.37-3.93c0.39-0.45,1.07-0.51,1.52-0.12l0.02,0.02l3.15,2.59c0.46,0.38,0.53,1.06,0.15,1.52 l-0.02,0.03h0l-3.29,3.75c-0.13,0.15-0.29,0.25-0.46,0.31l0,0l-1.17,0.4l1.07,0.8l0.03,0.03l0.32-0.16 c0.53-0.26,1.18-0.04,1.45,0.49l0.02,0.03l1.54,2.94c0.74-1.66,2.39-2.8,3.83-3.8c0.3-0.21,0.6-0.42,0.86-0.61 c1.13-0.84,2.18-1.38,3.13-1.62c1.05-0.27,2-0.19,2.81,0.21c0.81,0.41,1.44,1.12,1.85,2.13c0.37,0.91,0.57,2.06,0.57,3.44v3.98 c0,0.05,0,0.11-0.01,0.16c-0.11,1.76-0.51,3.03-1.14,3.89c-0.39,0.53-0.85,0.9-1.38,1.14c-0.53,0.24-1.1,0.33-1.7,0.3 c-1.29-0.07-2.74-0.74-4.24-1.85l-1.15-0.85l6.79,12.58C101.51,46.46,103.06,46.26,104.65,46.26z"/></svg> },
                    { label: 'Bike Without Helmet', type: 'Bike', helmet: false, driver: false, 
                      icon: <svg width="20" height="20" viewBox="0 0 122.88 82.71" fill="currentColor">
                              <path fillRule="evenodd" clipRule="evenodd" d="M50.7,36.7l-0.16-0.68c-2.39,0.65-4.79,0.86-7.21,0.78c-2.76-0.09-5.52-0.56-8.28-1.19 c-1.35-0.31-2.53-0.64-3.65-0.96c-2.52-0.71-4.74-1.33-7.8-1.36c-0.03,0-0.05,0-0.08,0l0,0l-11.07-0.94l-2.18,3.14 c6.36,2.46,14.26,4.18,21.86,4.85c7.17,0.63,14.04,0.34,19.05-1.14L50.7,36.7L50.7,36.7z M104.65,46.26 c10.07,0,18.23,8.16,18.23,18.23c0,10.07-8.16,18.23-18.23,18.23c-10.07,0-18.23-8.16-18.23-18.23c0-6.08,2.97-11.46,7.54-14.77 l-5.29-10.4l-9.71,29.2h-4.29c0,0.12,0,0.24-0.02,0.35c-0.36,1.98-0.97,3.58-1.83,4.78c-0.96,1.34-2.21,2.2-3.76,2.57 c-1.89,0.45-7.19-0.4-10.65-0.95c-0.92-0.15-1.71-0.27-2.22-0.34l-11.41-1.53l-0.05,0.18c-0.27,1.08-1.32,1.79-2.44,1.61 l-7.08-1.16c-0.76,1.2-1.66,2.3-2.67,3.29c-3.35,3.28-7.99,5.31-13.1,5.31c-5.11,0-9.74-2.03-13.1-5.31 c-3.36-3.29-5.44-7.83-5.44-12.84c0-5.01,2.08-9.55,5.44-12.84c3.35-3.28,7.99-5.31,13.1-5.31c5.11,0,9.74,2.03,13.1,5.31 c3.36,3.29,5.44,7.83,5.44,12.84c0,0.56-0.03,1.11-0.08,1.65l6.17,1.71c1.06,0.29,1.72,1.34,1.56,2.4l10.97,1.47 c0.57,0.08,1.37,0.2,2.31,0.35c3.2,0.51,8.11,1.29,9.4,0.99c0.76-0.18,1.38-0.62,1.87-1.3c0.56-0.78,0.97-1.87,1.24-3.25H45.37 C37.45,41.52,17.65,37.82,6.29,47.48L0,47.4c1.88-4.56,6.3-7.52,11.67-9.11c-1.19-0.41-2.33-0.84-3.43-1.3 c-0.09-0.03-0.17-0.07-0.25-0.13c-0.49-0.34-0.61-1.01-0.27-1.5l3.29-4.74c0.21-0.32,0.59-0.52,1-0.49l11.69,0.99v0 c3.33,0.05,5.65,0.7,8.29,1.44c1.1,0.31,2.26,0.63,3.55,0.93c2.64,0.61,5.27,1.06,7.86,1.14c2.49,0.08,4.97-0.17,7.42-0.96 c0.8-0.71,1.61-1.39,2.45-2.04c0.87-0.68,1.79-1.34,2.77-1.99c2.61-1.74,5.29-3.13,8.12-4.08c2.85-0.95,5.84-1.45,9.07-1.39 c1.99,0.04,3.92,0.34,5.75,0.97c1.26,0.44,2.48,1.03,3.64,1.79c0.01-0.2,0.08-0.4,0.2-0.56l-5.77-4.33h-9.02 c-1.05,0-1.89-0.85-1.89-1.89c0-1.05,0.85-1.89,1.89-1.89h8.31v-7.54h0.01l0-0.04c0.01-0.25,0-0.48-0.03-0.68 c-0.02-0.17-0.06-0.33-0.11-0.49c-0.16-0.49-0.5-0.7-0.96-0.98c-0.03-0.01-0.05-0.03-0.08-0.04c-0.05-0.03-0.1-0.06-0.22-0.13 l-0.08,1.3c-0.05,0.77-0.71,1.36-1.49,1.31c-0.77-0.05-1.36-0.71-1.31-1.49l0.52-8.19c0.05-0.77,0.71-1.36,1.49-1.31 c0.77,0.05,1.36,0.71,1.31,1.49l-0.24,3.73l1.05,0.64l0.39,0.23c0.03,0.01,0.05,0.03,0.07,0.05c1,0.58,1.73,1.04,2.22,2.53 c0.1,0.3,0.17,0.63,0.22,1c0.04,0.33,0.06,0.69,0.05,1.07h0v8.19l3.66,2.74l0.33-0.38l-0.86-0.62c-0.48-0.35-0.59-1.03-0.24-1.51 c0.03-0.04,0.06-0.08,0.09-0.11l3.37-3.93c0.39-0.45,1.07-0.51,1.52-0.12l0.02,0.02l3.15,2.59c0.46,0.38,0.53,1.06,0.15,1.52 l-0.02,0.03h0l-3.29,3.75c-0.13,0.15-0.29,0.25-0.46,0.31l0,0l-1.17,0.4l1.07,0.8l0.03,0.03l0.32-0.16 c0.53-0.26,1.18-0.04,1.45,0.49l0.02,0.03l1.54,2.94c0.74-1.66,2.39-2.8,3.83-3.8c0.3-0.21,0.6-0.42,0.86-0.61 c1.13-0.84,2.18-1.38,3.13-1.62c1.05-0.27,2-0.19,2.81,0.21c0.81,0.41,1.44,1.12,1.85,2.13c0.37,0.91,0.57,2.06,0.57,3.44v3.98 c0,0.05,0,0.11-0.01,0.16c-0.11,1.76-0.51,3.03-1.14,3.89c-0.39,0.53-0.85,0.9-1.38,1.14c-0.53,0.24-1.1,0.33-1.7,0.3 c-1.29-0.07-2.74-0.74-4.24-1.85l-1.15-0.85l6.79,12.58C101.51,46.46,103.06,46.26,104.65,46.26z"/></svg> },
                    { label: 'Car With Driver', type: 'Car', helmet: false, driver: true, 
                      icon: <svg width="20" height="20" viewBox="0 0 122.88 92.02" fill="currentColor">
                              <path fillRule="evenodd" d="M10.17,34.23c-10.98-5.58-9.72-11.8,1.31-11.15l2.47,4.63l5.09-15.83C21.04,5.65,24.37,0,30.9,0H96 c6.53,0,10.29,5.54,11.87,11.87l3.82,15.35l2.2-4.14c11.34-0.66,12.35,5.93,0.35,11.62l1.95,2.99c7.89,8.11,7.15,22.45,5.92,42.48 v8.14c0,2.04-1.67,3.71-3.71,3.71h-15.83c-2.04,0-3.71-1.67-3.71-3.71v-4.54H24.04v4.54c0,2.04-1.67,3.71-3.71,3.71H4.5 c-2.04,0-3.71-1.67-3.71-3.71V78.2c0-0.2,0.02-0.39,0.04-0.58C-0.37,62.25-2.06,42.15,10.17,34.23L10.17,34.23z M30.38,58.7 l-14.06-1.77c-3.32-0.37-4.21,1.03-3.08,3.89l1.52,3.69c0.49,0.95,1.14,1.64,1.9,2.12c0.89,0.55,1.96,0.82,3.15,0.87l12.54,0.1 c3.03-0.01,4.34-1.22,3.39-4C34.96,60.99,33.18,59.35,30.38,58.7L30.38,58.7z M54.38,52.79h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0 c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0C52.82,53.49,53.52,52.79,54.38,52.79L54.38,52.79z M89.96,73.15 h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0 C88.41,73.85,89.1,73.15,89.96,73.15L89.96,73.15z M92.5,58.7l14.06-1.77c3.32-0.37,4.21,1.03,3.08,3.89l-1.52,3.69 c-0.49,0.95-1.14,1.64-1.9,2.12c-0.89,0.55,1.96,0.82,3.15,0.87l-12.54,0.1c-3.03-0.01-4.34-1.22-3.39-4 C87.92,60.99,89.7,59.35,92.5,58.7L92.5,58.7z M18.41,73.15h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4 c-0.85,0-1.55-0.7-1.55-1.55l0,0C16.86,73.85,17.56,73.15,18.41,73.15L18.41,73.15z M19.23,31.2h86.82l-3.83-15.92 c-1.05-4.85-4.07-9.05-9.05-9.05H33.06c-4.97,0-7.52,4.31-9.05,9.05L19.23,31.2v0.75V31.2L19.23,31.2z"/>
                            </svg> },
                    { label: 'Car With Self Drive', type: 'Car', helmet: false, driver: false, 
                      icon: <svg width="20" height="20" viewBox="0 0 122.88 92.02" fill="currentColor">
                              <path fillRule="evenodd" d="M10.17,34.23c-10.98-5.58-9.72-11.8,1.31-11.15l2.47,4.63l5.09-15.83C21.04,5.65,24.37,0,30.9,0H96 c6.53,0,10.29,5.54,11.87,11.87l3.82,15.35l2.2-4.14c11.34-0.66,12.35,5.93,0.35,11.62l1.95,2.99c7.89,8.11,7.15,22.45,5.92,42.48 v8.14c0,2.04-1.67,3.71-3.71,3.71h-15.83c-2.04,0-3.71-1.67-3.71-3.71v-4.54H24.04v4.54c0,2.04-1.67,3.71-3.71,3.71H4.5 c-2.04,0-3.71-1.67-3.71-3.71V78.2c0-0.2,0.02-0.39,0.04-0.58C-0.37,62.25-2.06,42.15,10.17,34.23L10.17,34.23z M30.38,58.7 l-14.06-1.77c-3.32-0.37-4.21,1.03-3.08,3.89l1.52,3.69c0.49,0.95,1.14,1.64,1.9,2.12c0.89,0.55,1.96,0.82,3.15,0.87l12.54,0.1 c3.03-0.01,4.34-1.22,3.39-4C34.96,60.99,33.18,59.35,30.38,58.7L30.38,58.7z M54.38,52.79h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0 c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0C52.82,53.49,53.52,52.79,54.38,52.79L54.38,52.79z M89.96,73.15 h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0 C88.41,73.85,89.1,73.15,89.96,73.15L89.96,73.15z M92.5,58.7l14.06-1.77c3.32-0.37,4.21,1.03,3.08,3.89l-1.52,3.69 c-0.49,0.95-1.14,1.64-1.9,2.12c-0.89,0.55,1.96,0.82,3.15,0.87l-12.54,0.1c-3.03-0.01-4.34-1.22-3.39-4 C87.92,60.99,89.7,59.35,92.5,58.7L92.5,58.7z M18.41,73.15h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4 c-0.85,0-1.55-0.7-1.55-1.55l0,0C16.86,73.85,17.56,73.15,18.41,73.15L18.41,73.15z M19.23,31.2h86.82l-3.83-15.92 c-1.05-4.85-4.07-9.05-9.05-9.05H33.06c-4.97,0-7.52,4.31-9.05,9.05L19.23,31.2v0.75V31.2L19.23,31.2z"/>
                            </svg> }
                  ].map(opt => {
                    const isSelected = formData.vehicleType === opt.type && (opt.type === 'Bike' ? formData.withHelmet === opt.helmet : formData.withDriver === opt.driver);
                    return (
                      <div key={opt.label}
                        onClick={(e) => { e.stopPropagation(); setFormData({...formData, vehicleType: opt.type, withHelmet: opt.helmet, withDriver: opt.driver}); openDropdown('off'); }}
                        style={{ 
                          padding: "12px 16px", borderRadius: "10px", fontWeight: isSelected ? 700 : 500, 
                          display: 'flex', alignItems: 'center', gap: '12px',
                          color: isSelected ? RED : "#444", 
                          background: isSelected ? `${RED}08` : "transparent", 
                          cursor: "pointer", fontSize: "14px", transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = isSelected ? `${RED}12` : "#f8fafd"}
                        onMouseOut={(e) => e.currentTarget.style.background = isSelected ? `${RED}08` : "transparent"}
                      >
                        <span style={{ opacity: 0.7 }}>{opt.icon}</span>
                        {opt.label}
                        {isSelected && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="3" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Booking Date */}
            <div className="search-col" onClick={() => openDropdown('cal')} 
              style={{ zIndex: showCal ? 50 : 1, background: showCal ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showCal ? 'active' : ''}`}>Booking Date <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showCal ? 'rotate(180deg)' : 'rotate(90deg)' }}><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1a202c' }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill={RED}>
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                </svg>
                <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1 }}>
                  {formData.dateDisplay}
                </span>
              </div>
              <div className="col-sub" style={{ color: '#718096' }}>{formData.dayName}</div>
              {showCal && (
                <div className="cal-box" style={{ padding: 0 }} onClick={e => e.stopPropagation()}>
                    <CalendarInline selected={formData.selectedDate} onSelect={d => { setFormData({...formData, selectedDate:d, dateDisplay: formatPrettyDate(d), dayName: getDayName(d)}); openDropdown('off'); }} />
                </div>
              )}
            </div>

            {/* 3. Pickup Time */}
            <div className="search-col" onClick={() => openDropdown('pick')} 
              style={{ zIndex: showPickTime ? 50 : 1, background: showPickTime ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showPickTime ? 'active' : ''}`}>Pickup Time <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showPickTime ? 'rotate(180deg)' : 'rotate(90deg)' }}><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1a202c' }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill={RED}>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1 }}>
                  {formData.pickupTime}
                </span>
              </div>
              <div className="col-sub" style={{ color: '#718096' }}>Select start time</div>
              {showPickTime && (
                <div className="cal-box" style={{ padding: 0, width: "240px" }} onClick={e => e.stopPropagation()}>
                    <TimePopup onSelect={t => { setFormData({...formData, pickupTime: t}); openDropdown('off'); }} />
                </div>
              )}
            </div>

            {/* 4. Dropoff Time */}
            <div className="search-col" onClick={() => openDropdown('drop')} 
              style={{ zIndex: showDropTime ? 50 : 1, background: showDropTime ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showDropTime ? 'active' : ''}`}>Dropoff Time <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showDropTime ? 'rotate(180deg)' : 'rotate(90deg)' }}><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1a202c' }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill={RED}>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1 }}>
                  {formData.dropoffTime}
                </span>
              </div>
              <div className="col-sub" style={{ color: '#718096' }}>Select end time</div>
              {showDropTime && (
                <div className="cal-box" style={{ padding: 0, width: "240px" }} onClick={e => e.stopPropagation()}>
                    <TimePopup onSelect={t => { setFormData({...formData, dropoffTime: t}); openDropdown('off'); }} />
                </div>
              )}
            </div>
          </div>

          <button className="floating-search-btn" onClick={handleSearch} 
            style={{ 
              position: 'absolute', 
              bottom: '-38px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              margin: 0,
              width: '360px'
            }}>
            Search
          </button>
        </div>
      </div>

      {/* OFFERS SECTION */}
      <Offers />

      {/* WHY CHOOSE US - ORIGINAL HIGH-FIDELITY RESTORATION */}
      <div className="why-section">
        <div className="why-inner">
          <div className="section-header">
            <div className="section-tag">Why Choose Us</div>
            <h2 className="section-title">Bhubaneswar's Own<br/>Vehicle Rental Platform</h2>
            <p className="section-sub">Experience the freedom of smart mobility with RoadMate's verified fleet and seamless booking.</p>
          </div>
          <div className="features-grid">
            {featureCards.map((f,i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS - ORIGINAL HIGH-FIDELITY RESTORATION */}
      <div className="how-section">
        <div className="how-inner">
          <div className="section-header">
            <div className="section-tag">Seamless Process</div>
            <h2 className="section-title">Book Your Ride in 5 Easy Steps</h2>
            <p className="section-sub">Simple, fast, and completely online — no paperwork, no hassle.</p>
          </div>
          <div className="steps-grid">
            <div className="steps-grid-connector" />
            {[
              { step:"01", title:"Verify Docs",    desc:"Quick digital verification with zero physical paperwork." },
              { step:"02", title:"Choose Vehicle",  desc:"Select your preferred bike or car from our highly curated, verified fleet." },
              { step:"03", title:"Pick Date & Time",desc:"Set your rental date, pickup and drop-off time as per your convenience." },
              { step:"04", title:"Confirm Booking", desc:"Review the transparent pricing and confirm your booking instantly." },
              { step:"05", title:"Ride Away",        desc:"Pick up your vehicle and enjoy the ride. It's that simple!" },
            ].map((s,i) => (
              <div key={i} className="step-card">
                <div className="step-num">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;