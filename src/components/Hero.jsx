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
    <div style={{ fontFamily: F, width: "100%", padding: "20px", boxSizing: "border-box" }}>
      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:"16px", borderBottom:"1px solid #f0f0f0", marginBottom:"15px" }}>
        <span style={{ fontSize:"17px", fontWeight:900, color:"#111" }}>
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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:"8px" }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{
            textAlign:"center", fontSize:"11px", fontWeight:800,
            letterSpacing:"1.2px", padding:"8px 0",
            color: "#94a3b8",
          }}>{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
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
                aspectRatio:"1", borderRadius:"10px", border:"none",
                outline: sel ? `2px solid ${RED}` : tod ? `2px solid ${RED}50` : "2px solid transparent",
                background: sel ? RED : tod ? `${RED}12` : "transparent",
                color: past ? "#e2e8f0" : sel ? "#fff" : "#1e293b",
                fontSize:"15px", fontWeight: sel ? 800 : tod ? 700 : 500,
                cursor: past ? "default" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s cubic-bezier(0.4, 0, 0.2, 1)", fontFamily: H,
                boxShadow: sel ? `0 8px 16px rgba(190,13,13,0.3)` : "none",
              }}
              onMouseEnter={e => { if (!sel && !past) { e.currentTarget.style.background = `${RED}10`; e.currentTarget.style.transform = "scale(1.05)"; } }}
              onMouseLeave={e => { if (!sel && !past) { e.currentTarget.style.background = tod ? `${RED}12` : "transparent"; e.currentTarget.style.transform = "scale(1)"; } }}
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

  const jumpToday = (e) => {
    e.stopPropagation();
    const d = new Date();
    setFormData({...formData, selectedDate: d, dateDisplay: formatPrettyDate(d), dayName: getDayName(d)});
    setShowCal(false);
  };

  const jumpTomm = (e) => {
    e.stopPropagation();
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setFormData({...formData, selectedDate: d, dateDisplay: formatPrettyDate(d), dayName: getDayName(d)});
    setShowCal(false);
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
    
    .col-value {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;
      color: #111;
    }
    .col-value span {
      font-size: 32px;
      font-weight: 700;
      font-family: ${H};
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

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
      width: fit-content;
      margin: 0 auto 30px;
      background: #fff;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      display: flex;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
      position: relative;
      min-height: 130px;
    }

    .search-col {
      flex: 0 1 auto;
      padding: 28px 24px 48px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .search-col:hover { 
      background: ${RED}12 !important; 
    }
    .search-col:not(:last-child) { border-right: 1.5px solid #cbd5e1; }

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
    .col-sub {
      font-size: 13px;
      color: #718096;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

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
      top: 48px;
      left: 0;
      background: #fff;
      z-index: 1000;
      box-shadow: 0 30px 90px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.08);
      border-radius: 12px;
      min-width: 100%;
      width: 340px;
      overflow: visible !important;
      padding: 0;
      box-sizing: border-box;
      animation: dropdownFade 0.15s ease-out;
      transform-origin: top left;
    }
    @keyframes dropdownFade {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .date-pill {
      padding: 6px 16px;
      background: #000;
      border: 1.5px solid #000;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 800;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      line-height: 1;
      height: 32px;
      margin-top: -2px;
    }
    .date-pill:hover {
      background: ${RED};
      border-color: ${RED};
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .date-pill.active {
      background: ${RED};
      color: #fff;
      border-color: ${RED};
      box-shadow: 0 4px 10px rgba(190,13,13,0.2);
    }

    @media (max-width: 900px) {
      .search-ribbon { padding: 20px 20px 60px; }
      .search-inner { flex-direction: column; gap: 10px; align-items: stretch; }
      .search-field { flex: none; border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
      .search-btn { width: 100%; justify-content: center; border-radius: 14px; height: 50px; }
      .search-btn:hover { transform: none; }
      .offer-section { padding: 40px 20px 30px; }
      .why-section { padding: 40px 20px 100px; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .how-section { padding: 80px 20px 100px; }
      .steps-grid { grid-template-columns: repeat(2, 1fr); }
      .steps-grid::before { display: none; }
      .cal-popup { left: 0; right: 0; width: auto !important; }
      .hero-banner { display: none !important; }
      .hero-section { margin-top: 56px !important; padding-bottom: 70px; }
      .search-ribbon { padding-top: 16px !important; }
    }

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
            <div className="search-col" 
              onClick={() => openDropdown('cat')}
              style={{ width: '180px', zIndex: showCat ? 50 : 1, background: showCat ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showCat ? 'active' : ''}`}>
                Vehicle Category <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showCat ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg>
              </div>
              <div className="col-value">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {formData.vehicleType === 'Bike' ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={RED}>
                      <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm19-3.5c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-5 3.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zM20.5 10h-1.9l-2.4-4.5c-.3-.6-.9-1-1.6-1h-3.1c-.6 0-1.2.3-1.5.8L7.4 10.1c-.3.4-.4.9-.4 1.4v2.5h2v-2l2.1-3.5h3.1l2 3.5h-2.1v2h3.1c.7 0 1.3-.4 1.6-1l1.4-2.5c.3-.5.3-1.1.3-1.6v-2.5h2v1.1c0 1 .4 2 1.1 2.7l.9.9v2.1h2v-3.1c0-.5-.2-1-.6-1.4L20.5 10z"/>
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={RED}>
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  )}
                  <span>{formData.vehicleType}</span>
                </div>
              </div>
              <div className="col-sub">
                {formData.vehicleType === 'Bike' ? (formData.withHelmet ? 'With Helmet' : 'No Helmet') : (formData.withDriver ? 'Choice: Driver' : 'Self Drive')}
              </div>
              {showCat && (
                <div className="cal-box" style={{ padding: "8px", width: "240px" }}>
                  {[
                    { label: 'Bike With Helmet', type: 'Bike', helmet: true, driver: false },
                    { label: 'Bike Without Helmet', type: 'Bike', helmet: false, driver: false },
                    { label: 'Car With Driver', type: 'Car', helmet: false, driver: true },
                    { label: 'Car With Self Drive', type: 'Car', helmet: false, driver: false }
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
              style={{ width: '320px', zIndex: showCal ? 50 : 1, background: showCal ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showCal ? 'active' : ''}`}>
                Booking Date <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showCal ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg>
              </div>
              <div className="col-value">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1a202c' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={RED}>
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 11H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                  <span>{formData.dateDisplay}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                  <button onClick={jumpToday} className="date-pill">Today</button>
                  <button onClick={jumpTomm} className="date-pill">Tomorrow</button>
                </div>
              </div>
              <div className="col-sub">{formData.dayName}</div>
              {showCal && (
                <div className="cal-box" style={{ padding: 0 }} onClick={e => e.stopPropagation()}>
                    <CalendarInline selected={formData.selectedDate} onSelect={d => { setFormData({...formData, selectedDate:d, dateDisplay: formatPrettyDate(d), dayName: getDayName(d)}); openDropdown('off'); }} />
                </div>
              )}
            </div>

            {/* 3. Pickup Time */}
            <div className="search-col" onClick={() => openDropdown('pick')}
              style={{ width: '170px', zIndex: showPickTime ? 50 : 1, background: showPickTime ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showPickTime ? 'active' : ''}`}>
                Pickup Time <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showPickTime ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg>
              </div>
              <div className="col-value">
                <svg width="28" height="28" viewBox="0 0 24 24" fill={RED}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3.33 15.25L11 14.41V7h2v6.59l3.75 2.22l-.42-.44z"/>
                </svg>
                <span>{formData.pickupTime}</span>
              </div>
              <div className="col-sub">Select start time</div>
              {showPickTime && (
                <div className="cal-box" onClick={e => e.stopPropagation()}>
                    <TimePopup onSelect={t => { setFormData({...formData, pickupTime: t}); openDropdown('off'); }} />
                </div>
              )}
            </div>

            {/* 4. Dropoff Time */}
            <div className="search-col" onClick={() => openDropdown('drop')}
              style={{ width: '170px', zIndex: showDropTime ? 50 : 1, borderRight: 'none', background: showDropTime ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showDropTime ? 'active' : ''}`}>
                Dropoff Time <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showDropTime ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg>
              </div>
              <div className="col-value">
                <svg width="28" height="28" viewBox="0 0 24 24" fill={RED}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3.33 15.25L11 14.41V7h2v6.59l3.75 2.22l-.42-.44z"/>
                </svg>
                <span>{formData.dropoffTime}</span>
              </div>
              <div className="col-sub">Select end time</div>
              {showDropTime && (
                <div className="cal-box" onClick={e => e.stopPropagation()}>
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