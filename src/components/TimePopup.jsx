import { useState, useRef, useEffect } from "react";

const ITEM_HEIGHT = 32;
const VISIBLE     = 3;
const RED         = "#be0d0d";

const TimePopup = ({ onSelect, alignRight = false }) => {
  const hoursBase   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutesBase = ["00","05","10","15","20","25","30","35","40","45","50","55"];

  const hours   = [...hoursBase,   ...hoursBase,   ...hoursBase];
  const minutes = [...minutesBase, ...minutesBase, ...minutesBase];

  const [ampm,   setAmpm]   = useState("AM");
  const [hour,   setHour]   = useState("08");
  const [minute, setMinute] = useState("00");

  const hourRef = useRef(null);
  const minRef  = useRef(null);

  const scrollTo = (ref, baseList, value) => {
    const idx = baseList.indexOf(value);
    if (ref.current && idx !== -1)
      ref.current.scrollTop = (baseList.length + idx) * ITEM_HEIGHT;
  };

  useEffect(() => {
    scrollTo(hourRef, hoursBase, "08");
    scrollTo(minRef,  minutesBase, "00");
  }, []);

  const handleScroll = (ref, baseList, setter) => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT) % baseList.length;
    setter(baseList[idx]);
    const middle = baseList.length * ITEM_HEIGHT;
    const max    = baseList.length * 2 * ITEM_HEIGHT;
    if (el.scrollTop <= 0)   el.scrollTop = middle;
    if (el.scrollTop >= max) el.scrollTop = middle;
  };

  // Container height = VISIBLE rows + top+bottom padding of 1 row each
  const containerH = ITEM_HEIGHT * VISIBLE + ITEM_HEIGHT * 2;

  return (
    <div style={{
      width: "100%",
      background: "#fff",
      borderRadius: "20px",
      padding: "12px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
      fontFamily: "'DM Sans', sans-serif",
      boxSizing: "border-box",
      zIndex: 9999,
      border: "1px solid #f0f0f0",
    }}>

      {/* Header */}
      <p style={{ fontSize: "11px", fontWeight: "700", color: "#bbb", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px", textAlign: "center" }}>
        Select Time
      </p>

      {/* AM/PM toggle */}
      <div style={{ display: "flex", background: "#f5f5f5", borderRadius: "12px", padding: "3px", marginBottom: "10px", gap: "3px" }}>
        {["AM", "PM"].map(v => (
          <button key={v} onClick={() => setAmpm(v)} style={{
            flex: 1, padding: "6px", borderRadius: "10px", border: "none",
            background: ampm === v ? "#fff" : "transparent",
            color: ampm === v ? "#111" : "#aaa",
            fontWeight: "700", fontSize: "13px", cursor: "pointer",
            boxShadow: ampm === v ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            transition: "all .15s", fontFamily: "'DM Sans', sans-serif"
          }}>{v}</button>
        ))}
      </div>

      {/* Scroll area */}
      <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>

        {/* Active row highlight — sits at exactly ITEM_HEIGHT from top (= paddingTop offset) */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: ITEM_HEIGHT,
          height: ITEM_HEIGHT,
          background: "#f5f5f5",
          borderRadius: "10px",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Hour scroll */}
        <div style={{ flex: 1, zIndex: 1 }}>
          <div
            ref={hourRef}
            onScroll={() => handleScroll(hourRef, hoursBase, setHour)}
            className="rm-scroll"
            style={{
              height: ITEM_HEIGHT * VISIBLE,
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
              scrollbarWidth: "none",
              paddingTop:    ITEM_HEIGHT,
              paddingBottom: ITEM_HEIGHT,
              boxSizing: "content-box",
            }}
          >
            {hours.map((h, i) => (
              <div key={i} onClick={() => { setHour(h); scrollTo(hourRef, hoursBase, h); }}
                style={{
                  height: ITEM_HEIGHT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  scrollSnapAlign: "start",
                  fontSize:   hour === h ? "20px" : "14px",
                  fontWeight: hour === h ? "800"  : "400",
                  color:      hour === h ? "#111" : "#ccc",
                  cursor: "pointer", transition: "all .1s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >{h}</div>
            ))}
          </div>
        </div>

        {/* Colon — paddingTop = ITEM_HEIGHT so it sits on the active row */}
        <div style={{
          width: "18px", flexShrink: 0, zIndex: 1,
          paddingTop: ITEM_HEIGHT,
          display: "flex", justifyContent: "center",
        }}>
          <div style={{
            height: ITEM_HEIGHT,
            display: "flex", alignItems: "center",
            fontSize: "18px", fontWeight: "800", color: "#111",
          }}>:</div>
        </div>

        {/* Minute scroll */}
        <div style={{ flex: 1, zIndex: 1 }}>
          <div
            ref={minRef}
            onScroll={() => handleScroll(minRef, minutesBase, setMinute)}
            className="rm-scroll"
            style={{
              height: ITEM_HEIGHT * VISIBLE,
              overflowY: "scroll",
              scrollSnapType: "y mandatory",
              scrollbarWidth: "none",
              paddingTop:    ITEM_HEIGHT,
              paddingBottom: ITEM_HEIGHT,
              boxSizing: "content-box",
            }}
          >
            {minutes.map((m, i) => (
              <div key={i} onClick={() => { setMinute(m); scrollTo(minRef, minutesBase, m); }}
                style={{
                  height: ITEM_HEIGHT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  scrollSnapAlign: "start",
                  fontSize:   minute === m ? "20px" : "14px",
                  fontWeight: minute === m ? "800"  : "400",
                  color:      minute === m ? "#111" : "#ccc",
                  cursor: "pointer", transition: "all .1s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >{m}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm */}
      <button onClick={() => onSelect(`${hour}:${minute} ${ampm}`)} style={{
        marginTop: "10px", width: "100%",
        background: `linear-gradient(135deg, ${RED}, #e84545)`,
        color: "#fff", border: "none", padding: "10px", borderRadius: "12px",
        fontWeight: "700", cursor: "pointer", fontSize: "13px",
        boxShadow: `0 4px 14px rgba(190,13,13,0.3)`,
        fontFamily: "'DM Sans', sans-serif"
      }}>Confirm</button>

      <style>{`.rm-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default TimePopup;