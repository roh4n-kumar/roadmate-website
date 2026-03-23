import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

const MapSection = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      initLeaflet();
    };
    document.head.appendChild(script);

    const unsub = onSnapshot(collection(db, "locations"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(data);
      setLoading(false);
    });

    return () => {
      unsub();
      // Cleanup script/link if needed, though usually fine to keep
    };
  }, []);

  const initLeaflet = () => {
      // We'll use a second useEffect or wait for locations to re-init
  };

  useEffect(() => {
    if (window.L && locations.length > 0 && !loading) {
      const container = document.getElementById("leaflet-map");
      if (container) {
          // Clear previous map if any
          container._leaflet_id = null; 
          
          const first = locations[0];
          const map = window.L.map('leaflet-map').setView([first.lat, first.lng], 12);

          window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          // Custom Icon
          const createIcon = (color) => window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const bounds = [];
          locations.forEach(loc => {
            const marker = window.L.marker([loc.lat, loc.lng], {
              icon: createIcon(loc.type === "Garage" ? RED : "#4f46e5")
            }).addTo(map);

            marker.bindPopup(`
              <div style="font-family: 'Inter', sans-serif; padding: 4px;">
                <b style="color: #0f172a; font-size: 14px;">${loc.name}</b><br/>
                <span style="font-size: 11px; color: #64748b;">${loc.address}</span><br/>
                <span style="display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 800; color: ${loc.type === 'Garage' ? RED : '#4f46e5'}">${loc.type.toUpperCase()}</span>
              </div>
            `);
            bounds.push([loc.lat, loc.lng]);
          });

          if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50] });
          }
      }
    }
  }, [locations, loading]);

  return (
    <section style={{ padding: "100px 24px", background: "#fff", overflow: "hidden" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "1000px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Our Network</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, marginTop: "10px", color: "#0f172a" }}>Visit Our Hubs</h2>
          <p style={{ color: "#64748b", fontSize: "16px", marginTop: "15px", maxWidth: "600px", margin: "15px auto 0" }}>
            Free & Open-Source Map: Find RoadMate partners and garages across the city without any API restrictions.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: "relative", borderRadius: "40px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.12)", border: "8px solid #fff", background: "#f0f0f0" }}
        >
          {loading ? (
            <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "15px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #ddd", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 600 }}>Locating our partners...</p>
            </div>
          ) : (
            <div id="leaflet-map" style={{ height: "550px", width: "100%", zIndex: 1 }} />
          )}

          <style>
              {`
                  @keyframes spin { to { transform: rotate(360deg); } }
                  .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 0 !important; }
                  .leaflet-popup-content { margin: 12px !important; line-height: 1.4 !important; }
                  .leaflet-container { font-family: 'Inter', sans-serif !important; }
              `}
          </style>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
