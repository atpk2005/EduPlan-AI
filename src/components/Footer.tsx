/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GraduationCap, Github, Twitter, Linkedin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090b0d] border-t border-slate-800/80 pt-16 pb-8" id="eduplan-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand block */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-emerald-500" />
              <span className="font-display font-medium text-lg tracking-tight text-white">
                EduPlan <span className="text-emerald-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Dynamic system to convert any study syllabus into an interactive, stress-free learning roadmap with adaptive spaced repetition and real-time biometric burnout limits.
            </p>
            <div className="flex space-x-3 pt-2">
              <button className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer">
                <Github className="h-4 w-4" />
              </button>
              <button className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Module 1: Core Systems */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase">
              Core Accelerators
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-450 font-sans">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  AI Roadmap Generator
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Spaced Repetitive Revisions
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Active Pomodoro Engine
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Cognitive Burnout Loggers
                </Link>
              </li>
            </ul>
          </div>

          {/* Module 2: Audience targets */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase">
              Target Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-sans">
              <li>
                <span className="text-slate-400">School & College Semesters</span>
              </li>
              <li>
                <span className="text-slate-400">Competitive Exam Aspirants</span>
              </li>
              <li>
                <span className="text-slate-400">Working Certifications</span>
              </li>
              <li>
                <span className="text-slate-400">Active Self-Directed Learners</span>
              </li>
            </ul>
          </div>

          {/* Module 3: Security & Trust */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase">
              Security & Privacy
            </h4>
            <div className="p-4 bg-[#0d0f11] border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-200 font-mono">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>JWT SECURED APP</span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Database entries and password hashes are safely validated through standard JWT schemas & password-protected storage.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} EduPlan AI Corporation. All software rights protected.
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-300 transition-colors">Privacy Charter</span>
            <span>&middot;</span>
            <span className="hover:text-slate-300 transition-colors">Terms of Use</span>
            <span>&middot;</span>
            <span className="hover:text-slate-300 transition-colors">Contact Expert</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
