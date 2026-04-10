import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "REMOVED_SECRET",
  authDomain: "roadmate-72830.firebaseapp.com",
  projectId: "roadmate-72830",
  storageBucket: "roadmate-72830.firebasestorage.app",
  messagingSenderId: "1062661041786",
  appId: "1:1062661041786:web:5b92f1c2730472bc3755c3",
  measurementId: "G-C3TS0N6HEF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ THIS LINE FIXES AUTO LOGOUT
setPersistence(auth, browserLocalPersistence);