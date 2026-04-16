import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#be0d0d";
const SLATE = "#0f172a";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const IcoCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const OfferModal = ({ offer, onClose, onBookNow }) => {
    const [copied, setCopied] = useState(false);

    if (!offer) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(offer.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tcPoints = [
        `Use code ${offer.code} to get this exclusive discount.`,
        "Offer available only for registered RoadMate users.",
        "Offer is applicable for a minimum rental duration of 1 hour.",
        "Valid once per customer email or mobile number.",
        "Cannot be combined with any other ongoing promotions.",
        "RoadMate reserves the right to modify or end this offer at its discretion.",
        "All disputes are subject to local jurisdiction."
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ 
                position: "fixed", inset: 0, zIndex: 10000, 
                background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
            }}
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                    background: "#fff", width: "100%", maxWidth: "600px", 
                    borderRadius: "32px", overflow: "hidden", 
                    boxShadow: "0 30px 100px rgba(15, 23, 42, 0.2)",
                    position: "relative"
                }}
            >
                {/* Header Section */}
                <div style={{ padding: "40px", borderBottom: "1.5px dashed #f1f5f9", textAlign: "center", position: "relative" }}>
                    <button 
                        onClick={onClose}
                        style={{ position: "absolute", top: "24px", right: "24px", background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: SLATE }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <span style={{ background: "rgba(190, 13, 13, 0.08)", color: RED, padding: "6px 16px", borderRadius: "99px", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", display: "inline-block", fontFamily: H }}>{offer.category} OFFER</span>
                    <h2 style={{ fontSize: "28px", fontWeight: "900", color: SLATE, margin: "0 0 8px", fontFamily: H, letterSpacing: "-0.5px" }}>{offer.title}</h2>
                    <p style={{ fontSize: "14px", color: "rgba(15, 23, 42, 0.5)", fontWeight: "600", margin: 0 }}>{offer.desc}</p>
                </div>

                {/* Promo Code Section */}
                <div style={{ padding: "30px 40px", background: "#f8fafc", textAlign: "center" }}>
                    <div style={{ 
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", 
                        background: "#fff", padding: "12px 24px", borderRadius: "20px", border: "2px dashed #e2e8f0",
                        width: "fit-content", margin: "0 auto"
                    }}>
                        <span style={{ fontSize: "20px", fontWeight: "900", color: SLATE, fontFamily: H, letterSpacing: "2px" }}>{offer.code}</span>
                        <div style={{ width: "1.5px", height: "20px", background: "#e2e8f0" }} />
                        <button 
                            onClick={handleCopy}
                            style={{ background: "none", border: "none", color: RED, fontWeight: "900", fontSize: "13px", cursor: "pointer", textTransform: "uppercase", padding: "4px 8px" }}
                        >
                            {copied ? "COPIED!" : "COPY"}
                        </button>
                    </div>
                </div>

                {/* T&C Section */}
                <div style={{ padding: "40px", maxHeight: "350px", overflowY: "auto" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "900", color: SLATE, marginBottom: "20px", fontFamily: H }}>What is the Offer</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {tcPoints.map((point, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                <div style={{ marginTop: "2px" }}><IcoCheck /></div>
                                <p style={{ margin: 0, fontSize: "14px", color: "#475569", fontWeight: "500", lineHeight: "1.5" }}>{point}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div style={{ padding: "30px 40px", background: "#fff", borderTop: "1.5px solid #f1f5f9" }}>
                    <button 
                        onClick={onBookNow}
                        style={{ 
                            width: "100%", padding: "18px", borderRadius: "16px", 
                            background: RED, color: "#fff", border: "none", 
                            fontSize: "16px", fontWeight: "900", cursor: "pointer", 
                            boxShadow: "0 10px 30px rgba(190, 13, 13, 0.3)",
                            fontFamily: F, textTransform: "uppercase", letterSpacing: "1px",
                            transition: "all 0.3s"
                        }}
                    >
                        Book Now with this Offer
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OfferModal;
