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

    const tcPoints = offer.details || [
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
                    background: "#fff", width: "100%", maxWidth: "560px", 
                    maxHeight: "90vh", // Ensure it doesn't exceed screen height
                    borderRadius: "24px", overflow: "hidden", 
                    boxShadow: "0 40px 100px rgba(15, 23, 42, 0.25)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* Header Section - Sticky Header */}
                <div style={{ padding: "32px 40px 24px", borderBottom: "1.5px dashed #f1f5f9", textAlign: "center", position: "relative", flexShrink: 0 }}>
                    <button 
                        onClick={onClose}
                        style={{ position: "absolute", top: "20px", right: "20px", background: "#f8fafc", border: "none", width: "36px", height: "36px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: SLATE, transition: "all 0.2s" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <span style={{ background: "rgba(190, 13, 13, 0.08)", color: RED, padding: "6px 16px", borderRadius: "8px", fontSize: "10px", fontVariantCaps: "all-small-caps", fontWeight: "900", letterSpacing: "1px", marginBottom: "12px", display: "inline-block", fontFamily: H }}>{offer.category} EXCLUSIVE</span>
                    <h2 style={{ fontSize: "24px", fontWeight: "900", color: SLATE, margin: "0 0 6px", fontFamily: H, letterSpacing: "-0.5px" }}>{offer.title}</h2>
                    <p style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.45)", fontWeight: "600", margin: 0 }}>{offer.desc}</p>
                </div>

                {/* Main Content Area - Scrollable */}
                <div style={{ 
                    overflowY: "auto", 
                    flex: 1, 
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }} className="modal-no-scrollbar">
                    <style>{`.modal-no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

                    {/* Promo Code Section */}
                    <div style={{ padding: "24px 40px", background: "#f8fafc", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ 
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", 
                            background: "#fff", padding: "10px 20px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
                            width: "fit-content", margin: "0 auto", boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                        }}>
                            <span style={{ fontSize: "18px", fontWeight: "900", color: SLATE, fontFamily: H, letterSpacing: "1px" }}>{offer.code}</span>
                            <div style={{ width: "1.5px", height: "18px", background: "#e2e8f0" }} />
                            <button 
                                onClick={handleCopy}
                                style={{ background: "none", border: "none", color: RED, fontWeight: "900", fontSize: "12px", cursor: "pointer", textTransform: "uppercase" }}
                            >
                                {copied ? "COPIED" : "COPY"}
                            </button>
                        </div>
                    </div>

                    {/* T&C Section */}
                    <div style={{ padding: "32px 40px" }}>
                        <h4 style={{ fontSize: "15px", fontWeight: "800", color: SLATE, marginBottom: "18px", fontFamily: H }}>What is the Offer</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {tcPoints.map((point, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                    <div style={{ marginTop: "1px" }}><IcoCheck /></div>
                                    <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", fontWeight: "500", lineHeight: "1.5" }}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default OfferModal;
