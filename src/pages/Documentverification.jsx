import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ChevLeft  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>);
const ChevRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>);

const MiniDropdown = ({ options, value, onChange, width }) => {
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
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: "1.5px solid #f1f5f9", background: "#f8fafc", fontSize: "13px", fontWeight: "700", color: "#1e293b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'Outfit', sans-serif" }}>
        <span>{selected?.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points={open?"18 15 12 9 6 15":"6 9 12 15 18 9"}/></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
            style={{ position:"absolute", top:"calc(100% + 4px)", left:0, width:"100%", maxHeight:"180px", overflowY:"auto", background:"#fff", borderRadius:"12px", zIndex:9999, boxShadow:"0 6px 20px rgba(0,0,0,0.12)", border:"1px solid #f1f5f9" }}>
            {options.map(opt => (
              <div key={opt.value} onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
                style={{ padding:"10px 14px", fontSize:"13px", fontWeight: opt.value===value?"700":"600", color: opt.value===value?RED:"#475569", background: opt.value===value?"rgba(190,13,13,0.05)":"transparent", cursor:"pointer", fontFamily:"'Outfit', sans-serif" }}
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
        style={{ width:"100%", padding:"12px 16px", borderRadius:"14px", border: hasError?`2px solid ${RED}`:"1.5px solid #e2e8f0", background:disabled?"#f8fafc":"#fff", fontSize:"14px", fontWeight:"600", color:value?(disabled?"#64748b":"#1e293b"):"#94a3b8", boxSizing:"border-box", fontFamily:"'Outfit', sans-serif", transition:"all 0.2s", cursor:disabled?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none" }}>
        <span>{displayValue}</span>
        {!disabled && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)}
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
    <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"4px 12px", borderRadius:"20px", background:c.bg, border:`1px solid ${c.border}`, color:c.color, fontSize:"12px", fontWeight:"800", fontFamily:"'Outfit', sans-serif" }}>
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
      <p style={{ fontSize:"12px", fontWeight:"800", color:"#64748b", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px", fontFamily:"'Outfit', sans-serif" }}>{label}</p>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        style={{ border:`2.5px dashed ${(file||fallbackUrl)?"#22c55e":"#e2e8f0"}`, borderRadius:"20px", padding:"20px", textAlign:"center", cursor:disabled?"default":"pointer", background:(file||fallbackUrl)?"#f0fdf4":"#f8fafc", transition:"all 0.3s", minHeight:"130px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px" }}
        onMouseEnter={e => { if (!disabled && !file) e.currentTarget.style.borderColor=RED; e.currentTarget.style.background="#f1f5f9"; }}
        onMouseLeave={e => { if (!disabled && !file) { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.background="#f8fafc"; } else if (file||fallbackUrl) e.currentTarget.style.background="#f0fdf4"; }}
      >
        {displaySrc ? (
          <div style={{ position:"relative" }}>
            <img src={displaySrc} alt={label} style={{ maxHeight:"100px", maxWidth:"100%", borderRadius:"12px", objectFit:"contain", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }} />
            {!disabled && (
              <div style={{ position:"absolute", top:"-8px", right:"-8px", background:RED, color:"white", width:"20px", height:"20px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"900", border:"2px solid white" }}>✕</div>
            )}
          </div>
        ) : (
          <>
            <div style={{ color:"#94a3b8" }}><UploadIcon /></div>
            <p style={{ fontSize:"14px", fontWeight:"700", color:"#475569", margin:0, fontFamily:"'Outfit', sans-serif" }}>Click to upload</p>
            <p style={{ fontSize:"11px", color:"#94a3b8", margin:0, fontFamily:"'Outfit', sans-serif", fontWeight:"600" }}>{hint}</p>
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
  const { docType } = useParams();
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
    return () => { authUnsub(); firestoreUnsub?.(); };
  }, [navigate]);

  const prevExpandedRef = useRef({});
  useEffect(() => {
    const prev = prevExpandedRef.current;
    const openedKey = Object.keys(expandedCards).find(k => expandedCards[k] && !prev[k]);
    const anyOpen = Object.values(expandedCards).some(v => v);
    if (openedKey && stepRefs.current[openedKey]) {
      setTimeout(() => { const el = stepRefs.current[openedKey]; const top = el.getBoundingClientRect().top+window.scrollY-90; window.scrollTo({ top, behavior:"smooth" }); }, 100);
    } else if (!anyOpen) { setTimeout(() => window.scrollTo({ top:0, behavior:"smooth" }), 100); }
    prevExpandedRef.current = { ...expandedCards };
  }, [expandedCards]);

  useEffect(() => {
    if (!dlClassOpen) return;
    const handler = (e) => { if (!e.target.closest("#dl-class-dropdown")) setDlClassOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dlClassOpen]);

  useEffect(() => {
    const isValid = /^[A-Z]{2}([0-9]{11}|[0-9]{13})$/.test(dlNumber.toUpperCase());
    if (dlNumber.length >= 13 && isValid) setDlBorderColor("#22c55e");
    else if (dlNumber.length >= 13 && !isValid) setDlBorderColor("#be0d0d");
    else setDlBorderColor(undefined);
  }, [dlNumber]);

  useEffect(() => { return () => { if (stream) stream.getTracks().forEach(t => t.stop()); }; }, [stream]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } });
      setStream(s); setCameraOn(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100);
      setTimeout(() => { const el = stepRefs.current["selfie"]; if (el) window.scrollTo({ top:el.getBoundingClientRect().top+window.scrollY-90, behavior:"smooth" }); }, 200);
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
    if (!dlFront) errors.photo = true;
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
      if (!selfiePend && selfieImg) { const blob=await fetch(selfieImg).then(r=>r.blob()); const selfieFile=new File([blob],"selfie.jpg",{type:"image/jpeg"}); uploadPromises.push(uploadToCloudinary(selfieFile).then(url=>({ key:"selfieImage", url }))); }
      const uploadedImgs = await Promise.all(uploadPromises);
      const imgMap = {}; uploadedImgs.forEach(({ key, url }) => { imgMap[key]=url; });
      const updates = {};
      if (!dlPending) Object.assign(updates, { dlNumber:dlNumber.replace(/-/g,"").toUpperCase(), dlExpiry, dlClass, dlStatus:"pending", dlSubmittedAt:new Date(), ...(imgMap.dlImage?{dlImage:imgMap.dlImage}:{}) });
      if (!aadPending) Object.assign(updates, { aadhaarNumber, aadhaarStatus:"pending", aadhaarSubmittedAt:new Date(), ...(imgMap.aadhaarFrontImage?{aadhaarFrontImage:imgMap.aadhaarFrontImage}:{}), ...(imgMap.aadhaarBackImage?{aadhaarBackImage:imgMap.aadhaarBackImage}:{}) });
      if (!selfiePend) Object.assign(updates, { selfieStatus:"pending", selfieSubmittedAt:new Date(), ...(imgMap.selfieImage?{selfieImage:imgMap.selfieImage}:{}) });
      if (Object.keys(updates).length===0) { showToast("All documents already submitted!", "error"); return; }
      await setDoc(doc(db,"users",user.uid), updates, { merge:true });
      setDocStatus(prev => ({ ...prev, ...(!dlPending?{"driving-licence":"pending"}:{}), ...(!aadPending?{aadhaar:"pending"}:{}), ...(!selfiePend?{selfie:"pending"}:{}) }));
      showToast("Documents submitted for review!");
      setExpandedCards({ "driving-licence":false, aadhaar:false, selfie:false });
      setTimeout(() => window.scrollTo({ top:0, behavior:"smooth" }), 150);
    } catch(e) { showToast("Upload failed — check your connection and try again.", "error"); }
    finally { setUploading(false); }
  };

  const allVerified = Object.values(docStatus).every(s => s==="verified");
  const anyPending  = Object.values(docStatus).some(s => s==="pending");

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"40px", height:"40px", border:"4px solid rgba(190,13,13,0.1)", borderTop:`4px solid ${RED}`, borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto" }} />
        <p style={{ color:"#64748b", marginTop:"20px", fontSize:"15px", fontWeight:"700", fontFamily:"'Outfit', sans-serif" }}>Preparing verification...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'Outfit', sans-serif" }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .dv-wrap { animation: slideUp 0.6s ease-out; }
        input:focus, select:focus { outline:none; border-color:${RED} !important; border-width:2px; }
        .field-input { transition: all 0.2s; }
        .hover-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.04) !important; }

        /* Desktop */
        .dv-container { padding-top: 100px; padding-bottom: 120px; max-width: 800px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        .dv-header { margin-bottom: 35px; }
        .dv-card { background:#fff; border-radius:28px; padding:30px; margin-bottom:20px; border:1px solid #f1f5f9; box-shadow:0 4px 20px rgba(0,0,0,0.02); }
        .dv-dl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .dv-aad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .dv-step-header { display:flex; align-items:center; gap:20px; cursor:pointer; }

        @media (max-width: 900px) {
          .dv-container { padding-top: 80px !important; padding-bottom: 100px !important; }
          .dv-card { padding: 20px !important; border-radius: 20px !important; }
          .dv-dl-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .dv-aad-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .dv-title { font-size: 28px !important; }
          .dv-banner-icon { width: 40px !important; height: 40px !important; }
          .dv-step-icon { width: 42px !important; height: 42px !important; border-radius: 12px !important; }
        }
      `}</style>

      <div className="dv-container">
        <div className="dv-wrap">

          {/* Header */}
          <div className="dv-header">
            <h1 className="dv-title" style={{ fontSize: "38px", fontWeight: "900", color: "#1e293b", margin: 0, letterSpacing: "-1.5px" }}>
              Document <span style={{ color: RED }}>Verification</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: "16px", marginTop: "8px", fontWeight: "600" }}>Complete verification to unlock premium bookings</p>
          </div>

          {/* Status Banner */}
          <div className="dv-card" style={{ 
            background: allVerified ? "rgba(34,197,94,0.03)" : anyPending ? "rgba(217,119,6,0.03)" : "#fff", 
            borderColor: allVerified ? "#bbf7d0" : anyPending ? "#fde68a" : "#f1f5f9", 
            marginBottom: "30px",
            borderLeft: `6px solid ${allVerified ? "#22c55e" : anyPending ? "#f59e0b" : "#e2e8f0"}`
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"18px" }}>
              <div className="dv-banner-icon" style={{ 
                width:"54px", height:"54px", borderRadius:"16px", 
                background: allVerified ? "#22c55e" : anyPending ? "#f59e0b" : "#f1f5f9", 
                display:"flex", alignItems:"center", justifyContent:"center", 
                color: allVerified || anyPending ? "white" : "#94a3b8", flexShrink:0,
                boxShadow: allVerified ? "0 8px 20px rgba(34,197,94,0.2)" : anyPending ? "0 8px 20px rgba(245,158,11,0.2)" : "none"
              }}>
                <ShieldIcon />
              </div>
              <div style={{ flex:1 }}>
                <h3 style={{ margin:0, fontSize:"18px", fontWeight:"900", color:"#1e293b", letterSpacing:"-0.5px" }}>
                  {allVerified?"All Documents Verified ✅":anyPending?"Verification In Progress":"Verification Required"}
                </h3>
                <p style={{ margin:"4px 0 0", fontSize:"14px", color:"#64748b", fontWeight:"600" }}>
                  {allVerified?"You have verified access to RoadMate fleet.":anyPending?"Our team is reviewing your documents (ETA: 24h).":"Please upload required documents to start your journey."}
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          {STEPS.map((step, i) => {
            const status = docStatus[step.key];
            const isOpen = expandedCards[step.key];
            return (
              <div key={step.key} ref={el => stepRefs.current[step.key]=el} className="dv-card hover-card">
                <div className="dv-step-header" onClick={() => setExpandedCards(p => ({ ...p, [step.key]:!p[step.key] }))}>
                  <div className="dv-step-icon" style={{ 
                    width:"50px", height:"50px", borderRadius:"16px", 
                    background: status==="verified" ? "rgba(34,197,94,0.1)" : status==="pending" ? "rgba(217,119,6,0.1)" : status==="rejected" ? "rgba(190,13,13,0.1)" : "#f8fafc", 
                    display:"flex", alignItems:"center", justifyContent:"center", 
                    color: status==="verified"?"#16a34a":status==="pending"?"#d97706":status==="rejected"?RED:"#94a3b8", flexShrink:0, 
                    border:`1.5px solid ${status==="verified"?"#bbf7d0":status==="pending"?"#fde68a":status==="rejected"?"#fecdd3":"#f1f5f9"}` 
                  }}>
                    {status==="verified"?<CheckIcon />:step.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                      <span style={{ fontSize:"16px", fontWeight:"900", color:"#1e293b", letterSpacing:"-0.3px" }}>{step.label}</span>
                      <StatusBadge status={status} />
                    </div>
                    <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#94a3b8", fontWeight:"600" }}>{step.desc}</p>
                  </div>
                  <div style={{ color:"#cbd5e1", transform:isOpen?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.3s", flexShrink:0 }}>
                    <ChevronRight />
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}>
                      <div style={{ borderTop:"1.5px solid #f1f5f9", marginTop:"20px", paddingTop:"25px" }}>

                        {/* DL Form */}
                        {step.key==="driving-licence" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                            <UploadBox label="DL Photo" hint="Front clear photo of your Driving Licence" file={dlFront} onChange={setDlFront} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={dlImageUrl} />
                            <div className="dv-dl-grid">
                              <div style={{ flex:1 }}>
                                <label style={fieldLabel}>DL Number</label>
                                <input
                                  value={dlNumber}
                                  onChange={e => { const val=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,15); setDlNumber(val); if (/^[A-Z]{2}([0-9]{11}|[0-9]{13})$/.test(val)) setDlErrors(p=>({...p,dlNumber:""})); }}
                                  placeholder="OD0420XXXXXXXXX" maxLength={15}
                                  disabled={status==="pending"||status==="verified"||uploading}
                                  style={{ ...fieldInput(status!=="pending"&&status!=="verified"&&!uploading), borderColor:dlErrors.dlNumber?RED:dlBorderColor }}
                                />
                                {dlErrors.dlNumber && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ {dlErrors.dlNumber}</p>}
                              </div>
                              <div style={{ flex:1 }}>
                                <label style={fieldLabel}>Expiry Date</label>
                                <ExpiryDatePicker value={dlExpiry} onChange={val=>{ setDlExpiry(val); setDlErrors(p=>({...p,dlExpiry:""})); }} disabled={status==="pending"||status==="verified"||uploading} hasError={!!dlErrors.dlExpiry} />
                                {dlErrors.dlExpiry && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ {dlErrors.dlExpiry}</p>}
                              </div>
                            </div>
                            <div>
                              <label style={fieldLabel}>Vehicle Category</label>
                              {(() => {
                                const classes = [
                                  { value:"LMV",      label:"LMV",        sub:"Light Motor Vehicle (Car)" },
                                  { value:"MCWG",     label:"MCWG",       sub:"Motorcycle With Gear" },
                                  { value:"MCWOG",    label:"MCWOG",      sub:"Motorcycle Without Gear" },
                                  { value:"LMV+MCWG", label:"LMV + MCWG", sub:"Both Car and Motorcycle" },
                                ];
                                const selected = classes.find(c => c.value===dlClass);
                                const isDisabled = status==="pending"||status==="verified"||uploading;
                                return (
                                  <div id="dl-class-dropdown" style={{ position:"relative" }}>
                                    <div onClick={() => !isDisabled && setDlClassOpen(p=>!p)}
                                      style={{ ...fieldInput(!isDisabled), borderColor:dlErrors.dlClass?RED:dlClassOpen?RED:undefined, cursor:isDisabled?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none" }}>
                                      <span style={{ color:selected?"#1e293b":"#94a3b8", fontSize:"14px", fontWeight:"600" }}>{selected?selected.label:"Select primary category"}</span>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform:dlClassOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                    {dlClassOpen && (
                                      <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, right:0, background:"#fff", borderRadius:"16px", border:"1px solid #f1f5f9", boxShadow:"0 10px 40px rgba(0,0,0,0.1)", zIndex:100, overflow:"hidden" }}>
                                        {classes.map(c => (
                                          <div key={c.value} onClick={() => { setDlClass(c.value); setDlErrors(p=>({...p,dlClass:""})); setDlClassOpen(false); }}
                                            style={{ display:"flex", alignItems:"center", gap:"14px", padding:"15px 20px", cursor:"pointer", background:dlClass===c.value?"rgba(190,13,13,0.05)":"transparent", borderBottom:"1px solid #f8fafc" }}
                                            onMouseEnter={e => { if (dlClass!==c.value) e.currentTarget.style.background="#f8fafc"; }}
                                            onMouseLeave={e => { if (dlClass!==c.value) e.currentTarget.style.background="transparent"; }}>
                                            <div style={{ flex:1 }}>
                                              <p style={{ margin:0, fontSize:"14px", fontWeight:"800", color:dlClass===c.value?RED:"#1e293b", fontFamily:"'Outfit', sans-serif" }}>{c.label}</p>
                                              <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#94a3b8", fontFamily:"'Outfit', sans-serif", fontWeight:"600" }}>{c.sub}</p>
                                            </div>
                                            {dlClass===c.value && (<div style={{ background:RED, borderRadius:"50%", padding:"4px" }}><CheckIcon /></div>)}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                              {dlErrors.dlClass && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ Licence category is required</p>}
                            </div>
                            {(status==="not_uploaded"||status==="rejected") && (
                              <p style={{ fontSize:"13px", color:"#f59e0b", fontWeight:"700", margin:0, background:"rgba(245,158,11,0.08)", padding:"12px 16px", borderRadius:"12px", border:"1px solid rgba(245,158,11,0.2)" }}>
                                💡 Make sure all details on DL match your profile Information.
                              </p>
                            )}
                          </div>
                        )}

                        {/* Aadhaar Form */}
                        {step.key==="aadhaar" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                            <div className="dv-aad-grid">
                              <UploadBox label="Front Side" hint="Clear scan of Aadhaar front" file={aadhaarFront} onChange={setAadhaarFront} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={aadhaarFrontUrl} />
                              <UploadBox label="Back Side" hint="Clear scan of Aadhaar back" file={aadhaarBack} onChange={setAadhaarBack} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={aadhaarBackUrl} />
                            </div>
                            <div>
                              <label style={fieldLabel}>Aadhaar Number</label>
                              <input
                                value={aadhaarNumber}
                                onChange={e => { const raw=e.target.value.replace(/\D/g,"").slice(0,12); const formatted=raw.replace(/(\d{4})(?=\d)/g,"$1 ").trim(); setAadhaarNumber(formatted); }}
                                placeholder="XXXX XXXX XXXX"
                                disabled={status==="pending"||status==="verified"||uploading}
                                style={{ ...fieldInput(status!=="pending"&&status!=="verified"&&!uploading), borderColor:aadhaarErrors?.aadhaarNumber?RED:aadhaarNumber.replace(/\s/g,"").length===12?"#22c55e":undefined }}
                              />
                              {aadhaarErrors?.aadhaarNumber && <p style={{ margin:"6px 0 0", fontSize:"12px", color:RED, fontWeight:"700" }}>⚠ {aadhaarErrors.aadhaarNumber}</p>}
                            </div>
                          </div>
                        )}

                        {/* Selfie Form */}
                        {step.key==="selfie" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"20px", alignItems:"center" }}>
                            {(status==="not_uploaded"||status==="rejected") && !cameraOn && !selfieImg && (
                              <div style={{ padding:"15px 20px", borderRadius:"16px", background:"rgba(190,13,13,0.05)", border:"1px solid rgba(190,13,13,0.1)", fontSize:"13px", color:RED, fontWeight:"700", width:"100%", textAlign:"center" }}>
                                📸 We need a live selfie for identity verification.
                              </div>
                            )}
                            {(status==="pending"||status==="verified") && selfieImg && (
                              <div style={{ textAlign:"center", position:"relative" }}>
                                <img src={selfieImg} alt="selfie" style={{ width:"180px", height:"180px", borderRadius:"50%", objectFit:"cover", border:`6px solid ${status==="verified"?"#22c55e":"#f59e0b"}`, boxShadow:"0 10px 30px rgba(0,0,0,0.1)" }} />
                                <div style={{ position:"absolute", bottom:"10px", right:"10px", background:status==="verified"?"#22c55e":"#f59e0b", color:"white", width:"36px", height:"36px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.15)" }}>
                                  {status==="verified"?<CheckIcon />:<ClockIcon />}
                                </div>
                              </div>
                            )}
                            {status!=="pending"&&status!=="verified" && (
                              selfieImg ? (
                                <div style={{ textAlign:"center" }}>
                                  <img src={selfieImg} alt="selfie" style={{ width:"200px", height:"200px", borderRadius:"50%", objectFit:"cover", border:`5px solid ${RED}`, boxShadow:"0 15px 40px rgba(190,13,13,0.2)" }} />
                                  <p style={{ fontSize:"15px", color:"#22c55e", fontWeight:"800", marginTop:"15px" }}>Perfect Shot! ✨</p>
                                  <button onClick={() => !uploading&&setSelfieImg(null)} style={{ background:"#f8fafc", border:"1.5px solid #f1f5f9", padding:"10px 24px", borderRadius:"12px", fontSize:"14px", fontWeight:"800", cursor:uploading?"not-allowed":"pointer", marginTop:"10px", color:"#1e293b", transition:"0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"} onMouseLeave={e=>e.currentTarget.style.background="#f8fafc"}>Retake Photo</button>
                                </div>
                              ) : cameraOn ? (
                                <div style={{ textAlign:"center", width:"100%" }}>
                                  <div style={{ position:"relative", display:"inline-block", maxWidth:"300px", width:"100%" }}>
                                    <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", aspectRatio:"1/1", borderRadius:"100px", objectFit:"cover", border:`5px solid ${RED}`, boxShadow:"0 20px 50px rgba(190,13,13,0.15)" }} />
                                    <button onClick={() => { stream?.getTracks().forEach(t=>t.stop()); setCameraOn(false); }} 
                                      style={{ position:"absolute", top:"15px", right:"15px", width:"36px", height:"36px", borderRadius:"50%", background:"rgba(0,0,0,0.5)", border:"none", color:"white", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(5px)" }}>✕</button>
                                  </div>
                                  <canvas ref={canvasRef} style={{ display:"none" }} />
                                  <br />
                                  <button onClick={takeSelfie} style={{ ...submitBtn, width:"auto", padding:"14px 40px", marginTop:"20px", display:"inline-flex", alignItems:"center", gap:"10px", background:RED }}>
                                    <CameraIcon /> Capture Selfie
                                  </button>
                                </div>
                              ) : (
                                <button onClick={startCamera} disabled={uploading} style={{ ...submitBtn, background:"#1e293b", opacity:uploading?0.5:1 }}>
                                  <span style={{ display:"flex", alignItems:"center", gap:"10px", justifyContent:"center" }}><CameraIcon /> Access Camera</span>
                                </button>
                              )
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

          {/* Action Footer */}
          {!allVerified && !anyPending && (
            <div style={{ marginTop:"20px" }}>
              <button onClick={handleSubmitAll} disabled={uploading} style={{ 
                ...submitBtn, padding:"18px", fontSize:"16px", borderRadius:"20px", 
                boxShadow: uploading ? "none" : "0 10px 30px rgba(190,13,13,0.3)", 
                opacity:uploading?0.8:1, transition:"0.3s" 
              }}>
                {uploading ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"12px" }}>
                    <div className="spinner" style={{ width:"20px", height:"20px", border:"3px solid rgba(255,255,255,0.3)", borderTop:"3px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                    Finalizing Upload...
                  </span>
                ) : "Submit for Verification"}
              </button>
            </div>
          )}

          {anyPending && (
            <div style={{ marginTop:"20px", padding:"20px", borderRadius:"20px", background:"rgba(245,158,11,0.05)", border:"1px solid rgba(245,158,11,0.2)", fontSize:"15px", color:"#b45309", fontWeight:"700", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 4px 15px rgba(245,158,11,0.05)" }}>
              <ClockIcon /> Review in progress. We'll notify you once verified.
            </div>
          )}

          <p style={{ fontSize:"13px", color:"#94a3b8", textAlign:"center", marginTop:"25px", fontWeight:"600", letterSpacing:"0.2px" }}>
            🔒 Your data is end-to-end encrypted and used only for verification.
          </p>

        </div>
      </div>

      {/* Admin notification & Toast same as before but updated style */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity:0, y:-100 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-100 }}
            style={{ position:"fixed", top:"100px", left:0, right:0, display:"flex", justifyContent:"center", zIndex:9999, padding:"0 20px" }}>
            <div style={{ background:notification.type==="approved"?"#ecfdf5":"#fef2f2", border:`2px solid ${notification.type==="approved"?"#bbf7d0":"#fecdd3"}`, color:notification.type==="approved"?"#065f46":RED, padding:"18px 24px", borderRadius:"24px", fontSize:"15px", fontWeight:"800", boxShadow:"0 15px 40px rgba(0,0,0,0.1)", maxWidth:"550px", width:"100%", display:"flex", alignItems:"center", gap:"15px" }}>
               <ShieldIcon /> {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

const fieldLabel = { display:"block", fontSize:"12px", fontWeight:"800", color:"#64748b", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"1.2px", fontFamily:"'Outfit', sans-serif" };
const fieldInput = (editable) => ({ width:"100%", padding:"12px 16px", borderRadius:"14px", border:editable?"1.5px solid #e2e8f0":"1.5px solid #f1f5f9", background:editable?"#fff":"#f8fafc", fontSize:"14px", fontWeight:"600", color:editable?"#1e293b":"#94a3b8", boxSizing:"border-box", fontFamily:"'Outfit', sans-serif", transition:"all 0.2s", cursor:editable?"text":"default" });
const submitBtn = { width:"100%", padding:"15px", borderRadius:"16px", background:RED, color:"white", border:"none", fontSize:"14px", fontWeight:"800", cursor:"pointer", fontFamily:"'Outfit', sans-serif", letterSpacing:"0.5px" };

export default DocumentVerification;