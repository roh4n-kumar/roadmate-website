import React from 'react';
import { motion } from 'framer-motion';

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const ProfileCard = ({ name, email, avatarOnly = false, style = {} }) => {
  const initial = (name?.[0] || email?.[0] || "?").toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "20px", 
        padding: "24px", 
        borderRadius: "28px", 
        background: "rgba(255, 255, 255, 0.7)", 
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style 
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        {/* Avatar Ring */}
        <div style={{ 
          position: "absolute", 
          inset: "-4px", 
          borderRadius: "22px", 
          padding: "2px", 
          background: `linear-gradient(135deg, ${RED}30, transparent)`, 
          border: `1.5px solid ${RED}15`
        }} />
        
        <div style={{ 
          width: "60px", 
          height: "60px", 
          borderRadius: "18px", 
          background: `linear-gradient(135deg, ${RED}, #ff4b4b)`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "#fff", 
          fontSize: "24px", 
          fontWeight: 900, 
          fontFamily: H,
          boxShadow: `0 8px 20px ${RED}30`,
          position: "relative",
          zIndex: 1
        }}>
          {initial}
        </div>
      </div>

      {!avatarOnly && (
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h4 style={{ 
              fontSize: "19px", 
              fontWeight: 900, 
              margin: 0, 
              color: "#0f172a", 
              whiteSpace: "nowrap", 
              textOverflow: "ellipsis", 
              overflow: "hidden", 
              fontFamily: H,
              letterSpacing: "-0.5px"
            }}>
              {name || "RoadMate User"}
            </h4>
            <div style={{ 
              padding: "4px 10px", 
              borderRadius: "8px", 
              background: `${RED}10`, 
              color: RED, 
              fontSize: "10px", 
              fontWeight: 800, 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              fontFamily: H
            }}>
              Elite
            </div>
          </div>
          <p style={{ 
            fontSize: "14px", 
            color: "#64748b", 
            margin: 0, 
            whiteSpace: "nowrap", 
            textOverflow: "ellipsis", 
            overflow: "hidden", 
            fontWeight: 600,
            fontFamily: F
          }}>
            {email}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileCard;
