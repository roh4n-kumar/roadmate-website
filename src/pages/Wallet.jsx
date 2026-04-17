import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const F = "'Inter', sans-serif";
const H = "'Outfit', sans-serif";

const Svg = ({ children, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const IcoWallet = () => <Svg size={32}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>;
const IcoPlus = () => <Svg size={20}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const IcoArrowUp = () => <Svg size={16} color="#ef4444"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></Svg>;
const IcoArrowDown = () => <Svg size={16} color="#22c55e"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></Svg>;

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        // Listen to user document for wallet balance
        const unsubUser = onSnapshot(doc(db, "users", u.uid), (snap) => {
          if (snap.exists()) {
            setWalletBalance(snap.data().walletBalance || 0);
          } else {
            setWalletBalance(0);
          }
          setLoading(false);
        });

        // Listen to transactions
        const q = query(
          collection(db, "users", u.uid, "transactions"),
          orderBy("at", "desc"),
          limit(10)
        );
        const unsubTx = onSnapshot(q, (snap) => {
          setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
          unsubUser();
          unsubTx();
        };
      } else {
        navigate("/");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  const handleTopUp = async () => {
    if (!topUpAmount || isNaN(topUpAmount) || topUpAmount <= 0) return;
    setIsTopUpLoading(true);

    try {
      const amountToAdd = parseFloat(topUpAmount);
      const userRef = doc(db, "users", user.uid);
      
      // Update balance
      await updateDoc(userRef, {
        walletBalance: (walletBalance || 0) + amountToAdd
      });

      // Record transaction
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        type: "credit",
        amount: amountToAdd,
        description: "Wallet Top-up",
        at: serverTimestamp()
      });

      setTopUpAmount("");
      setIsTopUpLoading(false);
    } catch (error) {
      console.error("Top-up failed:", error);
      setIsTopUpLoading(false);
    }
  };

  const fmtDate = (at) => {
    if (!at) return "";
    const date = at.toDate ? at.toDate() : new Date(at);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
       <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: RED, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "80px", paddingBottom: "100px", fontFamily: F }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "32px" }}>
          <button onClick={() => navigate(-1)} style={{ background: "#fff", border: "1.5px solid rgba(15,23,42,0.1)", borderRadius: "12px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Svg size={20}><polyline points="15 18 9 12 15 6"/></Svg>
          </button>
          <h1 style={{ fontSize: "28px", fontWeight: 900, fontFamily: H, color: SLATE, margin: 0 }}>RoadMate Wallet</h1>
        </div>

        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: `linear-gradient(135deg, ${RED} 0%, #8b0000 100%)`,
            borderRadius: "32px",
            padding: "40px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 30px 60px ${RED}40`,
            marginBottom: "40px"
          }}
        >
          {/* Decorative Circles */}
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", opacity: 0.8 }}>
              <IcoWallet />
              <span style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Current Balance</span>
            </div>
            <h2 style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, margin: 0, letterSpacing: "-1px" }}>₹{walletBalance.toLocaleString("en-IN")}</h2>
            <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: 700 }}>
                    Active Wallet
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} /> Secure
                </div>
            </div>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px" }}>
          
          {/* Top Up Section */}
          <section>
            <h3 style={{ fontSize: "18px", fontWeight: 800, fontFamily: H, color: SLATE, marginBottom: "20px" }}>Add Money</h3>
            <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", border: "1.5px solid rgba(15,23,42,0.08)" }}>
                <div style={{ position: "relative", marginBottom: "16px" }}>
                    <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", fontWeight: 900, color: SLATE }}>₹</span>
                    <input 
                        type="number" 
                        placeholder="Enter amount"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        style={{ width: "100%", padding: "16px 20px 16px 45px", borderRadius: "16px", border: "1.5px solid rgba(15,23,42,0.1)", fontSize: "18px", fontWeight: 800, outline: "none", fontFamily: F }}
                    />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "24px" }}>
                    {[500, 1000, 2000].map(amt => (
                        <button 
                            key={amt} 
                            onClick={() => setTopUpAmount(amt.toString())}
                            style={{ padding: "10px", borderRadius: "12px", border: "1.5px solid rgba(15,23,42,0.05)", background: "#f8fafc", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = RED}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.05)"}
                        >
                            +₹{amt}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleTopUp}
                    disabled={isTopUpLoading || !topUpAmount}
                    style={{ 
                        width: "100%", padding: "16px", borderRadius: "16px", background: SLATE, color: "#fff", border: "none", 
                        fontSize: "16px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        opacity: (isTopUpLoading || !topUpAmount) ? 0.6 : 1, transition: "all 0.3s"
                    }}
                >
                    {isTopUpLoading ? "Processing..." : <><IcoPlus /> Add to Wallet</>}
                </button>
            </div>
          </section>

          {/* Transactions Section */}
          <section>
            <h3 style={{ fontSize: "18px", fontWeight: 800, fontFamily: H, color: SLATE, marginBottom: "20px" }}>Recent Transactions</h3>
            <div style={{ background: "#fff", borderRadius: "24px", padding: "8px", border: "1.5px solid rgba(15,23,42,0.08)", minHeight: "300px" }}>
                <AnimatePresence>
                    {transactions.length === 0 ? (
                        <div style={{ padding: "60px 20px", textAlign: "center", color: "rgba(15,23,42,0.4)" }}>
                            <p style={{ fontSize: "14px", fontWeight: 700 }}>No transactions yet</p>
                        </div>
                    ) : (
                        transactions.map((tx, idx) => (
                            <motion.div 
                                key={tx.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{ 
                                    padding: "16px", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "space-between",
                                    borderBottom: idx === transactions.length - 1 ? "none" : "1.2px solid #f1f5f9"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <div style={{ 
                                        width: "40px", height: "40px", borderRadius: "12px", 
                                        background: tx.type === "credit" ? "#22c55e15" : "#ef444415",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        {tx.type === "credit" ? <IcoArrowDown /> : <IcoArrowUp />}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: SLATE }}>{tx.description}</p>
                                        <p style={{ margin: "2px 0 0", fontSize: "11px", fontWeight: 600, color: "rgba(15,23,42,0.4)" }}>{fmtDate(tx.at)}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: tx.type === "credit" ? "#22c55e" : "#ef4444" }}>
                                        {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
          </section>

        </div>

      </div>
      
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
