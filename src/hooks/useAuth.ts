"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthChange, fetchAdminList, isAllowedDomain, signOut } from "@/lib/auth";
import React from "react";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email && isAllowedDomain(firebaseUser.email)) {
        setUser(firebaseUser);
        const admins = await fetchAdminList();
        setIsAdmin(admins.includes(firebaseUser.email));
      } else {
        if (firebaseUser && firebaseUser.email && !isAllowedDomain(firebaseUser.email)) {
          await signOut();
        }
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, isAdmin, loading, signOut: handleSignOut } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
