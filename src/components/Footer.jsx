import { Link } from "react-router-dom";
import logo from "../assets/roadMate Red Logo 2.png";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

/* SVG Icons for Contact Section */
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

/* SVG Icons for Social Media */
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

/* SVG Payment Icons */
const VisaIcon = () => (
  <svg width="50" height="16" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 1.2L16.8 14.8H13.7L16.4 1.2H19.5ZM33.3 9.8L35 4.8L35.9 9.8H33.3ZM36.8 14.8H39.7L37.2 1.2H34.5C33.8 1.2 33.2 1.6 32.9 2.2L27.8 14.8H31.1L31.8 12.8H35.8L36.8 14.8ZM28.2 10.1C28.2 6.2 22.7 6 22.7 4.2C22.7 3.6 23.3 3 24.4 2.8C25 2.7 26.5 2.6 28.2 3.4L28.9 1.5C28 1.1 26.8 0.8 25.4 0.8C22.3 0.8 20.1 2.5 20.1 4.9C20.1 6.7 21.7 7.7 22.9 8.3C24.2 8.9 24.6 9.3 24.6 9.9C24.6 10.8 23.5 11.1 22.5 11.1C20.7 11.1 19.6 10.6 18.8 10.2L18.1 12.2C18.9 12.6 20.5 13 22.1 13C25.4 13 27.5 11.3 28.2 10.1ZM12.7 1.2L7.7 14.8H4.3L1.9 3.5C1.7 2.7 1.6 2.4 1 2.1C0 1.5 -0.1 1.5 -0.1 1.5L0 1.2H5.1C5.9 1.2 6.6 1.7 6.7 2.7L7.9 9.5L11 1.2H12.7Z" fill="rgba(255,255,255,0.5)"/>
  </svg>
);

const MastercardIcon = () => (
  <svg width="36" height="22" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="11" r="10" fill="rgba(255,100,100,0.4)"/>
    <circle cx="23" cy="11" r="10" fill="rgba(255,180,50,0.4)"/>
  </svg>
);

const UPIIcon = () => (
  <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="13" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="'Inter', sans-serif">UPI</text>
  </svg>
);

const socialIcons = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
};

const Footer = () => {
  return (
    <footer style={{ background: "#111111", color: "#ffffff", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "50px", paddingBottom: "40px", fontFamily: F }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "50px", marginBottom: "35px" }}>
          
          {/* Brand Column */}
          <div style={{ flex: "1 1 300px" }}>
            <Link to="/" style={{ display: "block", marginBottom: "20px" }}>
              <img src={logo} alt="RoadMate" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
            </Link>
            <p style={{ color: "#ffffff", lineHeight: "1.8", fontSize: "15px", maxWidth: "320px", marginBottom: "30px" }}>
              Bhubaneswar's leading vehicle rental platform. Experience the freedom of the road with our quality, 100% verified fleet.
            </p>
          </div>
 
          {/* Nav Group */}
          <div style={{ display: "flex", gap: "80px", flexWrap: "wrap" }}>
            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: 800, marginTop: "0", marginBottom: "25px", fontFamily: H, color: "#ffffff", textAlign: "left" }}>Company</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                <Link to="/about" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s", lineHeight: "1.6" }} onMouseEnter={(e) => e.target.style.color = RED} onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}>About Us</Link>
                <Link to="/vehicles?type=all" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s", lineHeight: "1.6" }} onMouseEnter={(e) => e.target.style.color = RED} onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}>Our Fleet</Link>
                <Link to="/pricing" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s", lineHeight: "1.6" }} onMouseEnter={(e) => e.target.style.color = RED} onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}>Pricing</Link>
                <Link to="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s", lineHeight: "1.6" }} onMouseEnter={(e) => e.target.style.color = RED} onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}>Contact Us</Link>
              </div>
            </div>
  
            {/* Support */}
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: 800, marginTop: "0", marginBottom: "25px", fontFamily: H, color: "#ffffff", textAlign: "left" }}>Support</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                {[
                  { name: "Help Center", path: "/help-center" }, 
                  { name: "Safety Information", path: "/safety-information" }, 
                  { name: "Terms of Service", path: "/terms-of-service" }, 
                  { name: "Privacy Policy", path: "/privacy-policy" }
                ].map(item => (
                  <Link key={item.name} to={item.path} style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 500, lineHeight: "1.6", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = RED} onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}>{item.name}</Link>
                ))}
              </div>
            </div>
  
            {/* Explore Section */}
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: 800, marginTop: "0", marginBottom: "25px", fontFamily: H, color: "#ffffff", textAlign: "left" }}>Explore</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                {[
                  { name: "Special Offers", path: "/#offers" }, 
                  { name: "Trust & Safety", path: "/safety-information" }, 
                  { name: "RoadMate Blogs", path: "/#blog" }, 
                  { name: "Partner With Us", path: "/contact" }
                ].map(item => (
                  <Link key={item.name} to={item.path} style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s", lineHeight: "1.6" }} onMouseEnter={(e) => e.target.style.color = RED} onMouseLeave={(e) => e.target.style.color = "rgba(255, 255, 255, 0.8)"}>{item.name}</Link>
                ))}
              </div>
            </div>
          </div>
 
        </div>
 
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <p style={{ fontSize: "13px", color: "#ffffff", fontWeight: 500 }}>
            © {new Date().getFullYear()} RoadMate Private Limited. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {["instagram", "twitter", "facebook", "linkedin"].map(social => {
              const links = {
                instagram: "https://www.instagram.com/roh4n.chaudhary?igsh=MXM5b25lcTlsODg0OQ==",
                twitter: "https://x.com/roh4n_chaudhary",
                facebook: "https://www.facebook.com/share/1CXSdCGZj9/",
                linkedin: "https://www.linkedin.com/in/rohan-k-54aa08259?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              };

              return (
                <a key={social} href={links[social]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    backgroundColor: "transparent", 
                    cursor: "pointer", 
                    transition: "all 0.3s ease",
                    color: "#ffffff"
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = "translateY(-3px)"; 
                    e.currentTarget.style.color = RED;
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = "translateY(0)"; 
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  >
                    {socialIcons[social]}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
