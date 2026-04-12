import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { bookingId, amount, userId } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ message: "Booking ID and Amount are required" });
  }

  try {
    // 1. Initialize Razorpay
    // Note: On Vercel, use process.env instead of import.meta.env
    const instance = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder", 
      key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
    });

    // 2. [SECURITY] Fetch booking from Firestore to verify amount
    // In a production app, you would fetch the amount from Firestore here:
    // const booking = await getDoc(doc(db, "bookings", bookingId));
    // const realAmount = booking.data().total;
    // For now, we use the passed amount but multiply by 100 for Razorpay (paisa)
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paisa)
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    };

    const order = await instance.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
}
