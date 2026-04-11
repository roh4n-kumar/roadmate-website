import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const RED = "#be0d0dff";
const SLATE = "#000000";
const F   = "'Inter', sans-serif";
const H   = "'Outfit', sans-serif";

const howItWorksData = [
  {
    category: "1. Search & Select Your Ride",
    content: "The RoadMate journey begins with a seamless discovery experience. Browse through our extensive fleet of 100% verified cars and bikes listed by trusted local hosts. Use our advanced filters to sort by vehicle type, fuel preference, transmission, and price range to find the perfect match for your needs. Simply enter your desired pickup location and dates to see real-time availability and transparent pricing. We offer flexible plans, from short hourly rentals for quick errands to daily or weekly plans for long road trips and self-drive adventures."
  },
  {
    category: "2. One-Time Digital Verification",
    content: "To maintain a safe and secure community, all new RoadMate users undergo a quick, one-time digital verification process. You'll need to upload a clear photograph of your valid, permanent Driving License (original) and an identity proof such as an Aadhaar card or Passport. Our automated systems and dedicated safety team typically complete the verification within 30-60 minutes. Once verified, you're a member of the RoadMate community for life and can book any vehicle instantly without having to re-upload documents for future trips."
  },
  {
    category: "3. Secure Online Booking",
    content: "Once you've found your ride, confirming your booking is just a few taps away. Our checkout process is protected by industry-standard encryption, and we support a wide variety of payment methods including UPI, Credit/Debit cards, and Net Banking. We believe in transparency—the price you see is the price you pay, with no hidden charges for basic insurance or platform fees. After a successful payment, you'll receive an instant confirmation via the app, email, and SMS, containing your unique booking ID, pickup instructions, and host contact details."
  },
  {
    category: "4. Handover & Inspection",
    content: "On the day of your booking, head to the designated pickup point or have the vehicle delivered to your doorstep if you've opted for home delivery. Our vehicle partners will assist you with a quick physical handover. To protect your interests, we recommend doing a thorough inspection of the vehicle, including checking the fuel level, tire condition, and existing minor dents or scratches. Share the Booking OTP with the host only after you are satisfied with the vehicle's condition. Capture a quick walkaround video for your own reference, and you're ready to hit the road!"
  },
  {
    category: "5. Safe Ride & Easy Return",
    content: "Enjoy your self-drive experience with the peace of mind that comes with our 24/7 roadside assistance. As your rental period comes to an end, navigate back to the drop-off location and return the vehicle at the scheduled time. Ensure that you return the vehicle with the same fuel level as was provided at pickup to avoid additional refueling convenience charges. The host will perform a final check to confirm the vehicle's safe return. If a security deposit was charged, the refund is initiated immediately to your original payment source, reflecting in your account as per your bank's processing time."
  }
];

const HowItWorks = () => {
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
                        Easy Rental
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: "56px", fontWeight: 900, fontFamily: H, marginBottom: "20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}
                    >
                        How It <span style={{ color: RED }}>Works</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}
                    >
                        The simple 5-step process to getting your favorite ride and starting your journey with RoadMate.
                    </motion.p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section style={{ padding: "40px 24px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    
                    <div style={{ marginTop: "10px" }}>
                        {howItWorksData.map((section, sIdx) => (
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

                    <div style={{ marginTop: "60px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "rgba(15,23,42,0.4)" }}>
                            Still have questions about the process? Check our <a href="/help-center" style={{ color: RED, textDecoration: "none", fontWeight: 700 }}>Help Center</a> or contact us at support@roadmate.in
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;
