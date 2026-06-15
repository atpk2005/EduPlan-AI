/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LearnerType } from "../types";
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Briefcase, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  School,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const OnboardingPage: React.FC = () => {
  const { saveOnboardingProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<LearnerType | null>(null);

  // Profile forms details state
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(3);
  
  // School Student Particulars
  const [schoolClass, setSchoolClass] = useState("Class 10");
  const [schoolBoard, setSchoolBoard] = useState("CBSE");
  const [schoolStream, setSchoolStream] = useState("Science");

  // College Student Particulars
  const [degree, setDegree] = useState("B.Tech");
  const [course, setCourse] = useState("Computer Science");
  const [university, setUniversity] = useState("RGPV State University");
  const [semester, setSemester] = useState(5);

  // Competitive Aspirant Particulars
  const [targetExam, setTargetExam] = useState("JEE Main");
  const [attemptYear, setAttemptYear] = useState(2027);

  // Working Professional Particulars
  const [certificationGoal, setCertificationGoal] = useState("AWS Certified Solutions Architect");

  // Self Learner Particulars
  const [learningGoal, setLearningGoal] = useState("Deep Learning & LLMs");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const learnerTypeCards = [
    {
      type: LearnerType.SCHOOL_STUDENT,
      title: "School Student",
      desc: "Preparing for Board Exams, Olympiads, or Daily Classes",
      icon: School,
      color: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/40",
      iconColor: "text-emerald-400"
    },
    {
      type: LearnerType.COLLEGE_STUDENT,
      title: "College Student",
      desc: "Managing Degree Coursework, Term Papers, and Semester Exams",
      icon: BookOpen,
      color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/40",
      iconColor: "text-blue-400"
    },
    {
      type: LearnerType.COMPETITIVE_ASPIRANT,
      title: "Competitive Aspirant",
      desc: "Preparing for Entrance Exams (JEE, NEET, UPSC, GATE, SAT)",
      icon: Target,
      color: "from-amber-500/10 to-amber-500/5 hover:border-amber-500/40",
      iconColor: "text-amber-400"
    },
    {
      type: LearnerType.WORKING_PROFESSIONAL,
      title: "Working Professional",
      desc: "Earning Certifications or Upskilling while Balancing Full-Time Job",
      icon: Briefcase,
      color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/40",
      iconColor: "text-purple-400"
    },
    {
      type: LearnerType.SELF_LEARNER,
      title: "Self Learner",
      desc: "Acquiring Specific Intellectual Skills, Languages, or Tech Concepts",
      icon: Lightbulb,
      color: "from-rose-500/10 to-rose-500/5 hover:border-rose-500/40",
      iconColor: "text-rose-400"
    }
  ];

  const handleSelectType = (type: LearnerType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBackButton = () => {
    setStep(1);
    setError(null);
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setIsLoading(true);
    setError(null);

    // Structure profile parameters to send to backend
    const payload: any = {
      learnerType: selectedType,
      dailyStudyHours,
    };

    switch (selectedType) {
      case LearnerType.SCHOOL_STUDENT:
        payload.schoolClass = schoolClass;
        payload.schoolBoard = schoolBoard;
        payload.schoolStream = schoolStream;
        break;
      case LearnerType.COLLEGE_STUDENT:
        payload.degree = degree;
        payload.course = course;
        payload.university = university;
        payload.semester = Number(semester);
        break;
      case LearnerType.COMPETITIVE_ASPIRANT:
        payload.targetExam = targetExam;
        payload.attemptYear = Number(attemptYear);
        break;
      case LearnerType.WORKING_PROFESSIONAL:
        payload.certificationGoal = certificationGoal;
        break;
      case LearnerType.SELF_LEARNER:
        payload.learningGoal = learningGoal;
        break;
    }

    const completed = await saveOnboardingProfile(payload);
    setIsLoading(false);

    if (completed) {
      navigate("/dashboard");
    } else {
      setError("Failed submitting profile details. Ensure target connection is alive.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f12] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Progress Line */}
      <div className="max-w-4xl w-full flex justify-between items-center mb-8 px-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
            <GraduationCap className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="font-display font-medium text-white text-sm">Onboarding Setup Wizard</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded-full ${step === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'}`}>01 Avatar</span>
          <span className="text-slate-600">&rarr;</span>
          <span className={`px-2.5 py-1 rounded-full ${step === 2 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'}`}>02 Particulars</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1-type-selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl w-full space-y-6 text-center"
          >
            <div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>STEP ONE</span>
              </span>
              <h2 className="mt-3 text-2xl font-display font-medium text-white tracking-tight">
                What kind of student are you?
              </h2>
              <p className="mt-1.5 text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                We personalize study plans, spaced intervals, and rest routines based on your educational profile.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
              {learnerTypeCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.type}
                    onClick={() => handleSelectType(card.type)}
                    className={`p-5 rounded-2xl bg-gradient-to-r text-left border border-slate-800 hover:border-slate-755 hover:shadow-xl transition-all duration-250 flex items-center space-x-4 cursor-pointer relative group ${card.color}`}
                  >
                    <div className={`p-3 bg-slate-900 border border-slate-800 rounded-xl group-hover:scale-105 transition-transform ${card.iconColor}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-sans font-medium text-white flex items-center space-x-1">
                        <span>{card.title}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">{card.desc}</p>
                    </div>
                    <div className="p-2 border border-slate-800 group-hover:border-slate-700 bg-slate-900 rounded-lg text-slate-400 group-hover:text-white transition-colors shrink-0">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2-fields-population"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md w-full p-8 bg-[#0d1013] border border-slate-800 rounded-2xl shadow-2xl relative"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-emerald-500 font-mono uppercase tracking-widest block mb-1">
                {selectedType?.replace("_", " ")} DETAILS
              </span>
              <h2 className="text-xl font-display font-medium text-white">Setup Profile Goals</h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Tell us about your courses to load academic templates
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-455 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Dynamic Profile Fields Form */}
            <form onSubmit={handleOnboardingSubmit} className="space-y-5" id="eduplan-onboarding-form">
              
              {/* Core Hours slider */}
              <div>
                <label className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                  <span>DAILY STUDY TARGET HOURS</span>
                  <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md font-mono text-xs inline-flex items-center space-x-1">
                    <Timer className="h-3.5 w-3.5" />
                    <span>{dailyStudyHours} hrs / day</span>
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer bg-slate-900 border border-slate-800 h-2 rounded-xl"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1 HR</span>
                  <span>6 HRS</span>
                  <span>12 HRS</span>
                </div>
              </div>

              {/* Dynamic Sections Based on selectedType */}
              {selectedType === LearnerType.SCHOOL_STUDENT && (
                <div className="space-y-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Class Name</label>
                    <input
                      type="text"
                      required
                      value={schoolClass}
                      onChange={(e) => setSchoolClass(e.target.value)}
                      placeholder="Class 10, Class 12, etc."
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Education Board</label>
                    <input
                      type="text"
                      required
                      value={schoolBoard}
                      onChange={(e) => setSchoolBoard(e.target.value)}
                      placeholder="CBSE, ICSE, IB, State Board"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Branch / Stream</label>
                    <input
                      type="text"
                      required
                      value={schoolStream}
                      onChange={(e) => setSchoolStream(e.target.value)}
                      placeholder="Science, Commerce, Arts, General"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>
              )}

              {selectedType === LearnerType.COLLEGE_STUDENT && (
                <div className="space-y-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Degree Program</label>
                    <input
                      type="text"
                      required
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="B.Tech, B.Sc, MBA, MBBS"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Major Course / Branch</label>
                    <input
                      type="text"
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Computer Science, Electronics, Finance"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">University Title</label>
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. RGPV, LNCT, VIT, Stanford"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Semester Index</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semValue) => (
                        <option key={semValue} value={semValue}>Semester {semValue}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedType === LearnerType.COMPETITIVE_ASPIRANT && (
                <div className="space-y-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Target Exam Goal</label>
                    <input
                      type="text"
                      required
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      placeholder="UPSC, JEE ADVANCED, SAT, GATE"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Target Attempt Year</label>
                    <select
                      value={attemptYear}
                      onChange={(e) => setAttemptYear(Number(e.target.value))}
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    >
                      {[2026, 2027, 2028, 2029, 2030].map((yearVal) => (
                        <option key={yearVal} value={yearVal}>Attempt Year {yearVal}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedType === LearnerType.WORKING_PROFESSIONAL && (
                <div className="space-y-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Upskilling / Certification Target</label>
                    <input
                      type="text"
                      required
                      value={certificationGoal}
                      onChange={(e) => setCertificationGoal(e.target.value)}
                      placeholder="e.g. AWS Architect, CFA Level 1, PMP"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>
              )}

              {selectedType === LearnerType.SELF_LEARNER && (
                <div className="space-y-4 pt-2 border-t border-slate-900">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">Aesthetic Learning Objective</label>
                    <input
                      type="text"
                      required
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      placeholder="Python AI Models, Learn German, WebDev"
                      className="block w-full px-4 py-2.5 bg-[#0a0c0e] border border-slate-800 rounded-xl text-slate-200 text-sm focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Action Panels */}
              <div className="flex space-x-3 mt-6 pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={handleBackButton}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Choose Other</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center space-x-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Onboarding</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
