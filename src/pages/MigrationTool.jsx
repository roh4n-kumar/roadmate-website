import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F = "'Inter', sans-serif";
const H = "'Outfit', sans-serif";

export default function MigrationTool() {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("idle"); // idle, running, complete, error
    const [progress, setProgress] = useState({ total: 0, current: 0 });
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, u => setUser(u));
        return () => unsub();
    }, []);

    const addLog = (msg) => setLogs(prev => [msg, ...prev].slice(0, 50));

    const runMigration = async () => {
        if (!window.confirm("⚠️ Are you sure? This will permanently reorganize all user data into the new Tree Structure.")) return;
        
        setStatus("running");
        setLogs([]);
        addLog("🚀 Starting Database Migration...");

        try {
            const usersCol = collection(db, "users");
            const snapshot = await getDocs(usersCol);
            const total = snapshot.size;
            setProgress({ total, current: 0 });
            addLog(`📌 Found ${total} users to process.`);

            for (let i = 0; i < snapshot.docs.length; i++) {
                const userDoc = snapshot.docs[i];
                const data = userDoc.data();
                const userId = userDoc.id;

                if (data.profile) {
                    addLog(`⏩ Skipping ${userId} (already migrated)`);
                    setProgress(prev => ({ ...prev, current: i + 1 }));
                    continue;
                }

                addLog(`🔄 Migrating: ${data.name || data.email || userId}`);

                const newProfile = {
                    name: data.name || data.displayName || "",
                    email: data.email || "",
                    phone: data.phone || data.phoneNumber || "",
                    bio: data.bio || "",
                    birthday: data.birthday || "",
                    gender: data.gender || "",
                    city: data.city || "",
                    address: data.address || "",
                    profilePhoto: data.profilePhoto || data.photoURL || "",
                    joined: data.joined || data.createdAt || null
                };

                const newVerification = {
                    status: data.verificationStatus || data.aadhaarStatus || "unverified",
                    aadhaar: {
                        number: data.aadhaarNumber || null,
                        status: data.aadhaarStatus || "unverified",
                        frontImage: data.aadhaarFrontImage || null,
                        backImage: data.aadhaarBackImage || null,
                        submittedAt: data.aadhaarSubmittedAt || null,
                        verifiedAt: data.aadhaarVerifiedAt || null,
                        rejectedAt: data.aadhaarRejectedAt || null,
                        rejectedReason: data.aadhaarRejectedReason || ""
                    },
                    drivingLicence: {
                        number: data.dlNumber || null,
                        status: data.dlStatus || "unverified",
                        frontImage: data.dlFrontImage || null,
                        backImage: data.dlBackImage || null,
                        class: data.dlClass || null,
                        expiry: data.dlExpiry || null,
                        submittedAt: data.dlSubmittedAt || null,
                        verifiedAt: data.dlVerifiedAt || null,
                        rejectedAt: data.dlRejectedAt || null,
                        rejectedReason: data.dlRejectedReason || ""
                    },
                    selfie: {
                        url: data.selfieImage || null,
                        status: data.selfieStatus || "unverified"
                    }
                };

                const updateData = {
                    profile: newProfile,
                    verification: newVerification,
                    name: deleteField(),
                    displayName: deleteField(),
                    email: deleteField(),
                    phone: deleteField(),
                    phoneNumber: deleteField(),
                    bio: deleteField(),
                    birthday: deleteField(),
                    gender: deleteField(),
                    city: deleteField(),
                    address: deleteField(),
                    profilePhoto: deleteField(),
                    photoURL: deleteField(),
                    joined: deleteField(),
                    createdAt: deleteField(),
                    aadhaarNumber: deleteField(),
                    aadhaarStatus: deleteField(),
                    aadhaarFrontImage: deleteField(),
                    aadhaarBackImage: deleteField(),
                    aadhaarSubmittedAt: deleteField(),
                    aadhaarVerifiedAt: deleteField(),
                    aadhaarRejectedAt: deleteField(),
                    aadhaarRejectedReason: deleteField(),
                    dlNumber: deleteField(),
                    dlStatus: deleteField(),
                    dlFrontImage: deleteField(),
                    dlBackImage: deleteField(),
                    dlClass: deleteField(),
                    dlExpiry: deleteField(),
                    dlSubmittedAt: deleteField(),
                    dlVerifiedAt: deleteField(),
                    dlRejectedAt: deleteField(),
                    dlRejectedReason: deleteField(),
                    selfieImage: deleteField(),
                    selfieStatus: deleteField(),
                    verificationStatus: deleteField()
                };

                await updateDoc(doc(db, "users", userId), updateData);
                setProgress(prev => ({ ...prev, current: i + 1 }));
            }

            setStatus("complete");
            addLog("🏁 Migration successfully completed!");
        } catch (err) {
            console.error(err);
            setStatus("error");
            addLog(`❌ Error: ${err.message}`);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: "100px 20px", textAlign: "center", fontFamily: F }}>
                <h1 style={{ fontFamily: H }}>Please Login to Continue</h1>
                <p>Migration tool requires an active authenticated session.</p>
                <button onClick={() => window.location.href = "/"} style={{ padding: "12px 24px", background: SLATE, color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer" }}>Back to Home</button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "100px", paddingBottom: "100px", fontFamily: F }}>
            <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", borderRadius: "32px", padding: "40px", boxShadow: "0 20px 50px rgba(15,23,42,0.1)", border: "1.5px solid rgba(15,23,42,0.05)" }}>
                
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div style={{ width: "64px", height: "64px", background: `${RED}10`, borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: RED, margin: "0 auto 20px" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><path d="M12 16v6"/><path d="m8 18 4 4 4-4"/><path d="m3 9 18 6"/></svg>                    </div>
                    <h1 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, color: SLATE, margin: "0 0 8px" }}>DB Migration Tool</h1>
                    <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.5)", fontWeight: 600 }}>Convert legacy flat data to modern tree maps</p>
                </div>

                <div style={{ background: "rgba(15,23,42,0.03)", borderRadius: "20px", padding: "24px", marginBottom: "30px", border: "1.5px solid rgba(15,23,42,0.05)" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(15,23,42,0.4)", marginBottom: "15px" }}>Status</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: status === "running" ? "#f59e0b" : (status === "complete" ? "#10b981" : "#cbd5e1") }} />
                        <span style={{ fontWeight: 800, fontSize: "16px", color: SLATE }}>{status.toUpperCase()}</span>
                    </div>

                    {status === "running" && (
                        <div>
                            <div style={{ width: "100%", height: "8px", background: "rgba(15,23,42,0.1)", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
                                <motion.div animate={{ width: `${(progress.current/progress.total)*100}%` }} style={{ height: "100%", background: RED }} />
                            </div>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(15,23,42,0.5)" }}>Processed {progress.current} of {progress.total} users</p>
                        </div>
                    )}
                </div>

                {status !== "running" && status !== "complete" && (
                    <button 
                        onClick={runMigration}
                        style={{ width: "100%", padding: "20px", borderRadius: "18px", background: RED, color: "#fff", border: "none", fontSize: "16px", fontWeight: 900, cursor: "pointer", boxShadow: `0 15px 35px ${RED}30`, marginBottom: "30px" }}
                    >
                        Execute Full Migration
                    </button>
                )}

                <div style={{ background: "#0f172a", borderRadius: "20px", padding: "20px", height: "200px", overflowY: "auto", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <h3 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "10px", fontFamily: F }}>Logs</h3>
                    {logs.map((log, i) => (
                        <div key={i} style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace", marginBottom: "4px", lineHeight: 1.5 }}>{`> ${log}`}</div>
                    ))}
                </div>

                {status === "complete" && (
                    <div style={{ marginTop: "30px", textAlign: "center" }}>
                        <button onClick={() => window.location.href = "/"} style={{ background: "none", border: "none", color: RED, fontWeight: 800, cursor: "pointer", fontSize: "14px" }}>← Back to Application</button>
                    </div>
                )}
            </div>
        </div>
    );
}
