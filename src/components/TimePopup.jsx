import { useState } from "react";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const TimePopup = ({ onSelect }) => {
  const [hour,   setHour]   = useState(9);
  const [minute, setMinute] = useState(0);
  const [ampm,   setAmpm]   = useState("AM");

  const incrementHour = () => setHour(prev => (prev === 12 ? 1 : prev + 1));
  const decrementHour = () => setHour(prev => (prev === 1 ? 12 : prev - 1));

  const incrementMinute = () => setMinute(prev => (prev === 55 ? 0 : prev + 5));
  const decrementMinute = () => setMinute(prev => (prev === 0 ? 55 : prev - 5));

  const formatNum = (n) => n.toString().padStart(2, "0");

  const ArrowBtn = ({ direction, onClick }) => (
    <button 
      onClick={onClick}
      style={{
        width: "32px", height: "32px",
        borderRadius: "8px", border: "1px solid #f1f5f9",
        background: "#fff", color: "#64748b",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.2s",
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
      }}
      onMouseOver={(e) => { e.currentTarget.style.color = RED; e.currentTarget.style.borderColor = RED; e.currentTarget.style.background = `${RED}08`; }}
      onMouseOut={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "#fff"; }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: direction === 'down' ? 'rotate(180deg)' : 'none' }}>
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  );

  return (
    <div style={{
      width: "100%",
      padding: "12px",
      fontFamily: F,
      zIndex: 9999,
      userSelect: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      
      <p style={{ 
        fontSize: "10px", 
        fontWeight: "800", 
        color: "#94a3b8", 
        textTransform: "uppercase", 
        letterSpacing: "1.2px", 
        margin: "0 0 16px",
        textAlign: "center"
      }}>Set Time</p>

      {/* Clock Display */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        
        {/* Hour Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", width: "48px" }}>
          <ArrowBtn direction="up" onClick={incrementHour} />
          <div style={{ 
            fontSize: "32px", fontWeight: "900", fontFamily: H, color: "#1e293b", 
            lineHeight: 1, fontVariantNumeric: "tabular-nums" 
          }}>
            {formatNum(hour)}
          </div>
          <ArrowBtn direction="down" onClick={decrementHour} />
        </div>

        <div style={{ fontSize: "20px", fontWeight: "900", color: "#cbd5e1", marginTop: "28px", height: "32px", display: "flex", alignItems: "center" }}>:</div>

        {/* Minute Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", width: "48px" }}>
          <ArrowBtn direction="up" onClick={incrementMinute} />
          <div style={{ 
            fontSize: "32px", fontWeight: "900", fontFamily: H, color: "#1e293b", 
            lineHeight: 1, fontVariantNumeric: "tabular-nums" 
          }}>
            {formatNum(minute)}
          </div>
          <ArrowBtn direction="down" onClick={decrementMinute} />
        </div>

      </div>

      {/* AM/PM Toggle */}
      <div style={{ 
        display: "flex", 
        background: "#f8fafc", 
        borderRadius: "14px", 
        padding: "4px", 
        marginBottom: "20px",
        gap: "4px",
        border: "1px solid #f1f5f9"
      }}>
        {["AM", "PM"].map(v => (
          <button 
            key={v} 
            onClick={() => setAmpm(v)}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none",
              background: ampm === v ? "#fff" : "transparent",
              color: ampm === v ? RED : "#64748b",
              fontWeight: "800", fontSize: "13px", 
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: ampm === v ? "0 4px 10px rgba(0,0,0,0.04)" : "none",
              fontFamily: H
            }}
          >{v}</button>
        ))}
      </div>

      {/* Confirm Button */}
      <button 
        onClick={() => onSelect(`${formatNum(hour)}:${formatNum(minute)} ${ampm}`)}
        style={{
          width: "100%",
          background: RED,
          color: "#fff", 
          border: "none", 
          padding: "14px", 
          borderRadius: "14px",
          fontWeight: "800", 
          cursor: "pointer", 
          fontSize: "14px",
          boxShadow: `0 8px 20px rgba(190,13,13,0.25)`,
          fontFamily: H,
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 12px 25px rgba(190,13,13,0.35)`; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 20px rgba(190,13,13,0.25)`; }}
      >
        Confirm Time
      </button>

    </div>
  );
};

export default TimePopup;