import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const getEnv = (key: string, fallback: string) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyDjS-E3X2FbKqjppvmURO4KvDfKvKcqtlA"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "growup-dec3f.firebaseapp.com"),
  databaseURL: getEnv("VITE_FIREBASE_DATABASE_URL", "https://growup-dec3f-default-rtdb.asia-southeast1.firebasedatabase.app"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "growup-dec3f"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "growup-dec3f.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "600768981851"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:600768981851:web:752542e35d8fc19ce9487e"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "G-XB3TRFMYW3"),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
