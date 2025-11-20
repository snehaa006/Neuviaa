// firebaseNeuvia.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbfHizg62ZaJcM2R9VsJWF6v7yPPUU8DA",
  authDomain: "neuviaapp.firebaseapp.com",
  projectId: "neuviaapp",
  storageBucket: "neuviaapp.appspot.com",
  messagingSenderId: "311196864013",
  appId: "1:311196864013:web:424f90e7e7521f8ebf0f44",
  measurementId: "G-1PZVTVRXXP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Analytics (only works in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
export default app;
