
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDjS-E3X2FbKqjppvmURO4KvDfKvKcqtlA",
  authDomain: "growup-dec3f.firebaseapp.com",
  databaseURL: "https://growup-dec3f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "growup-dec3f",
  storageBucket: "growup-dec3f.firebasestorage.app",
  messagingSenderId: "600768981851",
  appId: "1:600768981851:web:752542e35d8fc19ce9487e",
  measurementId: "G-XB3TRFMYW3"
};
    
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);