import { useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

const Home = ({ isDrawerOpen, setIsDrawerOpen }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="home-container" style={{ overflowX: "hidden" }}>
      <style>
        {`
          body::-webkit-scrollbar { display: none !important; }
          body { 
            -ms-overflow-style: none !important; 
            scrollbar-width: none !important; 
            margin: 0;
            padding: 0;
            background: #fff;
          }
        `}
      </style>

      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
        >
          <Hero
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ background: "#fff", minHeight: "100vh" }}
      >
        {/* Vehicle Cards yahan aayenge */}
      </motion.div>
    </div>
  );
};

export default Home;