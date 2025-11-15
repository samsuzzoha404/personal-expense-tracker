import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { auth, googleProvider } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || undefined,
          createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to login";
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
      // User state will be updated by onAuthStateChanged
    } catch (error: unknown) {
      console.error("Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to login with Google";
      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // User state will be updated by onAuthStateChanged
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sign up";
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      // User state will be updated by onAuthStateChanged
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to logout";
      throw new Error(errorMessage);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
