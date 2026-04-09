import { useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * useUserSync Hook
 * Ensures that every logged-in user has a professional Firestore document 
 * with modular maps (profile, verification, notification).
 */
export const useUserSync = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const snap = await getDoc(userRef);
          
          if (!snap.exists()) {
            console.log("Creating new professional user document for:", user.email);
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              createdAt: serverTimestamp(),
              
              // Modular Maps
              profile: {
                name: user.displayName || "",
                email: user.email || "",
                phone: "",
                dob: "",
                gender: "",
                city: "",
                pincode: "",
                address: "",
                avatar: user.photoURL || ""
              },
              
              verification: {
                status: "unverified", // unverified, pending, verified, rejected
                aadhaar: { number: "", status: "none", image: null },
                dl: { number: "", status: "none", image: null },
                selfie: { status: "none", image: null },
                updatedAt: null
              },
              
              notification: {
                lastSeen: serverTimestamp(),
                unreadCount: 0,
                messages: []
              }
            });
          }
        } catch (error) {
          console.error("Error syncing user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);
};
