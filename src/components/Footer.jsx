import { Link } from "react-router-dom";

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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
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
    <text x="0" y="13" fill="rgba(255,255,255,0.5)" fontSize="13" fontWeight="700" fontFamily="'Inter', sans-serif">UPI</text>
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
    <footer style={{ background: "#0f172a", color: "#fff", paddingTop: "80px", paddingBottom: "40px", fontFamily: F }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "50px", marginBottom: "60px" }}>
          
          {/* Brand Column */}
          <div style={{ gridColumn: "span 2" }}>
            <Link to="/" style={{ fontSize: "28px", fontWeight: 900, textDecoration: "none", color: "#fff", letterSpacing: "-1px", fontFamily: H, display: "block", marginBottom: "20px" }}>
              Road<span style={{ color: RED }}>Mate</span>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.8", fontSize: "15px", maxWidth: "320px", marginBottom: "30px" }}>
              Bhubaneswar's leading vehicle rental platform. Experience the freedom of the road with our quality, 100% verified fleet.
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              {["facebook", "twitter", "instagram", "linkedin"].map(social => (
                <div key={social} style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s" }}>
                  {socialIcons[social]}
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
                <MapPinIcon />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>Jayadev Vihar, Bhubaneswar,<br/>Odisha 751013</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <PhoneIcon />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>+91 98765 43210</span>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <MailIcon />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>support@roadmate.in</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            © {new Date().getFullYear()} RoadMate Technologies Pvt Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "22px", alignItems: "center" }}>
            {/* VISA - Real logo */}
            <svg width="60" height="20" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.64 1.27L15.53 18.73H10.18L6.18 4.82C5.94 3.89 5.73 3.55 5 3.16C3.8 2.53 1.87 1.94 0.18 1.58L0.3 1.27H8.53C9.56 1.27 10.47 1.95 10.69 3.13L12.7 13.67L17.94 1.27H23.64ZM42.18 12.87C42.2 8.27 35.73 7.99 35.77 5.93C35.78 5.3 36.38 4.63 37.7 4.46C38.35 4.38 40.12 4.32 42.12 5.24L42.92 1.72C41.85 1.33 40.49 0.95 38.82 0.95C33.44 0.95 29.62 3.83 29.59 7.92C29.55 10.93 32.28 12.59 34.35 13.59C36.48 14.6 37.18 15.27 37.17 16.17C37.16 17.56 35.5 18.19 33.94 18.22C31.65 18.26 30.33 17.59 29.27 17.08L28.44 20.71C29.52 21.21 31.52 21.65 33.6 21.67C39.32 21.67 43.07 18.83 42.18 12.87ZM55.09 18.73H60L55.73 1.27H51.38C50.47 1.27 49.7 1.81 49.35 2.65L41.35 18.73H47.06L48.18 15.67H55.09V18.73ZM49.67 11.87L52.53 4.07L54.19 11.87H49.67ZM33.73 1.27L29.18 18.73H23.73L28.27 1.27H33.73Z" fill="#1434CB" opacity="0.8"/>
            </svg>
            {/* Mastercard - Real logo */}
            <svg width="44" height="28" viewBox="0 0 44 28" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="12" r="11" fill="#EB001B" opacity="0.85"/>
              <circle cx="29" cy="12" r="11" fill="#F79E1B" opacity="0.85"/>
              <path d="M22 3.07A10.96 10.96 0 0 1 26 12 10.96 10.96 0 0 1 22 20.93 10.96 10.96 0 0 1 18 12 10.96 10.96 0 0 1 22 3.07z" fill="#FF5F00" opacity="0.9"/>
              <text x="22" y="27" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5" fontWeight="600" fontFamily="'Inter', sans-serif" letterSpacing="0.5">mastercard</text>
            </svg>
            {/* RuPay - Real logo */}
            <svg width="65" height="22" viewBox="0 0 65 22" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="18" fontSize="19" fontWeight="800" fontFamily="'Inter', sans-serif" fontStyle="italic" fill="rgba(255,255,255,0.7)" letterSpacing="-0.5">RuPay</text>
              <path d="M56 6l6 5.5-6 5.5z" fill="#F37021" opacity="0.85"/>
              <path d="M52 9l5 3-5 3z" fill="#3EAB4E" opacity="0.85"/>
            </svg>
            {/* UPI - Real logo */}
            <svg width="50" height="22" viewBox="0 0 50 22" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="18" fontSize="20" fontWeight="800" fontFamily="'Inter', sans-serif" fill="rgba(255,255,255,0.5)" letterSpacing="-0.5">UPI</text>
              <path d="M40 5l7 6.5-7 6.5z" fill="#F37021" opacity="0.85"/>
              <path d="M36 8l5.5 3.5-5.5 3.5z" fill="#3EAB4E" opacity="0.85"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
