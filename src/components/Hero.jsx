import { useNavigate } from "react-router-dom";
import TimePopup from "./TimePopup";
/* ROADMATE - Hero Component - Stable Build */
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

  const [formData, setFormData] = useState(() => {
    const d = new Date();
    const day = d.getDate().toString();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear().toString().slice(-2);
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    return {
      vehicleType: null, // Initially null for caption
      withHelmet: true,
      withDriver: false,
      selectedDate: d,
      dateDisplay: `${day} ${month}'${year}`, 
      dayName: dayName,
      pickupTime: null, // Initially null for caption
      dropoffTime: null, // Initially null for caption
    };
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

  const isSelectedToday = () => {
    const today = new Date();
    return formData.selectedDate.toDateString() === today.toDateString();
  };
  const isSelectedTomorrow = () => {
    const tomm = new Date();
    tomm.setDate(tomm.getDate() + 1);
    return formData.selectedDate.toDateString() === tomm.toDateString();
  };

  const handleSearch = () => {
    const { vehicleType, selectedDate, pickupTime, dropoffTime, withHelmet, withDriver } = formData;
    if (!vehicleType || !selectedDate || !pickupTime || !dropoffTime) {
      alert("Please select Vehicle Category, Pickup and Dropoff Times to search!");
      return;
    }
    
    const params = new URLSearchParams({
      type: vehicleType,
      date: selectedDate.toISOString(),
      pickup: pickupTime,
      drop: dropoffTime,
      helmet: withHelmet ? "1" : "0",
      driver: withDriver ? "1" : "0"
    });

    navigate(`/vehicles?${params.toString()}`);
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

    .search-tab-popup {
      position: absolute;
      top: -50px;
      left: 45px;
      background: #ffffff;
      padding: 14px 30px;
      border-radius: 12px 12px 0 0;
      box-shadow: 0 -15px 40px rgba(0,0,0,0.06);
      border: 1.2px solid #f2f2f2;
      border-bottom: none;
      z-index: 30;
      display: flex;
      align-items: center;
    }
    .search-tab-text {
      font-size: 14px;
      font-weight: 800;
      color: ${RED};
      font-family: ${H};
      text-transform: uppercase;
      letter-spacing: 1px;
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
      max-width: 1252px;
      margin: 0 auto;
      background: #ffffff;
      border: 1.2px solid #f2f2f2;
      border-radius: 12px;
      padding: 40px 24px 50px; /* Restored top padding, matched side padding */
      box-shadow: 0 40px 120px rgba(0,0,0,0.12), 0 10px 40px rgba(0,0,0,0.08);
      position: relative;
      z-index: 100;
      overflow: visible;
    }

    .search-main-card {
      width: 100%;
      margin: -20px auto 0; /* Adjusted from -25px to be 5px lower */
      background: #fff;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      display: grid;
      grid-template-columns: 220px 1fr 240px 240px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.04);
      position: relative;
      min-height: auto;
    }

    .search-col:first-child { border-radius: 16px 0 0 16px; }
    .search-col:last-child { border-radius: 0 16px 16px 0; }

    .search-col {
      padding: 24px 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .search-col:nth-child(3), .search-col:nth-child(4) {
      padding: 24px 14px;
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
      white-space: nowrap;
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
      margin: 0 auto;
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
      position: absolute;
      bottom: -32px;
      left: 50%;
      transform: translateX(-50%);
    }
    .floating-search-btn:hover { transform: translateX(-50%) translateY(-3px) scale(1.02); box-shadow: 0 20px 40px rgba(190,13,13,0.5); }

    .info-ribbon-bar {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      height: 56px;
      padding: 0 30px;
      border-radius: 99px;
      box-shadow: 0 25px 65px rgba(0,0,0,0.2), 0 0 0 1.2px rgba(0,0,0,0.12);
      border: none;
      display: flex;
      align-items: center;
      gap: 0;
      z-index: 5;
      white-space: nowrap;
    }
    .disclaimer-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: #fff;
      border: 1.5px solid #e5e7eb;
      border-radius: 14px;
      transition: none;
      color: #334155;
      cursor: default;
    }
    .disclaimer-pill:hover {
      background: #fff !important;
      border-color: #e5e7eb !important;
      transform: none !important;
    }
    .pill-icon-box {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${RED};
      font-size: 16px;
    }
    .pill-text {
      font-size: 13px;
      font-weight: 700;
      line-height: 1.2;
    }
    .pill-text span {
      display: block;
      color: ${RED};
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px;
    }
    .info-sep {
      height: 100%;
      width: 1.2px;
      background: #f2f2f2;
    }
    .info-text {
      font-size: 13px;
      font-weight: 800;
      color: #1a202c;
      font-family: ${H};
      letter-spacing: 0.3px;
    }
    .info-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${RED};
    }

    .cal-box {
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      background: #fff;
      z-index: 1000;
      box-shadow: 0 30px 90px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.08);
      border-radius: 12px;
      margin-top: 4px;
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
      background: #f1f5f9;
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 800;
      color: #64748b;
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
      background: #fff;
      border-color: ${RED}30;
      color: ${RED};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .date-pill.active {
      background: #000;
      color: #fff;
      border-color: #000;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
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
        </div>

        {/* MAIN SEARCH AREA */}
        <div className="search-master-card">
          <div className="search-tab-popup">
            <span className="search-tab-text">Start renting vehicles in simple and accessible way</span>
          </div>
          <div ref={searchRef} className="search-main-card">
            {/* 1. Vehicle Category */}
            <div className="search-col" onClick={() => openDropdown('cat')} 
              style={{ zIndex: showCat ? 50 : 1, background: showCat ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showCat ? 'active' : ''}`}>Vehicle Category <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showCat ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
                {formData.vehicleType ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1a202c' }}>
                   {formData.vehicleType === 'Bike' ? 
                    <svg width="28" height="28" viewBox="0 0 122.88 82.71" fill="#000000" style={{ flexShrink: 0 }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M50.7,36.7l-0.16-0.68c-2.39,0.65-4.79,0.86-7.21,0.78c-2.76-0.09-5.52-0.56-8.28-1.19 c-1.35-0.31-2.53-0.64-3.65-0.96c-2.52-0.71-4.74-1.33-7.8-1.36c-0.03,0-0.05,0-0.08,0l0,0l-11.07-0.94l-2.18,3.14 c6.36,2.46,14.26,4.18,21.86,4.85c7.17,0.63,14.04,0.34,19.05-1.14L50.7,36.7L50.7,36.7z M104.65,46.26 c10.07,0,18.23,8.16,18.23,18.23c0,10.07-8.16,18.23-18.23,18.23c-10.07,0-18.23-8.16-18.23-18.23c0-6.08,2.97-11.46,7.54-14.77 l-5.29-10.4l-9.71,29.2h-4.29c0,0.12,0,0.24-0.02,0.35c-0.36,1.98-0.97,3.58-1.83,4.78c-0.96,1.34-2.21,2.2-3.76,2.57 c-1.89,0.45-7.19-0.4-10.65-0.95c-0.92-0.15-1.71-0.27-2.22-0.34l-11.41-1.53l-0.05,0.18c-0.27,1.08-1.32,1.79-2.44,1.61 l-7.08-1.16c-0.76,1.2-1.66,2.3-2.67,3.29c-3.35,3.28-7.99,5.31-13.1,5.31c-5.11,0-9.74-2.03-13.1-5.31 c-3.36-3.29-5.44-7.83-5.44-12.84c0-5.01,2.08-9.55,5.44-12.84c3.35-3.28,7.99-5.31,13.1-5.31c5.11,0,9.74,2.03,13.1,5.31 c3.36,3.29,5.44,7.83,5.44,12.84c0,0.56-0.03,1.11-0.08,1.65l6.17,1.71c1.06,0.29,1.72,1.34,1.56,2.4l10.97,1.47 c0.57,0.08,1.37,0.2,2.31,0.35c3.2,0.51,8.11,1.29,9.4,0.99c0.76-0.18,1.38-0.62,1.87-1.3c0.56-0.78,0.97-1.87,1.24-3.25H45.37 C37.45,41.52,17.65,37.82,6.29,47.48L0,47.4c1.88-4.56,6.3-7.52,11.67-9.11c-1.19-0.41-2.33-0.84-3.43-1.3 c-0.09-0.03-0.17-0.07-0.25-0.13c-0.49-0.34-0.61-1.01-0.27-1.5l3.29-4.74c0.21-0.32,0.59-0.52,1-0.49l11.69,0.99v0 c3.33,0.05,5.65,0.7,8.29,1.44c1.1,0.31,2.26,0.63,3.55,0.93c2.64,0.61,5.27,1.06,7.86,1.14c2.49,0.08,4.97-0.17,7.42-0.96 c0.8-0.71,1.61-1.39,2.45-2.04c0.87-0.68,1.79-1.34,2.77-1.99c2.61-1.74,5.29-3.13,8.12-4.08c2.85-0.95,5.84-1.45,9.07-1.39 c1.99,0.04,3.92,0.34,5.75,0.97c1.26,0.44,2.48,1.03,3.64,1.79c0.01-0.2,0.08-0.4,0.2-0.56l-5.77-4.33h-9.02 c-1.05,0-1.89-0.85-1.89-1.89c0-1.05,0.85-1.89,1.89-1.89h8.31v-7.54h0.01l0-0.04c0.01-0.25,0-0.48-0.03-0.68 c-0.02-0.17-0.06-0.33-0.11-0.49c-0.16-0.49-0.5-0.7-0.96-0.98c-0.03-0.01-0.05-0.03-0.08-0.04c-0.05-0.03-0.1-0.06-0.22-0.13 l-0.08,1.3c-0.05,0.77-0.71,1.36-1.49,1.31c-0.77-0.05-1.36-0.71-1.31-1.49l0.52-8.19c0.05-0.77,0.71-1.36,1.49-1.31 c0.77,0.05,1.36,0.71,1.31,1.49l-0.24,3.73l1.05,0.64l0.39,0.23c0.03,0.01,0.05,0.03,0.07,0.05c1,0.58,1.73,1.04,2.22,2.53 c0.1,0.3,0.17,0.63,0.22,1c0.04,0.33,0.06,0.69,0.05,1.07h0v8.19l3.66,2.74l0.33-0.38l-0.86-0.62c-0.48-0.35-0.59-1.03-0.24-1.51 c0.03-0.04,0.06-0.08,0.09-0.11l3.37-3.93c0.39-0.45,1.07-0.51,1.52-0.12l0.02,0.02l3.15,2.59c0.46,0.38,0.53,1.06,0.15,1.52 l-0.02,0.03h0l-3.29,3.75c-0.13,0.15-0.29,0.25-0.46,0.31l0,0l-1.17,0.4l1.07,0.8l0.03,0.03l0.32-0.16 c0.53-0.26,1.18-0.04,1.45,0.49l0.02,0.03l1.54,2.94c0.74-1.66,2.39-2.8,3.83-3.8c0.3-0.21,0.6-0.42,0.86-0.61 c1.13-0.84,2.18-1.38,3.13-1.62c1.05-0.27,2-0.19,2.81,0.21c0.81,0.41,1.44,1.12,1.85,2.13c0.37,0.91,0.57,2.06,0.57,3.44v3.98 c0,0.05,0,0.11-0.01,0.16c-0.11,1.76-0.51,3.03-1.14,3.89c-0.39,0.53-0.85,0.9-1.38,1.14c-0.53,0.24-1.1,0.33-1.7,0.3 c-1.29-0.07-2.74-0.74-4.24-1.85l-1.15-0.85l6.79,12.58C101.51,46.46,103.06,46.26,104.65,46.26z"/></svg> :
                    <svg width="28" height="28" viewBox="0 0 122.88 92.02" fill="#000000" style={{ flexShrink: 0 }}>
                      <path fillRule="evenodd" d="M10.17,34.23c-10.98-5.58-9.72-11.8,1.31-11.15l2.47,4.63l5.09-15.83C21.04,5.65,24.37,0,30.9,0H96 c6.53,0,10.29,5.54,11.87,11.87l3.82,15.35l2.2-4.14c11.34-0.66,12.35,5.93,0.35,11.62l1.95,2.99c7.89,8.11,7.15,22.45,5.92,42.48 v8.14c0,2.04-1.67,3.71-3.71,3.71h-15.83c-2.04,0-3.71-1.67-3.71-3.71v-4.54H24.04v4.54c0,2.04-1.67,3.71-3.71,3.71H4.5 c-2.04,0-3.71-1.67-3.71-3.71V78.2c0-0.2,0.02-0.39,0.04-0.58C-0.37,62.25-2.06,42.15,10.17,34.23L10.17,34.23z M30.38,58.7 l-14.06-1.77c-3.32-0.37-4.21,1.03-3.08,3.89l1.52,3.69c0.49,0.95,1.14,1.64,1.9,2.12c0.89,0.55,1.96,0.82,3.15,0.87l12.54,0.1 c3.03-0.01,4.34-1.22,3.39-4C34.96,60.99,33.18,59.35,30.38,58.7L30.38,58.7z M54.38,52.79h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0 c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0C52.82,53.49,53.52,52.79,54.38,52.79L54.38,52.79z M89.96,73.15 h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4c-0.85,0-1.55-0.7-1.55-1.55l0,0 C88.41,73.85,89.1,73.15,89.96,73.15L89.96,73.15z M92.5,58.7l14.06-1.77c3.32-0.37,4.21,1.03,3.08,3.89l-1.52,3.69 c-0.49,0.95-1.14,1.64-1.9,2.12c-0.89,0.55,1.96,0.82,3.15,0.87l-12.54,0.1c-3.03-0.01-4.34-1.22-3.39-4 C87.92,60.99,89.7,59.35,92.5,58.7L92.5,58.7z M18.41,73.15h14.4c0.85,0,1.55,0.7,1.55,1.55l0,0c0,0.85-0.7,1.55-1.55,1.55h-14.4 c-0.85,0-1.55-0.7-1.55-1.55l0,0C16.86,73.85,17.56,73.15,18.41,73.15L18.41,73.15z M19.23,31.2h86.82l-3.83-15.92 c-1.05-4.85-4.07-9.05-9.05-9.05H33.06c-4.97,0-7.52,4.31-9.05,9.05L19.23,31.2v0.75V31.2L19.23,31.2z"/>
                    </svg>
                   }
                   <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1 }}>
                    {formData.vehicleType}
                   </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: '#718096', fontWeight: 600, lineHeight: 1.2 }}>
                    <span>Tap to</span>
                    <span>choose your</span>
                    <span>vehicle</span>
                  </div>
                )}
              </div>
              {formData.vehicleType && (
                <div className="col-sub" style={{ color: '#718096' }}>
                  {formData.vehicleType === 'Bike' ? (formData.withHelmet ? 'With Helmet' : 'No Helmet') : (formData.withDriver ? 'Choice: Driver' : 'Self Drive')}
                </div>
              )}
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
              <div className={`col-label ${showCal ? 'active' : ''}`}>
                Booking Date <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showCal ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg>
              </div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a202c', flexShrink: 0 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000" style={{ flexShrink: 0 }}>
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 11H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                  <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {formData.dateDisplay}
                  </span>
                </div>
                {/* Pills moved here */}
                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                  <button onClick={jumpToday} className={`date-pill ${isSelectedToday() ? 'active' : ''}`}>Today</button>
                  <button onClick={jumpTomm} className={`date-pill ${isSelectedTomorrow() ? 'active' : ''}`}>Tomorrow</button>
                </div>
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
              <div className={`col-label ${showPickTime ? 'active' : ''}`}>Pickup Time <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showPickTime ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a202c', flexShrink: 0, minHeight: '32px' }}>
                {formData.pickupTime ? (
                  <>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000" style={{ flexShrink: 0 }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3.33 15.25L11 14.41V7h2v6.59l3.75 2.22l-.42-.44z"/>
                    </svg>
                    <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1, whiteSpace: 'nowrap' }}>
                      {formData.pickupTime}
                    </span>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: '#718096', fontWeight: 600, lineHeight: 1.2 }}>
                    <span>Tap to</span>
                    <span>set pickup</span>
                    <span>time</span>
                  </div>
                )}
              </div>
              {formData.pickupTime && <div className="col-sub" style={{ color: '#718096' }}>Selected start time</div>}
              {showPickTime && (
                <div className="cal-box" onClick={e => e.stopPropagation()}>
                    <TimePopup onSelect={t => { setFormData({...formData, pickupTime: t}); openDropdown('off'); }} />
                </div>
              )}
            </div>

            {/* 4. Dropoff Time */}
            <div className="search-col" onClick={() => openDropdown('drop')} 
              style={{ zIndex: showDropTime ? 50 : 1, background: showDropTime ? `${RED}12` : 'transparent' }}>
              <div className={`col-label ${showDropTime ? 'active' : ''}`}>Return Time <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: showDropTime ? 'rotate(90deg)' : 'rotate(0deg)' }}><polyline points="9 6 15 12 9 18"/></svg></div>
              <div className="col-value" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a202c', flexShrink: 0, minHeight: '32px' }}>
                {formData.dropoffTime ? (
                  <>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000" style={{ flexShrink: 0 }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm3.33 15.25L11 14.41V7h2v6.59l3.75 2.22l-.42-.44z"/>
                    </svg>
                    <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: H, color: '#111', lineHeight: 1, whiteSpace: 'nowrap' }}>
                      {formData.dropoffTime}
                    </span>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: '#718096', fontWeight: 600, lineHeight: 1.2 }}>
                    <span>Tap to</span>
                    <span>set return</span>
                    <span>time</span>
                  </div>
                )}
              </div>
              {formData.dropoffTime && <div className="col-sub" style={{ color: '#718096' }}>Selected end time</div>}
              {showDropTime && (
                <div className="cal-box" onClick={e => e.stopPropagation()}>
                    <TimePopup onSelect={t => { setFormData({...formData, dropoffTime: t}); openDropdown('off'); }} />
                </div>
              )}
            </div>
          </div>

          <button className="floating-search-btn" onClick={handleSearch}>
            Search
          </button>

          {/* Restored Disclaimer Pills */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '18px', marginBottom: '0px' }}>
            <div className="disclaimer-pill">
               <div className="pill-icon-box">
                  <svg viewBox="0 0 512 512" width="22" height="22" fill="currentColor">
                    <path d="M294.396 52.127c-17.944.066-35.777 1.834-52.886 4.746-86.727 14.76-135.612 53.467-161.99 107.824 31.215-2.434 62.002-5.024 91.966-4.838 24.114.15 47.696 2.097 70.54 7.37 15.15 3.5 24.652 16.647 27.607 31.735 2.954 15.088.858 32.92-5.055 51.553l-.287.904-.468.826c-7.762 13.64-24.263 24.498-45.295 35.994-21.032 11.497-46.695 22.693-72.27 32.428-25.574 9.735-51.012 17.98-71.575 23.437-7.254 1.925-13.85 3.48-19.735 4.657 2.275 31.13 6.562 63.38 12.008 95.98 140.118-38.25 273.5-79.888 403.51-123.254 25.935-44.457 29.927-86.448 16.967-126.734-22.393-69.605-60.9-107.048-105.215-126.168-27.696-11.95-57.913-16.57-87.82-16.46zM130.184 179.205c-9.06.51-18.265 1.156-27.532 1.836L59.31 329.386c3.384-.79 6.936-1.663 10.754-2.676 4.004-1.063 8.27-2.27 12.66-3.554 10.022-31.07 43.3-131.415 47.46-143.95zm-46.7 3.262c-10.868.826-21.824 1.654-32.908 2.37-.32.445-.714.947-1.318 2.267-1.58 3.45-3.375 9.418-4.912 16.724-3.075 14.612-5.37 34.727-6.705 54.877-1.333 20.15-1.73 40.438-1.193 55.582.268 7.572.79 13.905 1.442 17.96.048.306.078.312.13.59.46-.01 1.033-.044 1.546-.064l43.918-150.306zM224 183c-15.596 0-28.66 12.582-28.66 28.152s13.064 28.155 28.66 28.155 28.66-12.584 28.66-28.155c0-15.57-13.064-28.152-28.66-28.152zm0 18c6.12 0 10.66 4.567 10.66 10.152 0 5.586-4.54 10.155-10.66 10.155s-10.66-4.57-10.66-10.155c0-5.585 4.54-10.152 10.66-10.152zm230.19 144.865C330.383 386.852 203.285 426.23 70.054 462.56c.413 2.317.81 4.63 1.232 6.948 147.607-26.65 255.974-68.965 371.36-109.164 4.118-4.857 7.947-9.68 11.546-14.48z"></path>
                  </svg>
               </div>
               <div className="pill-text">
                  <span>* Item Info</span>
                  Helmet Includes Extra Charges
               </div>
            </div>
            <div className="disclaimer-pill">
               <div className="pill-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
               </div>
               <div className="pill-text">
                  <span>* Driver Info</span>
                  Driver Includes Extra Charges
               </div>
            </div>
          </div>
        </div>

        {/* Floating Info Ribbon - Moved to Background Boundary */}
        <div className="info-ribbon-bar">
          <div className="info-item">
            <span className="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></span>
            <span className="info-text">Verify Identity</span>
          </div>
          <div className="info-sep" />
          <div className="info-item">
            <span className="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg></span>
            <span className="info-text">No Docs with Driver</span>
          </div>
          <div className="info-sep" />
          <div className="info-item">
            <span className="info-icon">
              <svg width="30" height="30" viewBox="0 0 960 960" fill="none">
                <path d="M413.059 208.901C608.802 236.46 691.795 170.573 712.469 409.752C798.504 403.547 819.597 489.8 801.131 558.596C813.938 585.419 817.15 620.066 791.358 641.453C736.952 660.845 762.963 629.112 747.473 708.56C742.84 729.522 729.559 754.833 704.08 750.955C667.813 750.275 632.186 735.998 640.724 693.188C642.813 677.987 643.212 662.55 644.4 646.918C526.21 646.918 408.523 646.918 289.266 646.918C288.294 669.902 292.647 695.092 284.932 717.654C276.537 746.61 245.759 749.352 220.35 744.025C168.889 736.955 181.451 680.766 183.062 643.127C143.971 649.978 120.638 592.942 147.192 565.501C155.528 561.552 130.812 536.661 132.15 522.409C116.693 457.957 146.725 398.405 219.825 404.845C223.547 404.734 225.39 403.664 226.435 399.821C264.508 286.424 269.681 203.459 413.059 208.901ZM287.955 403.125C288.851 361.273 339.214 338.093 376.168 350.285C431.558 363.375 419.471 398.402 440.568 406.275C516.767 405.955 593.117 409.418 669.193 408.617C658.228 370.383 659.703 276.558 610.786 271.272C525.688 262.66 439.1 247.47 353.704 258.266C298.37 270.311 292.635 343.714 270.564 387.01C258.184 408.385 269.393 402.494 287.955 403.125ZM174.588 596.487C354.297 607.995 534.334 597.529 714.13 605.986C726.226 603.481 776.164 614.504 772.054 597.103C772.343 593.492 772.344 589.048 766.677 588.677C657.284 579.315 547.364 586.691 437.818 578.211C397.035 578.211 177.775 561.416 174.588 596.487ZM724.774 495.766C724.513 459.028 675.521 469.748 670.872 498.772C664.162 543.102 727.79 535.008 724.774 495.766ZM681.562 648.326C680.598 665.526 679.624 683.107 678.621 700.687C679.463 712.356 696.344 707.841 704.877 711.087C712.519 690.853 712.914 670.07 712.309 648.326C701.85 648.326 691.97 648.326 681.562 648.326ZM246.781 534.515C267.893 520.971 267.201 464.285 233.307 483.641C210.236 503.766 219.679 525.528 246.781 534.515ZM222.946 643.578C222.946 657.553 222.822 671.304 222.976 685.052C223.191 704.234 222.902 701.621 239 703.374C243.788 703.895 245.993 702.791 246.013 698.168C246.091 680.147 246.045 662.126 246.045 643.579C239.531 643.578 232.359 643.578 222.946 643.578ZM332.166 403.939C352.196 403.939 371.722 403.939 391.485 403.939C376.535 383.549 343.298 383.199 332.166 403.939Z" fill="currentColor"></path>
                <path d="M919.69 342.167C904.518 374.882 877.776 400.919 857.489 430.595C851.315 440.056 838.415 444.488 829.12 438.007C799.504 414.086 868.275 358.719 879.848 333.116C890.963 315.862 917.726 319.559 919.69 342.167Z" fill="currentColor"></path>
                <path d="M196.654 354.115C198.368 380.922 165.322 386.007 158.831 361.254C156.88 331.776 114.863 266.84 151.64 251.172C190.879 243.993 186.956 327.987 196.654 354.115Z" fill="currentColor"></path>
                <path d="M62.4105 376.051C79.5025 382.753 118.711 410.297 110.585 431.36C93.2885 465.448 61.5485 423.425 44.8315 409.278C33.8425 397.126 46.4635 376.762 62.4105 376.051Z" fill="currentColor"></path>
                <path d="M789.942 334.684C785.27 351.641 792.04 387.513 766.973 387.308C743.943 383.571 752.089 349.54 749.457 332.384C749.824 303.169 792.105 305.745 789.942 334.684Z" fill="currentColor"></path>
                {/* White accents to keep the detail */}
                <path d="M287.955 403.125C269.963 402.329 257.764 408.637 270.572 387.014C292.557 343.73 298.428 270.302 353.699 258.267C439.1 247.467 525.686 262.663 610.781 271.27C659.857 276.649 658.109 370.28 669.198 408.613C593.117 409.418 516.767 405.955 440.573 406.271C419.688 398.643 431.259 363.132 376.168 350.29C339.176 338.094 288.876 361.273 287.955 403.125Z" fill="white"></path>
                <path d="M174.586 596.489C177.408 561.425 397.466 578.921 437.813 578.205C547.362 586.693 657.281 579.316 766.675 588.678C772.341 589.05 772.341 593.494 772.052 597.102C776.451 614.559 725.426 603.448 714.129 605.995C534.333 597.531 354.294 607.998 174.586 596.489Z" fill="white"></path>
                <path d="M724.773 495.766C727.779 535.023 664.156 543.089 670.868 498.77C675.515 469.746 724.514 459.03 724.773 495.766Z" fill="white"></path>
                <path d="M681.563 648.328C691.971 648.328 701.851 648.328 712.311 648.328C712.916 670.072 712.521 690.854 704.88 711.087C696.349 707.868 679.465 712.337 678.621 700.691C679.625 683.109 680.599 665.528 681.563 648.328Z" fill="white"></path>
                <path d="M222.946 643.578C232.359 643.578 239.531 643.578 246.044 643.578C246.044 662.125 246.09 680.146 246.012 698.167C245.992 702.791 243.787 703.895 238.999 703.373C222.901 701.62 223.19 704.233 222.975 685.051C222.822 671.304 222.946 657.554 222.946 643.578Z" fill="white"></path>
                <path d="M332.164 403.94C343.296 383.2 376.533 383.55 391.483 403.94C371.72 403.94 352.194 403.94 332.164 403.94Z" fill="white"></path>
                <path d="M269.347 500.571C272.353 539.828 208.73 547.894 215.442 503.575C220.089 474.551 269.088 463.835 269.347 500.571Z" fill="white"></path>
              </svg>
            </span>
            <span className="info-text">100% Verified Fleet</span>
          </div>
          <div className="info-sep" />
          <div className="info-item">
            <span className="info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
            <span className="info-text">Enjoy Your Ride</span>
          </div>
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