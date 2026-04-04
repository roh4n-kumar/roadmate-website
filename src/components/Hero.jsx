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

// ── Hero ──────────────────────────────────────────────────────────────────────


const Hero = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const navigate = useNavigate();

  const vehicleRef = useRef(null);
  const dateRef    = useRef(null);
  const pickupRef  = useRef(null);
  const dropRef    = useRef(null);

  const [selectedService, setSelectedService] = useState("Bikes");
  const [tripType, setTripType] = useState("Daily");
  const [formData, setFormData] = useState({
    vehicle: "Bike", selectedDate: null, dateDisplay: "", pickupTime: "09:00 AM", dropTime: "09:00 PM",
    location: "Bhubaneswar", pickupPoint: "Saheed Nagar", dropDate: null, dropDateDisplay: ""
  });
  const [showPickup,      setShowPickup]      = useState(false);
  const [showDrop,        setShowDrop]        = useState(false);
  const [showCal,         setShowCal]         = useState(false);
  const [showDropCal,     setShowDropCal]     = useState(false);
  const [showVehiclePopup,setShowVehiclePopup]= useState(false);
  const [user,            setUser]            = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const formatPrettyDate = (d) => {
    if (!d) return "";
    const day   = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year  = d.getFullYear().toString().slice(-2);
    return `${day} ${month}'${year}`;
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
      if (dateRef.current    && !dateRef.current.contains(e.target))    { setShowCal(false); setShowDropCal(false); }
      if (pickupRef.current  && !pickupRef.current.contains(e.target))  setShowPickup(false);
      if (dropRef.current    && !dropRef.current.contains(e.target))    setShowDrop(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Icons for Tabs
  const ServiceIcon = ({ type, active }) => {
    const color = active ? "#3b82f6" : "#455a64";
    if (type === "All") return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    if (type === "Bikes") return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>;
    if (type === "Cars") return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
    if (type === "Scooters") return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"/><path d="M5 19v-4h14M8 19l2-8 3 1h2"/></svg>;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  };

  const featureCards = [
    { icon: <FaGift />, title: "100% Verified Vehicles", desc: "Every bike and car is thoroughly inspected and verified before listing." },
    { icon: <FaCreditCard />,  title: "No Hidden Charges",       desc: "Transparent pricing with GST included. What you see is what you pay." },
    { icon: <FaSun />,  title: "24/7 Support",            desc: "Round-the-clock customer support for a hassle-free rental experience." },
    { icon: <FaIdCard />,   title: "Instant Booking",         desc: "Book your ride in under 2 minutes. No paperwork, no waiting." },
  ];

  const css = `
    .hero-section { font-family: 'Inter', sans-serif; background: #f2f2f2; overflow: visible; padding-bottom: 60px; }
    
    .search-ribbon {
      background: url('https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=2070') center/cover no-repeat;
      padding: 80px 20px 40px;
      position: relative;
      min-height: 540px;
    }
    .search-ribbon::before {
      content: '';
      position: absolute;
      top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.45);
    }

    .search-inner-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* SERVICE TABS */
    .service-tabs-nav {
      display: flex;
      justify-content: center;
      background: #fff;
      border-radius: 12px;
      padding: 8px 15px;
      gap: 5px;
      width: fit-content;
      margin: 0 auto -10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      position: relative;
      z-index: 10;
    }
    .service-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 22px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s;
      gap: 4px;
      position: relative;
    }
    .service-tab span { font-size: 13px; font-weight: 700; color: #455a64; font-family: 'Outfit'; }
    .service-tab.active span { color: #3b82f6; }
    .service-tab.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 15%;
      right: 15%;
      height: 3px;
      background: #3b82f6;
      border-radius: 2px;
    }
    .badge-new {
      position: absolute;
      top: -2px;
      right: 4px;
      background: #9c27b0;
      color: #fff;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    /* MAIN CARD */
    .search-card-main {
      background: #fff;
      border-radius: 20px;
      padding: 30px 0 60px;
      box-shadow: 0 40px 100px rgba(0,0,0,0.25);
      position: relative;
    }

    .trip-selectors {
      display: flex;
      gap: 25px;
      padding: 0 40px 25px;
    }
    .trip-type {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      color: #111;
    }
    .radio-circle {
      width: 18px;
      height: 18px;
      border: 1.5px solid #ccc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .trip-type.active .radio-circle { border-color: #3b82f6; }
    .trip-type.active .radio-circle::after {
      content: '';
      width: 10px;
      height: 10px;
      background: #3b82f6;
      border-radius: 50%;
    }

    .search-inputs-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr 1fr;
      border: 1.5px solid #e0e0e0;
      border-radius: 12px;
      margin: 0 40px;
    }
    .input-sec {
      padding: 15px 25px;
      border-right: 1.5px solid #e0e0e0;
      cursor: pointer;
      transition: background 0.2s;
      position: relative;
    }
    .input-sec:last-child { border-right: none; }
    .input-sec:hover { background: #f8faff; }

    .sec-label { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; display: flex; align-items: center; gap: 5px; }
    .sec-value { 
      font-size: 32px; 
      font-weight: 900; 
      color: #111; 
      font-family: 'Outfit'; 
      line-height:1;
      margin-bottom: 5px;
    }
    .sec-sub { font-size: 12px; color: #64748b; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .swap-btn {
      position: absolute;
      right: -18px;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      background: #fff;
      border: 1.5px solid #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
      color: #3b82f6;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .special-fares {
       display: flex;
       align-items: center;
       gap: 15px;
       padding: 25px 40px 0;
    }
    .fares-label { font-size: 12px; font-weight: 800; color: #111; text-transform: uppercase; letter-spacing: 0.5px; }
    .fare-tag {
      padding: 8px 16px;
      background: #f1f5f9;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }
    .fare-tag.active { background: #e0f2fe; border-color: #3b82f6; color: #0369a1; }

    .floating-search-btn {
      position: absolute;
      bottom: -32px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
      color: #fff;
      border: none;
      padding: 0 60px;
      height: 64px;
      border-radius: 32px;
      font-size: 24px;
      font-weight: 900;
      font-family: 'Outfit';
      cursor: pointer;
      box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4);
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .floating-search-btn:hover { transform: translateX(-50%) translateY(-3px); box-shadow: 0 25px 50px rgba(37, 99, 235, 0.5); }

    .cal-box { position: absolute; top: 105%; left: 0; background: #fff; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); border: 1px solid #eee; z-index: 1000; padding: 20px; }

    @media (max-width: 1000px) {
      .search-inputs-grid { grid-template-columns: 1fr; }
      .input-sec { border-right: none; border-bottom: 1.5px solid #e0e0e0; }
      .swap-btn { display: none; }
      .service-tabs-nav { overflow-x: auto; max-width: 100%; justify-content: flex-start; }
      .floating-search-btn { width: 90%; padding: 0; font-size: 20px; }
      .search-card-main { padding-bottom: 80px; }
    }
  `;

  return (
    <section className="hero-section">
      <style>{css}</style>

      <div className="search-ribbon">
        <div className="search-inner-wrapper">
          
          {/* SERVICE TABS */}
          <div className="service-tabs-nav">
             {["All", "Bikes", "Cars", "Scooters", "Luxury"].map(srv => (
               <div key={srv} className={`service-tab ${selectedService === srv ? 'active' : ''}`} onClick={() => setSelectedService(srv)}>
                 <ServiceIcon type={srv} active={selectedService === srv} />
                 <span>{srv}</span>
                 {(srv === "Scooters" || srv === "Luxury") && <div className="badge-new">new</div>}
               </div>
             ))}
          </div>

          {/* MAIN SEARCH CARD */}
          <div className="search-card-main">
             <div className="trip-selectors">
                {["Daily", "Weekly/Monthly", "Subscription"].map(type => (
                  <div key={type} className={`trip-type ${tripType === type ? 'active' : ''}`} onClick={() => setTripType(type)}>
                    <div className="radio-circle" /> {type}
                  </div>
                ))}
             </div>

             <div className="search-inputs-grid">
                {/* 1. From Location */}
                <div className="input-sec">
                   <div className="sec-label">Pick-up Location</div>
                   <div className="sec-value">{formData.location}</div>
                   <div className="sec-sub">{formData.pickupPoint}, Odisha India</div>
                   <div className="swap-btn">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
                   </div>
                </div>

                {/* 2. Pickup Date */}
                <div className="input-sec" onClick={() => setShowCal(!showCal)}>
                   <div className="sec-label">Departure <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
                   <div className="sec-value">{formData.dateDisplay || "Select"}</div>
                   <div className="sec-sub">{formData.pickupTime} | Click to change</div>
                   {showCal && (
                     <div className="cal-box" onClick={e => e.stopPropagation()}>
                        <CalendarInline selected={formData.selectedDate} onSelect={d => { setFormData({...formData, selectedDate:d, dateDisplay: formatPrettyDate(d)}); setShowCal(false); }} />
                     </div>
                   )}
                </div>

                {/* 3. Drop Date */}
                <div className="input-sec" onClick={() => setShowDropCal(!showDropCal)}>
                   <div className="sec-label">Return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
                   <div className="sec-value">{formData.dropDateDisplay || formatPrettyDate(new Date())}</div>
                   <div className="sec-sub">Tap to add return for more savings</div>
                   {showDropCal && (
                     <div className="cal-box" onClick={e => e.stopPropagation()}>
                        <CalendarInline selected={formData.dropDate} onSelect={d => { setFormData({...formData, dropDate:d, dropDateDisplay: formatPrettyDate(d)}); setShowDropCal(false); }} />
                     </div>
                   )}
                </div>

                {/* 4. Category */}
                <div className="input-sec">
                   <div className="sec-label">Vehicle Category <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg></div>
                   <div className="sec-value">Standard</div>
                   <div className="sec-sub">Economy/Premium Selection</div>
                </div>
             </div>

             <div className="special-fares">
                <div className="fares-label">Special Features</div>
                {["Helmet Incl.", "Home Delivery", "Verified Only", "No Security Deposit"].map(f => (
                  <div key={f} className={`fare-tag ${f === "Helmet Incl." ? 'active' : ''}`}>{f}</div>
                ))}
             </div>

             <button className="floating-search-btn" onClick={handleSearch}>Search</button>
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