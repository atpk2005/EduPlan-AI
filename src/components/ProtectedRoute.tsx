/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = true 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show a gorgeous, thematic space-themed onboarding loader during verification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0f12] flex flex-col justify-center items-center font-sans">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 text-sm text-slate-400 font-mono tracking-wider"
        >
          VERIFYING ACADEMIC COACH STATE...
        </motion.p>
      </div>
    );
  }

  // Redirect to sign in if completely unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to Onboarding setup if authentication exists but profile details are missing
  const completedOnboarding = !!user?.profile;
  if (requireOnboarding && !completedOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect fully setup users attempting to reach onboarding back to Dashboard
  if (completedOnboarding && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
