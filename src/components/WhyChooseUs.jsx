import React from "react";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

const IconVerified = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const IconCharges = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
);

const IconSupport = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const IconRocket = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#be0d0d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const featureCards = [
  { icon: <IconVerified />, title: "100% Verified Vehicles", desc: "Every bike and car is thoroughly inspected and verified before listing.", bg: "#fdf2f2" },
  { icon: <IconCharges />,  title: "No Hidden Charges",       desc: "Transparent pricing with GST included. What you see is what you pay.", bg: "#fff9f0" },
  { icon: <IconSupport />,  title: "24/7 Support",            desc: "Round-the-clock customer support for a hassle-free rental experience.", bg: "#f0f9ff" },
  { icon: <IconRocket />,   title: "Instant Booking",         desc: "Book your ride in under 2 minutes. No paperwork, no waiting.", bg: "#fef2f2" },
];

const WhyChooseUs = () => {
    return (
        <section className="why-section" style={{ padding: "40px 24px 100px", background: "#fafafa" }}>
            <style>{`
                .why-inner { max-width: 1250px; margin: 0 auto; }
                .section-header { text-align: center; margin-bottom: 60px; }
                .section-tag { 
                display: inline-block; 
                background: #fff0f0; 
                color: ${RED}; 
                font-size: 12px; 
                font-weight: 800; 
                text-transform: uppercase; 
                letter-spacing: 2px; 
                padding: 8px 18px; 
                border-radius: 99px; 
                margin-bottom: 18px; 
                }
                .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #111; margin: 0 0 15px; line-height: 1.1; letter-spacing: -0.5px; font-family: ${H}; }
                .section-sub { font-size: 17px; color: #666; font-weight: 400; max-width: 550px; margin: 0 auto; }
                
                .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
                .feature-card { 
                background: #fff; 
                border-radius: 28px; 
                padding: 40px 30px; 
                border: 1px solid #f0f0f0; 
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                cursor: default; 
                position: relative; 
                overflow: hidden; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                }
                .feature-card::before { 
                content: ''; 
                position: absolute; 
                bottom: 0; left: 0; right: 0; height: 4px; 
                background: ${RED}; 
                transform: scaleX(0); 
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                transform-origin: center; 
                }
                .feature-card:hover { 
                transform: translateY(-10px); 
                box-shadow: 0 25px 50px rgba(0,0,0,0.07); 
                border-color: #ffd5d5; 
                }
                .feature-card:hover::before { transform: scaleX(1); }
                .feature-icon { 
                width: 64px; 
                height: 64px; 
                background: #fff5f5; 
                border-radius: 20px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 28px; 
                margin-bottom: 24px; 
                transition: transform 0.3s;
                }
                .feature-card:hover .feature-icon { transform: rotate(10deg) scale(1.1); }
                .feature-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 12px; font-family: ${H}; }
                .feature-desc { font-size: 14px; color: #777; line-height: 1.7; margin: 0; font-weight: 450; }

                @media (max-width: 900px) {
                    .features-grid { grid-template-columns: 1fr !important; gap: 15px !important; }
                    .feature-card { padding: 30px 20px !important; border-radius: 20px !important; }
                }
            `}</style>
            <div className="why-inner">
            <div className="section-header">
                <div className="section-tag">Why Choose Us</div>
                <h2 className="section-title">Bhubaneswar's Own Vehicle Rental Platform</h2>
                <p className="section-sub">Experience the freedom of smart mobility with RoadMate's verified fleet and seamless booking.</p>
            </div>
            <div className="features-grid">
                {featureCards.map((f,i) => (
                <div key={i} className="feature-card">
                    <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">{f.desc}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
