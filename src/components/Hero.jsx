import { useNavigate } from "react-router-dom";
import TimePopup from "./TimePopup";
import { useState, useRef, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

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
    .hero-section { font-family: 'Outfit', sans-serif; background: #fff; overflow: visible; }

    .search-ribbon {
      background: linear-gradient(180deg, #111 0%, #0f172a 100%);
      padding: 60px 40px 100px;
      position: relative;
      overflow: visible;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    
    .search-inner-wrapper {
      max-width: 1250px;
      margin: 0 auto;
      position: relative;
    }

    .glass-search-container {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 28px;
      padding: 40px;
      display: flex;
      align-items: flex-end;
      gap: 0;
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
      margin-bottom: -60px;
      position: relative;
      z-index: 100;
    }

    .search-field { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
      gap: 10px; 
      position: relative; 
      padding-right: 25px; 
      margin-right: 25px; 
      border-right: 1px solid rgba(255,255,255,0.1); 
    }
    .search-field { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
      gap: 10px; 
      position: relative; 
      padding-right: 25px; 
      margin-right: 25px; 
      border-right: 1px solid rgba(255,255,255,0.1); 
    }
    .search-field:last-child { border-right: none; padding-right: 0; margin-right: 0; }
    
    .search-label { 
      font-size: 11px; 
      color: rgba(255, 255, 255, 0.6); 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 1.2px; 
      padding-left: 4px;
      font-family: ${H};
    }
    
    .search-input-box { 
      background: rgba(255,255,255,0.05); 
      border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 16px; 
      height: 56px; 
      padding: 0 18px; 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      cursor: pointer; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      color: #fff; 
    }
    .search-input-box:hover { 
      border-color: ${RED}; 
      background: rgba(255,255,255,0.08); 
      box-shadow: 0 0 20px rgba(190, 13, 13, 0.2);
    }
    .search-input-box span { font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.4); }
    .search-input-box span.filled { color: #fff; font-weight: 600; }

    .search-btn-container {
      display: flex;
      justify-content: center;
      margin-top: -30px;
      position: relative;
      z-index: 150;
    }

    .search-btn { 
      background: ${RED}; 
      color: #fff; 
      border: none; 
      padding: 0 50px; 
      height: 60px; 
      border-radius: 20px; 
      font-size: 16px; 
      font-weight: 700; 
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      white-space: nowrap; 
      box-shadow: 0 15px 35px rgba(190,13,13,0.4); 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      font-family: 'Outfit', sans-serif; 
    }
    .search-btn:hover { 
      transform: translateY(-3px) scale(1.02); 
      box-shadow: 0 15px 40px rgba(190,13,13,0.5); 
      filter: brightness(1.1);
    }
    .search-btn:active { transform: translateY(0) scale(0.98); }

    .date-sub-row { display: flex; gap: 10px; align-items: center; }
    .date-trigger { flex: 1; }
    .quick-btn { 
      background: rgba(255,255,255,0.08); 
      border: 1px solid rgba(255,255,255,0.1); 
      color: rgba(255,255,255,0.7); 
      padding: 0 16px; 
      height: 56px; 
      border-radius: 16px; 
      font-size: 13px; 
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.2s; 
      font-family: ${H}; 
    }
    .quick-btn:hover { background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3); }

    .v-dropdown { 
      position: absolute; 
      top: calc(100% + 12px); 
      left: 0; 
      width: 100%; 
      background: #fff; 
      border-radius: 20px; 
      overflow: hidden; 
      box-shadow: 0 20px 50px rgba(0,0,0,0.15); 
      border: 1px solid #eee; 
      z-index: 5000; 
      padding: 8px;
    }
    .v-option { 
      padding: 14px 18px; 
      font-size: 15px; 
      font-weight: 600; 
      color: #333; 
      cursor: pointer; 
      border-radius: 12px;
      transition: all 0.2s; 
      margin-bottom: 4px;
    }
    .v-option:last-child { margin-bottom: 0; }
    .v-option:hover { background: #fff0f0; color: var(--brand-red); }
    .v-option.active { background: var(--brand-red); color: #fff; }

    .cal-popup { 
      position: absolute; 
      top: calc(100% + 12px); 
      left: 0; 
      background: #fff; 
      border-radius: 24px; 
      padding: 24px; 
      box-shadow: 0 25px 60px rgba(0,0,0,0.12); 
      border: 1px solid #f0f0f0; 
      z-index: 9999; 
    }

    .stats-bar { 
      background: var(--ribbon-dark); 
      padding: 40px 40px; 
      position: relative;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .stats-inner { max-width: 1250px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
    .stat-item { display: flex; align-items: center; gap: 15px; }
    .stat-num { font-size: 36px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
    .stat-label { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; line-height: 1.4; text-transform: uppercase; letter-spacing: 1px; }
    .stat-divider { width: 1px; height: 50px; background: rgba(255,255,255,0.1); }

    .offer-section { padding: 100px 40px 60px; background: #fff; }
    .offer-inner { max-width: 1250px; margin: 0 auto; border-radius: 30px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.08); transition: transform 0.4s; }
    .offer-inner:hover { transform: scale(1.01); }
    .offer-inner img { width: 100%; height: auto; display: block; }

    .why-section { padding: 60px 40px 100px; background: #fff; }
    .why-inner { max-width: 1250px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 60px; }
    .section-tag { 
      display: inline-block; 
      background: #fff0f0; 
      color: var(--brand-red); 
      font-size: 12px; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      padding: 8px 18px; 
      border-radius: 99px; 
      margin-bottom: 18px; 
    }
    .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #111; margin: 0 0 15px; line-height: 1.1; letter-spacing: -0.5px; }
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
      background: var(--brand-red); 
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
    .feature-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 12px; }
    .feature-desc { font-size: 14px; color: #777; line-height: 1.7; margin: 0; font-weight: 450; }

    .how-section { padding: 80px 40px 100px; background: #fafafa; position: relative; overflow: hidden; }
    .how-inner { max-width: 1250px; margin: 0 auto; position: relative; z-index: 1; }
    .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; position: relative; }
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
      border: 3px solid var(--brand-red); 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      margin: 0 auto 24px; 
      font-size: 28px; 
      font-weight: 900; 
      color: var(--brand-red); 
      box-shadow: 0 10px 25px rgba(190,13,13,0.15); 
      transition: all 0.3s;
    }
    .step-card:hover .step-num { background: var(--brand-red); color: #fff; transform: scale(1.1); }
    .step-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 10px; }
    .step-desc { font-size: 14px; color: #777; line-height: 1.6; font-weight: 400; max-width: 220px; margin: 0 auto; }

    @media (max-width: 1100px) {
      .stats-inner { gap: 30px; flex-wrap: wrap; justify-content: center; }
      .stat-divider { display: none; }
    }

    @media (max-width: 900px) {
      .search-ribbon { padding: 30px 20px 100px; }
      .glass-search-container { 
        flex-direction: column; 
        gap: 15px; 
        align-items: stretch; 
        padding: 24px;
        margin-bottom: -150px;
      }
      .search-field { flex: none; border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
      .search-btn { width: 100%; justify-content: center; border-radius: 16px; height: 56px; }
      .search-btn:hover { transform: none; }
      
      .stats-bar { padding: 40px 20px; }
      .stat-num { font-size: 28px; }
      
      .offer-section { padding: 180px 20px 40px; }
      .why-section { padding: 40px 20px 60px; }
      .features-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
      .how-section { padding: 40px 20px 60px; }
      .steps-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
      .steps-grid-connector { display: none; }
      
      .hero-banner { display: block !important; }
      .hero-section { margin-top: 56px !important; }
      .search-ribbon { padding-top: 30px !important; }
    }

    @media (max-width: 540px) {
      .features-grid { grid-template-columns: 1fr; }
      .steps-grid { grid-template-columns: 1fr; }
      .section-title { font-size: 26px; }
      .stat-item { width: 45%; justify-content: center; }
    }

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
    <section className="hero-section" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", background: "#fbfbfb", paddingBottom: "100px" }}>
      <style>{css}</style>

      {/* SEARCH RIBBON */}
      <div className="search-ribbon" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
        <div className="search-inner-wrapper">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h1 style={{ fontSize: "clamp(34px, 5vw, 64px)", fontWeight: 900, color: "#fff", marginBottom: "15px", letterSpacing: "-2px" }}>
              Rent <span style={{ color: RED }}>Premium</span> Bikes & Cars
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", fontWeight: 500 }}>Bhubaneswar's elite vehicle rental platform.</p>
          </div>
          <div className="glass-search-container">
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
                <div style={{ position:"absolute", top:"115%", left:0, zIndex:9999,
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
                <div style={{ position:"absolute", top:"115%", left:0, zIndex:9999,
                  width: dropRef.current ? dropRef.current.offsetWidth+"px" : "190px" }}>
                  <TimePopup onSelect={t => { setFormData(p=>({...p,dropTime:t})); setShowDrop(false); }} alignRight />
                </div>
              )}
            </div>
          </div>

          <div className="search-btn-container">
            <button className="search-btn" onClick={handleSearch}>
              <SearchIcon /> Search Availability
            </button>
          </div>
        </div>
      </div>

      {/* STATS BAR - moved above offer for better hierarchy */}
      <div className="stats-bar">
        <div className="stats-inner">
          {stats.map((s,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div key={s.num+i} className="stat-item">
                <div className="stat-num">
                  <span style={{ color:"#fff" }}>{s.num}</span>
                  <span style={{ color:'var(--brand-red)' }}>{s.suffix}</span>
                </div>
                <div className="stat-label">
                  <div>{s.line1}</div>
                  <div>{s.line2}</div>
                </div>
              </div>
              {i < stats.length - 1 && <div className="stat-divider" style={{ marginLeft: '40px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="why-section" style={{ paddingTop: "100px" }}>
        <div className="why-inner">
          <div className="section-header">
            <div className="section-tag">Premium Benefits</div>
            <h2 className="section-title">Bhubaneswar's Most Trusted<br/>Vehicle Rental Platform</h2>
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

      {/* HOW IT WORKS */}
      <div className="how-section">
        <div className="how-inner">
          <div className="section-header">
            <div className="section-tag">Seamless Process</div>
            <h2 className="section-title">Book Your Ride in 4 Easy Steps</h2>
            <p className="section-sub">Simple, fast, and completely online — no paperwork, no hassle.</p>
          </div>
          <div className="steps-grid">
            <div className="steps-grid-connector" />
            {[
              { step:"01", title:"Choose Vehicle",  desc:"Select your preferred bike or car from our highly curated, verified fleet." },
              { step:"02", title:"Pick Date & Time",desc:"Set your rental date, pickup and drop-off time as per your convenience." },
              { step:"03", title:"Confirm Booking", desc:"Review the transparent pricing and confirm your booking instantly." },
              { step:"04", title:"Ride Away",        desc:"Pick up your vehicle and enjoy the ride. It's that simple!" },
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