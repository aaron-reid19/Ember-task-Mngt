/**
 * Ember — Auth Context
 * Layer: Data
 * Owner: Aaron
 * Task IDs: D2
 * Status: 🟢 READY
 *
 * Dependencies:
 *   - services/firebaseAuth.ts: login/signup/logout/subscribeToAuth — Aaron — READY
 *
 * Notes:
 *   Single source of truth for the current Firebase user across the app.
 *   Screens consume this via useAuth() — they must never call firebaseAuth
 *   directly. Loading stays true until the first onAuthStateChanged fires.
 *   // * subscribeToAuth is wired in useEffect with cleanup — do not duplicate
 *   // & used by app/_layout.tsx for the gated onboarding/auth redirect
 */

import { createContext, ReactNode, useContext, useEffect, useState} from "react";
import { User } from "firebase/auth";
import { subscribeToAuth, login, signup, logout, loginWithGoogle} from "@/services/firebaseAuth";
import { migrateTasksToQuests } from "@/services/FirestoreServices";
import { AsyncStorageService } from "@/services/AsyncStorageService";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: typeof login;
    signup: typeof signup;
    logout: typeof logout;
    loginWithGoogle: typeof loginWithGoogle;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: {children: ReactNode}) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(()=>{
        const unsubscribe = subscribeToAuth((currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // * one-time tasks → quests migration per user
            // & see migrateTasksToQuests in FirestoreServices — runs once then flags AsyncStorage
            if (currentUser) {
                (async () => {
                    const already = await AsyncStorageService.hasMigratedTasks(currentUser.uid);
                    if (already) return;
                    try {
                        const count = await migrateTasksToQuests(currentUser.uid);
                        if (count > 0) {
                            console.log(`[Ember] migrated ${count} legacy tasks → quests`);
                        }
                    } catch (error) {
                        console.error("[Ember] tasks→quests migration failed:", error);
                    } finally {
                        await AsyncStorageService.markTasksMigrated(currentUser.uid);
                    }
                })();
            }
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{user,loading, login, signup, logout, loginWithGoogle}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    return context;
}
