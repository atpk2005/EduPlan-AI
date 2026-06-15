/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Timer, 
  BrainCircuit, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  RotateCcw
} from "lucide-react";
import { motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#0c0f12] min-h-screen text-slate-100 selection:bg-brand-500/35 overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-4 max-w-7xl mx-auto flex flex-col justify-center items-center text-center">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-emerald-500/10 blur-[90px] md:blur-[140px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Powered by Gemini 2.0 Enterprise AI</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl md:text-6.5xl font-medium tracking-tight text-white max-w-4xl leading-tight"
        >
          Convert Your Syllabus into a <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-500 font-bold decoration-emerald-500">
            Personalized AI Academic Roadmap
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed font-sans"
        >
          Stop stress-cramming. EduPlan AI auto-categorizes subjects, sets up spaced repetition schedules, handles Pomodoro tasks, and limits study fatigue dynamically.
        </motion.p>

        {/* Actions Button Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 border border-emerald-500/30 font-sans"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-slate-800 hover:bg-slate-700/80 text-white rounded-xl text-sm font-medium border border-slate-700/80 transition-colors font-sans hover:text-emerald-400"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Minimal Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 pt-10 border-t border-slate-800/85 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-slate-400 text-xs font-mono"
        >
          <div>
            <span className="block text-2xl font-semibold text-white mb-1">94%</span>
            <span>STRESS DECREASE RATE</span>
          </div>
          <div>
            <span className="block text-2xl font-semibold text-white mb-1">10x</span>
            <span>FASTER PLAN GENERATION</span>
          </div>
          <div>
            <span className="block text-2xl font-semibold text-white mb-1">4.9/5</span>
            <span>STUDENT REVIEWS SCORE</span>
          </div>
          <div>
            <span className="block text-2xl font-semibold text-white mb-1">2.4 Mil+</span>
            <span>FOCUS HOURS RECORDED</span>
          </div>
        </motion.div>
      </section>

      {/* 2. VALUE PROPOSITION: BENTO GRID FEATURES */}
      <section className="py-20 bg-slate-950/40 border-y border-slate-900/60" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-emerald-500 font-mono uppercase tracking-wider mb-2">
              Deep Architectural Features
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
              Combines Google Calendar, Notion & Duolingo in ONE Complete Hub
            </h3>
            <p className="mt-4 text-slate-400 text-sm sm:text-base font-sans">
              No multiple tools needed. Get a centralized environment containing real-time adaptive plan engines, motivation badges, and physical burnout limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: AI Roadmap */}
            <div className="p-8 bg-[#0d1013] border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-emerald-500" />
                </div>
                <h4 className="text-lg font-sans font-medium text-white">
                  1-Click AI Roadmap Generator
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Paste exam timelines, course subjects, and confidence ratings. The system automatically prioritize high-weightage topics and maps them directly to daily slots.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <span>Gemini API Optimized</span>
                <Sparkles className="h-3 w-3" />
              </div>
            </div>

            {/* Bento Card 2: Spaced Repetition */}
            <div className="p-8 bg-[#0d1013] border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-emerald-500" />
                </div>
                <h4 className="text-lg font-sans font-medium text-white">
                  Spaced Repetitive Revisions
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  The software automatically triggers mini revision tasks exactly at Day +1, +3, +7, and +14 intervals to maximize cerebral retention and protect your memory.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <span>Memory curve protection</span>
                <CheckCircle className="h-3 w-3" />
              </div>
            </div>

            {/* Bento Card 3: Pomodoro timer */}
            <div className="p-8 bg-[#0d1013] border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Timer className="h-5 w-5 text-emerald-500" />
                </div>
                <h4 className="text-lg font-sans font-medium text-white">
                  Integrated Focus Pomodoro
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Custom interval structures (e.g. 25/5 or 50/10) directly tied to your syllabus targets. Records exact focus duration values to your global profile.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <span>Gamified focus blocks</span>
                <TrendingUp className="h-3 w-3" />
              </div>
            </div>

            {/* Bento Card 4: Burnout mitigation */}
            <div className="md:col-span-2 p-8 bg-gradient-to-br from-[#0d1013] via-[#0d1013] to-[#121c16]/30 border border-slate-800/85 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-sans font-medium text-white">
                    Daily Biometric Burnout Mitigation
                  </h4>
                  <p className="text-sm text-slate-450 leading-relaxed font-sans">
                    Log your cognitive energy state values everyday (Okay, Tired, Burnout, High). The scheduler automatically scales down the study load, pushes back tasks, or flags rest breaks.
                  </p>
                </div>
                <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-xs text-rose-450 font-mono font-bold tracking-widest block mb-2 uppercase">▼ ENERGY ALERT</span>
                  <div className="text-xl font-display font-medium text-white">"TIRED ENERGY DETECTED"</div>
                  <p className="text-xs text-slate-400 mt-1 font-sans">EduPlan AI just auto-rescheduled 2 DBMS revision tasks and expanded break times by 15 mins.</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <span>Adaptive scheduler controls</span>
                <ShieldCheck className="h-3 w-3" />
              </div>
            </div>

            {/* Bento Card 5: Preloaded syllabus */}
            <div className="p-8 bg-[#0d1013] border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-emerald-500/25 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                </div>
                <h4 className="text-lg font-sans font-medium text-white">
                  Preloaded Syllabus Library
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Select your university, course, and semester. The application auto-fetches Operating Systems, Mathematics, and Computer Networks subjects instantly without coding configuration.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <span>RGPV, College & School compliant</span>
                <UserCheck className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS INTERACTIVE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider mb-2">
            Interactive Onboarding Matrix
          </h2>
          <h3 className="text-2xl sm:text-3xl font-display font-medium text-white">
            Setup Your Customized Plan in Four Easy Steps
          </h3>
          <p className="mt-4 text-slate-400 text-sm font-sans">
            EduPlan AI creates an intelligent setup perfectly personalized to your current career stage, exam metrics, and routine limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-8 right-8 h-[1px] bg-slate-800 -z-10" />

          {/* Step 1 */}
          <div className="space-y-4 bg-slate-900/20 p-6 border border-slate-800/40 rounded-xl relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-semibold text-emerald-400 font-mono">
              01
            </div>
            <h4 className="font-sans font-medium text-white">1. Secure Account</h4>
            <p className="text-xs text-slate-405 leading-relaxed font-sans">
              Create an account using your email, password, or direct Google Auth connections.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 bg-slate-900/20 p-6 border border-slate-800/40 rounded-xl relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-semibold text-emerald-400 font-mono">
              02
            </div>
            <h4 className="font-sans font-medium text-white">2. Select Learner</h4>
            <p className="text-xs text-slate-450 leading-relaxed font-sans">
              Identify as School, College, Aspirant, Professional, or Self-Directed learner.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 bg-slate-900/20 p-6 border border-slate-800/40 rounded-xl relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-semibold text-emerald-400 font-mono">
              03
            </div>
            <h4 className="font-sans font-medium text-white">3. Setup Syllabus</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Provide target exam dates, customize days, or pre-load structured template courses.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-4 bg-slate-900/20 p-6 border border-slate-800/45 rounded-xl relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-semibold text-emerald-400 font-mono">
              04
            </div>
            <h4 className="font-sans font-medium text-white">4. Begin Studying</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Unlock your interactive dashboard, study on calendar timers, and ace your goals with zero stress!
            </p>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-slate-950/40 border-t border-slate-900" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-emerald-500 font-mono uppercase tracking-widest mb-1.5 block">
              SUPPORT PROTOCOLS
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-medium text-white">
              Got Questions? We Have Answers.
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-[#0e1114] border border-slate-805/80 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-2">
                What does Spaced Repetition revision mean?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Instead of cramming before exams, our software adds scheduled revision reminders exactly when your mind is prone to forget things (Day +1, +3, +7, and +14), allowing for natural memory retention.
              </p>
            </div>

            <div className="p-6 bg-[#0e1114] border border-slate-800/80 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-2">
                How does Daily Burnout mitigation function?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                If you flag yourself as "Tired" or "Burned Out", our system will automatically shift less urgent slots forward, extend rest times, and schedule lighter tasks like flashcards instead of deep reading blocks to keep you sane.
              </p>
            </div>

            <div className="p-6 bg-[#0e1114] border border-slate-800/80 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-2">
                Can I log in using my Google account?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Yes! We have full simulation Google authentication. You can sign up or sign in instantly with Google credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOR REGISTRATION */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="relative p-8 md:p-16 bg-gradient-to-br from-[#0c0f12] via-[#0d1511] to-[#122a1b]/40 border border-slate-800 rounded-3xl overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

          <h3 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Stop Stressing. Start Compiling Progress Today.
          </h3>
          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto font-sans">
            Ready to convert that terrifying syllabus into structured, digestible daily learning blocks? Create your customized profile in minutes.
          </p>

          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xl shadow-emerald-500/20"
            >
              <span>Build My Roadmap Now</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
