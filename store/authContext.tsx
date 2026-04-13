import { createContext, ReactNode, useContext, useEffect, useState} from "react";
import { User } from "firebase/auth";
import { subscribeToAuth, login, signup, logout, loginWithGoogle} from "@/services/firebaseAuth";

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
            setLoading(false)
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
