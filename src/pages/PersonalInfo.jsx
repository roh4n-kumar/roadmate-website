import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const UserIcon    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const MailIcon    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const PhoneIcon   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.9 19.79 19.79 0 0 1 1.07 4.18 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>);
const CakeIcon    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/></svg>);
const GenderIcon  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11" r="4"/><path d="M12 15v6"/><path d="M9 18h6"/><path d="M19 5l-4.35 4.35"/><path d="M19 5h-4"/><path d="M19 5v4"/></svg>);
const MapPinIcon  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const CityIcon    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const PinIcon     = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>);
const EditIcon    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const SaveIcon    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>);
const InfoIcon    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const ChevronLeft = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const ChevronRight= () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);

const inputStyle = (editable) => ({
  width: "100%", padding: "12px 16px", borderRadius: "14px",
  border: editable ? "1.5px solid rgba(15, 23, 42, 0.1)" : "1.5px solid rgba(15, 23, 42, 0.05)",
  background: editable ? "#fff" : "rgba(15, 23, 42, 0.02)", fontSize: "14px", fontWeight: "600",
  color: editable ? "#0f172a" : "#64748b", cursor: editable ? "text" : "default",
  boxSizing: "border-box", fontFamily: F, transition: "all .2s ease",
});

const CustomDropdown = ({ options, value, onChange, width, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} style={{ position: "relative", width }}>
      <button onClick={(e) => { e.stopPropagation(); if (!disabled) setOpen(o => !o); }}
        style={{ ...inputStyle(!disabled), cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: value !== "" && value !== undefined ? (!disabled ? "#111" : "#666") : "#bbb" }}>
        <span>{selected?.label || placeholder || "Select"}</span>
        {!disabled && (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>)}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: "100%", maxHeight: "200px", overflowY: "auto", background: "#fff", borderRadius: "14px", zIndex: 2000, boxShadow: "0 10px 30px rgba(0,0,0,0.12)", border: "1.5px solid rgba(15, 23, 42, 0.08)" }}>
            {options.map(opt => (
              <div key={opt.value} onClick={(e) => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
                style={{ padding: "12px 16px", fontSize: "14px", fontWeight: opt.value === value ? "800" : "600", color: opt.value === value ? RED : "#0f172a", background: opt.value === value ? "#fff5f5" : "transparent", cursor: "pointer", fontFamily: F }}
                onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = "transparent"; }}>
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DatePicker = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const today = new Date();
  const parsed = value ? new Date(value.split("-").reverse().join("-")) : null;
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());
  const [viewYear,  setViewYear]  = useState(parsed ? parsed.getFullYear() : today.getFullYear() - 20);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay    = (m, y) => new Date(y, m, 1).getDay();
  const handleDayClick = (day) => { onChange(`${String(day).padStart(2,"0")}-${String(viewMonth+1).padStart(2,"0")}-${viewYear}`); setOpen(false); };
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0);  setViewYear(y => y+1); } else setViewMonth(m => m+1); };
  const days = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDay(viewMonth, viewYear);
  const selectedDay = parsed && parsed.getMonth() === viewMonth && parsed.getFullYear() === viewYear ? parsed.getDate() : null;
  const monthOptions = MONTHS.map((m, i) => ({ value: i, label: m }));
  const yearOptions  = Array.from({ length: 100 }, (_, i) => ({ value: today.getFullYear()-i, label: String(today.getFullYear()-i) }));
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => !disabled && setOpen(o => !o)}
        style={{ ...inputStyle(!disabled), cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none", color: value ? (disabled ? "#666" : "#111") : "#bbb" }}>
        <span>{value || "DD-MM-YYYY"}</span>
        {!disabled && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 9999, background: "#fff", borderRadius: "14px", border: "1.5px solid #eee", boxShadow: "0 8px 28px rgba(0,0,0,0.13)", padding: "12px", width: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", gap: "6px" }}>
              <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft /></button>
              <div style={{ display: "flex", gap: "6px", flex: 1, justifyContent: "center" }}>
                <CustomDropdown options={monthOptions} value={viewMonth} onChange={setViewMonth} width="110px" />
                <CustomDropdown options={yearOptions}  value={viewYear}  onChange={setViewYear}  width="76px" />
              </div>
              <button onClick={nextMonth} style={navBtnStyle}><ChevronRight /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px", marginBottom: "2px" }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: "700", color: "#bbb", padding: "2px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={"e"+i} style={{ height: "32px" }} />)}
              {Array.from({ length: days }, (_, i) => i+1).map(day => (
                <button key={day} onClick={() => handleDayClick(day)}
                  style={{ width: "100%", height: "32px", borderRadius: "6px", border: "none", background: selectedDay === day ? RED : "transparent", color: selectedDay === day ? "white" : "#111", fontWeight: selectedDay === day ? "700" : "500", fontSize: "12px", cursor: "pointer" }}
                  onMouseEnter={e => { if (selectedDay !== day) e.currentTarget.style.background = "#ececec"; }}
                  onMouseLeave={e => { if (selectedDay !== day) e.currentTarget.style.background = "transparent"; }}>
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PhoneInput = ({ digits, onChange, disabled, hasWarning, onEnterBlur }) => {
  const [focused, setFocused] = useState(false);
  const handleChange = (e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10));
  const handleKey = (e) => { if (e.key === "Enter") { e.preventDefault(); e.target.blur(); onEnterBlur(); } };
  const borderColor = hasWarning ? RED : focused ? RED : "#e0e0e0";
  const shadow = hasWarning ? "0 0 0 3px rgba(190,13,13,0.15)" : focused ? "0 0 0 3px rgba(190,13,13,0.08)" : "none";
  return (
    <div style={{ display: "flex", alignItems: "center", borderRadius: "14px", border: disabled ? "1.5px solid rgba(15, 23, 42, 0.05)" : `1.5px solid ${borderColor}`, background: disabled ? "rgba(15, 23, 42, 0.02)" : "#fff", boxShadow: disabled ? "none" : shadow, overflow: "hidden", transition: "all 0.2s" }}>
      <span style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "800", color: disabled ? "#94a3b8" : "#0f172a", whiteSpace: "nowrap", userSelect: "none", borderRight: "1.5px solid rgba(15, 23, 42, 0.08)", background: disabled ? "rgba(15, 23, 42, 0.03)" : "#f8fafc", flexShrink: 0, fontFamily: H }}>+91</span>
      <input type="tel" value={digits} onChange={handleChange} onKeyDown={handleKey} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} disabled={disabled} placeholder="XXXXXXXXXX"
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "12px 16px", fontSize: "14px", fontWeight: "600", fontFamily: F, color: disabled ? "#64748b" : "#0f172a", cursor: disabled ? "default" : "text" }} />
    </div>
  );
};

