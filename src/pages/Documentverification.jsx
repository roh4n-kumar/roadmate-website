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
        style={{ width: "100%", padding: "5px 10px", borderRadius: "8px", border: "1.5px solid #eee", background: "#fafafa", fontSize: "13px", fontWeight: "700", color: "#111", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif" }}>
        <span>{selected?.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points={open?"18 15 12 9 6 15":"6 9 12 15 18 9"}/></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
            style={{ position:"absolute", top:"calc(100% + 4px)", left:0, width:"100%", maxHeight:"180px", overflowY:"auto", background:"#fff", borderRadius:"10px", zIndex:9999, boxShadow:"0 6px 20px rgba(0,0,0,0.12)", border:"1px solid #eee" }}>
            {options.map(opt => (
              <div key={opt.value} onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
                style={{ padding:"9px 12px", fontSize:"13px", fontWeight: opt.value===value?"700":"500", color: opt.value===value?RED:"#333", background: opt.value===value?"#fff5f5":"transparent", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
                onMouseEnter={e => { if (opt.value!==value) e.currentTarget.style.background="#f9f9f9"; }}
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
        style={{ width:"100%", padding:"11px 14px", borderRadius:"12px", border: hasError?`1.5px solid ${RED}`:"1.5px solid #e0e0e0", background:disabled?"#fafafa":"#fff", fontSize:"14px", fontWeight:"500", color:value?(disabled?"#888":"#111"):"#bbb", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s", cursor:disabled?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none" }}>
        <span>{displayValue}</span>
        {!disabled && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}
            style={{ position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:9999, background:"#fff", borderRadius:"14px", border:"1.5px solid #eee", boxShadow:"0 8px 28px rgba(0,0,0,0.13)", padding:"12px", width:"280px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px", gap:"6px" }}>
              <button onClick={prevMonth} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", borderRadius:"6px", display:"flex", alignItems:"center", color:"#555" }}><ChevLeft/></button>
              <div style={{ display:"flex", gap:"6px", flex:1, justifyContent:"center" }}>
                <MiniDropdown options={monthOptions} value={viewMonth} onChange={setViewMonth} width="110px"/>
                <MiniDropdown options={yearOptions}  value={viewYear}  onChange={setViewYear}  width="76px"/>
              </div>
              <button onClick={nextMonth} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", borderRadius:"6px", display:"flex", alignItems:"center", color:"#555" }}><ChevRight/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"1px", marginBottom:"2px" }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign:"center", fontSize:"10px", fontWeight:"700", color:"#bbb", padding:"2px 0" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"1px" }}>
              {Array.from({ length:firstDay }).map((_,i) => <div key={"e"+i} style={{ height:"32px" }}/>)}
              {Array.from({ length:days }, (_,i) => i+1).map(day => {
                const past = isPastDay(day);
                return (
                  <button key={day} onClick={() => !past && handleDayClick(day)} disabled={past}
                    style={{ width:"100%", height:"32px", borderRadius:"6px", border:"none", background:selectedDay===day?RED:"transparent", color:selectedDay===day?"white":past?"#ddd":"#111", fontWeight:selectedDay===day?"700":"500", fontSize:"12px", cursor:past?"default":"pointer" }}
                    onMouseEnter={e => { if (selectedDay!==day && !past) e.currentTarget.style.background="#ececec"; }}
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
    verified:     { bg:"#f0fdf4", border:"#86efac", color:"#16a34a", text:"Verified",     icon:<CheckIcon /> },
    pending:      { bg:"#fffbeb", border:"#fcd34d", color:"#d97706", text:"Pending",      icon:<ClockIcon /> },
    rejected:     { bg:"#fff5f5", border:"#fca5a5", color:RED,       text:"Rejected",     icon:"✕" },
    not_uploaded: { bg:"#f8fafc", border:"#e2e8f0", color:"#94a3b8", text:"Not Uploaded", icon:<span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#cbd5e1", display:"inline-block" }}/> },
  };
  const c = config[status] || config.not_uploaded;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"4px 10px", borderRadius:"20px", background:c.bg, border:`1px solid ${c.border}`, color:c.color, fontSize:"12px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif" }}>
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
      <p style={{ fontSize:"12px", fontWeight:"700", color:"#999", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px", fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        style={{ border:`2px dashed ${(file||fallbackUrl)?"#86efac":"#e0e0e0"}`, borderRadius:"14px", padding:"16px", textAlign:"center", cursor:disabled?"default":"pointer", background:(file||fallbackUrl)?"#f0fdf4":"#fafafa", transition:"all 0.2s", minHeight:"110px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px" }}
        onMouseEnter={e => { if (!disabled && !file) e.currentTarget.style.borderColor=RED; }}
        onMouseLeave={e => { if (!disabled && !file) e.currentTarget.style.borderColor="#e0e0e0"; }}
      >
        {displaySrc ? (
          <img src={displaySrc} alt={label} style={{ maxHeight:"90px", maxWidth:"100%", borderRadius:"8px", objectFit:"contain" }} />
        ) : (
          <>
            <div style={{ color:"#ccc" }}><UploadIcon /></div>
            <p style={{ fontSize:"13px", fontWeight:"600", color:"#555", margin:0, fontFamily:"'DM Sans',sans-serif" }}>Click to upload</p>
            <p style={{ fontSize:"11px", color:"#aaa", margin:0, fontFamily:"'DM Sans',sans-serif" }}>{hint}</p>
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
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width:"36px", height:"36px", border:"3px solid #f0f0f0", borderTop:`3px solid ${RED}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f4f4f6", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(190,13,13,0.08) !important; }
        .hover-btn:hover { background:#ececec !important; }
        input::placeholder { color:#ccc !important; font-weight:400 !important; }

        /* Desktop */
        .dv-wrap  { padding-top: 84px; padding-bottom: 120px; }
        .dv-inner { max-width: 700px; margin: 0 auto; padding: 0 20px; }
        .dv-card  { background:#fff; border-radius:20px; padding:24px; box-shadow:0 2px 16px rgba(0,0,0,0.06); border:1px solid #efefef; overflow:visible; margin-bottom:12px; }
        .dv-title { font-size: 34px; }
        .dv-dl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .dv-aad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .dv-step-header { display:flex; align-items:center; gap:16px; cursor:pointer; }

        /* Mobile */
        @media (max-width: 900px) {
          .dv-wrap  { padding-top: 68px !important; padding-bottom: 80px !important; }
          .dv-inner { padding: 0 12px !important; }
          .dv-card  { padding: 16px !important; border-radius: 16px !important; margin-bottom: 10px !important; }
          .dv-title { font-size: 24px !important; }
          .dv-dl-grid  { grid-template-columns: 1fr !important; gap: 12px !important; }
          .dv-aad-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .dv-step-header { gap: 12px !important; }
          .dv-step-icon { width: 40px !important; height: 40px !important; border-radius: 12px !important; }
          .dv-step-label { font-size: 14px !important; }
          .dv-step-desc { font-size: 11px !important; }
          .dv-banner-icon { width: 40px !important; height: 40px !important; }
          .dv-banner-title { font-size: 14px !important; }
          .dv-banner-sub   { font-size: 12px !important; }
          .dv-selfie-vid { width: 200px !important; height: 200px !important; }
          .dv-selfie-img { width: 160px !important; height: 160px !important; }
        }
      `}</style>

      <div className="dv-wrap">
        <div className="dv-inner">

          {/* Header */}
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:"24px" }}>
            <h1 className="dv-title" style={{ fontFamily:"'Arial Black','Arial',sans-serif", fontWeight:"900", color:"#111", margin:0, letterSpacing:"-0.5px" }}>
              Document <span style={{ color:RED }}>Verification</span>
            </h1>
            <p style={{ color:"#999", fontSize:"14px", marginTop:"6px", fontWeight:"500" }}>Complete verification to unlock bookings</p>
          </motion.div>

          {/* Status Banner */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="dv-card" style={{ background:allVerified?"#f0fdf4":anyPending?"#fffbeb":"#fff", borderColor:allVerified?"#86efac":anyPending?"#fcd34d":"#efefef", marginBottom:"20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <div className="dv-banner-icon" style={{ width:"48px", height:"48px", borderRadius:"50%", background:allVerified?"#22c55e":anyPending?"#f59e0b":"#e5e5e5", display:"flex", alignItems:"center", justifyContent:"center", color:"white", flexShrink:0 }}>
                <ShieldIcon />
              </div>
              <div>
                <h3 className="dv-banner-title" style={{ margin:0, fontSize:"16px", fontWeight:"800", fontFamily:"'Arial Black','Arial',sans-serif", color:"#111" }}>
                  {allVerified?"All Documents Verified ✅":anyPending?"Verification In Progress":"Verification Required"}
                </h3>
                <p className="dv-banner-sub" style={{ margin:"3px 0 0", fontSize:"13px", color:"#777", fontWeight:"500" }}>
                  {allVerified?"You can now book any vehicle on RoadMate!":anyPending?"Our team will review your documents within 24 hours.":"Submit all 3 documents to start booking vehicles."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          {STEPS.map((step, i) => {
            const status = docStatus[step.key];
            return (
              <motion.div key={step.key} ref={el => stepRefs.current[step.key]=el} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05*i }} className="dv-card">

                <div className="dv-step-header" onClick={() => setExpandedCards(p => ({ ...p, [step.key]:!p[step.key] }))}>
                  <div className="dv-step-icon" style={{ width:"46px", height:"46px", borderRadius:"14px", background:status==="verified"?"#f0fdf4":status==="pending"?"#fffbeb":"#fff5f5", display:"flex", alignItems:"center", justifyContent:"center", color:status==="verified"?"#16a34a":status==="pending"?"#d97706":RED, flexShrink:0, border:`1.5px solid ${status==="verified"?"#86efac":status==="pending"?"#fcd34d":"#fcc"}` }}>
                    {status==="verified"?<CheckIcon />:step.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                      <span className="dv-step-label" style={{ fontSize:"15px", fontWeight:"700", color:"#111" }}>{step.label}</span>
                      <StatusBadge status={status} />
                    </div>
                    <p className="dv-step-desc" style={{ margin:"2px 0 0", fontSize:"12px", color:"#aaa", fontWeight:"500" }}>{step.desc}</p>
                  </div>
                  <div style={{ color:"#ccc", transform:expandedCards[step.key]?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.2s", flexShrink:0 }}>
                    <ChevronRight />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedCards[step.key] && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.25 }} style={{ overflow:"visible" }}>
                      <div style={{ borderTop:"1px solid #f0f0f0", marginTop:"16px", paddingTop:"18px" }}>

                        {/* ── DL Form ── */}
                        {step.key==="driving-licence" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                            <UploadBox label="DL Photo" hint="Clear photo of your Driving Licence" file={dlFront} onChange={setDlFront} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={dlImageUrl} />
                            <div className="dv-dl-grid">
                              <div>
                                <label style={fieldLabel}>DL Number</label>
                                <input
                                  value={dlNumber}
                                  onChange={e => { const raw=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,15); const letters=raw.slice(0,2).replace(/[^A-Z]/g,""); const digits=raw.slice(2).replace(/[^0-9]/g,""); const val=(letters+digits).slice(0,15); setDlNumber(val); if (/^[A-Z]{2}([0-9]{11}|[0-9]{13})$/.test(val)) setDlErrors(p=>({...p,dlNumber:""})); }}
                                  onKeyDown={e => { if (e.key==="Enter") { e.preventDefault(); e.target.blur(); } }}
                                  onBlur={() => { if (!dlNumber) return; if (!/^[A-Z]{2}([0-9]{11}|[0-9]{13})$/.test(dlNumber)) setDlErrors(p=>({...p,dlNumber:"Invalid DL number format"})); }}
                                  placeholder="OD0420XXXXXXX" maxLength={15}
                                  disabled={status==="pending"||status==="verified"||uploading}
                                  style={{ ...fieldInput(status!=="pending"&&status!=="verified"&&!uploading), borderColor:dlErrors.dlNumber?"#be0d0d":dlBorderColor }}
                                />
                                {dlErrors.dlNumber && <p style={{ margin:"4px 0 0", fontSize:"11px", color:"#be0d0d", fontWeight:"600" }}>⚠ {dlErrors.dlNumber}</p>}
                              </div>
                              <div>
                                <label style={fieldLabel}>Expiry Date</label>
                                <ExpiryDatePicker value={dlExpiry} onChange={val=>{ setDlExpiry(val); setDlErrors(p=>({...p,dlExpiry:""})); }} disabled={status==="pending"||status==="verified"||uploading} hasError={!!dlErrors.dlExpiry} />
                                {dlErrors.dlExpiry && <p style={{ margin:"4px 0 0", fontSize:"11px", color:RED, fontWeight:"600" }}>⚠ {dlErrors.dlExpiry}</p>}
                              </div>
                            </div>
                            <div>
                              <label style={fieldLabel}>Vehicle Class</label>
                              {(() => {
                                const classes = [
                                  { value:"LMV",      label:"LMV",        sub:"Light Motor Vehicle (Car)" },
                                  { value:"MCWG",     label:"MCWG",       sub:"Motorcycle With Gear" },
                                  { value:"MCWOG",    label:"MCWOG",      sub:"Motorcycle Without Gear (Scooter)" },
                                  { value:"LMV+MCWG", label:"LMV + MCWG", sub:"Both Car and Motorcycle" },
                                ];
                                const selected = classes.find(c => c.value===dlClass);
                                const isDisabled = status==="pending"||status==="verified"||uploading;
                                return (
                                  <div id="dl-class-dropdown" style={{ position:"relative" }}>
                                    <div onClick={() => !isDisabled && setDlClassOpen(p=>!p)}
                                      style={{ ...fieldInput(!isDisabled), borderColor:dlErrors.dlClass?RED:dlClassOpen?RED:undefined, cursor:isDisabled?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none" }}>
                                      <span style={{ color:selected?"#111":"#aaa", fontSize:"14px" }}>{selected?selected.label:"Select vehicle type"}</span>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform:dlClassOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s", flexShrink:0 }}><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                    {dlClassOpen && (
                                      <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fff", borderRadius:"14px", border:"1.5px solid #e0e0e0", boxShadow:"0 8px 30px rgba(0,0,0,0.12)", zIndex:100, overflow:"hidden" }}>
                                        {classes.map(c => (
                                          <div key={c.value} onClick={() => { setDlClass(c.value); setDlErrors(p=>({...p,dlClass:""})); setDlClassOpen(false); }}
                                            style={{ display:"flex", alignItems:"center", gap:"14px", padding:"13px 16px", cursor:"pointer", background:dlClass===c.value?"#fff5f5":"transparent", borderBottom:"1px solid #f5f5f5" }}
                                            onMouseEnter={e => { if (dlClass!==c.value) e.currentTarget.style.background="#fafafa"; }}
                                            onMouseLeave={e => { if (dlClass!==c.value) e.currentTarget.style.background="transparent"; }}>
                                            <div style={{ flex:1 }}>
                                              <p style={{ margin:0, fontSize:"14px", fontWeight:"700", color:dlClass===c.value?RED:"#111", fontFamily:"'DM Sans',sans-serif" }}>{c.label}</p>
                                              <p style={{ margin:"1px 0 0", fontSize:"12px", color:"#aaa", fontFamily:"'DM Sans',sans-serif" }}>{c.sub}</p>
                                            </div>
                                            {dlClass===c.value && (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>)}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                              {dlErrors.dlClass && <p style={{ margin:"4px 0 0", fontSize:"11px", color:RED, fontWeight:"600" }}>⚠ {dlErrors.dlClass}</p>}
                            </div>
                            {(status==="not_uploaded"||status==="rejected") && (
                              <p style={{ fontSize:"12px", color:RED, fontWeight:"600", margin:"0" }}>⚠ Ensure your DL is valid and the selected class matches your licence.</p>
                            )}
                          </div>
                        )}

                        {/* ── Aadhaar Form ── */}
                        {step.key==="aadhaar" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                            <div className="dv-aad-grid">
                              <UploadBox label="Front Side" hint="Aadhaar front with photo" file={aadhaarFront} onChange={setAadhaarFront} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={aadhaarFrontUrl} />
                              <UploadBox label="Back Side" hint="Aadhaar back with address" file={aadhaarBack} onChange={setAadhaarBack} disabled={status==="pending"||status==="verified"||uploading} fallbackUrl={aadhaarBackUrl} />
                            </div>
                            <div>
                              <label style={fieldLabel}>Aadhaar Number</label>
                              <input
                                value={aadhaarNumber}
                                onChange={e => { const raw=e.target.value.replace(/\D/g,"").slice(0,12); const formatted=raw.replace(/(\d{4})(?=\d)/g,"$1 ").trim(); setAadhaarNumber(formatted); }}
                                onBlur={() => { const digits=aadhaarNumber.replace(/\s/g,""); if (digits.length>0&&digits.length<12) setAadhaarErrors(p=>({...p,aadhaarNumber:"Invalid Aadhaar number"})); else setAadhaarErrors(p=>({...p,aadhaarNumber:""})); }}
                                onKeyDown={e => { if (e.key==="Enter") e.target.blur(); }}
                                placeholder="XXXX XXXX XXXX"
                                disabled={status==="pending"||status==="verified"||uploading}
                                style={{ ...fieldInput(status!=="pending"&&status!=="verified"&&!uploading), borderColor:aadhaarErrors?.aadhaarNumber?RED:aadhaarNumber.replace(/\s/g,"").length===12?"#22c55e":undefined }}
                              />
                              {aadhaarErrors?.aadhaarNumber && <p style={{ margin:"4px 0 0", fontSize:"11px", color:RED, fontWeight:"600" }}>⚠ {aadhaarErrors.aadhaarNumber}</p>}
                            </div>
                          </div>
                        )}

                        {/* ── Selfie Form ── */}
                        {step.key==="selfie" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:"14px", alignItems:"center" }}>
                            {status!=="pending"&&status!=="verified" && (
                              <div style={{ padding:"10px 14px", borderRadius:"10px", background:"#fff5f5", border:"1px solid #fcc", fontSize:"12px", color:RED, fontWeight:"600", width:"100%", boxSizing:"border-box", display:"flex", alignItems:"center", gap:"7px" }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                Camera only — gallery upload not allowed for security reasons.
                              </div>
                            )}
                            {(status==="pending"||status==="verified") && selfieImg && (
                              <div style={{ textAlign:"center" }}>
                                <img src={selfieImg} alt="selfie" className="dv-selfie-img" style={{ width:"160px", height:"160px", borderRadius:"50%", objectFit:"cover", border:`3px solid ${status==="verified"?"#22c55e":"#fcd34d"}`, boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }} />
                              </div>
                            )}
                            {status!=="pending"&&status!=="verified" && (
                              selfieImg ? (
                                <div style={{ textAlign:"center" }}>
                                  <img src={selfieImg} alt="selfie" className="dv-selfie-img" style={{ width:"180px", height:"180px", borderRadius:"50%", objectFit:"cover", border:`4px solid ${RED}`, boxShadow:"0 6px 20px rgba(190,13,13,0.2)" }} />
                                  <p style={{ fontSize:"13px", color:"#22c55e", fontWeight:"600", marginTop:"10px" }}>Selfie captured!</p>
                                  <button onClick={() => !uploading&&setSelfieImg(null)} className="hover-btn" style={{ background:"#f5f5f5", border:"none", padding:"8px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:"600", cursor:uploading?"not-allowed":"pointer", marginTop:"6px", opacity:uploading?0.5:1 }}>Retake</button>
                                </div>
                              ) : cameraOn ? (
                                <div style={{ textAlign:"center" }}>
                                  <div style={{ position:"relative", display:"inline-block" }}>
                                    <video ref={videoRef} autoPlay playsInline muted className="dv-selfie-vid" style={{ width:"240px", height:"240px", borderRadius:"50%", objectFit:"cover", border:`4px solid ${RED}` }} />
                                    <button onClick={() => { stream?.getTracks().forEach(t=>t.stop()); setCameraOn(false); }} disabled={uploading}
                                      style={{ position:"absolute", top:"6px", right:"6px", width:"30px", height:"30px", borderRadius:"50%", background:"rgba(0,0,0,0.6)", border:"1.5px solid rgba(255,255,255,0.2)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:uploading?"not-allowed":"pointer", backdropFilter:"blur(4px)", opacity:uploading?0.5:1 }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                  </div>
                                  <canvas ref={canvasRef} style={{ display:"none" }} />
                                  <br />
                                  <button onClick={takeSelfie} disabled={uploading} style={{ ...submitBtn, marginTop:"14px", opacity:uploading?0.5:1 }}>
                                    <span style={{ display:"flex", alignItems:"center", gap:"8px", justifyContent:"center" }}>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                      Capture
                                    </span>
                                  </button>
                                </div>
                              ) : (
                                <button onClick={startCamera} disabled={uploading} style={{ ...submitBtn, opacity:uploading?0.5:1 }}>
                                  <span style={{ display:"flex", alignItems:"center", gap:"8px", justifyContent:"center" }}><CameraIcon /> Open Camera</span>
                                </button>
                              )
                            )}
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Submit button */}
          {!allVerified && !anyPending && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ marginTop:"8px" }}>
              <button onClick={handleSubmitAll} disabled={uploading} style={{ ...submitBtn, padding:"16px", fontSize:"15px", borderRadius:"16px", boxShadow:"0 6px 20px rgba(190,13,13,0.35)", opacity:uploading?0.7:1, cursor:uploading?"not-allowed":"pointer" }}>
                {uploading ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                    <span style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid white", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }} />
                    Uploading...
                  </span>
                ) : "Submit All Documents for Verification"}
              </button>
            </motion.div>
          )}

          {anyPending && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ marginTop:"8px", padding:"14px 18px", borderRadius:"14px", background:"#fffbeb", border:"1px solid #fcd34d", fontSize:"14px", color:"#92400e", fontWeight:"600", display:"flex", alignItems:"center", gap:"10px" }}>
              <ClockIcon /> All documents submitted — our team will review within 24 hours.
            </motion.div>
          )}

          <p style={{ fontSize:"12px", color:"#bbb", textAlign:"center", marginTop:"16px", fontWeight:"500" }}>
            All documents are securely stored. Only verified users can book vehicles.
          </p>
        </div>
      </div>

      {/* Admin Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity:0, y:-60 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-60 }} transition={{ duration:0.4 }}
            onAnimationComplete={() => { setTimeout(() => setNotification(null), 5000); }}
            style={{ position:"fixed", top:"80px", left:0, right:0, display:"flex", justifyContent:"center", zIndex:9999, padding:"0 16px" }}>
            <div style={{ background:notification.type==="approved"?"#ecfdf5":"#fef2f2", border:`1.5px solid ${notification.type==="approved"?"#6ee7b7":"#fca5a5"}`, color:notification.type==="approved"?"#059669":RED, padding:"14px 18px", borderRadius:"16px", fontSize:"14px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 8px 30px rgba(0,0,0,0.12)", maxWidth:"500px", width:"100%", display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:notification.type==="approved"?"rgba(22,163,74,0.15)":notification.type==="revoked"?"rgba(217,119,6,0.15)":"rgba(190,13,13,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {notification.type==="approved"
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={notification.type==="approved"?"#16a34a":RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : notification.type==="revoked"
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                }
              </div>
              <span style={{ flex:1 }}>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }}
            style={{ position:"fixed", bottom:"80px", left:0, right:0, display:"flex", justifyContent:"center", zIndex:9999, padding:"0 16px" }}>
            <div style={{ background:"#111", color:"white", padding:"13px 22px", borderRadius:"14px", display:"flex", alignItems:"center", gap:"10px", boxShadow:"0 8px 30px rgba(0,0,0,0.25)", borderLeft:`4px solid ${toast.type==="error"?RED:"#22c55e"}`, fontSize:"14px", fontWeight:"600", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>
              {toast.type==="error"?"⚠️":"✅"} {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const fieldLabel = { display:"block", fontSize:"11px", fontWeight:"700", color:"#999", marginBottom:"7px", textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'DM Sans',sans-serif" };
const fieldInput = (editable) => ({ width:"100%", padding:"11px 14px", borderRadius:"12px", border:editable?"1.5px solid #e0e0e0":"1.5px solid #f0f0f0", background:editable?"#fff":"#fafafa", fontSize:"14px", fontWeight:"500", color:editable?"#111":"#888", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s", cursor:editable?"text":"default" });
const submitBtn = { width:"100%", padding:"13px", borderRadius:"12px", background:RED, color:"white", border:"none", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 14px rgba(190,13,13,0.3)" };

export default DocumentVerification;