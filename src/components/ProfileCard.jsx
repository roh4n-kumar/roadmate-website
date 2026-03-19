import React from 'react';
import { motion } from 'framer-motion';

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";
const F = "'Inter', sans-serif";

const ProfileCard = ({ name, email, avatarOnly = false, action, style = {} }) => {
  const initial = (name?.[0] || email?.[0] || "?").toUpperCase();

  // Vibrant, multi-stop premium gradient
  const avatarGradient = `linear-gradient(135deg, ${RED} 0%, #ff3d3d 45%, #ff7070 100%)`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "20px", 
        padding: "20px", 
        borderRadius: "24px", 
        background: "#f8f9fa", 
        border: "1px solid #eee",
        transition: "all 0.3s ease",
        flexWrap: "wrap",
        ...style 
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1, minWidth: "180px" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          {/* External Soft Ring */}
          <div style={{ 
            position: "absolute", 
            inset: "-3px", 
            borderRadius: "20px", 
            border: `1.5px solid ${RED}15`,
            background: `linear-gradient(135deg, ${RED}08, transparent)`
          }} />
          
          <div style={{ 
            width: "56px", 
            height: "56px", 
            borderRadius: "16px", 
            background: avatarGradient, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#fff", 
            fontSize: "22px", 
            fontWeight: 900, 
            fontFamily: H,
            boxShadow: `0 8px 20px ${RED}25`,
            position: "relative",
            zIndex: 1,
            overflow: "hidden"
          }}>
            {/* Glossy Overlay */}
            <div style={{ 
              position: "absolute", 
              top: "-50%", 
              left: "-50%", 
              width: "200%", 
              height: "200%", 
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)",
              pointerEvents: "none"
            }} />
            <span style={{ position: "relative", zIndex: 2 }}>{initial}</span>
          </div>
        </div>

        {!avatarOnly && (
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <h4 style={{ 
                fontSize: "18px", 
                fontWeight: 900, 
                margin: 0, 
                color: "#1a1a1a", 
                whiteSpace: "nowrap", 
                textOverflow: "ellipsis", 
                overflow: "hidden", 
                fontFamily: H,
                letterSpacing: "-0.3px"
              }}>
                {name || "RoadMate User"}
              </h4>
              <div style={{ 
                padding: "3px 8px", 
                borderRadius: "6px", 
                background: `${RED}10`, 
                color: RED, 
                fontSize: "9px", 
                fontWeight: 800, 
                textTransform: "uppercase", 
                fontFamily: H
              }}>
                Elite
              </div>
            </div>
            <p style={{ 
              fontSize: "13px", 
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
      </div>

      {action && (
        <div style={{ marginLeft: "auto" }}>
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default ProfileCard;
