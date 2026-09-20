import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthUser, DEMO_AUTH_MODE } from '../types/auth';
import {
  getDemoCurrentSession,
  registerDemoUser,
  loginDemoUser,
  logoutDemoUser,
} from '../services/demoAuthStorage';

interface AuthContextType {
  currentUser: AuthUser | User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (DEMO_AUTH_MODE) {
      // Restore local demo session from localStorage on load / refresh
      const session = getDemoCurrentSession();
      setCurrentUser(session);
      setLoading(false);
      return;
    }

    // Standard Firebase onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => {
    setAuthError(null);
  };

  const getFriendlyErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/user-not-found':
          return 'No user account found with this email.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
          return 'Invalid email or password. Please check your credentials.';
        case 'auth/email-already-in-use':
          return 'An account already exists with this email address.';
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection and try again.';
        case 'auth/too-many-requests':
          return 'Access temporarily blocked due to many failed attempts. Try again later.';
        default:
          return (error as { message?: string }).message || 'Authentication failed. Please try again.';
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const login = async (email: string, password: string) => {
    setAuthError(null);

    if (DEMO_AUTH_MODE) {
      try {
        const user = loginDemoUser(email, password);
        setCurrentUser(user);
        return;
      } catch (err) {
        const msg = getFriendlyErrorMessage(err);
        setAuthError(msg);
        throw new Error(msg);
      }
    }

    // Firebase Auth login
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthError(null);

    if (DEMO_AUTH_MODE) {
      try {
        const user = registerDemoUser(name, email, password);
        setCurrentUser(user);
        return;
      } catch (err) {
        const msg = getFriendlyErrorMessage(err);
        setAuthError(msg);
        throw new Error(msg);
      }
    }

    // Firebase Auth registration
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (userCredential.user && name.trim()) {
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
        });
        setCurrentUser({ ...userCredential.user, displayName: name.trim() });
      }
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setAuthError(null);

    if (DEMO_AUTH_MODE) {
      logoutDemoUser();
      setCurrentUser(null);
      return;
    }

    // Firebase Auth sign-out
    try {
      await signOut(auth);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        authError,
        clearError,
        isDemoMode: DEMO_AUTH_MODE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

