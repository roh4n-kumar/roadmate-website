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
    <div style={{ fontFamily: F, minWidth: 280 }}>
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
    pickup: "Bhubaneswar", pickupSub: "Saheed Nagar, Odisha",
    dropoff: "Bhubaneswar", dropoffSub: "Airport Area",
    selectedDate: new Date(), dateDisplay: "5 Apr'26", dayName: "Sunday",
    dropDate: null, dropDateDisplay: "Tap to add return",
    category: "Bikes / All", categorySub: "Standard / Premium",
    tripType: "Daily"
  });

  const [showCal,     setShowCal]     = useState(false);
  const [showDropCal, setShowDropCal] = useState(false);
  const [activeTab,   setActiveTab]   = useState("Regular");

  const formatPrettyDate = (d) => {
    const day   = d.getDate().toString();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year  = d.getFullYear().toString().slice(-2);
    return `${day} ${month}'${year}`;
  };

  const getDayName = (d) => d.toLocaleDateString("en-US", { weekday: "long" });

  const handleSearch = () => {
    const { pickup, selectedDate } = formData;
    if (!pickup || !selectedDate) {
      alert("Please select pick-up location and date!");
      return;
    }
    navigate(`/vehicles?loc=${encodeURIComponent(pickup)}`);
  };

  const IconVerified = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gradV" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#gradV)" opacity="0.2"/>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="url(#gradV)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="url(#gradV)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const IconCharges = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="14" r="8" fill="#d97706" opacity="0.4" />
      <circle cx="12" cy="12" r="9" fill="url(#gradC)" />
      <circle cx="12" cy="12" r="7" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      <path d="M12 7V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M14.5 9.5H11C10.1716 9.5 9.5 10.1716 9.5 11C9.5 11.8284 10.1716 12.5 11 12.5H13C13.8284 12.5 14.5 13.1716 14.5 14C14.5 14.8284 13.8284 15.5 13 15.5H9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="7" r="1.5" fill="#fff" opacity="0.8" />
    </svg>
  );

  const IconSupport = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradS" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#gradS)" opacity="0.15" />
      <circle cx="12" cy="12" r="10" stroke="url(#gradS)" strokeWidth="2" />
      <path d="M12 6V12L16 14" stroke="url(#gradS)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="url(#gradS)" opacity="0.1" />
    </svg>
  );

  const IconRocket = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="gradFlame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path d="M12 18C12 18 10 20 10 22C10 24 12 24 12 24C12 24 14 24 14 22C14 20 12 18 12 18Z" fill="url(#gradFlame)" />
      <path d="M12 2C12 2 7 6 7 12V17H17V12C17 6 12 2 12 2Z" fill="url(#gradR)" />
      <path d="M7 14L4 18V20H7V17" fill="#991b1b" />
      <path d="M17 14L20 18V20H17V17" fill="#991b1b" />
      <circle cx="12" cy="8" r="2" fill="#fff" opacity="0.3" stroke="#fff" strokeWidth="1" />
      <path d="M11 4L12 2L13 4" fill="#fff" opacity="0.2" />
    </svg>
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
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
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
      max-width: 1240px;
      margin: 0 auto 30px;
      display: flex;
      align-items: center;
      gap: 30px;
      padding-top: 10px;
    }
    
    .trip-option {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
    .trip-radio {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      position: relative;
      transition: all 0.2s;
    }
    .trip-option.active .trip-radio { border-color: #3b82f6; background: #3b82f6; }
    .trip-radio::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0;
    }
    .trip-option.active .trip-radio::after { opacity: 1; }

    .search-main-card {
      width: 100%;
      background: #fff;
      border-radius: 12px;
      display: flex;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .search-col {
      flex: 1;
      padding: 18px 25px;
      cursor: pointer;
      transition: background 0.2s;
      position: relative;
      min-width: 0;
    }
    .search-col:hover { background: #f8fafc; }
    .search-col:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
    .search-col:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
    .search-col:not(:last-child) { border-right: 1.5px solid #edf2f7; }

    .col-label {
      font-size: 13px;
      color: #718096;
      font-weight: 600;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .col-value {
      font-size: 32px;
      font-weight: 900;
      color: #1a202c;
      font-family: 'Outfit', sans-serif;
      margin-bottom: 4px;
      line-height: 1;
    }
    .col-sub {
      font-size: 13px;
      color: #4a5568;
      font-weight: 500;
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
    }
    .swap-btn:hover { border-color: #3b82f6; color: #3b82f6; }

    .special-fares-row {
      max-width: 1200px;
      margin: 25px auto 0;
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }
    .fares-label {
      font-size: 12px;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      margin-top: 15px;
      letter-spacing: 1px;
    }
    .fares-list { display: flex; gap: 12px; flex-wrap: wrap; }
    .fare-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 10px 18px;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 140px;
    }
    .fare-card:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); }
    .fare-card.active { border-color: #3b82f6; background: #3b82f615; }
    .f-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
    .fare-card.active .f-title { color: #3b82f6; }
    .f-sub { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; }

    .floating-search-btn {
      position: absolute;
      bottom: -32px;
      left: 50%;
      transform: translateX(-50%);
      height: 64px;
      padding: 0 60px;
      background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
      color: #fff;
      border: none;
      border-radius: 99px;
      font-size: 20px;
      font-weight: 900;
      font-family: 'Outfit', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      box-shadow: 0 15px 30px rgba(37,99,235,0.4);
      transition: all 0.3s;
      z-index: 20;
    }
    .floating-search-btn:hover { transform: translateX(-50%) translateY(-3px) scale(1.02); box-shadow: 0 20px 40px rgba(37,99,235,0.5); }

    .cal-box {
      position: absolute;
      top: 105%;
      left: 0;
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      z-index: 1000;
      border: 1px solid #edf2f7;
    }

    @media (max-width: 1024px) {
      .search-main-card { flex-wrap: wrap; }
      .search-col { flex: 1 1 33.33%; border-right: none !important; border-bottom: 1.5px solid #edf2f7; }
      .search-col:nth-child(3) { border-bottom: none; }
      .trip-type-row { justify-content: center; overflow-x: auto; padding-bottom: 20px; }
      .hero-title { font-size: 40px; }
      .hero-subtitle { font-size: 16px; }
      .special-fares-row { flex-direction: column; align-items: stretch; }
      .fares-label { margin-top: 0; text-align: center; }
    }
    @media (max-width: 600px) {
      .search-col { flex: 1 1 100%; }
      .search-main-card { border-radius: 16px; }
      .hero-section { margin-top: 60px; }
      .hero-title { font-size: 32px; }
    }
  `;

  return (
    <section className="hero-section">
      <style>{css}</style>
      
      <div className="search-ribbon-v2">
        {/* HEADER BLOCK */}
        <div className="hero-header-block">
           <h1 className="hero-title">Premium Self-Drive Rentals</h1>
           <p className="hero-subtitle">Rent high-quality verified bikes and cars in your city</p>
        </div>

        {/* TRIP TYPE ROW */}
        <div className="trip-type-row">
          {["Daily", "Weekly/Monthly", "Subscription"].map(t => (
            <div key={t} className={`trip-option ${formData.tripType === t ? 'active' : ''}`}
              onClick={() => setFormData({...formData, tripType: t})}>
              <div className="trip-radio" />
              <span>{t}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 700 }}>Book Verified Bikes and Cars</div>
        </div>

        {/* MAIN SEARCH AREA */}
        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto' }}>
          <div className="search-main-card">
            {/* 1. Pickup */}
            <div className="search-col" style={{ flex: 1.2 }}>
              <div className="col-label">From</div>
              <div className="col-value">{formData.pickup}</div>
              <div className="col-sub">{formData.pickupSub}</div>
              <div className="swap-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 3 21 8 16 13"/><line x1="21" y1="8" x2="9" y2="8"/><polyline points="8 21 3 16 8 11"/><line x1="3" y1="16" x2="15" y2="16"/></svg>
              </div>
            </div>

            {/* 2. Dropoff */}
            <div className="search-col" style={{ flex: 1 }}>
              <div className="col-label">To</div>
              <div className="col-value">{formData.dropoff}</div>
              <div className="col-sub">{formData.dropoffSub}</div>
            </div>

            {/* 3. Date */}
            <div className="search-col" onClick={() => setShowCal(!showCal)}>
              <div className="col-label">Departure <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value">{formData.dateDisplay}</div>
              <div className="col-sub">{formData.dayName}</div>
              {showCal && (
                <div className="cal-box" onClick={e => e.stopPropagation()}>
                   <CalendarInline selected={formData.selectedDate} onSelect={d => { setFormData({...formData, selectedDate:d, dateDisplay: formatPrettyDate(d), dayName: getDayName(d)}); setShowCal(false); }} />
                </div>
              )}
            </div>

            {/* 4. Return */}
            <div className="search-col" onClick={() => setShowDropCal(!showDropCal)}>
              <div className="col-label">Return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value" style={{ color: formData.dropDate ? "#1a202c" : "#718096", fontSize: formData.dropDate ? "32px" : "14px", marginTop: formData.dropDate ? "0" : "10px" }}>
                {formData.dropDateDisplay}
              </div>
              {formData.dropDate && <div className="col-sub">{getDayName(formData.dropDate)}</div>}
              {showDropCal && (
                <div className="cal-box" onClick={e => e.stopPropagation()}>
                   <CalendarInline selected={formData.dropDate} onSelect={d => { setFormData({...formData, dropDate:d, dropDateDisplay: formatPrettyDate(d)}); setShowDropCal(false); }} />
                </div>
              )}
            </div>

            {/* 5. Category */}
            <div className="search-col" style={{ flex: 1.3 }}>
              <div className="col-label">Vehicle Category <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
              <div className="col-value">All</div>
              <div className="col-sub">Select preferred category</div>
            </div>
          </div>

          <button className="floating-search-btn" onClick={handleSearch}>Search</button>
        </div>

        {/* SPECIAL FEATURES ROW */}
        <div className="special-fares-row" style={{ maxWidth: '1240px' }}>
          <div className="fares-label">Special Features</div>
          <div className="fares-list">
            {[
              { t:"Regular",  s:"Standard Pricing" },
              { t:"Student",  s:"Extra ID Discounts" },
              { t:"Military", s:"Armed Forces Spl" },
              { t:"Premium",  s:"Home Delivery" },
              { t:"Elite",    s:"No Deposit Option" },
            ].map(f => (
              <div key={f.t} className={`fare-card ${activeTab === f.t ? 'active' : ''}`} onClick={() => setActiveTab(f.t)}>
                <div className="f-title">{f.t}</div>
                <div className="f-sub">{f.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OFFERS SECTION */}
      <Offers />

      {/* WHY CHOOSE US */}
      <div className="why-section" style={{ paddingTop: "80px" }}>
        <div className="why-inner">
          <div className="section-header">
            <div style={{ display: "inline-block", background: "#f8fafc", color: "#64748b", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", padding: "8px 18px", borderRadius: "99px", marginBottom: "18px" }}>RoadMate Fleet</div>
            <h2 style={{ fontSize: "44px", fontWeight: 900, color: "#111", margin: "0 0 15px" }}>The Perfect Ride for Every Journey</h2>
            <p style={{ fontSize: "18px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>Choose from our wide range of bikes and cars tailored to your needs.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
            {featureCards.map((f,i) => (
              <div key={i} className="feature-card" style={{ padding: "40px 30px", background: "#fff", border: "1.5px solid #f0f0f0", borderRadius: "20px" }}>
                 <div style={{ fontSize: "32px", marginBottom: "20px" }}>{f.icon}</div>
                 <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#111", marginBottom: "10px" }}>{f.title}</h3>
                 <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="how-section" style={{ padding: "80px 40px", background: "#fff" }}>
        <div className="how-inner" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ display: "inline-block", background: "#3b82f615", color: "#3b82f6", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", padding: "8px 18px", borderRadius: "99px", marginBottom: "18px" }}>Seamless Process</div>
            <h2 style={{ fontSize: "44px", fontWeight: 900, color: "#111", margin: "0 0 15px" }}>Book Your Ride in 5 Easy Steps</h2>
            <p style={{ fontSize: "18px", color: "#666", maxWidth: "600px", margin: "0 auto" }}>Simple, fast, and completely online — no paperwork, no hassle.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px" }}>
            {[
              { step:"01", title:"Verify Docs",    desc:"Quick digital verification with zero physical paperwork." },
              { step:"02", title:"Choose Vehicle",  desc:"Select your preferred bike or car from our highly curated, verified fleet." },
              { step:"03", title:"Pick Date & Time",desc:"Set your rental date, pickup and drop-off time as per your convenience." },
              { step:"04", title:"Confirm Booking", desc:"Review the transparent pricing and confirm your booking instantly." },
              { step:"05", title:"Enjoy Ride",       desc:"Pick up your vehicle and enjoy the ride. It's that simple!" },
            ].map((s,i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", background: "#fff", border: "3px solid #3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "28px", fontWeight: 900, color: "#3b82f6", boxShadow: "0 10px 25px rgba(59,130,246,0.15)" }}>{s.step}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#777", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;