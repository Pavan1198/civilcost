import React, { createContext, useContext, useState } from "react";

export interface User {
  name: string;
  email?: string;
  phone?: string;
  location: string;
  userType?: "household" | "architect";
}

type AuthMode = "login" | "signup";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  authModalOpen: boolean;
  authMode: AuthMode;
  analyzerOpen: boolean;
  openLogin: (onSuccess?: () => void) => void;
  openSignup: (onSuccess?: () => void) => void;
  closeAuth: () => void;
  login: (user: User) => void;
  logout: () => void;
  openAnalyzer: () => void;
  closeAnalyzer: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function withOptionalAction(action?: () => void) {
  return action ? () => action() : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [analyzerOpen, setAnalyzerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const openLogin = (onSuccess?: () => void) => {
    setAuthMode("login");
    setPendingAction(withOptionalAction(onSuccess));
    setAuthModalOpen(true);
  };

  const openSignup = (onSuccess?: () => void) => {
    setAuthMode("signup");
    setPendingAction(withOptionalAction(onSuccess));
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
    setPendingAction(null);
  };

  const login = (userData: User) => {
    const action = pendingAction;
    setUser(userData);
    setAuthModalOpen(false);
    setPendingAction(null);
    action?.();
  };

  const logout = () => {
    setUser(null);
    setAnalyzerOpen(false);
  };

  const openAnalyzer = () => {
    setAnalyzerOpen(true);
  };

  const closeAnalyzer = () => {
    setAnalyzerOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        authModalOpen,
        authMode,
        analyzerOpen,
        openLogin,
        openSignup,
        closeAuth,
        login,
        logout,
        openAnalyzer,
        closeAnalyzer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
