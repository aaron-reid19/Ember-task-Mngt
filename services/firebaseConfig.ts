/**
 * Ember — Firebase Config
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D1
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - EXPO_PUBLIC_* env vars must be set in .env — Aaron — READY
 *
 * Notes:
 *   Bootstraps the Firebase app instance, Firestore db, and Auth client.
 *   Every other service in services/ imports `db` or `auth` from this file.
 *   // ! do not hardcode API keys here — only read from process.env
 *   // & see .env.example for required EXPO_PUBLIC_* keys
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export { app };
export const db = getFirestore(app);
export const auth = getAuth(app);
