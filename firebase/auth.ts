import { 
    GoogleAuthProvider,
    signInWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    User,
    onAuthStateChanged,
 } from "firebase/auth";
 import { auth } from "./config"
 import { ensureUserProfile } from "@/services/FirestoreServices";

// signup email and password
 export async function signup( email: string, password:string ){

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        await ensureUserProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
        });
        return { user: userCredential.user, error: null }
    }
    catch (error: unknown){
        const message = error instanceof Error ? error.message: "An error occured";
        return { user: null, error: message}
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
        await ensureUserProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          });
        return { user: userCredential.user, error: null}
    }
    catch(error: unknown){
        const message = error instanceof Error ? error.message: "Please try again"
        return { user: null, error: message}
    }
 }

// google login 
export async function loginWithGoogle(idToken: string) {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);

        await ensureUserProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
          });
      
        return {user: userCredential.user, error: null}
    }
    catch (error: unknown){
        const message = error instanceof Error ? error.message : "Google sign-in failed"
        return { user: null, error: message}
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

