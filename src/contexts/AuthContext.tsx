import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "@/api";
import { User, UserRole, AuthState, RegisterUserData } from "@/types";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for stored token in localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      loadUser(storedToken);
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Load user from token
  const loadUser = async (token: string) => {
    try {
      const response = await userAPI.getMe();
      const userData = response.data.data.user;

      setAuthState({
        user: userData,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      localStorage.removeItem("token");

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please log in again.",
      });

      toast.error("Session expired. Please log in again.");
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.login({ email, password, role });
      const { token, data } = response.data;

      localStorage.setItem("token", token);

      setAuthState({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success("Logged in successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  const register = async (userData: RegisterUserData) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.register(userData);

      const { token, data } = response.data;

      // Registration successful - store token but redirect to login instead of auto-login
      localStorage.setItem("token", token);

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));

      toast.success("Registration successful! Please log in.");

      // After successful registration, redirect to login
      window.location.href = "/login";
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    toast.success("Logged out successfully!");
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