const PincodeInput = ({ value, onChange, disabled, hasWarning, onEnterBlur }) => {
  const [focused, setFocused] = useState(false);
  const handleChange = (e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6));
  const handleKey = (e) => { if (e.key === "Enter") { e.preventDefault(); e.target.blur(); onEnterBlur(); } };
  const borderColor = hasWarning ? RED : focused ? RED : "#e0e0e0";
  const shadow = hasWarning ? "0 0 0 3px rgba(190,13,13,0.15)" : focused ? "0 0 0 3px rgba(190,13,13,0.08)" : "none";
  return (
    <input type="tel" value={value} onChange={handleChange} onKeyDown={handleKey} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} disabled={disabled} placeholder="XXXXXX"
      style={{ ...inputStyle(!disabled), color: !disabled ? "#0f172a" : "#64748b", outline: "none", borderColor: disabled ? "rgba(15, 23, 42, 0.05)" : borderColor, boxShadow: disabled ? "none" : shadow }} />
  );
};

const FIELDS = [
  { key: "name",    label: "Full Name",     type: "text",          Icon: UserIcon,   placeholder: "Enter your full name" },
  { key: "email",   label: "Email Address", type: "email",         Icon: MailIcon,   placeholder: "Enter your email", disabled: true },
  { key: "phone",   label: "Phone Number",  type: "phone",         Icon: PhoneIcon },
  { key: "dob",     label: "Date of Birth", type: "datepicker",    Icon: CakeIcon },
  { key: "gender",  label: "Gender",        type: "custom-select", Icon: GenderIcon, options: ["Male", "Female", "Non-binary", "Prefer not to say"] },
  { key: "city",    label: "City",          type: "text",          Icon: CityIcon,   placeholder: "Your city" },
  { key: "address", label: "Address",       type: "textarea",      Icon: MapPinIcon, placeholder: "Enter your full address" },
  { key: "pincode", label: "Pin Code",      type: "pincode",       Icon: PinIcon },
];

