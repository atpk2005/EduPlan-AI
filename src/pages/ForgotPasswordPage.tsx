/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { GraduationCap, Mail, Key, Lock, ArrowRight, ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type RecoveryStep = "REQUEST_EMAIL" | "ENTER_OTP_AND_RESET";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<RecoveryStep>("REQUEST_EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Phase 1: Request OTP passcode link
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage("Please enter your registered academic email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data && res.data.success) {
        setSuccessMessage("Simulated OTP passcode dispatched beautifully!");
        
        // Save simulated pin for easy developer sandbox checking
        if (res.data.otpDebug) {
          setDebugOtp(res.data.otpDebug);
        }
        
        // Transit to verification state
        setStep("ENTER_OTP_AND_RESET");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "User account not found with the specified email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: Verify custom PIN and install new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all verification input slots.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Choose a password with at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password entries do not match up. Verify mismatch.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { 
        otp, 
        newPassword 
      });

      if (res.data && res.data.success) {
        setSuccessMessage("Security keys reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Verification code is expired or invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f12] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans">
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-[#0d1013] border border-slate-800 rounded-2xl shadow-2xl relative block"
      >
        {/* Brand Banner */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-white justify-center">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <GraduationCap className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="font-display font-medium text-lg tracking-tight">EduPlan AI</span>
          </Link>
          <h2 className="mt-4 text-xl font-display font-medium text-white font-bold text-center">Trouble Logging In?</h2>
          <p className="mt-1 text-xs text-slate-450 font-sans">
            Specify credentials to rebuild secure profile credentials
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-start space-x-2 text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start space-x-2 text-xs">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sandbox Debug Code Notification */}
        {debugOtp && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl space-y-1.5 text-xs">
            <div className="font-mono font-bold tracking-wider text-[10px] text-amber-400 uppercase">
              ⚙️ Sandbox Email Dispatch Emulator
            </div>
            <p className="font-sans text-slate-300">
              Passcode pin dispatched to <span className="font-semibold text-emerald-400 font-mono">{email}</span> is:
            </p>
            <div className="text-center py-2 bg-slate-900 border border-slate-800 text-lg font-mono font-bold tracking-widest text-amber-400">
              {debugOtp}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "REQUEST_EMAIL" ? (
            <motion.form
              key="request-email"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleRequestOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                  Academic Email Address
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
                    placeholder="you@email.com"
                    className="block w-full pl-10 pr-4 py-3 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 font-sans transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Generate Reset Code</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-and-reset"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2 font-bold">
                  6-Digit Passage OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit Code"
                    className="block w-full pl-10 pr-4 py-3 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm tracking-widest font-mono text-center focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                  New Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Must be at least 6 characters"
                    className="block w-full pl-10 pr-4 py-3 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/35"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                  Verify Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="block w-full pl-10 pr-4 py-3 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Security Key</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("REQUEST_EMAIL")}
                className="w-full inline-flex items-center justify-center space-x-1 py-2 text-xs text-slate-550 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Go back to email step</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="pt-2 border-t border-slate-850 flex justify-center text-xs font-sans text-slate-450">
          <Link to="/login" className="inline-flex items-center space-x-1 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="h-3 w-3" />
            <span>Return to login panel</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
