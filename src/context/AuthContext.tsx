/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthResponseData, LearnerType, UserProfile } from "../types";
import api from "../api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponseData) => void;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  saveOnboardingProfile: (profile: Omit<UserProfile, "id">) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and check for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("eduplan_token");
      if (savedToken) {
        setToken(savedToken);
        try {
          // Fetch real status from our endpoint to declare session clean
          const res = await api.get("/users/me");
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem("eduplan_token");
          }
        } catch (err) {
          console.error("Token verification failed, clearing active token.", err);
          localStorage.removeItem("eduplan_token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Update session credentials on state
  const login = (authData: AuthResponseData) => {
    localStorage.setItem("eduplan_token", authData.accessToken);
    setToken(authData.accessToken);
    
    // Partially initialize User state, then pull full profile synchronously
    refreshUser();
  };

  // Terminate credentials and wipe active storages safely
  const logout = () => {
    localStorage.removeItem("eduplan_token");
    setToken(null);
    setUser(null);
  };

  // Re-fetch clean session details from the container database
  const refreshUser = async (): Promise<User | null> => {
    try {
      const res = await api.get("/users/me");
      if (res.data && res.data.success) {
        setUser(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      console.error("Failed to query authenticated current user statistics:", err);
    }
    return null;
  };

  // Saves onboarding data and updates local React States
  const saveOnboardingProfile = async (profile: Omit<UserProfile, "id">): Promise<boolean> => {
    try {
      const res = await api.post("/users/profile", profile);
      if (res.data && res.data.success) {
        setUser(res.data.data);
        return true;
      }
    } catch (err) {
      console.error("Failed storing custom onboarding syllabus parameters:", err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshUser,
        saveOnboardingProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be consumed within an active AuthProvider scope.");
  }
  return context;
};
