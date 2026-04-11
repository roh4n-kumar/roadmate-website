import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0d";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const tosData = [
  {
    category: "1. User Agreement & Eligibility",
    points: [
      { id: "1.1", text: "By accessing and using roadMate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
      { id: "1.2", text: "Users must be at least 18 years of age (or 21 for certain premium vehicles) and must possess a valid, permanent Driving License for the category of vehicle being rented." },
      { id: "1.3", text: "Users are responsible for providing authentic and updated documentation (DL, Aadhaar/Passport) for identity verification before every trip." }
    ]
  },
  {
    category: "2. Booking & Payments",
    points: [
      { id: "2.1", text: "All bookings are subject to vehicle availability. Pricing is dynamic and may vary based on location, demand, and seasonality." },
      { id: "2.2", text: "Payments must be made through our authorized payment gateways. roadMate reserves the right to cancel bookings in case of payment failure or fraudulent activity." },
      { id: "2.3", text: "A refundable security deposit may be required for specific high-value vehicles, which will be processed within 48 hours of a safe return." }
    ]
  },
  {
    category: "3. Vehicle Usage & Standards",
    points: [
      { id: "3.1", text: "Prohibited use includes off-roading, racing, commercial sub-letting, towing other vehicles, or using the vehicle for any illegal activities." },
      { id: "3.2", text: "Fuel Policy: Vehicles are typically provided with a specific fuel level; please return the vehicle at the same level to avoid additional refueling charges." },
      { id: "3.3", text: "Cleanliness: Users are expected to return the vehicle in a reasonably clean state. Excessive littering or staining will attract a cleaning fee." }
    ]
  },
  {
    category: "4. Traffic Compliance & Safety",
    points: [
      { id: "4.1", text: "Users are solely responsible for any traffic violations, parking fines, or legal penalties incurred during the rental period." },
      { id: "4.2", text: "Driving under the influence of alcohol or prohibited substances is strictly forbidden. roadMate has a zero-tolerance policy for such actions." },
      { id: "4.3", text: "Wearing mandatory safety gear (Helmets for bikes, Seatbelts for cars) as per regional traffic laws is the user's responsibility." }
    ]
  },
  {
    category: "5. Damage, Insurance & Theft",
    points: [
      { id: "5.1", text: "Any damage or accident must be reported to roadMate support within 2 hours of the occurrence for insurance processing." },
      { id: "5.2", text: "In the event of damage, the user is liable to pay the 'insurance deductible' or the actual repair cost, whichever is lower (for minor incidents)." },
      { id: "5.3", text: "Negligent usage (overspeeding beyond 80kmph, wrong-side driving) voids all insurance covers, making the user 100% liable for all repair costs." }
    ]
  },
  {
    category: "6. Cancellation & Refund Policy",
    points: [
      { id: "6.1", text: "Cancellations made 24+ hours before start time are eligible for a full refund. Cancellations within 24 hours incur a partial booking fee." },
      { id: "6.2", text: "Approved refunds are processed back to the original source of payment within 5-7 business days." }
    ]
  }
];

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: "#ffffff", fontFamily: F, color: "#1a1a1a", minHeight: "100vh" }}>
            
            {/* HERO SECTION */}
            <section style={{ 
                padding: "120px 40px 120px", 
                background: "#000000", 
                color: "#fff", 
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                            display: "inline-block", 
                            background: `${RED}22`, 
                            color: RED, 
                            fontSize: "14px", 
                            fontWeight: 900, 
                            textTransform: "uppercase", 
                            letterSpacing: "3px", 
                            padding: "10px 24px", 
                            borderRadius: "99px", 
                            marginBottom: "20px",
                            border: `1px solid ${RED}33`
                        }}
                    >
                        T&C
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        Terms of <span style={{ color: RED }}>Service</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}
                    >
                        Your guide to a safe, transparent, and hassle-free roadMate experience.
                    </motion.p>

                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    


                    <div style={{ marginTop: "10px" }}>
                        {tosData.map((section, sIdx) => (
                           <div key={sIdx} style={{ marginBottom: "60px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: SLATE, marginBottom: "25px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    {section.category}
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {section.points.map((point, pIdx) => (
                                        <div key={pIdx} style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 800, color: RED, fontFamily: H, minWidth: "30px", paddingTop: "2px" }}>
                                                {point.id}
                                            </span>
                                            <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.8", margin: 0, fontWeight: 500 }}>
                                                {point.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                           </div>
                        ))}
                    </div>
                    
                    {/* Support Box */}
                    <div style={{ borderTop: "1.5px solid rgba(0,0,0,0.06)", paddingTop: "50px", marginTop: "80px", textAlign: "center" }}>
                        <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 600, marginBottom: "15px" }}>
                            Have questions regarding our policies?
                        </p>
                        <a 
                            href="mailto:legal@roadmate.in" 
                            style={{ 
                                color: RED, 
                                textDecoration: "none", 
                                fontWeight: 800, 
                                fontSize: "16px",
                                background: `${RED}11`,
                                padding: "12px 30px",
                                borderRadius: "12px",
                                display: "inline-block"
                            }}
                        >
                            legal@roadmate.in
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
