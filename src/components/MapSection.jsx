import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const RED = "#be0d0d";
const H = "'Outfit', sans-serif";

const MapSection = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "locations"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (window.google) {
      setGoogleLoaded(true);
      return;
    }
    const script = document.createElement("script");
    // Note: The user should replace YOUR_API_KEY with their actual Google Maps API Key
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (googleLoaded && mapRef.current && locations.length > 0) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: locations[0].lat || 28.6139, lng: locations[0].lng || 77.2090 },
        zoom: 11,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }] },
          { "featureType": "administrative.country", "elementType": "geometry", "stylers": [{ "visibility": "on" }] },
          { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#a0a4a5" }] },
          { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#f5f5f5" }] },
          { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#e3eed3" }] },
          { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] },
          { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] },
          { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "boxShadow": "0 2px 4px rgba(0,0,0,0.1)" }] },
          { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#d3eafc" }] }
        ]
      });

      locations.forEach(loc => {
        const marker = new window.google.maps.Marker({
          position: { lat: Number(loc.lat), lng: Number(loc.lng) },
          map: map,
          title: loc.name,
          animation: window.google.maps.Animation.DROP,
          // Custom SVG Marker based on type
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: loc.type === "Garage" ? RED : "#4f46e5",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#fff",
            scale: 2,
            anchor: new window.google.maps.Point(12, 22),
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: 'Inter', sans-serif;">
              <h4 style="margin: 0; color: #0f172a; font-weight: 800;">${loc.name}</h4>
              <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">${loc.address}</p>
              <span style="display: inline-block; margin-top: 8px; padding: 3px 8px; border-radius: 6px; background: ${loc.type === 'Garage' ? 'rgba(190,13,13,0.1)' : 'rgba(79,70,229,0.1)'}; color: ${loc.type === 'Garage' ? RED : '#4f46e5'}; font-size: 9px; font-weight: 800; text-transform: uppercase;">${loc.type}</span>
            </div>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach(loc => bounds.extend({ lat: Number(loc.lat), lng: Number(loc.lng) }));
        map.fitBounds(bounds);
      }
    }
  }, [googleLoaded, locations]);

  return (
    <section style={{ padding: "100px 24px", background: "#fff", overflow: "hidden" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span style={{ color: RED, background: "rgba(190, 13, 13, 0.08)", padding: "8px 20px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.5px", display: "inline-block" }}>Our Network</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, fontFamily: H, marginTop: "10px", color: "#0f172a" }}>Visit Our Hubs</h2>
          <p style={{ color: "#64748b", fontSize: "16px", marginTop: "15px", maxWidth: "600px", margin: "15px auto 0" }}>
            Find RoadMate partners and our specialized garages across the city for a seamless pickup and maintenance experience.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", borderRadius: "40px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.12)", border: "8px solid #fff", background: "#f0f0f0" }}
        >
          {loading ? (
            <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "15px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #ddd", borderTop: `3px solid ${RED}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 600 }}>Locating our partners...</p>
            </div>
          ) : (
            <div ref={mapRef} style={{ height: "550px", width: "100%" }} />
          )}
          
          <style>
            {`
              @keyframes spin { to { transform: rotate(360deg); } }
              .gm-style-iw { border-radius: 16px !important; padding: 0 !important; }
              .gm-style-iw-d { overflow: hidden !important; }
              .gm-ui-hover-effect { top: 4px !important; right: 4px !important; }
            `}
          </style>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
