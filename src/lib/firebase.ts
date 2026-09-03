// lib/firebase.ts - SERVER SAFE + CLIENT SAFE
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // update code 
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};
// fixing code 3 again change 
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth is browser-only (used by AuthContext / login). Initialising it on the
// server dragged browser persistence APIs into the serverless bundle, so it is
// now created lazily only in the browser. Server code only ever needs `db`.
export const auth =
  typeof window !== "undefined" ? getAuth(app) : (undefined as unknown as ReturnType<typeof getAuth>);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics ke ar top-level e import korbo na - crash er main karon oita chilo
export const getAnalyticsInstance = async () => {
  if (typeof window === "undefined") return null;
  const { isSupported, getAnalytics } = await import("firebase/analytics");
  const ok = await isSupported();
  return ok ? getAnalytics(app) : null;
};