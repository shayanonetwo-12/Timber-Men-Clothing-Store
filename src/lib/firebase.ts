// Firebase client initialisation.
// These values are publishable (client-side) Firebase config, safe in the bundle.
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyD9sBvyOxnBXQlEKb3m74IJRuBr4JAfquE",
  authDomain: "timber-clothing.firebaseapp.com",
  projectId: "timber-clothing",
  storageBucket: "timber-clothing.firebasestorage.app",
  messagingSenderId: "52785850900",
  appId: "1:52785850900:web:035f52e0722fd552e2d501",
  measurementId: "G-2684G0BBFT",
};

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Analytics is browser-only: it touches window/indexedDB, so it must never run
// during SSR. Call this from an effect after hydration.
export async function initFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return null;
  return getAnalytics(getFirebaseApp());
}
