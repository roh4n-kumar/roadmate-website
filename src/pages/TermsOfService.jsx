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
    content: "By accessing and using roadMate, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Users must be at least 18 years of age (or 21 for certain premium vehicles) and must possess a valid, permanent Driving License for the category of vehicle being rented. Users are responsible for providing authentic and updated documentation (DL, Aadhaar/Passport) for identity verification before every trip."
  },
  {
    category: "2. Booking & Payments",
    content: "All bookings are subject to vehicle availability. Pricing is dynamic and may vary based on location, demand, and seasonality. Payments must be made through our authorized payment gateways. roadMate reserves the right to cancel bookings in case of payment failure or fraudulent activity. A refundable security deposit may be required for specific high-value vehicles, which will be processed within 48 hours of a safe return."
  },
  {
    category: "3. Vehicle Usage & Standards",
    content: "Prohibited use includes off-roading, racing, commercial sub-letting, towing other vehicles, or using the vehicle for any illegal activities. Fuel Policy: Vehicles are typically provided with a specific fuel level; please return the vehicle at the same level to avoid additional refueling charges. Cleanliness: Users are expected to return the vehicle in a reasonably clean state. Excessive littering or staining will attract a cleaning fee."
  },
  {
    category: "4. Traffic Compliance & Safety",
    content: "Users are solely responsible for any traffic violations, parking fines, or legal penalties incurred during the rental period. Driving under the influence of alcohol or prohibited substances is strictly forbidden. roadMate has a zero-tolerance policy for such actions. Wearing mandatory safety gear (Helmets for bikes, Seatbelts for cars) as per regional traffic laws is the user's responsibility."
  },
  {
    category: "5. Damage, Insurance & Theft",
    content: "Any damage or accident must be reported to roadMate support within 2 hours of the occurrence for insurance processing. In the event of damage, the user is liable to pay the 'insurance deductible' or the actual repair cost, whichever is lower (for minor incidents). Negligent usage (overspeeding beyond 80kmph, wrong-side driving) voids all insurance covers, making the user 100% liable for all repair costs."
  },
  {
    category: "6. Cancellation & Refund Policy",
    content: "Cancellations made 24+ hours before start time are eligible for a full refund. Cancellations within 24 hours incur a partial booking fee. Approved refunds are processed back to the original source of payment within 5-7 business days."
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
                padding: "120px 40px 60px", 
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
                            background: "#ffffff", 
                            color: RED, 
                            fontSize: "14px", 
                            fontWeight: 900, 
                            textTransform: "uppercase", 
                            letterSpacing: "3px", 
                            padding: "10px 24px", 
                            borderRadius: "99px", 
                            marginBottom: "20px",
                            border: "none"
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
                                <h3 style={{ fontSize: "18px", fontWeight: 900, fontFamily: H, color: RED, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    {section.category}
                                </h3>
                                <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: "1.8", margin: 0, fontWeight: 500 }}>
                                    {section.content}
                                </p>
                           </div>
                        ))}
                    </div>
                    
                    {/* Support Box */}
                    <div style={{ marginTop: "60px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.4)" }}>
                            If you have any questions about these Terms of Service, please contact us at legal@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
