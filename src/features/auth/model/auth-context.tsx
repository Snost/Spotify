"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
  isAuthed: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = useMemo<AuthState>(
    () => ({
      accessToken,
      setAccessToken,
      isAuthed: Boolean(accessToken),
    }),
    [accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
