import React from "react";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

const HowItWorks = () => {
    return (
        <section className="how-section" style={{ padding: "40px 24px 100px", background: "#ffffff", position: "relative", overflow: "hidden" }}>
            <style>{`
                .how-inner { max-width: 1250px; margin: 0 auto; position: relative; z-index: 1; }
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

                .steps-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 30px; position: relative; }
                .steps-grid-connector { 
                    position: absolute; 
                    top: 40px; 
                    left: 15%; 
                    right: 15%; 
                    height: 2px; 
                    background: repeating-linear-gradient(to right, transparent, transparent 10px, rgba(190,13,13,0.2) 10px, rgba(190,13,13,0.2) 20px);
                    z-index: 0;
                }
                .step-card { text-align: center; position: relative; z-index: 1; }
                .step-num { 
                    width: 80px; 
                    height: 80px; 
                    background: #fff; 
                    border: 3px solid ${RED}; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin: 0 auto 24px; 
                    font-size: 28px; 
                    font-weight: 900; 
                    color: ${RED}; 
                    box-shadow: 0 10px 25px rgba(190,13,13,0.15); 
                    transition: all 0.3s;
                }
                .step-card:hover .step-num { background: ${RED}; color: #fff; transform: scale(1.1); }
                .step-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 10px; font-family: ${H}; }
                .step-desc { font-size: 14px; color: #777; line-height: 1.6; font-weight: 400; max-width: 220px; margin: 0 auto; }

                @media (max-width: 900px) {
                    .steps-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
                    .steps-grid-connector { display: none !important; }
                    .step-num { width: 60px !important; height: 60px !important; font-size: 20px !important; }
                }
            `}</style>
            <div className="how-inner">
                <div className="section-header">
                <div className="section-tag">Seamless Process</div>
                <h2 className="section-title">Book Your Ride in 5 Easy Steps</h2>
                <p className="section-sub">Simple, fast, and completely online — no paperwork, no hassle.</p>
                </div>
                <div className="steps-grid">
                <div className="steps-grid-connector" />
                {[
                    { step:"01", title:"Verify Docs",    desc:"Quick digital verification with zero physical paperwork." },
                    { step:"02", title:"Choose Vehicle",  desc:"Select your preferred bike or car from our highly curated, verified fleet." },
                    { step:"03", title:"Pick Date & Time",desc:"Set your rental date, pickup and drop-off time as per your convenience." },
                    { step:"04", title:"Confirm Booking", desc:"Review the transparent pricing and confirm your booking instantly." },
                    { step:"05", title:"Ride Away",        desc:"Pick up your vehicle and enjoy the ride. It's that simple!" },
                ].map((s,i) => (
                    <div key={i} className="step-card">
                    <div className="step-num">{s.step}</div>
                    <h3 className="step-title">{s.title}</h3>
                    <p className="step-desc">{s.desc}</p>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
