/**
 * Ember — Firebase Auth Service
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D1, D2
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - firebaseConfig.ts: initialized `auth` instance — Aaron — READY
 *   - FirestoreServices.ensureUserProfile(): creates the user doc on first sign-in — Aaron — READY
 *
 * Notes:
 *   Wraps Firebase Auth sign-in / sign-up / sign-out / Google credential flows and
 *   maps Firebase error codes to human-friendly strings for the UI layer.
 *   // * friendlyError() keeps Kaley's screens free of raw Firebase error codes
 *   // & consumed by store/authContext.tsx — do not bypass the context
 */

import {
    GoogleAuthProvider,
    signInWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut as firebaseSignOut,
    User,
    onAuthStateChanged,
 } from "firebase/auth";
 import { auth } from "./firebaseConfig";
 import { ensureUserProfile } from "@/services/FirestoreServices";

/** Map Firebase error codes to user-friendly messages */
function friendlyError(error: unknown, fallback: string): string {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code: string }).code;
        switch (code) {
            case "auth/email-already-in-use":
                return "An account with this email already exists. Try signing in instead.";
            case "auth/invalid-email":
                return "That email address doesn't look right.";
            case "auth/weak-password":
                return "Password is too weak — use at least 6 characters.";
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                return "Incorrect email or password.";
            case "auth/too-many-requests":
                return "Too many attempts. Please wait a moment and try again.";
            case "auth/network-request-failed":
                return "Network error — check your connection and try again.";
        }
    }
    return fallback;
}

/** Best-effort profile sync — don't let Firestore failures block auth */
async function syncProfile(uid: string, data: { email: string | null; displayName: string | null; photoURL: string | null }) {
    try {
        await ensureUserProfile(uid, data);
    } catch {
        // Profile will be created on next login or app load
    }
}

// signup email and password
 export async function signup( email: string, password: string, displayName?: string ){

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );

        if (displayName) {
            await updateProfile(userCredential.user, { displayName });
        }

        await syncProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: displayName || userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
        });
        return { user: userCredential.user, error: null }
    }
    catch (error: unknown){
        // Account already exists (e.g. previous signup succeeded in Auth but
        // failed at the profile step) — sign them in instead of blocking.
        if (typeof error === "object" && error !== null && "code" in error
            && (error as { code: string }).code === "auth/email-already-in-use") {
            return login(email, password);
        }
        return { user: null, error: friendlyError(error, "Something went wrong. Please try again.")}
    }
 }

 //login email and password
 export async function login( email: string, password:string ){

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        await syncProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          });
        return { user: userCredential.user, error: null}
    }
    catch(error: unknown){
        return { user: null, error: friendlyError(error, "Incorrect email or password.")}
    }
 }

// google login
export async function loginWithGoogle(idToken: string) {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);

        await syncProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          });

        return {user: userCredential.user, error: null}
    }
    catch (error: unknown){
        return { user: null, error: friendlyError(error, "Google sign-in failed.")}
    }
}
 //logout
 export async function logout(){
    try {
        await firebaseSignOut(auth)
        return {error: null}
    }
    catch(error:unknown){
        const message = error instanceof Error ? error.message: "Error logging out"
        return { error: message}
    }
 }
 export function subscribeToAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
 }
