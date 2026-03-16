import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const fieldLabel = { display:"block", fontSize:"12px", fontWeight:"800", color:"#94a3b8", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"1.2px", fontFamily:H };
const fieldInput = (editable) => ({ width:"100%", padding:"12px 16px", borderRadius:"14px", border:editable?"1.5px solid rgba(15, 23, 42, 0.1)":"1.5px solid rgba(15, 23, 42, 0.05)", background:editable?"#fff":"rgba(15, 23, 42, 0.02)", fontSize:"14px", fontWeight:"600", color:editable?"#0f172a":"#64748b", boxSizing:"border-box", fontFamily:F, transition:"all 0.2s ease", cursor:editable?"text":"default" });
const submitBtn = { width:"100%", padding:"16px", borderRadius:"16px", background:RED, color:"white", border:"none", fontSize:"15px", fontWeight:"900", cursor:"pointer", fontFamily:H, boxShadow:`0 10px 25px ${RED}40` };

const MiniDropdown = ({ options, value, onChange, width, disabled }) => {
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
      <button onClick={e => { e.stopPropagation(); if (disabled) return; setOpen(o => !o); }}
        style={{ width: "100%", padding: "6px 12px", borderRadius: "8px", border: "1.5px solid rgba(15, 23, 42, 0.08)", background: disabled ? "rgba(15, 23, 42, 0.02)" : "#fff", fontSize: "13px", fontWeight: "800", color: disabled ? "#94a3b8" : "#0f172a", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: F }}>
        <span>{selected?.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points={open?"18 15 12 9 6 15":"6 9 12 15 18 9"}/></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
            style={{ position:"absolute", top:"calc(100% + 6px)", left:0, width:"100%", maxHeight:"180px", overflowY:"auto", background:"#fff", borderRadius:"12px", zIndex:9999, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border:"1.5px solid rgba(15, 23, 42, 0.08)" }}>
            {options.map(opt => (
              <div key={opt.value} onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
                style={{ padding:"10px 12px", fontSize:"13px", fontWeight: opt.value===value?"800":"600", color: opt.value===value?RED:"#0f172a", background: opt.value===value?"#fff5f5":"transparent", cursor:"pointer", fontFamily: F }}
                onMouseEnter={e => { if (opt.value!==value) e.currentTarget.style.background="#f8fafc"; }}
                onMouseLeave={e => { if (opt.value!==value) e.currentTarget.style.background="transparent"; }}>
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExpiryDatePicker = ({ value, onChange, disabled, hasError }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const today = new Date();
  const parsed = value ? (() => { const [y,m,d] = value.split('-').map(Number); return new Date(y, m-1, d); })() : null;
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());
  const [viewYear,  setViewYear]  = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay    = (m, y) => new Date(y, m, 1).getDay();
  const handleDayClick = (day) => { const mm = String(viewMonth+1).padStart(2,"0"); const dd = String(day).padStart(2,"0"); onChange(`${viewYear}-${mm}-${dd}`); setOpen(false); };
  const prevMonth = () => { if (viewMonth===0) { setViewMonth(11); setViewYear(y=>y-1); } else setViewMonth(m=>m-1); };
  const nextMonth = () => { if (viewMonth===11) { setViewMonth(0); setViewYear(y=>y+1); } else setViewMonth(m=>m+1); };
  const days = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDay(viewMonth, viewYear);
  const selectedDay = parsed && parsed.getMonth()===viewMonth && parsed.getFullYear()===viewYear ? parsed.getDate() : null;
  const isPastDay = (day) => { const d = new Date(viewYear,viewMonth,day); d.setHours(0,0,0,0); const t = new Date(); t.setHours(0,0,0,0); return d < t; };
  const displayValue = parsed ? parsed.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "Select expiry date";
  const monthOptions = MONTHS.map((m,i) => ({ value:i, label:m }));
  const yearOptions  = Array.from({ length:30 }, (_,i) => ({ value:today.getFullYear()+i, label:String(today.getFullYear()+i) }));
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={() => !disabled && setOpen(o=>!o)}
        style={{ width:"100%", padding:"12px 16px", borderRadius:"14px", border: hasError?`1.5px solid ${RED}`:"1.5px solid rgba(15, 23, 42, 0.1)", background:disabled?"rgba(15, 23, 42, 0.02)":"#fff", fontSize:"14px", fontWeight:"600", color:value?(disabled?"#64748b":"#0f172a"):"#94a3b8", boxSizing:"border-box", fontFamily:F, transition:"all 0.2s ease", cursor:disabled?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none" }}>
        <span>{displayValue}</span>
        {!disabled && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}
            style={{ position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:9999, background:"#fff", borderRadius:"20px", border:"1px solid #f1f5f9", boxShadow:"0 15px 35px rgba(0,0,0,0.12)", padding:"16px", width:"290px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px", gap:"6px" }}>
              <button onClick={prevMonth} style={{ background:"none", border:"none", cursor:"pointer", padding:"6px", borderRadius:"10px", display:"flex", alignItems:"center", color:"#475569" }}><ChevLeft/></button>
              <div style={{ display:"flex", gap:"6px", flex:1, justifyContent:"center" }}>
                <MiniDropdown options={monthOptions} value={viewMonth} onChange={setViewMonth} width="115px"/>
                <MiniDropdown options={yearOptions}  value={viewYear}  onChange={setViewYear}  width="80px"/>
              </div>
              <button onClick={nextMonth} style={{ background:"none", border:"none", cursor:"pointer", padding:"6px", borderRadius:"10px", display:"flex", alignItems:"center", color:"#475569" }}><ChevRight/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"1px", marginBottom:"4px" }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign:"center", fontSize:"10px", fontWeight:"800", color:"#94a3b8", padding:"4px 0" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px" }}>
              {Array.from({ length:firstDay }).map((_,i) => <div key={"e"+i} style={{ height:"34px" }}/>)}
              {Array.from({ length:days }, (_,i) => i+1).map(day => {
                const past = isPastDay(day);
                return (
                  <button key={day} onClick={() => !past && handleDayClick(day)} disabled={past}
                    style={{ width:"100%", height:"34px", borderRadius:"10px", border:"none", background:selectedDay===day?RED:"transparent", color:selectedDay===day?"white":past?"#e2e8f0":"#334155", fontWeight:selectedDay===day?"800":"600", fontSize:"13px", cursor:past?"default":"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e => { if (selectedDay!==day && !past) e.currentTarget.style.background="#f1f5f9"; }}
                    onMouseLeave={e => { if (selectedDay!==day) e.currentTarget.style.background="transparent"; }}>
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChevLeft  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const ChevRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const ShieldIcon  = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const CarIcon     = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/></svg>);
const AadhaarIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M14 9h4M14 13h4M6 16h12"/></svg>);
const SelfieIcon  = () => (<svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H6a3 3 0 0 0-3 3v2"/><path d="M20 3h2a3 3 0 0 1 3 3v2"/><path d="M8 25H6a3 3 0 0 1-3-3v-2"/><path d="M20 25h2a3 3 0 0 0 3-3v-2"/><circle cx="14" cy="11" r="3"/><path d="M9 23c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>);
const UploadIcon  = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const CheckIcon   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const ClockIcon   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const ChevronRight= () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);
const CameraIcon  = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);

const StatusBadge = ({ status }) => {
  const config = {
    verified:     { bg:"#f0fdf4", border:"#bbf7d0", color:"#16a34a", text:"Verified",     icon:<CheckIcon /> },
    pending:      { bg:"#fffbeb", border:"#fde68a", color:"#d97706", text:"Pending",      icon:<ClockIcon /> },
    rejected:     { bg:"#fef2f2", border:"#fecdd3", color:RED,       text:"Rejected",     icon:"✕" },
    not_uploaded: { bg:"#f8fafc", border:"#e2e8f0", color:"#94a3b8", text:"Not Uploaded", icon:<span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#cbd5e1", display:"inline-block" }}/> },
  };
  const c = config[status] || config.not_uploaded;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 14px", borderRadius:"99px", background:c.bg, border:`1.5px solid ${c.border}`, color:c.color, fontSize:"11px", fontWeight:"900", fontFamily:H, textTransform:"uppercase", letterSpacing:"0.5px" }}>
      {c.icon} {c.text}
    </span>
  );
};

const UploadBox = ({ label, hint, file, onChange, accept="image/*", disabled, fallbackUrl }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const displaySrc = preview || fallbackUrl || null;
  return (
    <div>
      <p style={{ fontSize:"12px", fontWeight:"800", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"10px", fontFamily:H }}>{label}</p>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        style={{ border:`2px dashed ${(file||fallbackUrl)?"rgba(34, 197, 94, 0.4)":"rgba(15, 23, 42, 0.08)"}`, borderRadius:"18px", padding:"24px", textAlign:"center", cursor:disabled?"default":"pointer", background:(file||fallbackUrl)?"#f0fdf4":"rgba(15, 23, 42, 0.02)", transition:"all 0.3s ease", minHeight:"130px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px" }}
        onMouseEnter={e => { if (!disabled && !file) e.currentTarget.style.borderColor=RED; e.currentTarget.style.background="rgba(190, 13, 13, 0.02)"; }}
        onMouseLeave={e => { if (!disabled && !file) { e.currentTarget.style.borderColor="rgba(15, 23, 42, 0.08)"; e.currentTarget.style.background="rgba(15, 23, 42, 0.02)"; } }}
      >
        {displaySrc ? (
          <div style={{ position:"relative" }}>
            <img src={displaySrc} alt={label} style={{ maxHeight:"110px", maxWidth:"100%", borderRadius:"12px", objectFit:"contain", boxShadow:"0 8px 20px rgba(0,0,0,0.1)" }} />
            {!disabled && (
              <div onClick={e => { e.stopPropagation(); onChange(null); }} style={{ position:"absolute", top:"-8px", right:"-8px", background:RED, color:"white", width:"20px", height:"20px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"900", border:"2px solid white", cursor:"pointer" }}>✕</div>
            )}
          </div>
        ) : (
          <>
            <div style={{ color:"#94a3b8" }}><UploadIcon /></div>
            <p style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a", margin:0, fontFamily:F }}>Click to upload</p>
            <p style={{ fontSize:"12px", color:"#94a3b8", margin:0, fontWeight:"600", fontFamily:F }}>{hint}</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} style={{ display:"none" }} onChange={e => { const f=e.target.files[0]; if (f && f.size>5*1024*1024) { alert("File size must be under 5MB."); e.target.value=""; return; } onChange(f); e.target.value=""; }} />
    </div>
  );
};

const STEPS = [
  { key:"driving-licence", label:"Driving Licence", icon:<CarIcon />,     desc:"Valid DL with LMV/MCWG class" },
  { key:"aadhaar",         label:"Aadhaar Card",    icon:<AadhaarIcon />, desc:"Front & back scan required" },
  { key:"selfie",          label:"Live Selfie",     icon:<SelfieIcon />,  desc:"Camera only — no gallery upload" },
];

const DocumentVerification = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [docStatus, setDocStatus] = useState({ "driving-licence":"not_uploaded", aadhaar:"not_uploaded", selfie:"not_uploaded" });
  const [notification, setNotification] = useState(null);
  const stepRefs = useRef({});
  const allPendingOrDone = (s) => s==="pending" || s==="verified";
  const [expandedCards, setExpandedCards] = useState({ "driving-licence":true, aadhaar:true, selfie:true });

  const [dlFront, setDlFront] = useState(null);
  const [dlImageUrl, setDlImageUrl] = useState(null);
  const [aadhaarFrontUrl, setAadhaarFrontUrl] = useState(null);
  const [aadhaarBackUrl, setAadhaarBackUrl] = useState(null);
  const [dlNumber, setDlNumber] = useState("");
  const [dlExpiry, setDlExpiry] = useState("");
  const [dlClass, setDlClass] = useState("");
  const [dlErrors, setDlErrors] = useState({});
  const [dlBorderColor, setDlBorderColor] = useState(undefined);
  const [dlClassOpen, setDlClassOpen] = useState(false);

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarErrors, setAadhaarErrors] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [selfieImg, setSelfieImg] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type="success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

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
    const formData = new FormData();
    formData.append("file", compressed);
    formData.append("upload_preset", "RoadMate Image");
    formData.append("cloud_name", "ds1cjvxyj");
    const res = await fetch("https://api.cloudinary.com/v1_1/ds1cjvxyj/image/upload", { method:"POST", body:formData });
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  useEffect(() => {
    let firestoreUnsub = null;
    const authUnsub = onAuthStateChanged(auth, (u) => {
      if (!u) { navigate("/"); return; }
      setUser(u);
      firestoreUnsub = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const newStatus = { "driving-licence":d.dlStatus||"not_uploaded", aadhaar:d.aadhaarStatus||"not_uploaded", selfie:d.selfieStatus||"not_uploaded" };
          setDocStatus(newStatus);
          setExpandedCards({ "driving-licence":!allPendingOrDone(newStatus["driving-licence"]), aadhaar:!allPendingOrDone(newStatus.aadhaar), selfie:!allPendingOrDone(newStatus.selfie) });
          if (d.dlStatus==="rejected"||d.dlStatus==="not_uploaded") { setDlNumber(""); setDlExpiry(""); setDlClass(""); setDlFront(null); setDlImageUrl(null); setDlErrors({}); setDlBorderColor(undefined); }
          else { if (d.dlNumber) setDlNumber(d.dlNumber); if (d.dlExpiry) setDlExpiry(d.dlExpiry); if (d.dlClass) setDlClass(d.dlClass); if (d.dlImage) setDlImageUrl(d.dlImage); }
          if (d.aadhaarStatus==="rejected"||d.aadhaarStatus==="not_uploaded") { setAadhaarFront(null); setAadhaarBack(null); setAadhaarNumber(""); setAadhaarFrontUrl(null); setAadhaarBackUrl(null); setAadhaarErrors({}); }
          else { if (d.aadhaarNumber) setAadhaarNumber(d.aadhaarNumber); if (d.aadhaarFrontImage) setAadhaarFrontUrl(d.aadhaarFrontImage); if (d.aadhaarBackImage) setAadhaarBackUrl(d.aadhaarBackImage); }
          if (d.selfieStatus==="rejected"||d.selfieStatus==="not_uploaded") setSelfieImg(null);
          else { if (d.selfieImage) setSelfieImg(d.selfieImage); }
          if (d.notification && !d.notification.read) { setNotification(d.notification); setDoc(doc(db,"users",u.uid), { notification:{ ...d.notification, read:true } }, { merge:true }); }
        }
        setLoading(false);
      });
    });
    return () => { authUnsub(); firestoreUnsub?.(); if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [navigate]);

  useEffect(() => {
    const isValid = /^[A-Z]{2}([0-9]{11}|[0-9]{13})$/.test(dlNumber.toUpperCase());
    if (dlNumber.length >= 13 && isValid) setDlBorderColor("#22c55e");
    else if (dlNumber.length >= 13 && !isValid) setDlBorderColor("#be0d0d");
    else setDlBorderColor(undefined);
  }, [dlNumber]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } });
      setStream(s); setCameraOn(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100);
    } catch { showToast("Camera access denied", "error"); }
  };

  const takeSelfie = () => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video||!canvas) return;
    canvas.width=video.videoWidth; canvas.height=video.videoHeight;
    canvas.getContext("2d").drawImage(video,0,0);
    setSelfieImg(canvas.toDataURL("image/jpeg"));
    stream?.getTracks().forEach(t => t.stop()); setCameraOn(false);
  };

  const validateDL = () => {
    const errors = {};
    if (!dlFront && !dlImageUrl) errors.photo = true;
    const dlClean = dlNumber.replace(/-/g,"").toUpperCase().trim();
    if (!dlClean) errors.dlNumber="DL number is required";
    else if (!/^[A-Z]{2}([0-9]{11}|[0-9]{13})$/.test(dlClean)) errors.dlNumber="Invalid DL number format";
    if (!dlExpiry) errors.dlExpiry="Expiry date is required";
    else { const today=new Date(); today.setHours(0,0,0,0); if (new Date(dlExpiry)<today) errors.dlExpiry="DL is expired — please renew it first"; }
    if (!dlClass) errors.dlClass=true;
    setDlErrors(errors);
    if (errors.dlNumber) setDlBorderColor("#be0d0d");
    return Object.keys(errors).length===0;
  };

  const [uploading, setUploading] = useState(false);

  const handleSubmitAll = async () => {
    const dlPending  = docStatus["driving-licence"]==="pending"||docStatus["driving-licence"]==="verified";
    const aadPending = docStatus.aadhaar==="pending"||docStatus.aadhaar==="verified";
    const selfiePend = docStatus.selfie==="pending"||docStatus.selfie==="verified";
    const dlOk   = dlPending  || validateDL();
    const aadOk  = aadPending || (aadhaarFront && aadhaarBack && aadhaarNumber.replace(/\s/g,"").length===12);
    const selfOk = selfiePend || !!selfieImg;
    if (!dlOk||!aadOk||!selfOk) { showToast("Please fill in all required fields before submitting.", "error"); return; }
    setUploading(true);
    try {
      const uploadPromises = [];
      if (!dlPending && dlFront)       uploadPromises.push(uploadToCloudinary(dlFront).then(url=>({ key:"dlImage", url })));
      if (!aadPending && aadhaarFront) uploadPromises.push(uploadToCloudinary(aadhaarFront).then(url=>({ key:"aadhaarFrontImage", url })));
      if (!aadPending && aadhaarBack)  uploadPromises.push(uploadToCloudinary(aadhaarBack).then(url=>({ key:"aadhaarBackImage", url })));
      if (!selfiePend && selfieImg && selfieImg.startsWith("data:")) { const blob=await fetch(selfieImg).then(r=>r.blob()); const selfieFile=new File([blob],"selfie.jpg",{type:"image/jpeg"}); uploadPromises.push(uploadToCloudinary(selfieFile).then(url=>({ key:"selfieImage", url }))); }
      const uploadedImgs = await Promise.all(uploadPromises);
      const imgMap = {}; uploadedImgs.forEach(({ key, url }) => { imgMap[key]=url; });
      const updates = {};
      if (!dlPending) Object.assign(updates, { dlNumber:dlNumber.replace(/-/g,"").toUpperCase(), dlExpiry, dlClass, dlStatus:"pending", dlSubmittedAt:new Date(), ...(imgMap.dlImage?{dlImage:imgMap.dlImage}:{}) });
      if (!aadPending) Object.assign(updates, { aadhaarNumber, aadhaarStatus:"pending", aadhaarSubmittedAt:new Date(), ...(imgMap.aadhaarFrontImage?{aadhaarFrontImage:imgMap.aadhaarFrontImage}:{}), ...(imgMap.aadhaarBackImage?{aadhaarBackImage:imgMap.aadhaarBackImage}:{}) });
      if (!selfiePend) Object.assign(updates, { selfieStatus:"pending", selfieSubmittedAt:new Date(), ...(imgMap.selfieImage?{selfieImage:imgMap.selfieImage}:{}) });
      if (Object.keys(updates).length===0) { showToast("All documents already submitted!", "error"); return; }
      await setDoc(doc(db,"users",user.uid), updates, { merge:true });
      showToast("Documents submitted for review!");
      setExpandedCards({ "driving-licence":false, aadhaar:false, selfie:false });
      window.scrollTo({ top:0, behavior:"smooth" });
    } catch(e) { showToast("Upload failed — check your connection.", "error"); }
    finally { setUploading(false); }
  };

  const allVerified = Object.values(docStatus).every(s => s==="verified");
  const anyPending  = Object.values(docStatus).some(s => s==="pending");

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"40px", height:"40px", border:"4px solid rgba(190,13,13,0.1)", borderTop:`4px solid ${RED}`, borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto" }} />
        <p style={{ color:"#64748b", marginTop:"20px", fontSize:"15px", fontWeight:"700", fontFamily:H }}>Preparing verification...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(190,13,13,0.08) !important; }
        .hover-btn:hover { background:rgba(15, 23, 42, 0.05) !important; }
        input::placeholder { color:#94a3b8 !important; font-weight:600 !important; }

        .dv-inner { max-width: 800px; margin: 0 auto; padding: 100px 24px 120px; }
        .dv-card  { background:#fff; border-radius:28px; padding:32px; box-shadow:0 4px 24px rgba(0,0,0,0.03); border:1.5px solid rgba(15, 23, 42, 0.05); overflow:visible; margin-bottom:16px; transition:all .3s ease; }
        .dv-title { font-size: 40px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; font-family: H; }
        .dv-dl-grid, .dv-aad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .dv-step-header { display:flex; align-items:center; gap:20px; cursor:pointer; }

        @media (max-width: 900px) {
          .dv-inner { padding: 80px 16px 80px !important; }
          .dv-card  { padding: 24px !important; border-radius: 20px !important; }
          .dv-title { font-size: 28px !important; }
          .dv-dl-grid, .dv-aad-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      <div className="dv-inner">
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:"32px" }}>
            <h1 className="dv-title">
              Document <span style={{ color:RED }}>Verification</span>
            </h1>
            <p style={{ color:"#64748b", fontSize:"16px", marginTop:"8px", fontWeight:"600" }}>Complete verification to unlock bookings</p>
          </motion.div>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="dv-card" style={{ background:allVerified?"#f0fdf4":anyPending?"#fffbeb":"#fff", borderColor:allVerified?"rgba(34, 197, 94, 0.4)":anyPending?"#fcd34d":"rgba(15, 23, 42, 0.05)", marginBottom:"24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
              <div style={{ width:"56px", height:"56px", borderRadius:"18px", background:allVerified?`linear-gradient(135deg,#22c55e,#16a34a)`:anyPending?`linear-gradient(135deg,#f59e0b,#d97706)`:`rgba(15, 23, 42, 0.05)`, display:"flex", alignItems:"center", justifyContent:"center", color:allVerified||anyPending?"white":"#94a3b8", flexShrink:0 }}>
                <ShieldIcon />
              </div>
              <div>
                <h3 style={{ margin:0, fontSize:"18px", fontWeight:"900", fontFamily:H, color:"#0f172a" }}>
                  {allVerified?"All Documents Verified ✅":anyPending?"Verification In Progress":"Verification Required"}
                </h3>
                <p style={{ margin:"4px 0 0", fontSize:"14px", color:"#64748b", fontWeight:"600" }}>
                  {allVerified?"You can now book any vehicle on RoadMate!":anyPending?"Our team will review your documents within 24 hours.":"Submit all 3 documents to start booking vehicles."}
                </p>
              </div>
            </div>
          </motion.div>

          {STEPS.map((step) => {
            const status = docStatus[step.key];
            const isOpen = expandedCards[step.key];
            return (
              <div key={step.key} ref={el => stepRefs.current[step.key]=el} className="dv-card">
                <div className="dv-step-header" onClick={() => setExpandedCards(p => ({ ...p, [step.key]:!p[step.key] }))}>
                  <div style={{ width:"50px", height:"50px", borderRadius:"16px", background:status==="verified"?"#f0fdf4":status==="pending"?"#fffbeb":"rgba(15, 23, 42, 0.03)", display:"flex", alignItems:"center", justifyContent:"center", color:status==="verified"?"#16a34a":status==="pending"?"#d97706":"#94a3b8", flexShrink:0, border:`1.5px solid ${status==="verified"?"rgba(34, 197, 94, 0.3)":status==="pending"?"#fcd34d":"transparent"}` }}>
                    {status==="verified"?<CheckIcon />:step.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                      <span style={{ fontSize:"17px", fontWeight:"900", color:"#0f172a", fontFamily:H }}>{step.label}</span>
                      <StatusBadge status={status} />
                    </div>
                    <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#94a3b8", fontWeight:"600" }}>{step.desc}</p>
                  </div>
                  <div style={{ color:"#cbd5e1", transform:isOpen?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)", flexShrink:0 }}>
                    <ChevronRight />
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }} style={{ overflow: "hidden" }}>
                      <div style={{ borderTop: "1.5px solid #f1f5f9", marginTop: "20px", paddingTop: "25px" }}>
                        {step.key==="driving-licence" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                            <UploadBox label="DL Photo" hint="Front clear photo of your Driving Licence" file={dlFront} onChange={setDlFront} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={dlImageUrl} />
                            <div className="dv-dl-grid">
                              <div>
                                <label style={fieldLabel}>DL Number</label>
                                <input value={dlNumber} onChange={e => setDlNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,15))} placeholder="OD0420XXXXXXXXX" maxLength={15} disabled={status==="pending"||status==="verified"||uploading} style={{ ...fieldInput(status!=="pending"&&status!=="verified"&&!uploading), borderColor:dlErrors.dlNumber?RED:dlBorderColor }} />
                                {dlErrors.dlNumber && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ {dlErrors.dlNumber}</p>}
                              </div>
                              <div>
                                <label style={fieldLabel}>Expiry Date</label>
                                <ExpiryDatePicker value={dlExpiry} onChange={setDlExpiry} disabled={status==="pending"||status==="verified"||uploading} hasError={!!dlErrors.dlExpiry} />
                                {dlErrors.dlExpiry && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ {dlErrors.dlExpiry}</p>}
                              </div>
                            </div>
                            <div>
                               <label style={fieldLabel}>Vehicle Category</label>
                               <MiniDropdown options={[{value:"LMV",label:"LMV (Car)"},{value:"MCWG",label:"MCWG (Bike)"},{value:"LMV+MCWG",label:"Both Car & Bike"}]} value={dlClass} onChange={setDlClass} width="100%" disabled={status==="pending"||status==="verified"||uploading} />
                               {dlErrors.dlClass && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ Category is required</p>}
                            </div>
                          </div>
                        )}
                        {step.key==="aadhaar" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                            <div className="dv-aad-grid">
                              <UploadBox label="Front Side" hint="Clear scan of Aadhaar front" file={aadhaarFront} onChange={setAadhaarFront} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={aadhaarFrontUrl} />
                              <UploadBox label="Back Side" hint="Clear scan of Aadhaar back" file={aadhaarBack} onChange={setAadhaarBack} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={aadhaarBackUrl} />
                            </div>
                            <div>
                              <label style={fieldLabel}>Aadhaar Number</label>
                              <input value={aadhaarNumber} onChange={e => { const raw=e.target.value.replace(/\D/g,"").slice(0,12); const formatted=raw.replace(/(\d{4})(?=\d)/g,"$1 ").trim(); setAadhaarNumber(formatted); }} placeholder="XXXX XXXX XXXX" disabled={status==="pending"||status==="verified"||uploading} style={{ ...fieldInput(status!=="pending"&&status!=="verified"&&!uploading), borderColor:aadhaarNumber.replace(/\s/g,"").length===12?"#22c55e":undefined }} />
                            </div>
                          </div>
                        )}
                        {step.key==="selfie" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"20px", alignItems:"center" }}>
                            {status!=="pending"&&status!=="verified" ? (
                              selfieImg ? (
                                <div style={{ textAlign:"center" }}>
                                  <img src={selfieImg} alt="selfie" style={{ width:"200px", height:"200px", borderRadius:"50%", objectFit:"cover", border:`5px solid ${RED}`, boxShadow:`0 10px 25px ${RED}40` }} />
                                  <br /><button onClick={() => !uploading&&setSelfieImg(null)} className="hover-btn" style={{ background:"rgba(15, 23, 42, 0.05)", border:"none", padding:"10px 24px", borderRadius:"12px", fontSize:"14px", fontWeight:"800", cursor:uploading?"not-allowed":"pointer", marginTop:"15px" }}>Retake Photo</button>
                                </div>
                              ) : cameraOn ? (
                                <div style={{ textAlign:"center", width: "100%" }}>
                                  <video ref={videoRef} autoPlay playsInline muted style={{ width:"260px", height:"260px", borderRadius:"50%", objectFit:"cover", border:`5px solid ${RED}`, margin: "0 auto", display: "block" }} />
                                  <canvas ref={canvasRef} style={{ display:"none" }} />
                                  <button onClick={takeSelfie} style={{ ...submitBtn, width:"auto", padding:"14px 40px", marginTop:"20px" }}>Capture Selfie</button>
                                </div>
                              ) : (
                                <button onClick={startCamera} style={{ ...submitBtn, background: "#1e293b" }}>Open Camera for Selfie</button>
                              )
                            ) : (
                              <div style={{ textAlign:"center" }}>
                                <img src={selfieImg} alt="selfie" style={{ width:"180px", height:"180px", borderRadius:"50%", objectFit:"cover", border:`4px solid ${status==="verified"?"#22c55e":"#fcd34d"}` }} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {!allVerified && !anyPending && (
            <button onClick={handleSubmitAll} disabled={uploading} style={{ ...submitBtn, padding:"18px", fontSize:"16px", borderRadius:"18px", marginTop: "12px" }}>
              {uploading ? "Uploading Documents..." : "Submit for Verification"}
            </button>
          )}

          {anyPending && (
            <div style={{ marginTop:"12px", padding:"16px 20px", borderRadius:"18px", background:"#fffbeb", border:"1.5px solid #fcd34d", fontSize:"14px", color:"#92400e", fontWeight:"700", display:"flex", alignItems:"center", gap:"12px" }}>
              <ClockIcon /> Review in progress. Our team will notify you within 24 hours.
            </div>
          )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            style={{ position:"fixed", bottom:"40px", left:0, right:0, display:"flex", justifyContent:"center", zIndex:9999, padding:"0 20px" }}>
            <div style={{ background:"#1e293b", color:"white", padding:"16px 28px", borderRadius:"20px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 15px 40px rgba(0,0,0,0.2)", borderLeft:`6px solid ${toast.type==="error"?RED:"#22c55e"}`, fontSize:"15px", fontWeight:"800" }}>
              {toast.type==="error"?"⚠️":"✅"} {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentVerification;