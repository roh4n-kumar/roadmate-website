import { useNavigate } from "react-router-dom";
import TimePopup from "./TimePopup";
import { useState, useRef, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import heroPremium from "../assets/hero-premium.png";

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

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const navigate = useNavigate();

  const vehicleRef = useRef(null);
  const dateRef    = useRef(null);
  const pickupRef  = useRef(null);
  const dropRef    = useRef(null);

  const [formData, setFormData] = useState({
    vehicle: "", selectedDate: null, dateDisplay: "", pickupTime: "", dropTime: ""
  });
  const [showPickup,      setShowPickup]      = useState(false);
  const [showDrop,        setShowDrop]        = useState(false);
  const [showCal,         setShowCal]         = useState(false);
  const [showVehiclePopup,setShowVehiclePopup]= useState(false);
  const [user,            setUser]            = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const formatPrettyDate = (d) => {
    const day   = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    return `${day} ${month}, ${d.getFullYear()}`;
  };

  const selectToday = () => {
    const d = new Date();
    setFormData(prev => ({ ...prev, selectedDate: d, dateDisplay: formatPrettyDate(d) }));
    setShowCal(false);
  };

  const selectTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setFormData(prev => ({ ...prev, selectedDate: d, dateDisplay: formatPrettyDate(d) }));
    setShowCal(false);
  };

  const handleSearch = () => {
    const { vehicle, selectedDate, pickupTime, dropTime } = formData;
    if (!vehicle || !selectedDate || !pickupTime || !dropTime) {
      alert("Please fill all fields before searching!");
      return;
    }
    const dateStr = selectedDate.toISOString().split("T")[0];
    navigate(`/vehicles?type=${encodeURIComponent(vehicle)}&date=${dateStr}&pickup=${encodeURIComponent(pickupTime)}&drop=${encodeURIComponent(dropTime)}`);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (vehicleRef.current && !vehicleRef.current.contains(e.target)) setShowVehiclePopup(false);
      if (dateRef.current    && !dateRef.current.contains(e.target))    setShowCal(false);
      if (pickupRef.current  && !pickupRef.current.contains(e.target))  setShowPickup(false);
      if (dropRef.current    && !dropRef.current.contains(e.target))    setShowDrop(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const featureCards = [
    { icon: "🛡️", title: "100% Verified Vehicles", desc: "Every bike and car is thoroughly inspected and verified before listing." },
    { icon: "💰", title: "No Hidden Charges",       desc: "Transparent pricing with GST included. What you see is what you pay." },
    { icon: "🕐", title: "24/7 Support",            desc: "Round-the-clock customer support for a hassle-free rental experience." },
    { icon: "🚀", title: "Instant Booking",         desc: "Book your ride in under 2 minutes. No paperwork, no waiting." },
  ];

  const stats = [
    { num: "50",   suffix: "+", line1: "Bikes",  line2: "Available" },
    { num: "20",   suffix: "+", line1: "Cars",   line2: "Available" },
    { num: "1000", suffix: "+", line1: "Happy",  line2: "Riders"    },
    { num: "4.9",  suffix: "",  line1: "Average",line2: "Rating ⭐"  },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
    * { box-sizing: border-box; }
    .hero-section { font-family: ${F}; background: #fff; }

    .search-ribbon {
      background: #0f172a;
      padding: 30px 40px 60px;
      position: relative;
      overflow: visible;
    }
    .search-inner { 
      max-width: 1250px; margin: 0 auto; display: flex; align-items: flex-end; gap: 0; position: relative; 
      background: rgba(255, 255, 255, 0.03); 
      backdrop-filter: blur(10px);
      padding: 20px;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .search-field { flex: 1; display: flex; flex-direction: column; gap: 8px; position: relative; padding: 0 20px; border-right: 1px solid rgba(255,255,255,0.1); }
    .search-field:last-child { border-right: none; }
    .search-label { font-size: 11px; color: rgba(255, 255, 255, 0.6); font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; font-family: ${H}; }
    .search-input-box { 
      background: rgba(255,255,255,0.05); 
      border: 1.5px solid rgba(255,255,255,0.08); 
      border-radius: 14px; height: 52px; padding: 0 16px; 
      display: flex; align-items: center; justify-content: space-between; 
      cursor: pointer; transition: all .2s cubic-bezier(0.16, 1, 0.3, 1); color: #fff; 
    }
    .search-input-box:hover { border-color: ${RED}; background: rgba(255,255,255,0.1); }
    .search-input-box span { font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.4); }
    .search-input-box span.filled { color: #fff; }

    .search-btn-wrap { display: flex; justify-content: center; position: relative; z-index: 50; margin-top: -26px; padding-bottom: 26px; }
    .search-btn { 
      background: ${RED}; color: #fff; border: none; padding: 0 48px; height: 52px; border-radius: 999px; 
      font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; 
      white-space: nowrap; box-shadow: 0 12px 32px rgba(190,13,13,0.4); 
      transition: all .2s cubic-bezier(0.16, 1, 0.3, 1); font-family: ${F}; 
    }
    .search-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(190,13,13,0.5); }

    .date-sub-row { display: flex; gap: 8px; align-items: center; }
    .date-trigger { flex: 1; }
    .quick-btn { background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); padding: 0 14px; height: 50px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; white-space: nowrap; font-family: ${F}; }
    .quick-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }

    .v-dropdown { position: absolute; top: calc(100% + 8px); left: 0; width: 100%; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.25); border: 1px solid #eee; z-index: 5000; }
    .v-option { padding: 13px 16px; font-size: 14px; font-weight: 600; color: #222; cursor: pointer; border-bottom: 1px solid #f5f5f5; transition: background .1s; }
    .v-option:last-child { border-bottom: none; }
    .v-option:hover { background: #fff5f5; color: ${RED}; }
    .v-option.active { background: #fff0f0; color: ${RED}; }

    .cal-popup { position: absolute; top: calc(100% + 8px); left: 0; background: #fff; border-radius: 18px; padding: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.18); border: 1px solid #f0f0f0; z-index: 9999; }

    .stats-bar { background: linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #1a0000 100%); padding: 16px 40px; }
    .stats-inner { max-width: 1250px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 60px; }
    .stat-item { display: flex; align-items: center; gap: 12px; }
    .stat-num { font-size: 26px; font-weight: 900; line-height: 1; }
    .stat-label { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 600; line-height: 1.4; }
    .stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

    .offer-section { padding: 60px 40px 40px; background: #fff; }
    .offer-inner { max-width: 1250px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.1); }
    .offer-inner img { width: 100%; height: auto; display: block; }

    .why-section { padding: 20px 40px 70px; background: #fff; }
    .why-inner { max-width: 1250px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 40px; }
    .section-tag { display: inline-block; background: #fff0f0; color: ${RED}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 99px; margin-bottom: 14px; }
    .section-title { font-size: clamp(24px, 3vw, 36px); font-weight: 900; color: #111; margin: 0 0 10px; line-height: 1.2; }
    .section-sub { font-size: 15px; color: #888; font-weight: 500; max-width: 480px; margin: 0 auto; }
    .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .feature-card { background: #fff; border-radius: 20px; padding: 32px 24px; border: 1.5px solid #f0f0f0; transition: transform .25s, box-shadow .25s, border-color .25s; cursor: default; position: relative; overflow: hidden; }
    .feature-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${RED}, #e84545); transform: scaleX(0); transition: transform .25s; transform-origin: left; }
    .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); border-color: #ffd5d5; }
    .feature-card:hover::before { transform: scaleX(1); }
    .feature-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #fff0f0, #ffe0e0); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; }
    .feature-title { font-size: 16px; font-weight: 800; color: #111; margin: 0 0 8px; }
    .feature-desc { font-size: 13px; color: #888; line-height: 1.65; margin: 0; font-weight: 500; }

    .how-section { padding: 30px 40px 70px; background: #fafafa; }
    .how-inner { max-width: 1250px; margin: 0 auto; }
    .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; position: relative; }
    .steps-grid::before { content: ''; position: absolute; top: 32px; left: 12.5%; right: 12.5%; height: 2px; background: linear-gradient(90deg, ${RED}40, ${RED}, ${RED}40); }
    .step-card { text-align: center; position: relative; z-index: 1; }
    .step-num { width: 64px; height: 64px; background: #fff; border: 2px solid ${RED}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 20px; font-weight: 900; color: ${RED}; box-shadow: 0 4px 16px rgba(190,13,13,0.15); }
    .step-title { font-size: 15px; font-weight: 800; color: #111; margin: 0 0 8px; }
    .step-desc { font-size: 13px; color: #888; line-height: 1.6; font-weight: 500; }

    @media (max-width: 900px) {
      .search-ribbon { padding: 20px 20px 60px; }
      .search-inner { flex-direction: column; gap: 10px; align-items: stretch; }
      .search-field { flex: none; border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
      .search-btn { width: 100%; justify-content: center; border-radius: 14px; height: 50px; }
      .search-btn:hover { transform: none; }
      .stats-bar { padding: 16px 20px; }
      .stats-inner { gap: 20px; flex-wrap: wrap; justify-content: center; }
      .stat-num { font-size: 20px; }
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

    @media (max-width: 540px) {
      .features-grid { grid-template-columns: 1fr; }
      .steps-grid { grid-template-columns: 1fr; }
      .stat-divider { display: none; }
      .stats-inner { gap: 16px; }
      .section-title { font-size: 22px; }
    }
  `;

  const CalIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
  const ClockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  const ChevronIcon = ({ flip }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition:"transform .2s", transform: flip ? "rotate(180deg)" : "none" }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );

  return (
    <section className="hero-section" style={{ marginTop:"64px" }}>
      <style>{css}</style>

{/* BANNER — hidden on mobile */}
      <div className="hero-banner" style={{ width:"100%", position:"relative", lineHeight:0, overflow:"hidden", height: "min(600px, 70vh)" }}>
        <img src={heroPremium} alt="RoadMate Premium" style={{ width:"100%", height:"100%", display:"block", objectFit:"cover" }} />
        {/* Text overlay */}
        <div style={{
          position:"absolute", top:0, left:0, bottom:0,
          display:"flex", alignItems:"center",
          padding:"0 5%",
          background:"linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 55%, transparent 80%)",
        }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.9)", fontSize:"clamp(13px,1.8vw,18px)", fontWeight:800, margin:"0 0 8px", letterSpacing:"1.5px", fontFamily:H, textTransform: "uppercase" }}>
              Bhubaneswar's Smart Way to
            </p>
            <h1 style={{ margin:"0 0 6px", lineHeight:1.1, fontFamily:H }}>
              <span style={{ color:RED, fontSize:"clamp(32px,5vw,72px)", fontWeight:900, marginRight:"14px" }}>
                Rent
              </span>
              <span style={{ color:"#fff", fontSize:"clamp(32px,5vw,72px)", fontWeight:900 }}>
                Bikes &amp; Cars
              </span>
            </h1>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"clamp(12px,1.4vw,17px)", fontWeight:600, margin:"12px 0 0", fontFamily:F }}>
              Affordable · Verified · Instant Booking
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH RIBBON */}
      <div className="search-ribbon">
        <div className="search-inner">

          {/* 1. Vehicle */}
          <div ref={vehicleRef} className="search-field">
            <span className="search-label">Type of Vehicle</span>
            <div className="search-input-box" onClick={() => setShowVehiclePopup(p => !p)}>
              <span className={formData.vehicle ? "filled" : ""}>{formData.vehicle || "Select Vehicle"}</span>
              <ChevronIcon flip={showVehiclePopup} />
            </div>
            {showVehiclePopup && (
              <div className="v-dropdown">
                {["Bike","Car"].map(v => (
                  <div key={v} className={`v-option${formData.vehicle===v?" active":""}`}
                    onClick={e => { e.stopPropagation(); setFormData(p=>({...p,vehicle:v})); setShowVehiclePopup(false); }}>
                    {v}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Date */}
          <div ref={dateRef} className="search-field" style={{ flex:1.8 }}>
            <span className="search-label">Date of Booking</span>
            <div className="date-sub-row">
              <div className="search-input-box date-trigger"
                onClick={e => { e.stopPropagation(); setShowCal(p=>!p); }}>
                <span className={formData.dateDisplay ? "filled" : ""}>{formData.dateDisplay || "Select date"}</span>
                <CalIcon />
              </div>
              <button className="quick-btn" onClick={selectToday}>Today</button>
              <button className="quick-btn" onClick={selectTomorrow}>Tomorrow</button>
            </div>

            {/* ── Custom Calendar Popup ── */}
            {showCal && (
              <div className="cal-popup"
                style={{ width: dateRef.current ? dateRef.current.offsetWidth+"px" : "340px" }}>
                <CalendarInline
                  selected={formData.selectedDate}
                  onSelect={d => {
                    setFormData(p => ({ ...p, selectedDate: d, dateDisplay: formatPrettyDate(d) }));
                    setShowCal(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* 3. Pickup Time */}
          <div ref={pickupRef} className="search-field">
            <span className="search-label">Pickup Time</span>
            <div className="search-input-box" onClick={e => { e.stopPropagation(); setShowPickup(p=>!p); }}>
              <span className={formData.pickupTime ? "filled" : ""}>{formData.pickupTime || "Select time"}</span>
              <ClockIcon />
            </div>
            {showPickup && (
              <div style={{ position:"absolute", top:"110%", left:0, zIndex:9999,
                width: pickupRef.current ? pickupRef.current.offsetWidth+"px" : "190px" }}>
                <TimePopup onSelect={t => { setFormData(p=>({...p,pickupTime:t})); setShowPickup(false); }} />
              </div>
            )}
          </div>

          {/* 4. Drop Time */}
          <div ref={dropRef} className="search-field">
            <span className="search-label">Drop Time</span>
            <div className="search-input-box" onClick={e => { e.stopPropagation(); setShowDrop(p=>!p); }}>
              <span className={formData.dropTime ? "filled" : ""}>{formData.dropTime || "Select time"}</span>
              <ClockIcon />
            </div>
            {showDrop && (
              <div style={{ position:"absolute", top:"110%", left:0, zIndex:9999,
                width: dropRef.current ? dropRef.current.offsetWidth+"px" : "190px" }}>
                <TimePopup onSelect={t => { setFormData(p=>({...p,dropTime:t})); setShowDrop(false); }} alignRight />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SEARCH BUTTON */}
      <div className="search-btn-wrap">
        <button className="search-btn" onClick={handleSearch}>
          <SearchIcon /> Search Availability
        </button>
      </div>

      {/* OFFER BANNER */}
      <div className="offer-section">
        <div className="offer-inner">
          <img src="/offer_banner.png" alt="Special Offer" />
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="why-section">
        <div className="why-inner">
          <div className="section-header">
            <div className="section-tag">Why RoadMate</div>
            <h2 className="section-title">Bhubaneswar's Most Trusted<br/>Vehicle Rental Platform</h2>
            <p className="section-sub">Everything you need for a smooth, safe, and affordable rental experience.</p>
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

      {/* HOW IT WORKS */}
      <div className="how-section">
        <div className="how-inner">
          <div className="section-header">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">Book Your Ride in 4 Easy Steps</h2>
            <p className="section-sub">Simple, fast, and completely online — no paperwork needed.</p>
          </div>
          <div className="steps-grid">
            {[
              { step:"1", title:"Choose Vehicle",  desc:"Select your preferred bike or car from our verified fleet." },
              { step:"2", title:"Pick Date & Time",desc:"Set your rental date, pickup and drop-off time." },
              { step:"3", title:"Confirm Booking", desc:"Review the price and confirm your booking instantly." },
              { step:"4", title:"Ride Away",        desc:"Pick up your vehicle and enjoy the ride. It's that simple!" },
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

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          {stats.map((s,i) => (
            <>
              {i > 0 && <div key={"d"+i} className="stat-divider" />}
              <div key={s.num+i} className="stat-item">
                <div>
                  <div className="stat-num">
                    <span style={{ color:"#fff" }}>{s.num}</span>
                    <span style={{ color:RED }}>{s.suffix}</span>
                  </div>
                  <div className="stat-label">
                    <div>{s.line1}</div>
                    <div>{s.line2}</div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>


    </section>
  );
};

export default Hero;