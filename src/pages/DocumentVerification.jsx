import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

// Icons from PersonalInfo
const MailIcon    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const PhoneIcon   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.9 19.79 19.79 0 0 1 1.07 4.18 2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>);
const EditIcon    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const CameraIcon  = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const LicenceIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h3"/><path d="M15 12h3"/><path d="M7 16h10"/></svg>);
const AadhaarIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M14 9h4M14 13h4M6 16h12"/></svg>);
const SelfieIcon  = () => (<svg width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H6a3 3 0 0 0-3 3v2"/><path d="M20 3h2a3 3 0 0 1 3 3v2"/><path d="M8 25H6a3 3 0 0 1-3-3v-2"/><path d="M20 25h2a3 3 0 0 0 3-3v-2"/><circle cx="14" cy="11" r="3"/><path d="M9 23c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>);
const UploadIcon  = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const CheckIcon   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const ClockIcon   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const WarnIcon    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);

const inputStyle = (editable) => ({
  width: "100%", padding: "12px 16px", borderRadius: "14px",
  border: editable ? "1.5px solid rgba(15, 23, 42, 0.1)" : "1.5px solid rgba(15, 23, 42, 0.05)",
  background: editable ? "#fff" : "rgba(15, 23, 42, 0.02)", fontSize: "14px", fontWeight: "600",
  color: editable ? "#0f172a" : "#64748b", cursor: editable ? "text" : "default",
  boxSizing: "border-box", fontFamily: F, transition: "all .2s ease",
});

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
        style={{ width: "100%", padding: "10px 16px", borderRadius: "14px", border: "1.5px solid rgba(15, 23, 42, 0.08)", background: disabled ? "rgba(15, 23, 42, 0.02)" : "#fff", fontSize: "13px", fontWeight: "800", color: disabled ? "#94a3b8" : "#0f172a", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: F }}>
        <span>{selected?.label || "Select Category"}</span>
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
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parsed = value ? (() => { const parts = value.split('-'); if (parts.length!==3) return null; const [y,m,d] = parts.map(Number); return new Date(y, m-1, d); })() : null;
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
  
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={() => !disabled && setOpen(o=>!o)}
        style={{ ...inputStyle(!disabled), border: hasError?`1.5px solid ${RED}`:"1.5px solid rgba(15, 23, 42, 0.1)", color:value?(disabled?"#64748b":"#0f172a"):"#94a3b8", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none", cursor: !disabled ? "pointer" : "default" }}>
        <span>{displayValue}</span>
        {!disabled && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}
            style={{ position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:9999, background:"#fff", borderRadius:"20px", border:"1px solid #f1f5f9", boxShadow:"0 15px 35px rgba(0,0,0,0.12)", padding:"16px", width:"280px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
              <button onClick={prevMonth} style={pickerNavBtn}>&lsaquo;</button>
              <div style={{ fontWeight:"800", fontSize:"14px", fontFamily:H, color:"#1e293b" }}>{months[viewMonth]} {viewYear}</div>
              <button onClick={nextMonth} style={pickerNavBtn}>&rsaquo;</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"1px", marginBottom:"4px" }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign:"center", fontSize:"10px", fontWeight:"800", color:"#94a3b8", padding:"4px 0" }}>{d}</div>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px" }}>
              {Array.from({ length:firstDay }).map((_,i) => <div key={"e"+i} style={{ height:"32px" }}/>)}
              {Array.from({ length:days }, (_,i) => i+1).map(day => {
                const past = isPastDay(day);
                return (
                  <button key={day} onClick={() => !past && handleDayClick(day)} disabled={past}
                    style={{ width:"100%", height:"32px", borderRadius:"8px", border:"none", background:selectedDay===day?RED:"transparent", color:selectedDay===day?"white":past?"#e2e8f0":"#334155", fontWeight:selectedDay===day?"800":"600", fontSize:"12px", cursor:past?"default":"pointer", transition:"all 0.2s" }}
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

const pickerNavBtn = { background:"none", border:"none", color:"#94a3b8", fontSize:"22px", cursor:"pointer", padding:"0 10px" };

const StatusBadge = ({ status }) => {
  const config = {
    verified:     { bg:"#f0fdf4", border:"#bbf7d0", color:"#16a34a", text:"Verified",     icon:<CheckIcon /> },
    pending:      { bg:"#fffbeb", border:"#fde68a", color:"#d97706", text:"Pending",      icon:<ClockIcon /> },
    rejected:     { bg:"#fef2f2", border:"#fecdd3", color:RED,       text:"Rejected",     icon:<WarnIcon /> },
    not_uploaded: { bg:"#f8fafc", border:"#e2e8f0", color:"#94a3b8", text:"Not Uploaded", icon:<span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#cbd5e1", display:"inline-block" }}/> },
  };
  const c = config[status] || config.not_uploaded;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"6px 14px", borderRadius:"99px", background:c.bg, border:`1px solid ${c.border}`, color:c.color, fontSize:"10px", fontWeight:"900", fontFamily:H, textTransform:"uppercase", letterSpacing:"0.5px" }}>
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
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <p style={{ fontSize:"11px", fontWeight:"800", color: RED, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px", fontFamily:H }}>{label}</p>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        style={{ border:`1.5px dashed ${(file||fallbackUrl)?"rgba(34, 197, 94, 0.4)":"rgba(15, 23, 42, 0.1)"}`, borderRadius:"14px", padding:"20px", textAlign:"center", cursor:disabled?"default":"pointer", background:(file||fallbackUrl)?"#f0fdf4":"rgba(15, 23, 42, 0.02)", transition:"all 0.3s ease", minHeight:"120px", flex: 1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px" }}
      >
        {displaySrc ? (
          <div style={{ position:"relative" }}>
            <img src={displaySrc} alt={label} style={{ maxHeight:"80px", maxWidth:"100%", borderRadius:"10px", objectFit:"contain" }} />
            {!disabled && (
              <div onClick={e => { e.stopPropagation(); onChange(null); }} style={{ position:"absolute", top:"-8px", right:"-8px", background:RED, color:"white", width:"18px", height:"18px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:"900", border:"1.5px solid white", cursor:"pointer" }}>✕</div>
            )}
          </div>
        ) : (
          <>
            <div style={{ color:"#94a3b8" }}><UploadIcon /></div>
            <p style={{ fontSize:"13px", fontWeight:"700", color:"#0f172a", margin:0, fontFamily:F }}>Upload Photo</p>
            <p style={{ fontSize:"11px", color:"#94a3b8", margin:0, fontWeight:"500", fontFamily:F }}>{hint}</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} style={{ display:"none" }} onChange={e => { const f=e.target.files[0]; if (f && f.size>5*1024*1024) { alert("File size must be under 5MB."); e.target.value=""; return; } onChange(f); e.target.value=""; }} />
    </div>
  );
};

const DocumentVerification = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [docStatus, setDocStatus] = useState({ "driving-licence":"not_uploaded", aadhaar:"not_uploaded", selfie:"not_uploaded" });
  
  const [dlFront, setDlFront] = useState(null);
  const [dlImageUrl, setDlImageUrl] = useState(null);
  const [dlNumber, setDlNumber] = useState("");
  const [dlExpiry, setDlExpiry] = useState("");
  const [dlClass, setDlClass] = useState("");
  const [dlErrors, setDlErrors] = useState({});

  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [aadhaarFrontUrl, setAadhaarFrontUrl] = useState(null);
  const [aadhaarBackUrl, setAadhaarBackUrl] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [selfieImg, setSelfieImg] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const [uploading, setUploading] = useState(false);
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
          setProfile(d.profile || {});
          
          const statuses = {
             dl: (d.dlStatus || d.verification?.drivingLicence?.status || d.verification?.dl?.status || "not_uploaded").toLowerCase(),
             aadhaar: (d.aadhaarStatus || d.verification?.aadhaar?.status || "not_uploaded").toLowerCase(),
             selfie: (d.selfieStatus || d.verification?.selfie?.status || "not_uploaded").toLowerCase()
          };
          
          setDocStatus({ "driving-licence": statuses.dl, aadhaar: statuses.aadhaar, selfie: statuses.selfie });

          const isDlLocked = statuses.dl === "pending" || statuses.dl === "verified";
          const isAadLocked = statuses.aadhaar === "pending" || statuses.aadhaar === "verified";

          // DL
          const curDlNumber = d.dlNumber || d.verification?.drivingLicence?.number || d.verification?.dl?.number;
          const curDlExpiry = d.dlExpiry || d.verification?.drivingLicence?.expiry || d.verification?.dl?.expiry;
          const curDlClass  = d.dlClass  || d.verification?.drivingLicence?.class  || d.verification?.dl?.class;
          const curDlImage  = d.dlImage  || d.verification?.drivingLicence?.image  || d.verification?.dl?.image;

          if (statuses.dl === "rejected") { setDlNumber(""); setDlExpiry(""); setDlClass(""); setDlImageUrl(""); }
          else {
            if (curDlNumber && (isDlLocked || !dlNumber)) setDlNumber(curDlNumber);
            if (curDlExpiry && (isDlLocked || !dlExpiry)) setDlExpiry(curDlExpiry);
            if (curDlClass && (isDlLocked || !dlClass)) setDlClass(curDlClass);
            if (curDlImage) setDlImageUrl(curDlImage);
          }

          // Aadhaar
          const curAadNumber = d.aadhaarNumber || d.verification?.aadhaar?.number;
          const curAadFront  = d.aadhaarFrontImage || d.verification?.aadhaar?.frontImage;
          const curAadBack   = d.aadhaarBackImage  || d.verification?.aadhaar?.backImage;

          if (statuses.aadhaar === "rejected") { setAadhaarNumber(""); setAadhaarFrontUrl(""); setAadhaarBackUrl(""); }
          else {
            if (curAadNumber && (isAadLocked || !aadhaarNumber)) setAadhaarNumber(curAadNumber.replace(/(\d{4})(?=\d)/g,"$1 "));
            if (curAadFront) setAadhaarFrontUrl(curAadFront);
            if (curAadBack)  setAadhaarBackUrl(curAadBack);
          }

          // Selfie
          const curSelfie = d.selfieImage || d.verification?.selfie?.image;
          if (statuses.selfie === "rejected") { setSelfieUrl(""); setSelfieImg(null); }
          else { if (curSelfie) setSelfieUrl(curSelfie); }
        }
        setLoading(false);
      });
    });
    return () => { authUnsub(); firestoreUnsub?.(); if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [navigate]);

  const startCamera = async () => {
    try {
      setSelfieImg(null); // Clear previous capture
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } });
      setStream(s); setCameraOn(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 200);
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

  const handleSubmitAll = async () => {
    const statuses = Object.values(docStatus);
    const dlLocked = docStatus["driving-licence"]==="pending" || docStatus["driving-licence"]==="verified";
    const aadLocked = docStatus.aadhaar==="pending" || docStatus.aadhaar==="verified";
    const selfieLocked = docStatus.selfie==="pending" || docStatus.selfie==="verified";

    setUploading(true);
    try {
      const uploadPromises = [];
      if (!dlLocked && dlFront) uploadPromises.push(uploadToCloudinary(dlFront).then(url=>({ key:"dlImage", url })));
      if (!aadLocked && aadhaarFront) uploadPromises.push(uploadToCloudinary(aadhaarFront).then(url=>({ key:"aadhaarFrontImage", url })));
      if (!aadLocked && aadhaarBack) uploadPromises.push(uploadToCloudinary(aadhaarBack).then(url=>({ key:"aadhaarBackImage", url })));
      if (!selfieLocked && selfieImg) { 
        const blob=await fetch(selfieImg).then(r=>r.blob()); 
        const selfieFile=new File([blob],"selfie.jpg",{type:"image/jpeg"}); 
        uploadPromises.push(uploadToCloudinary(selfieFile).then(url=>({ key:"selfieImage", url }))); 
      }
      const uploadedImgs = await Promise.all(uploadPromises);
      const imgMap = {}; uploadedImgs.forEach(({ key, url }) => { imgMap[key]=url; });

      const updates = {};
      if (!dlLocked) { updates.dlNumber = dlNumber.replace(/\s/g,""); updates.dlExpiry = dlExpiry; updates.dlClass = dlClass; updates.dlStatus = "pending"; if (imgMap.dlImage) updates.dlImage = imgMap.dlImage; }
      if (!aadLocked) { updates.aadhaarNumber = aadhaarNumber.replace(/\s/g,""); updates.aadhaarStatus = "pending"; if (imgMap.aadhaarFrontImage) updates.aadhaarFrontImage = imgMap.aadhaarFrontImage; if (imgMap.aadhaarBackImage) updates.aadhaarBackImage = imgMap.aadhaarBackImage; }
      if (!selfieLocked) { updates.selfieStatus = "pending"; if (imgMap.selfieImage) updates.selfieImage = imgMap.selfieImage; }
      
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
      showToast("Documents submitted successfully!");
    } catch(e) { showToast("Failed to upload documents", "error"); }
    finally { 
      setUploading(false); 
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return null;

  return (
    <div style={{ minHeight:"100vh", background:"#f5f7f9", fontFamily:F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .pi-inner { max-width: 1250px; margin: 0 auto; padding: 0 24px; }
        .pi-card { background:#fff; border-radius:12px; padding:24px 40px 40px 40px; margin-bottom:24px; box-shadow:0 15px 40px rgba(0,0,0,0.03); border:1.5px solid #e2e8f0; position:relative; overflow:hidden; animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .dv-split { display:flex; gap:40px; align-items: stretch; }
        .dv-side-upload { flex:1; min-width:0; display:flex; flex-direction:column; }
        .dv-side-details { flex:1; min-width:0; }
        .divider { height:1.2px; background:#e2e8f0; margin-left:-40px; margin-right:-40px; margin-top:40px; margin-bottom:40px; }
      `}</style>

      {/* BANNER (Exact Sync with PersonalInfo) */}
      <div style={{ position:'relative', height:'400px', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'url("/document.jpg")', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.6)' }} />
        <div className="pi-inner" style={{ height:'100%', position:'relative', zIndex:2, display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:'center', paddingBottom:'40px' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
            <div style={{ width:'140px', height:'140px', borderRadius:'50%', background:RED, border:'5px solid rgba(255,255,255,0.2)', boxShadow:'0 10px 30px rgba(0,0,0,0.2)', marginBottom:'20px', overflow:'hidden' }}>
              {(profile.profileImage || user?.photoURL) ? <img src={profile.profileImage || user?.photoURL} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><CameraIcon /></div>}
            </div>
            <h1 style={{ margin:0, color:'#fff', fontSize:'42px', fontWeight:'900', fontFamily:H, letterSpacing:'-1px', textShadow:'0 2px 10px rgba(0,0,0,0.3)' }}>{profile.name || user?.displayName}</h1>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'25px', marginTop:'12px', color:'rgba(255,255,255,0.9)', fontSize:'15px', fontWeight:'600' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}><PhoneIcon /> +91 {profile.phone ? profile.phone.replace("+91","").trim() : 'Add Phone'}</div>
              <div style={{ height:'12px', width:'1.5px', background:'rgba(255,255,255,0.3)' }} />
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}><MailIcon /> {user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pi-inner" style={{ marginTop:'30px', paddingBottom:'100px' }}>
        {(() => {
          const statuses = Object.values(docStatus);
          const isAnyRejected = statuses.includes("rejected");
          const isAllVerified = statuses.every(s => s === "verified");
          const isAllLocked   = statuses.every(s => s === "verified" || s === "pending");

          return (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="pi-card">
              {/* HEADER SECTION */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "900", color: RED, margin: 0, fontFamily: H }}>Document Verification</h2>
                {(() => {
                  const globalStatus = isAnyRejected ? "rejected" : statuses.includes("pending") ? "pending" : isAllVerified ? "verified" : null;
                  return globalStatus ? <StatusBadge status={globalStatus} /> : null;
                })()}
              </div>

              {isAnyRejected && (
                <div style={{ color: RED, fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", background: RED+"08", padding: "10px 16px", borderRadius: "8px", marginTop: "20px" }}>
                  <WarnIcon /> YOUR DOCUMENTS ARE REJECTED. PLEASE UPDATE AND SUBMIT AGAIN.
                </div>
              )}

              <div className="divider" />

              {/* DL SECTION */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"15px" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:RED+"10", color:RED, display:"flex", alignItems:"center", justifyContent:"center" }}><LicenceIcon /></div>
                  <div>
                    <h3 style={{ margin:0, fontSize:"19px", fontWeight:"900", fontFamily:H, color:"#1e293b" }}>Driving Licence</h3>
                    <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", fontWeight:"500" }}>Upload your valid Indian Driving Licence</p>
                  </div>
                </div>
                {docStatus["driving-licence"] !== "verified" && (
                  <div className="dv-split" style={{ marginTop: "30px" }}>
                    <div className="dv-side-upload">
                      <UploadBox label="DL Front Photo" hint="Clear photo for verification" file={dlFront} onChange={setDlFront} disabled={docStatus["driving-licence"]==="pending"} fallbackUrl={dlImageUrl} />
                    </div>
                    <div className="dv-side-details">
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <p style={{ fontSize:"11px", fontWeight:"800", color: RED, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px", fontFamily:H }}>DL Number</p>
                          <input 
                            value={dlNumber} 
                            onChange={e => setDlNumber(e.target.value.toUpperCase().slice(0, 15))} 
                            placeholder="OD0420XXXXXXXXX" 
                            style={inputStyle(docStatus["driving-licence"]!=="pending")} 
                            disabled={docStatus["driving-licence"]==="pending"} 
                          />
                        </div>
                        <div>
                          <p style={{ fontSize:"11px", fontWeight:"800", color: RED, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px", fontFamily:H }}>Expiry Date</p>
                          <ExpiryDatePicker value={dlExpiry} onChange={setDlExpiry} disabled={docStatus["driving-licence"]==="pending"} />
                        </div>
                        <div>
                          <p style={{ fontSize:"11px", fontWeight:"800", color: RED, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px", fontFamily:H }}>Vehicle Category</p>
                          <MiniDropdown options={[{value:"LMV",label:"LMV (Car)"},{value:"MCWG",label:"MCWG (Bike)"},{value:"Both",label:"Car & Bike"}]} value={dlClass} onChange={setDlClass} width="100%" disabled={docStatus["driving-licence"]==="pending"} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="divider" />

              {/* AADHAAR SECTION */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"15px" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:RED+"10", color:RED, display:"flex", alignItems:"center", justifyContent:"center" }}><AadhaarIcon /></div>
                  <div>
                    <h3 style={{ margin:0, fontSize:"19px", fontWeight:"900", fontFamily:H, color:"#1e293b" }}>Aadhaar Card</h3>
                    <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", fontWeight:"500" }}>Upload your 12-digit Aadhaar Card details</p>
                  </div>
                </div>
                {docStatus.aadhaar !== "verified" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "30px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                        <p style={{ fontSize:"11px", fontWeight:"800", color: RED, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px", fontFamily:H }}>Aadhaar Number</p>
                        <input 
                          value={aadhaarNumber} 
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                            setAadhaarNumber(val.replace(/(\d{4})(?=\d)/g, "$1 ").trim());
                          }} 
                          placeholder="XXXX XXXX XXXX" 
                          style={inputStyle(docStatus.aadhaar!=="pending")} 
                          disabled={docStatus.aadhaar==="pending"} 
                          maxLength={14}
                        />
                        <p style={{ fontSize:"12px", color:"#64748b", marginTop:"8px", fontWeight:"500" }}>Please ensure Aadhaar details match correctly.</p>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <UploadBox label="Front Photo" hint="Front side of Aadhaar" file={aadhaarFront} onChange={setAadhaarFront} disabled={docStatus.aadhaar==="pending"} fallbackUrl={aadhaarFrontUrl} />
                      <UploadBox label="Back Photo" hint="Back side of Aadhaar" file={aadhaarBack} onChange={setAadhaarBack} disabled={docStatus.aadhaar==="pending"} fallbackUrl={aadhaarBackUrl} />
                    </div>
                  </div>
                )}
              </div>

              <div className="divider" />

              {/* SELFIE SECTION */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"15px" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:RED+"10", color:RED, display:"flex", alignItems:"center", justifyContent:"center" }}><SelfieIcon /></div>
                  <div>
                    <h3 style={{ margin:0, fontSize:"19px", fontWeight:"900", fontFamily:H, color:"#1e293b" }}>Live Selfie</h3>
                    <p style={{ margin:0, fontSize:"12px", color:"#94a3b8", fontWeight:"500" }}>Take a clear selfie for face verification</p>
                  </div>
                </div>
                {docStatus.selfie !== "verified" && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "25px", width: "100%", marginTop: "30px" }}>
                    <div style={{ position:"relative", width: "320px", height:"320px", borderRadius:"14px", border:"2px dashed #e2e8f0", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink: 0 }}>
                      {cameraOn ? (
                        <div style={{ width:"100%", height:"100%" }}>
                          <video ref={videoRef} autoPlay playsInline style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          <button onClick={takeSelfie} style={{ position:"absolute", bottom:"15px", left:"50%", transform:"translateX(-50%)", background:RED, color:"#fff", border:"none", padding:"10px 25px", borderRadius:"12px", fontWeight:"900", cursor:"pointer" }}>CAPTURE</button>
                        </div>
                      ) : (selfieImg || selfieUrl) ? (
                        <div style={{ width:"100%", height:"100%" }}>
                           <img src={selfieImg || selfieUrl} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                           <button onClick={startCamera} style={{ position:"absolute", bottom:"15px", left:"50%", transform:"translateX(-50%)", background:RED, color:"#fff", border:"none", padding:"10px 25px", borderRadius:"12px", fontWeight:"900", cursor:"pointer" }}>RETAKE PHOTO</button>
                        </div>
                      ) : (
                        <button onClick={startCamera} style={{ background:"#1e293b", color:"#fff", border:"none", padding:"15px 30px", borderRadius:"12px", fontWeight:"900", cursor:"pointer" }}>OPEN CAMERA</button>
                      )}
                      <canvas ref={canvasRef} style={{ display:"none" }} />
                    </div>
                    <div style={{ textAlign: "center", maxWidth: "600px" }}>
                      <p style={{ fontSize:"14px", color:"#475569", fontWeight:"600", lineHeight:"1.6", margin: 0 }}>Face verification ensures that the person matches the identity. Please make sure your face is well-lit.</p>
                      <ul style={{ display: "flex", justifyContent: "center", gap: "20px", listStyle: "none", padding: 0, color:"#64748b", fontSize:"13px", fontWeight:"500", marginTop:"10px" }}>
                        <li style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#94a3b8" }} /> No sunglasses or hats</li>
                        <li style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#94a3b8" }} /> Look directly at camera</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {!isAllLocked && (
                <>
                  <div className="divider" />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={handleSubmitAll} disabled={uploading} style={{ background: uploading ? "#f1f5f9" : RED, color: uploading ? "#94a3b8" : "#fff", border: 'none', padding: '16px 60px', borderRadius: '12px', fontWeight: '950', fontSize: '15px', cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: uploading ? "none" : "0 10px 40px "+RED+"30", display:"flex", alignItems:"center", gap:"10px", letterSpacing:"1px" }}>
                      {uploading ? "SUBMITTING..." : "SUBMIT FOR VERIFICATION"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          );
        })()}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ position:"fixed", bottom:"40px", left:0, right:0, display:"flex", justifyContent:"center", zIndex:9999 }}>
            <div style={{ background: "#fff", padding:"16px 28px", borderRadius:"16px", border:`2px solid ${toast.type==="error"?RED:"#22c55e"}`, color: toast.type==="error"?RED:"#22c55e", fontWeight:"900", fontSize:"14px", fontFamily:H, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>{toast.msg}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default DocumentVerification;