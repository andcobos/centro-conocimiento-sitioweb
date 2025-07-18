// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOP-DhjqzTulqWV68TiQEjB1lFgnwcWBk",
  authDomain: "bd-website-esen.firebaseapp.com",
  projectId: "bd-website-esen",
  storageBucket: "bd-website-esen.firebasestorage.app",
  messagingSenderId: "147595096088",
  appId: "1:147595096088:web:c07a98c3550f8364ecd36d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
