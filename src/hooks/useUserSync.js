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
              email: user.email || "",
              name: user.displayName || "",
              phone: "",
              dob: "",
              gender: "",
              city: "",
              pincode: "",
              address: "",
              createdAt: serverTimestamp(),

              // Initial Verification Status (Flat structure for Admin Panel)
              dlStatus: "not_uploaded",
              aadhaarStatus: "not_uploaded",
              selfieStatus: "not_uploaded",
              
              // Modular Maps (Maintaining for Web App compatibility)
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
                status: "not_uploaded",
                aadhaar: { number: "", status: "not_uploaded", image: null },
                dl: { number: "", status: "not_uploaded", image: null },
                selfie: { status: "not_uploaded", image: null },
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
