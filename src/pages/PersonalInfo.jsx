import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "../components/ProfileCard";
import Footer from "../components/Footer";

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
const ShieldIcon  = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const ChevronLeft = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const ChevronRight= () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const HomeIcon    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const CameraIcon  = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const WalletIcon  = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>);
const GiftIcon    = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>);
const UsersIcon   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const DevicesIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="12" rx="2" ry="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/></svg>);
const KeyIcon     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3L15.5 7.5z"/></svg>);

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
        style={{ ...inputStyle(!disabled), cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: value !== "" && value !== undefined ? (!disabled ? "#1e293b" : "#64748b") : "#94a3b8" }}>
        <span>{selected?.label || placeholder || "Select"}</span>
        {!disabled && (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>)}
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
        style={{ ...inputStyle(!disabled), cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none", color: value ? (disabled ? "#64748b" : "#1e293b") : "#94a3b8" }}>
        <span>{value || "DD-MM-YYYY"}</span>
        {!disabled && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 9999, background: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 15px 35px rgba(0,0,0,0.12)", padding: "16px", width: "290px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "6px" }}>
              <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft /></button>
              <div style={{ display: "flex", gap: "6px", flex: 1, justifyContent: "center" }}>
                <CustomDropdown options={monthOptions} value={viewMonth} onChange={setViewMonth} width="115px" />
                <CustomDropdown options={yearOptions}  value={viewYear}  onChange={setViewYear}  width="80px" />
              </div>
              <button onClick={nextMonth} style={navBtnStyle}><ChevronRight /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px", marginBottom: "4px" }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: "800", color: "#94a3b8", padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={"e"+i} style={{ height: "34px" }} />)}
              {Array.from({ length: days }, (_, i) => i+1).map(day => (
                <button key={day} onClick={() => handleDayClick(day)}
                  style={{ width: "100%", height: "34px", borderRadius: "10px", border: "none", background: selectedDay === day ? RED : "transparent", color: selectedDay === day ? "white" : "#334155", fontWeight: selectedDay === day ? "800" : "600", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { if (selectedDay !== day) e.currentTarget.style.background = "#f1f5f9"; }}
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
  const borderColor = hasWarning ? RED : focused ? RED : "#e2e8f0";
  const shadow = hasWarning ? "0 0 0 4px rgba(190,13,13,0.15)" : focused ? "0 0 0 4px rgba(190,13,13,0.08)" : "none";
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
  const borderColor = hasWarning ? RED : focused ? RED : "#e2e8f0";
  const shadow = hasWarning ? "0 0 0 4px rgba(190,13,13,0.15)" : focused ? "0 0 0 4px rgba(190,13,13,0.08)" : "none";
  return (
    <input type="tel" value={value} onChange={handleChange} onKeyDown={handleKey} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} disabled={disabled} placeholder="XXXXXX"
      style={{ ...inputStyle(!disabled), color: !disabled ? "#0f172a" : "#64748b", outline: "none", borderColor: disabled ? "rgba(15, 23, 42, 0.05)" : borderColor, boxShadow: disabled ? "none" : shadow }} />
  );
};

const FIELDS = [
  { key: "name",    label: "Full Name",     type: "text",          Icon: UserIcon,   placeholder: "Enter your full name", hint: "Must match the name on your official documents." },
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
  const [uploading,            setUploading]            = useState(false);
  const fileInputRef = useRef(null);
  const formCardRef  = useRef(null);
  const navigate     = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate("/"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      const rootData = snap.exists() ? snap.data() : {};
      const profile  = rootData.profile || {};
      
      let data = { 
        name: rootData.name || profile.name || u.displayName || "", 
        email: u.email, 
        phone: rootData.phone || profile.phone || "",
        dob: rootData.dob || profile.dob || "",
        gender: rootData.gender || profile.gender || "",
        city: rootData.city || profile.city || "",
        address: rootData.address || profile.address || "",
        pincode: rootData.pincode || profile.pincode || "",
        profileImage: rootData.profileImage || profile.profileImage || u.photoURL || ""
      };

      const phone   = data.phone ? data.phone.replace("+91","").replace(/\s/g,"").replace(/\D/g,"").slice(0,10) : "";
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
      const saveData = { ...formData, phone: "+91 " + phoneDigits, pincode: pincodeDigits };
      await setDoc(doc(db, "users", user.uid), { 
        ...saveData,
        profile: saveData, 
        updatedAt: new Date() 
      }, { merge: true });
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

  const handleImageClick = () => fileInputRef.current?.click();

  const compressImage = (file, maxW=1000, quality=0.75) => new Promise((res) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW/Math.max(img.width, img.height));
      const w = Math.round(img.width*scale); const h = Math.round(img.height*scale);
      const canvas = document.createElement("canvas");
      canvas.width=w; canvas.height=h;
      canvas.getContext("2d").drawImage(img,0,0,w,h);
      canvas.toBlob(blob => { URL.revokeObjectURL(url); res(new File([blob], file.name, { type:"image/jpeg" })); }, "image/jpeg", quality);
    };
    img.src = url;
  });

  const uploadToCloudinary = async (file) => {
    const compressed = (file.type==="image/jpeg"||file.type==="image/png"||file.type==="image/webp") ? await compressImage(file) : file;
    const formDataBody = new FormData();
    formDataBody.append("file", compressed);
    formDataBody.append("upload_preset", "RoadMate Image");
    formDataBody.append("cloud_name", "ds1cjvxyj");
    const res = await fetch("https://api.cloudinary.com/v1_1/ds1cjvxyj/image/upload", { method:"POST", body:formDataBody });
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      
      // Update Auth
      await updateProfile(user, { photoURL: url });
      
      // Update Firestore
      await setDoc(doc(db, "users", user.uid), {
        profileImage: url,
        profile: { ...formData, profileImage: url }
      }, { merge: true });

      setFormData(prev => ({ ...prev, profileImage: url }));
      setOriginalData(prev => ({ ...prev, profileImage: url }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const hasChanges = 
    formData.name !== originalData.name ||
    formData.dob !== originalData.dob ||
    formData.gender !== originalData.gender ||
    formData.city !== originalData.city ||
    formData.address !== originalData.address ||
    phoneDigits !== originalPhoneDigits ||
    pincodeDigits !== originalPincodeDigits;

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
    <div style={{ minHeight: "100vh", background: "#fdfdfd", fontFamily: F, color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        input:focus, textarea:focus { outline: none; border-color: ${RED} !important; box-shadow: 0 0 0 4px ${RED}15 !important; }
        .edit-btn:hover   { background: ${RED}08 !important; color: ${RED} !important; transform: translateY(-1px); }
        .cancel-btn:hover { background: rgba(15, 23, 42, 0.05) !important; }

        /* Modern Styles */
        
        .pi-wrap   { padding-bottom: 120px; position: relative; z-index: 10; }
        .pi-inner  { max-width: 1250px; margin: 0 auto; padding: 0 24px; }
        .pi-card   { 
          background: #fff; 
          border-radius: 12px; 
          padding: 40px; 
          margin-bottom: 24px; 
          box-shadow: 0 15px 40px rgba(0,0,0,0.03); 
          border: 1.5px solid #e2e8f0; 
          position: relative;
          overflow: hidden;
          animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pi-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .pi-title  { font-size: 30px; margin-bottom: 24px; letter-spacing: -1px; }
        .pi-avatar { width: 100px; height: 100px; font-size: 38px; border: 4px solid #fff; }
        .pi-name   { font-size: 26px; }
        .pi-btns   { display: flex; justify-content: center; gap: 16px; margin-top: 40px; }

        /* Avatar Hover Effect */
        .avatar-box { position: relative; overflow: hidden; cursor: pointer; transition: all 0.3s ease; }
        .avatar-box:hover { transform: scale(1.02); }
        .avatar-overlay {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          height: 50px;
          background: rgba(37, 99, 235, 0.7); /* Blue tint like the screenshot */
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          color: white;
        }
        .avatar-box:hover .avatar-overlay { bottom: 0; }
        .avatar-box:hover img { filter: brightness(0.8); }

        @media (max-width: 900px) {
          .pi-page-wrapper { padding-top: 64px !important; }
          .pi-banner { height: 320px !important; }
          .pi-header { padding: 40px 0 60px; }
          .pi-wrap  { padding-bottom: 80px !important; }
          .pi-inner { padding: 0 16px !important; }
          .pi-card  { padding: 24px 20px !important; border-radius: 20px !important; margin-bottom: 20px !important; }
          .pi-grid  { grid-template-columns: 1fr !important; gap: 20px !important; }
          .pi-title { font-size: 28px !important; margin-bottom: 12px !important; }
          .pi-avatar{ width: 90px !important; height: 90px !important; font-size: 24px !important; }
          .pi-name  { font-size: 20px !important; }
          .pi-btns  { flex-direction: column-reverse !important; gap: 12px !important; }
          .pi-btns button { width: 100% !important; justify-content: center !important; height: 56px !important; }
          .pi-edit-btn { padding: 10px 16px !important; font-size: 13px !important; }
          .pi-banner-details { flex-direction: column !important; gap: 10px !important; }
          .pi-separator { display: none !important; }
          .pi-card-header { flex-direction: row !important; align-items: center !important; }
          .pi-card-title { font-size: 18px !important; }
        }
      `}</style>

      <div className="pi-page-wrapper" style={{ background: '#f5f7f9', minHeight: '100vh', paddingBottom: '100px' }}>
        {/* IDENTITY BANNER RAILS */}
        <div className="pi-banner" style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/thar-off-roading.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.6)' }} />
          <div className="pi-inner" style={{ height: '100%', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '40px' }}>
            {/* Banner Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Hidden File Input */}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
              
              {/* Avatar */}
              <div onClick={handleImageClick} className="avatar-box pi-avatar" style={{ width: '140px', height: '140px', borderRadius: '50%', background: RED, border: '5px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {uploading ? (
                    <div style={{ fontSize: '12px', fontWeight: '900' }}>UPLOADING...</div>
                  ) : formData.profileImage || user?.photoURL ? (
                    <>
                      <img src={formData.profileImage || user?.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s' }} />
                      <div className="avatar-overlay">
                        <EditIcon />
                      </div>
                    </>
                  ) : (
                    <>
                      <CameraIcon />
                      <span style={{ fontSize: '11px', fontWeight: '900', marginTop: '6px', textTransform: 'uppercase' }}>Add Photo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Name and Details */}
              <div style={{ textAlign: 'center' }}>
                <h1 className="pi-title" style={{ margin: 0, color: '#fff', fontSize: '42px', fontWeight: '900', fontFamily: H, letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {formData.name || user?.displayName}
                </h1>
                <div className="pi-banner-details" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px', marginTop: '12px', color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneIcon /> {phoneDigits ? `+91 ${phoneDigits}` : 'Add Phone Number'}
                  </div>
                  <div className="pi-separator" style={{ height: '12px', width: '1.5px', background: 'rgba(255,255,255,0.3)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MailIcon /> {formData.email || 'Add Email Address'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pi-inner" style={{ marginTop: '30px' }}>
          {/* MAIN FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <motion.div ref={formCardRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pi-card" style={{ margin: 0, padding: '24px 40px 40px 40px' }}>
              <div className="pi-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="pi-card-title" style={{ fontSize: '22px', fontWeight: '900', color: RED, margin: 0, fontFamily: H }}>My Profile</h2>
                {!editMode && (
                  <button onClick={handleEditClick} style={{ background: '#f1f5f9', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: '800', color: '#475569', cursor: 'pointer', transition: '0.2s', fontSize: '12px' }}>EDIT</button>
                )}
              </div>

              <div style={{ height: '1.2px', background: '#e2e8f0', marginLeft: '-40px', marginRight: '-40px', marginBottom: '40px' }} />
              
              <div className="pi-grid">
                {FIELDS.map(({ key, label, type, Icon, placeholder, options, disabled, hint }) => (
                  <div key={key} style={{ gridColumn: type === "textarea" ? "1 / -1" : "auto" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", color: RED, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: H }}>
                      {label}
                    </label>
                    {type === "phone"         ? <PhoneInput digits={phoneDigits} onChange={setPhoneDigits} disabled={!editMode} hasWarning={phoneWarning} onEnterBlur={checkPhone} />
                    : type === "pincode"      ? <PincodeInput value={pincodeDigits} onChange={setPincodeDigits} disabled={!editMode} hasWarning={pincodeWarning} onEnterBlur={checkPincode} />
                    : type === "datepicker"   ? <DatePicker value={formData[key] || ""} onChange={(val) => handleChange(key, val)} disabled={!editMode} />
                    : type === "custom-select"? <CustomDropdown options={options.map(o => ({ value: o, label: o }))} value={formData[key] || ""} onChange={(val) => handleChange(key, val)} disabled={!editMode} width="100%" placeholder="Select gender" />
                    : type === "textarea"     ? <textarea value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} onKeyDown={handleEnterKey} disabled={!editMode} placeholder={placeholder} rows={2} style={{ ...inputStyle(editMode), resize: "none", color: editMode ? "#0f172a" : "#64748b" }} />
                    : <input type={type} value={formData[key] || ""} onChange={(e) => handleChange(key, e.target.value)} onKeyDown={handleEnterKey} disabled={!editMode || disabled} placeholder={placeholder} style={{ ...inputStyle(editMode && !disabled), color: (editMode && !disabled) ? "#0f172a" : "#64748b" }} />}
                    {hint && <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "#94a3b8", fontWeight: "500", lineHeight: "1.4" }}>{hint}</p>}
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MailIcon /> Email is linked to your account and cannot be changed.
              </div>

              <AnimatePresence>
                {editMode && (
                  <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button onClick={handleCancel} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                    <button 
                      onClick={handleSave} 
                      disabled={!hasChanges || saving} 
                      style={{ 
                        background: (!hasChanges || saving) ? '#f1f5f9' : RED, 
                        color: (!hasChanges || saving) ? '#94a3b8' : '#fff', 
                        border: 'none', 
                        padding: '12px 40px', 
                        borderRadius: '8px', 
                        fontWeight: '900', 
                        fontSize: '14px', 
                        cursor: (!hasChanges || saving) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {saving ? "SAVING..." : "SAVE"}
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
             style={{ position: "fixed", bottom: window.innerWidth <= 900 ? "100px" : "40px", left: "0", right: "0", display: "flex", justifyContent: "center", zIndex: 9999, padding: "0 20px", pointerEvents: "none" }}>
            <div style={{ 
              background: "#f0fff4", 
              color: "#22c55e", 
              padding: "16px 32px", 
              borderRadius: "16px", 
              fontSize: "14px", 
              fontWeight: "900", 
              border: "2px solid #bbf7d0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              fontFamily: H
            }}>
              <div style={{ background: '#22c55e', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff' }}>✓</div>
              Profile Updated successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const spinnerStyle = { width: "50px", height: "50px", border: "5px solid rgba(190,13,13,0.1)", borderTop: `5px solid ${RED}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" };
const navBtnStyle  = { background: "rgba(15, 23, 42, 0.04)", border: "none", cursor: "pointer", padding: "8px", borderRadius: "12px", display: "flex", alignItems: "center", color: "#475569", transition: "all 0.2s" };

const SidebarItem = ({ icon, label, active }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', borderRadius: '12px', background: active ? '#eff6ff' : 'transparent', color: active ? '#2563eb' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { if(!active) e.currentTarget.style.background = '#f8fafc'; }} onMouseLeave={e => { if(!active) e.currentTarget.style.background = 'transparent'; }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
    <span style={{ fontSize: '15px', fontWeight: active ? '800' : '600' }}>{label}</span>
    {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />}
  </div>
);

export default PersonalInfo;