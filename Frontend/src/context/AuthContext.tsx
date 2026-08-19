import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type User = {
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (
    accessToken: string,
    user?: { userId?: string; email?: string; firstName?: string; lastName?: string },
    refreshToken?: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: (token?: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const refreshUser = async (token?: string | null) => {
    const t = token ?? accessToken ?? localStorage.getItem("accessToken");

    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      const respUser = response.data?.user ?? response.data;

      console.log("responseUser: ", respUser);
      setUser({
        userId: respUser?.userId,
        email: respUser?.email,
        firstName: respUser?.firstName,
        lastName: respUser?.lastName,
      });
      setError(null);
    } catch (err: any) {
      console.error("refreshUser error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Unable to fetch user";
      setError(msg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
    refreshUser(token);
  }, []);

  const login = async (
  token: string,
  providedUser?: {
    userId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  },
  refreshToken?: string
) => {
  localStorage.setItem(
    "accessToken",
    token
  );

  if (refreshToken) {
    localStorage.setItem(
      "refreshToken",
      refreshToken
    );
  }

  setAccessToken(token);

  if (providedUser) {
    setUser({
      userId: providedUser.userId,
      email: providedUser.email,
      firstName: providedUser.firstName,
      lastName: providedUser.lastName,
    });
  }

  await refreshUser(token);

  navigate("/dashboard");
};

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setAccessToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, error, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
