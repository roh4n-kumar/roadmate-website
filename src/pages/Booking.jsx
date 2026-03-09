import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Old Booking page — redirect to home so user fills search form
const Booking = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/", { replace: true }); }, [navigate]);
  return null;
};

export default Booking;