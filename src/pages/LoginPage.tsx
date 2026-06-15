/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { GraduationCap, Mail, Lock, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if session expired state was passed
  const isSessionExpired = searchParams.get("session_expired") === "true";

  // Active form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please supply both your email address and security password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.success) {
        login(res.data.data);
        
        // Dynamic router routing: If onboarding already finished redirects to dashboard, else onboarding
        if (res.data.data.completedOnboarding) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      } else {
        setErrorMessage(res.data.message || "Credential verification failed.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid credentials provided. Please double check.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated Google SSO Authentication
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);

    // Prompt with a realistic mock auth screen
    const defaultGoogleEmail = "tester.academic@gmail.com";
    const defaultGoogleName = "Test Academic User";

    const confirmAccount = window.confirm(
      `EduPlan AI is initiating Google Single Sign On.\n\nSign in as: ${defaultGoogleName} (${defaultGoogleEmail})?`
    );

    if (!confirmAccount) {
      setGoogleLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/google", {
        email: defaultGoogleEmail,
        name: defaultGoogleName,
      });

      if (res.data && res.data.success) {
        login(res.data.data);
        if (res.data.data.completedOnboarding) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Google single sign-on authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f12] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans">
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-[#0d1013] border border-slate-800/80 rounded-2xl shadow-2xl relative block"
      >
        {/* Brand Banner */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-white justify-center">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <GraduationCap className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="font-display font-medium text-lg tracking-tight">EduPlan AI</span>
          </Link>
          <h2 className="mt-4 text-xl font-display font-medium text-white">Welcome Back</h2>
          <p className="mt-1 text-xs text-slate-400 font-sans">
            Log in to continue building your personalized study routine
          </p>
        </div>

        {/* Dynamic Warning Banners */}
        {isSessionExpired && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-xl flex items-center space-x-2 text-xs font-mono">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
            <span>SESSION TIMED OUT. Please re-authenticate.</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start space-x-2 text-xs font-sans">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Log In Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5" id="eduplan-login-form">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
              Email Address / Account ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="block w-full pl-10 pr-4 py-3 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 font-sans transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                Security Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors font-sans"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 font-sans transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || googleLoading}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 font-sans cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In To Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-mono tracking-wider uppercase">or continues with</span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Google SSO Login Simulation */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || googleLoading}
          className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 hover:border-slate-700 transition-colors font-sans cursor-pointer disabled:opacity-55"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Continue with Google Academic Auth</span>
            </>
          )}
        </button>

        {/* Foot Action */}
        <p className="text-center text-xs text-slate-500 font-sans mt-4">
          Don't have an EduPlan account?{" "}
          <Link to="/register" className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
            Register for Free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
