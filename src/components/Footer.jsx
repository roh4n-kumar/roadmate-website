import { Link } from "react-router-dom";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const Footer = () => {
  return (
    <footer style={{ background: "#0f172a", color: "#fff", paddingTop: "80px", paddingBottom: "40px", fontFamily: F }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "50px", marginBottom: "60px" }}>
          
          {/* Brand Column */}
          <div style={{ gridColumn: "span 2" }}>
            <Link to="/" style={{ fontSize: "28px", fontWeight: 900, textDecoration: "none", color: "#fff", letterSpacing: "-1px", fontFamily: H, display: "block", marginBottom: "20px" }}>
              Road<span style={{ color: RED }}>Mate</span>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.8", fontSize: "15px", maxWidth: "320px", marginBottom: "30px" }}>
              Bhubaneswar's premier vehicle rental platform. Experience the freedom of the road with our premium, 100% verified fleet.
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              {["facebook", "twitter", "instagram", "linkedin"].map(social => (
                <div key={social} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s" }}>
                  <img src={`https://cdn-icons-png.flaticon.com/512/733/733${social === 'facebook' ? '548' : social === 'twitter' ? '577' : social === 'instagram' ? '558' : '555'}.png`} alt={social} style={{ width: "18px", filter: "invert(1)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "25px", fontFamily: H }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {["About Us", "Our Fleet", "Pricing", "Contact"].map(item => (
                <Link key={item} to="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s" }}>{item}</Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "25px", fontFamily: H }}>Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {["Help Center", "Safety Information", "Terms of Service", "Privacy Policy"].map(item => (
                <Link key={item} to="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>{item}</Link>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "25px", fontFamily: H }}>Contact Us</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: RED }}>📍</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>Jayadev Vihar, Bhubaneswar,<br/>Odisha 751013</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ color: RED }}>📞</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>+91 98765 43210</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ color: RED }}>✉️</span>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>support@roadmate.in</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            © {new Date().getFullYear()} RoadMate Technologies Pvt Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "25px" }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: "12px", opacity: 0.3 }} />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: "18px", opacity: 0.3 }} />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" style={{ height: "15px", opacity: 0.3 }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
