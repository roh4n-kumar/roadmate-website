import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimePopup from "./TimePopup";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

// ── Calendar helpers ──────────────────────────────────────────────────────────
const DAYS   = ["SU","MO","TU","WE","TH","FR","SA"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay    = (y, m) => new Date(y, m, 1).getDay();

// Convert "08:30 AM" → "08:30" for URL param
const to24 = (t) => {
  if (!t) return "";
  const [time, meridiem] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
};

// ── Inline Calendar ───────────────────────────────────────────────────────────
const CalendarInline = ({ value, onChange }) => {
  const today = new Date();
  const [vy, setVy] = useState(today.getFullYear());
  const [vm, setVm] = useState(today.getMonth());

  const dim      = getDaysInMonth(vy, vm);
  const firstDay = getFirstDay(vy, vm);

  const prevM = () => { if (vm === 0) { setVm(11); setVy(y=>y-1); } else setVm(m=>m-1); };
  const nextM = () => { if (vm === 11) { setVm(0); setVy(y=>y+1); } else setVm(m=>m+1); };

  const isToday = d => d === today.getDate() && vm === today.getMonth() && vy === today.getFullYear();

  // value is "YYYY-MM-DD"
  const selDate  = value ? new Date(value) : null;
  const isSel    = d => selDate && d === selDate.getDate() && vm === selDate.getMonth() && vy === selDate.getFullYear();

  const pick = d => {
    const mm = String(vm + 1).padStart(2,"0");
    const dd = String(d).padStart(2,"0");
    onChange(`${vy}-${mm}-${dd}`);
  };

  const quickPick = offset => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    setVy(d.getFullYear()); setVm(d.getMonth());
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    onChange(`${d.getFullYear()}-${mm}-${dd}`);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);

  return (
    <div style={{ fontFamily: F }}>
      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:"8px" }}>
          <span style={{ fontSize:"18px", fontWeight:700, color:"#111" }}>{MONTHS[vm]}</span>
          <span style={{ fontSize:"15px", fontWeight:600, color:RED }}>{vy}</span>
        </div>
        <div style={{ display:"flex", gap:"6px" }}>
          {[["‹", prevM],["›", nextM]].map(([lbl,fn]) => (
            <button key={lbl} onClick={fn} style={{
              width:32, height:32, borderRadius:"9px",
              border:"1px solid #eee", background:"#fafafa",
              color:"#555", fontSize:"16px", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700,
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Quick buttons */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
        {["Today","Tomorrow"].map((lbl,i) => (
          <button key={lbl} onClick={() => quickPick(i)} style={{
            flex:1, padding:"7px 0", borderRadius:"10px",
            border:`1px solid ${RED}30`, background:"#fff9f9",
            color:RED, fontWeight:600, fontSize:"12px", cursor:"pointer", fontFamily:F,
          }}>{lbl}</button>
        ))}
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:"4px" }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign:"center", fontSize:"10px", fontWeight:700,
            letterSpacing:"1px", padding:"5px 0",
            color: d==="SU"||d==="SA" ? RED : "#bbb",
          }}>{d}</div>
        ))}
      </div>
      <div style={{ height:1, background:"#f3f3f3", marginBottom:"6px" }} />

      {/* Date grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"3px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const col  = (firstDay + day - 1) % 7;
          const wknd = col === 0 || col === 6;
          const sel  = isSel(day);
          const tod  = isToday(day);
          // Disable past dates
          const cellDate = new Date(vy, vm, day);
          const isPast   = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <button key={day} disabled={isPast} onClick={() => pick(day)} style={{
              aspectRatio:"1", borderRadius:"9px",
              border: sel ? `2px solid ${RED}` : tod ? `2px solid ${RED}40` : "2px solid transparent",
              background: sel ? RED : tod ? `${RED}12` : "transparent",
              color: isPast ? "#ddd" : sel ? "#fff" : wknd ? RED : "#222",
              fontSize:"13px", fontWeight: sel ? 700 : tod ? 600 : 400,
              cursor: isPast ? "default" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .12s", fontFamily:F,
            }}
              onMouseEnter={e => { if (!sel && !isPast) e.currentTarget.style.background = `${RED}15`; }}
              onMouseLeave={e => { if (!sel && !isPast) e.currentTarget.style.background = tod ? `${RED}12` : "transparent"; }}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
};

// ── Format date for display ───────────────────────────────────────────────────
const fmtDate = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
};

// ── Main BookingForm ──────────────────────────────────────────────────────────
const BookingForm = () => {
  const navigate = useNavigate();

  const [vehicleType,  setVehicleType]  = useState("Bike");
  const [date,         setDate]         = useState("");
  const [pickupTime,   setPickupTime]   = useState("");
  const [dropTime,     setDropTime]     = useState("");

  // which popup is open: "calendar" | "pickup" | "drop" | null
  const [openPanel, setOpenPanel] = useState(null);

  const panelRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    if (!date || !pickupTime || !dropTime) return;
    const p = to24(pickupTime);
    const d = to24(dropTime);
    navigate(`/vehicles?type=${encodeURIComponent(vehicleType)}&date=${date}&pickup=${p}&drop=${d}`);
  };

  const ready = date && pickupTime && dropTime;

  // ── Field button style ──
  const fieldBtn = (active) => ({
    display:"flex", alignItems:"center", gap:"10px",
    padding:"14px 18px", borderRadius:"16px",
    border:`1.5px solid ${active ? RED : "rgba(15, 23, 42, 0.08)"}`,
    background: active ? "#fffcfc" : "#fff",
    cursor:"pointer", width:"100%", textAlign:"left",
    transition:"all .25s cubic-bezier(0.16, 1, 0.3, 1)", fontFamily:F,
    boxShadow: active ? `0 6px 20px rgba(190,13,13,0.12)` : "none",
  });

  return (
    <div style={{
      width:"100%", maxWidth:"520px", margin:"0 auto",
      fontFamily: F,
      position:"relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @media (max-width: 600px) {
          .bf-panel {
            position: fixed !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            border-radius: 20px 20px 0 0 !important;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999 !important;
          }
          .bf-panel-overlay {
            display: block !important;
          }
          .bf-time-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ── Card ── */}
      <div style={{
        background:"rgba(255, 255, 255, 0.95)", borderRadius:"28px",
        padding:"28px", boxShadow:"0 20px 60px rgba(0,0,0,0.1)",
        border:"1px solid rgba(15, 23, 42, 0.05)",
        backdropFilter: "blur(20px)",
      }}>

        {/* Vehicle type toggle */}
        <div style={{ display:"flex", background:"#f8fafc", borderRadius:"16px", padding:"5px", marginBottom:"24px", gap:"5px" }}>
          {["Bike","Car"].map(v => (
            <button key={v} onClick={() => setVehicleType(v)} style={{
              flex:1, padding:"12px", borderRadius:"12px", border:"none",
              background: vehicleType===v ? "#0f172a" : "transparent",
              color: vehicleType===v ? "#fff" : "#64748b",
              fontWeight: 800, fontSize:"14px", cursor:"pointer",
              boxShadow: vehicleType===v ? "0 4px 12px rgba(15,23,42,0.1)" : "none",
              transition:"all .25s cubic-bezier(0.16, 1, 0.3, 1)", fontFamily:F,
            }}>
              {v === "Bike" ? "🏍️  Bike" : "🚗  Car"}
            </button>
          ))}
        </div>

        {/* ── Date field ── */}
        <div style={{ marginBottom:"12px" }}>
          <label style={{ fontSize:"11px", fontWeight:700, color:"#aaa", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>
            Date of Booking
          </label>
          <button style={fieldBtn(openPanel==="calendar")}
            onClick={() => setOpenPanel(openPanel==="calendar" ? null : "calendar")}>
            <span style={{ fontSize:"18px" }}>📅</span>
            <span style={{ fontSize:"15px", fontWeight: date ? 700 : 500, color: date ? "#0f172a" : "#94a3b8" }}>
              {date ? fmtDate(date) : "Select pickup date"}
            </span>
            {date && <span style={{ marginLeft:"auto", fontSize:"11px", color:RED, fontWeight:700 }}>✓</span>}
          </button>
        </div>

        {/* ── Time row ── */}
        <div className="bf-time-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
          {/* Pickup */}
          <div>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#aaa", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>
              Pickup Time
            </label>
            <button style={fieldBtn(openPanel==="pickup")}
              onClick={() => setOpenPanel(openPanel==="pickup" ? null : "pickup")}>
              <span style={{ fontSize:"16px" }}>⏰</span>
              <span style={{ fontSize:"14px", fontWeight: pickupTime ? 700 : 500, color: pickupTime ? "#0f172a" : "#94a3b8" }}>
                {pickupTime || "Select"}
              </span>
              {pickupTime && <span style={{ marginLeft:"auto", fontSize:"11px", color:RED, fontWeight:700 }}>✓</span>}
            </button>
          </div>

          {/* Drop */}
          <div>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#aaa", letterSpacing:"1px", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>
              Drop Time
            </label>
            <button style={fieldBtn(openPanel==="drop")}
              onClick={() => setOpenPanel(openPanel==="drop" ? null : "drop")}>
              <span style={{ fontSize:"16px" }}>🏁</span>
              <span style={{ fontSize:"14px", fontWeight: dropTime ? 700 : 500, color: dropTime ? "#0f172a" : "#94a3b8" }}>
                {dropTime || "Select"}
              </span>
              {dropTime && <span style={{ marginLeft:"auto", fontSize:"11px", color:RED, fontWeight:700 }}>✓</span>}
            </button>
          </div>
        </div>

        {/* ── Search button ── */}
        <button onClick={handleSearch} disabled={!ready} style={{
          width:"100%", padding:"16px",
          borderRadius:"16px", border:"none",
          background: ready ? `linear-gradient(135deg,${RED},#ff4d4d)` : "#f1f5f9",
          color: ready ? "#fff" : "#94a3b8",
          fontSize:"16px", fontWeight:900,
          cursor: ready ? "pointer" : "not-allowed",
          boxShadow: ready ? `0 10px 25px rgba(190,13,13,0.3)` : "none",
          transition:"all .3s cubic-bezier(0.16, 1, 0.3, 1)", fontFamily:F,
        }}>
          {ready ? "Search Availability 🔍" : "Fill all fields to search"}
        </button>
      </div>

      {/* ── Floating Panel ── */}
      {openPanel && (
        <>
          <div className="bf-panel-overlay" onClick={() => setOpenPanel(null)} style={{
            display:"none", position:"fixed", inset:0,
            background:"rgba(0,0,0,0.4)", zIndex:9998,
          }} />
          <div ref={panelRef} className="bf-panel" style={{
            position:"absolute", top:"calc(100% + 10px)",
            left:0, right:0, zIndex:9999,
            background:"#fff", borderRadius:"20px",
            padding:"20px",
            boxShadow:"0 20px 60px rgba(0,0,0,0.18)",
            border:"1px solid #f0f0f0",
          }}>
            {openPanel === "calendar" && (
              <CalendarInline
                value={date}
                onChange={d => { setDate(d); setOpenPanel(null); }}
              />
            )}
            {(openPanel === "pickup" || openPanel === "drop") && (
              <TimePopup
                onSelect={t => {
                  if (openPanel === "pickup") setPickupTime(t);
                  else setDropTime(t);
                  setOpenPanel(null);
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingForm;