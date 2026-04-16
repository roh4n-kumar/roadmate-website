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

          // Custom Icon (Marker) - Perfectly Centered
          const createIcon = (color) => window.L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
                <div style="position: absolute; width: 30px; height: 30px; background: ${color}; opacity: 0.2; border-radius: 50%; animation: pulse 2s infinite;"></div>
                <div style="background: ${color}; width: 12px; height: 12px; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 10px rgba(0,0,0,0.3); z-index: 2;"></div>
              </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -5] // Aligns the tip exactly above the dot
          });

          const bounds = [];
          locations.forEach(loc => {
            const marker = window.L.marker([loc.lat, loc.lng], {
              icon: createIcon(loc.type === "Garage" ? RED : "#4f46e5")
            }).addTo(map);

            marker.bindPopup(`
              <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 180px;">
                <div style="margin-bottom: 8px;">
                  <span style="display: inline-block; padding: 3px 10px; border-radius: 6px; background: ${loc.type === 'Garage' ? 'rgba(190,13,13,0.1)' : 'rgba(79,70,229,0.1)'}; color: ${loc.type === 'Garage' ? RED : '#4f46e5'}; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">${loc.type}</span>
                </div>
                <div style="color: #0f172a; font-size: 16px; font-weight: 900; line-height: 1.2; margin-bottom: 6px; font-family: 'Outfit', sans-serif;">${loc.name}</div>
                <div style="font-size: 12px; color: #64748b; line-height: 1.4;">${loc.address}</div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0;">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" style="text-decoration: none; color: ${RED}; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 5px;">
                    Get Directions →
                  </a>
                </div>
              </div>
            `, {
              closeButton: false
            });
            bounds.push([loc.lat, loc.lng]);
          });

          if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [50, 50] });
          }
      }
    }
  }, [locations, loading]);

  return (
    <section style={{ padding: "40px 24px", background: "#ffffff", overflow: "hidden" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "1000px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Our Network</span>
          <h2 className="map-heading" style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, margin: "10px 0 0", color: "#0f172a", lineHeight: 1.1 }}>Visit Our Hubs</h2>
          <p style={{ color: "#64748b", fontSize: "16px", margin: "8px auto 0", maxWidth: "600px", lineHeight: 1.6 }}>
            Locate our nearest partner hubs and certified garages for a seamless pickup and support experience across the city.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: "relative", borderRadius: "40px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.06)", border: "2px solid #fff", background: "#f8f9fa" }}
        >
          {loading ? (
            <div style={{ height: "380px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "15px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #ddd", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 600 }}>Locating our partners...</p>
            </div>
          ) : (
            <div id="leaflet-map" style={{ height: "380px", width: "100%", zIndex: 1 }} />
          )}

          <style>
              {`
                  @media (max-width: 900px) {
                    #leaflet-map { height: 350px !important; }
                    .map-heading { font-size: 32px !important; }
                  }
                  @keyframes spin { to { transform: rotate(360deg); } }
                  @keyframes pulse {
                    0% { transform: scale(0.6); opacity: 0.6; }
                    100% { transform: scale(2.5); opacity: 0; }
                  }
                  .leaflet-popup-content-wrapper { 
                    border-radius: 20px !important; 
                    padding: 0 !important; 
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
                    border: 1px solid #f0f0f0 !important;
                  }
                  .leaflet-popup-tip { box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
                  .leaflet-popup-content { margin: 20px !important; line-height: 1.4 !important; }
                  .leaflet-container { font-family: 'Inter', sans-serif !important; background: #f8f9fa !important; }
                  .custom-div-icon { background: none !important; border: none !important; }
              `}
          </style>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
