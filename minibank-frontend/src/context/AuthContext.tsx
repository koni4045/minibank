import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  accountId: string | null;
  login: (token: string, accountId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [accountId, setAccountId] = useState<string | null>(
    localStorage.getItem("accountId")
  );

  const login = (newToken: string, newAccountId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("accountId", newAccountId);
    setToken(newToken);
    setAccountId(newAccountId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountId");
    setToken(null);
    setAccountId(null);
  };

  return (
    <AuthContext.Provider value={{ token, accountId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}