const PersonalInfo = () => {
  const [user,                 setUser]                 = useState(null);
  const [formData,             setFormData]             = useState({});
  const [phoneDigits,          setPhoneDigits]          = useState("");
  const [pincodeDigits,        setPincodeDigits]        = useState("");
  const [editMode,             setEditMode]             = useState(false);
  const [loading,              setLoading]              = useState(true);
  const [saving,               setSaving]               = useState(false);
  const [saved,                setSaved]                = useState(false);
  const [originalData,         setOriginalData]         = useState({});
  const [originalPhoneDigits,  setOriginalPhoneDigits]  = useState("");
  const [originalPincodeDigits,setOriginalPincodeDigits]= useState("");
  const [phoneWarning,         setPhoneWarning]         = useState(false);
  const [pincodeWarning,       setPincodeWarning]       = useState(false);
  const formCardRef = useRef(null);
  const navigate    = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate("/"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      let data = snap.exists() ? { ...snap.data(), email: u.email } : { name: u.displayName || "", email: u.email };
      const phone   = data.phone   ? data.phone.replace("+91","").replace(/\s/g,"").replace(/\D/g,"").slice(0,10) : "";
      const pincode = data.pincode ? data.pincode.replace(/\D/g,"").slice(0,6) : "";
      setFormData(data);          setOriginalData(data);
      setPhoneDigits(phone);      setOriginalPhoneDigits(phone);
      setPincodeDigits(pincode);  setOriginalPincodeDigits(pincode);
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const triggerWarning = (setter) => { setter(true); setTimeout(() => setter(false), 3000); };
  const checkPhone   = () => { if (phoneDigits.length > 0 && phoneDigits.length < 10) { triggerWarning(setPhoneWarning); return false; } return true; };
  const checkPincode = () => { if (pincodeDigits.length > 0 && pincodeDigits.length < 6) { triggerWarning(setPincodeWarning); return false; } return true; };

  const handleSave = async () => {
    if (!checkPhone() || !checkPincode()) return;
    setSaving(true);
    try {
      const saveData = { ...formData, phone: "+91 " + phoneDigits, pincode: pincodeDigits, updatedAt: new Date() };
      await setDoc(doc(db, "users", user.uid), saveData, { merge: true });
      if (formData.name) await updateProfile(user, { displayName: formData.name });
      setOriginalData(formData); setOriginalPhoneDigits(phoneDigits); setOriginalPincodeDigits(pincodeDigits);
      setSaved(true); setEditMode(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error("Save error:", err); }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    setFormData(originalData); setPhoneDigits(originalPhoneDigits); setPincodeDigits(originalPincodeDigits);
    setPhoneWarning(false); setPincodeWarning(false); setEditMode(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = () => { setEditMode(true); setTimeout(() => formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150); };
  const handleEnterKey = (e) => { if (e.key === "Enter") { e.preventDefault(); e.target.blur(); } };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={spinnerStyle} />
        <p style={{ color: "#94a3b8", marginTop: "24px", fontSize: "14px", fontWeight: "700", fontFamily: F }}>Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus { outline: none; }
        .edit-btn:hover   { background: rgba(15, 23, 42, 0.05) !important; }
        .cancel-btn:hover { background: rgba(15, 23, 42, 0.05) !important; }

        /* Desktop */
        .pi-wrap   { padding-top: 100px; padding-bottom: 120px; }
        .pi-inner  { max-width: 800px; margin: 0 auto; padding: 0 24px; }
        .pi-card   { background: #fff; border-radius: 28px; padding: 40px; margin-bottom: 24px; boxShadow: 0 4px 24px rgba(0,0,0,0.03); border: 1.5px solid rgba(15, 23, 42, 0.05); }
        .pi-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .pi-title  { font-size: 40px; }
        .pi-avatar { width: 90px; height: 90px; font-size: 34px; }
        .pi-name   { font-size: 24px; }
        .pi-btns   { display: flex; justify-content: center; gap: 16px; margin-top: 32px; }

        /* Mobile */
        @media (max-width: 900px) {
          .pi-wrap  { padding-top: 80px !important; padding-bottom: 80px !important; }
          .pi-inner { padding: 0 16px !important; }
          .pi-card  { padding: 24px !important; border-radius: 20px !important; margin-bottom: 16px !important; }
          .pi-grid  { grid-template-columns: 1fr !important; gap: 16px !important; }
          .pi-title { font-size: 28px !important; }
          .pi-avatar{ width: 70px !important; height: 70px !important; font-size: 28px !important; }
          .pi-name  { font-size: 18px !important; }
          .pi-btns  { flex-direction: column !important; gap: 12px !important; }
          .pi-btns button { width: 100% !important; justify-content: center !important; }
          .pi-edit-btn { padding: 10px 16px !important; font-size: 13px !important; }
        }
      `}</style>

      <div className="pi-wrap">
        <div className="pi-inner">

          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "32px" }}>
            <h1 className="pi-title" style={{ fontFamily: H, fontWeight: "900", color: "#0f172a", margin: 0, letterSpacing: "-1.5px" }}>
              Personal <span style={{ color: RED }}>Information</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: "16px", marginTop: "8px", fontWeight: "600" }}>Manage and update your profile details</p>
          </motion.div>

          {/* Avatar card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="pi-card">
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div className="pi-avatar" style={{ borderRadius: "24px", background: `linear-gradient(135deg,${RED},#ff4d4d)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "white", fontFamily: H, boxShadow: `0 10px 25px ${RED}40`, flexShrink: 0 }}>
                {(formData.name?.[0] || user?.email?.[0] || "?").toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="pi-name" style={{ margin: 0, fontWeight: "900", fontFamily: H, letterSpacing: "-0.5px", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {formData.name || "Your Name"}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748b", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{formData.email}</p>
              </div>
              {!editMode && (
                <button onClick={handleEditClick} className="edit-btn pi-edit-btn" style={{ background: "rgba(15, 23, 42, 0.04)", border: "none", padding: "12px 20px", borderRadius: "14px", fontWeight: "800", fontSize: "14px", cursor: "pointer", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px", fontFamily: F, whiteSpace: "nowrap", flexShrink: 0, transition: "all .2s" }}>
                  <EditIcon /> Edit Profile
                </button>
              )}
            </div>
          </motion.div>

          {/* Fields card */}
          <motion.div ref={formCardRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="pi-card">
            <h2 style={{ margin: "0 0 28px", fontSize: "12px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: H }}>Profile Details</h2>

            <div className="pi-grid">
              {FIELDS.map(({ key, label, type, Icon, placeholder, options, disabled }) => (
                <div key={key} style={{ gridColumn: type === "textarea" ? "1 / -1" : "auto" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "800", color: "#64748b", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: H }}>
                    <span style={{ color: RED, display: "flex", alignItems: "center" }}><Icon /></span>
                    {label}
                  </label>
                  {type === "phone"         ? <PhoneInput digits={phoneDigits} onChange={setPhoneDigits} disabled={!editMode} hasWarning={phoneWarning} onEnterBlur={checkPhone} />
                  : type === "pincode"      ? <PincodeInput value={pincodeDigits} onChange={setPincodeDigits} disabled={!editMode} hasWarning={pincodeWarning} onEnterBlur={checkPincode} />
                  : type === "datepicker"   ? <DatePicker value={formData[key] || ""} onChange={(val) => handleChange(key, val)} disabled={!editMode} />
                  : type === "custom-select"? <CustomDropdown options={options.map(o => ({ value: o, label: o }))} value={formData[key] || ""} onChange={(val) => handleChange(key, val)} disabled={!editMode} width="100%" placeholder="Select gender" />
                  : type === "textarea"     ? <textarea value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} onKeyDown={handleEnterKey} disabled={!editMode} placeholder={placeholder} rows={3} style={{ ...inputStyle(editMode), resize: "none", color: editMode ? "#111" : "#666" }} />
                  : <input type={type} value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} onKeyDown={handleEnterKey} disabled={!editMode || disabled} placeholder={placeholder} style={{ ...inputStyle(editMode && !disabled), color: (editMode && !disabled) ? "#111" : "#666" }} />}
                </div>
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "24px", marginBottom: 0, display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
              <MailIcon /> Email is linked to your account and cannot be modified.
            </p>

            <AnimatePresence>
              {(phoneWarning || pincodeWarning) && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "10px", background: "#fff5f5", border: "1px solid #fcc", display: "flex", alignItems: "center", gap: "9px", color: RED, fontSize: "13px", fontWeight: "600" }}>
                  <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}><InfoIcon /></span>
                  {phoneWarning ? "Phone number must be 10 digits" : "Pin code must be 6 digits"}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {editMode && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="pi-btns">
                  <button onClick={handleCancel} className="cancel-btn" style={{ background: "rgba(15, 23, 42, 0.04)", border: "none", padding: "14px 28px", borderRadius: "14px", fontWeight: "800", fontSize: "15px", cursor: "pointer", color: "#64748b", fontFamily: F, transition: "all .2s" }}>Cancel</button>
                  <button onClick={handleSave} disabled={saving} style={{ background: RED, color: "white", border: "none", padding: "14px 36px", borderRadius: "14px", fontWeight: "900", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: `0 10px 25px ${RED}40`, fontFamily: H, transition: "all .3s ease" }}>
                    <SaveIcon />{saving ? "Saving..." : "Save Changes"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: "fixed", bottom: "40px", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9999, pointerEvents: "none" }}>
            <div style={{ background: "#0f172a", color: "white", padding: "16px 32px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", borderLeft: `6px solid #22c55e`, fontSize: "15px", fontWeight: "700", whiteSpace: "nowrap", fontFamily: F }}>
              ✅ Profile updated successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const spinnerStyle = { width: "36px", height: "36px", border: "3px solid #f0f0f0", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" };
const navBtnStyle  = { background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex", alignItems: "center", color: "#555" };

export default PersonalInfo;