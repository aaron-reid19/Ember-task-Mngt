import { createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
 } from "firebase/auth";
 import { auth } from "./firebase"

// signup
 export async function signup( email: string, password:string ){

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        return { user: userCredential.user, error: null }
    }
    catch (error: unknown){
        const message = error instanceof Error ? error.message: "an error occured";
        return { user: null, error: message}
    }
 }

 //login
 export async function login( email: string, password:string ){

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return { user: userCredential.user, error: null}
    }
    catch(error: unknown){
        const message = error instanceof Error ? error.message: "Plese try again"
        return { user: null, error: message}
    }
 }

 //logout
 export async function logout(){
    try {
        await firebaseSignOut(auth)
        return {error: null}
    }catch(error:unknown){
        const message = error instanceof Error ? error.message: "Error logging out"
        return { error: message}
    }
 }

