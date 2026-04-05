import { useState } from "react";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const TimePopup = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState("morning");
  const [selected,  setSelected]  = useState("");

  const timeData = {
    morning:   ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
    afternoon: ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"],
    evening:   ["06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM"],
    night:     ["09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM"]
  };

  const tabs = [
    { id: "morning",   label: "Morning",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> },
    { id: "afternoon", label: "Afternoon", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg> },
    { id: "evening",   label: "Evening",   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { id: "night",     label: "Night",     icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> }
  ];

  return (
    <div style={{
      width: "360px",
      background: "#fff",
      borderRadius: "24px",
      padding: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)",
      fontFamily: F,
      zIndex: 9999,
      border: "1px solid #f0f0f0",
      userSelect: "none"
    }}>

      {/* Header */}
      <p style={{ 
        fontSize: "12px", 
        fontWeight: "800", 
        color: "#94a3b8", 
        textTransform: "uppercase", 
        letterSpacing: "1.5px", 
        margin: "0 0 20px",
        textAlign: "center"
      }}>Select Pickup Time</p>

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        background: "#f8fafc", 
        borderRadius: "16px", 
        padding: "4px", 
        marginBottom: "24px",
        gap: "4px",
        border: "1px solid #f1f5f9"
      }}>
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id); setSelected(""); }}
            style={{
              flex: 1, 
              padding: "10px 4px", 
              borderRadius: "12px", 
              border: "none",
              background: activeTab === tab.id ? "#fff" : "transparent",
              color: activeTab === tab.id ? RED : "#64748b",
              fontWeight: "700", 
              fontSize: "13px", 
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              boxShadow: activeTab === tab.id ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
              fontFamily: H
            }}
          >
            <span style={{ opacity: activeTab === tab.id ? 1 : 0.6 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Slots */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "10px",
        maxHeight: "320px",
        overflowY: "auto",
        paddingRight: "4px"
      }} className="rm-time-grid">
        {timeData[activeTab].map(time => (
          <button 
            key={time}
            onClick={() => setSelected(time)}
            style={{
              padding: "12px 6px",
              borderRadius: "14px",
              border: "1.5px solid",
              borderColor: selected === time ? RED : "#f1f5f9",
              background: selected === time ? RED : "transparent",
              color: selected === time ? "#fff" : "#1e293b",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: F,
              outline: "none"
            }}
            onMouseOver={(e) => {
               if (selected !== time) {
                 e.currentTarget.style.borderColor = RED;
                 e.currentTarget.style.background = `${RED}08`;
                 e.currentTarget.style.color = RED;
               }
            }}
            onMouseOut={(e) => {
              if (selected !== time) {
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#1e293b";
              }
            }}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Confirm Action */}
      <button 
        disabled={!selected}
        onClick={() => onSelect(selected)}
        style={{
          marginTop: "24px", 
          width: "100%",
          background: selected ? RED : "#cbd5e1",
          color: "#fff", 
          border: "none", 
          padding: "16px", 
          borderRadius: "16px",
          fontWeight: "800", 
          cursor: selected ? "pointer" : "not-allowed", 
          fontSize: "16px",
          boxShadow: selected ? `0 10px 25px rgba(190,13,13,0.25)` : "none",
          fontFamily: H,
          transition: "all 0.3s ease"
        }}
      >
        {selected ? `Confirm ${selected}` : "Select a time"}
      </button>

      <style>{`
        .rm-time-grid::-webkit-scrollbar { width: 4px; }
        .rm-time-grid::-webkit-scrollbar-track { background: transparent; }
        .rm-time-grid::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .rm-time-grid {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
      `}</style>
    </div>
  );
};

export default TimePopup;