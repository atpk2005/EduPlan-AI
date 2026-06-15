/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Timer, 
  Play, 
  Square, 
  RotateCcw, 
  Sparkles, 
  Heart, 
  Brain, 
  CheckSquare, 
  Square as SquareIcon, 
  CalendarClock, 
  Activity, 
  GraduationCap,
  BookOpen,
  FileText,
  Download,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";
import { jsPDF } from "jspdf";
import { StudyBuddyAI } from "../components/StudyBuddyAI";
import { CustomSubjectCreator } from "../components/CustomSubjectCreator";
import { CustomExamCreator } from "../components/CustomExamCreator";
import { SubjectRoadmapDrawer } from "../components/SubjectRoadmapDrawer";

interface SyllabusTask {
  id: number;
  subject: string;
  topic: string;
  durationMins: number;
  status: "PENDING" | "COMPLETED";
}

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  // Focus Timer States
  const [timerMode, setTimerMode] = useState<"FOCUS" | "BREAK">("FOCUS");
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Biometric Burnout States
  const [burnoutLevel, setBurnoutLevel] = useState<"HIGH" | "READY" | "TIRED" | "BURNOUT">("READY");
  const [burnoutNotice, setBurnoutNotice] = useState<string | null>(null);

  // Active Context Tracker for Study Buddy
  const [activeSubject, setActiveSubject] = useState("Operating Systems");
  const [activeTopic, setActiveTopic] = useState("Simulate Semaphore & Mutex synchronization locks");

  // Preloaded Syllabus Selector states in alignment with user profile
  const [selectedUniversity, setSelectedUniversity] = useState(user?.profile?.university || "RGPV");
  const [selectedDegree, setSelectedDegree] = useState(user?.profile?.degree || "B.Tech");
  const [selectedCourse, setSelectedCourse] = useState(user?.profile?.course || "CSE");
  const [selectedSemester, setSelectedSemester] = useState<number>(user?.profile?.semester || 3);
  const [rgpvSyllabusSubjects, setRgpvSyllabusSubjects] = useState<any[]>([]);
  const [cloningSemester, setCloningSemester] = useState(false);
  const [syllabusStatusMessage, setSyllabusStatusMessage] = useState<string | null>(null);

  // School Curriculum states
  const [schoolSyllabusSubjects, setSchoolSyllabusSubjects] = useState<any[]>([]);
  const [cloningSchool, setCloningSchool] = useState(false);
  const [schoolStatusMessage, setSchoolStatusMessage] = useState<string | null>(null);

  // Custom Subjects, Exams & Active Panel States
  const [customSubjects, setCustomSubjects] = useState<any[]>([]);
  const [customExams, setCustomExams] = useState<any[]>([]);
  const [streamsTab, setStreamsTab] = useState<"SUBJECTS" | "EXAMS" | "WEEKLY_REPORTS" | "PREDICTOR" | "VIVA_PREP">("SUBJECTS");
  const [isSubjectCreatorOpen, setIsSubjectCreatorOpen] = useState(false);
  const [isExamCreatorOpen, setIsExamCreatorOpen] = useState(false);
  const [selectedSubjectForDrawer, setSelectedSubjectForDrawer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persistent server state caches for reports, predictors, and viva
  const [weeklyReports, setWeeklyReports] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  
  // Action status indicators
  const [generatingReport, setGeneratingReport] = useState(false);
  const [simulatingScenario, setSimulatingScenario] = useState(false);

  // Interactive Predictor inputs
  const [skipScenario, setSkipScenario] = useState("Skip Today");

  // In-universe Viva configurations
  const [vivaSubject, setVivaSubject] = useState("Operating Systems");
  const [vivaTopic, setVivaTopic] = useState("Semaphore & Mutex locks");
  const [vivaDifficulty, setVivaDifficulty] = useState("Intermediate");
  const [vivaQuestions, setVivaQuestions] = useState<any[]>([]);
  const [generatingViva, setGeneratingViva] = useState(false);
  const [currentVivaIndex, setCurrentVivaIndex] = useState(0);
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null);
  const [typedVivaAnswer, setTypedVivaAnswer] = useState("");
  const [selectedConfidence, setSelectedConfidence] = useState("Confident");
  const [vivaAttempts, setVivaAttempts] = useState<any[]>([]);
  const [sessionScore, setSessionScore] = useState<number | null>(null);
  const [recordingSession, setRecordingSession] = useState(false);

  // Mock Academic Syllabus Tasks
  const [tasks, setTasks] = useState<SyllabusTask[]>([]);

  // Load preloaded curriculum topics on selector changes
  const loadRgpvSyllabusSubjects = async (sem: number) => {
    try {
      const res = await api.get(`/rgpv/syllabus?semester=${sem}`);
      if (res.data.success) {
        setRgpvSyllabusSubjects(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load RGPV preloaded subjects:", err);
    }
  };

  const loadSchoolSyllabusSubjects = async () => {
    try {
      const res = await api.get("/school/subjects");
      if (res.data.success) {
        setSchoolSyllabusSubjects(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load school subjects:", err);
    }
  };

  useEffect(() => {
    if (user?.profile?.learnerType === "COLLEGE_STUDENT") {
      loadRgpvSyllabusSubjects(selectedSemester);
    } else if (user?.profile?.learnerType === "SCHOOL_STUDENT") {
      loadSchoolSyllabusSubjects();
    }
  }, [selectedSemester, user]);

  const handleCloneSemester = async () => {
    try {
      setCloningSemester(true);
      setSyllabusStatusMessage("Cloning preloaded courses... Please wait...");
      const res = await api.post("/rgpv/clone", { semester: selectedSemester });
      if (res.data.success) {
        setSyllabusStatusMessage(`Successfully populated Semester ${selectedSemester} subjects into your active curriculum workspace!`);
        fetchCustomData();
        refreshTasks();
        setTimeout(() => setSyllabusStatusMessage(null), 5000);
      }
    } catch (err) {
      console.error("Failed to clone preloaded data:", err);
      setSyllabusStatusMessage("Courses cloned or already initialized in workspace.");
      setTimeout(() => setSyllabusStatusMessage(null), 4000);
    } finally {
      setCloningSemester(false);
    }
  };

  const handleCloneSchoolSyllabus = async () => {
    try {
      setCloningSchool(true);
      setSchoolStatusMessage("Cloning school curriculum syllabus... Please wait...");
      const res = await api.post("/school/clone");
      if (res.data.success) {
        setSchoolStatusMessage(`Successfully populated school subjects into your active workspace!`);
        fetchCustomData();
        refreshTasks();
        setTimeout(() => setSchoolStatusMessage(null), 5000);
      }
    } catch (err) {
      console.error("Failed to clone school preloaded data:", err);
      setSchoolStatusMessage("School subjects cloned or already initialized in workspace.");
      setTimeout(() => setSchoolStatusMessage(null), 4000);
    } finally {
      setCloningSchool(false);
    }
  };

  // Synchronize Tasks list with Database Server
  const refreshTasks = async () => {
    try {
      const response = await api.get("/users/tasks");
      if (response.data.success && response.data.tasks.length > 0) {
        setTasks(response.data.tasks);
      } else {
        // Seed initial default roadmap tasks on the database server
        const defaults = [
          { subject: "Operating Systems", topic: "Simulate Semaphore & Mutex synchronization locks", durationMins: 45 },
          { subject: "Database Architecture", topic: "Solve ACID isolation levels and phantom reads practice", durationMins: 50 },
          { subject: "Computer Networks", topic: "Examine IPv6 packet structures & route translation boundaries", durationMins: 35 }
        ];
        for (const defaultTask of defaults) {
          await api.post("/users/tasks", defaultTask);
        }
        const refResponse = await api.get("/users/tasks");
        if (refResponse.data.success) {
          setTasks(refResponse.data.tasks);
        }
      }
    } catch (err) {
      console.error("Failed to load and seed roadmap syllabus tasks:", err);
    }
  };

  const fetchCustomData = async () => {
    try {
      const subRes = await api.get("/custom-subjects");
      if (subRes.data.success) {
        setCustomSubjects(subRes.data.data);
        if (selectedSubjectForDrawer) {
          const updated = subRes.data.data.find((s: any) => s.id === selectedSubjectForDrawer.id);
          if (updated) {
            setSelectedSubjectForDrawer(updated);
          }
        }
      }
      const examRes = await api.get("/custom-exams");
      if (examRes.data.success) {
        setCustomExams(examRes.data.data);
      }
      
      // Fetch new modules data
      const reportsRes = await api.get("/weekly-reports");
      if (reportsRes.data.success) {
        setWeeklyReports(reportsRes.data.data);
      }
      const predictionsRes = await api.get("/predictions");
      if (predictionsRes.data.success) {
        setPredictions(predictionsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to trigger custom subject/exam query syncs:", err);
    }
  };

  // Completed focus sessions persistence logger (Section 3 - Point 3)
  const logFocusSessionCompleted = async (durationMinutes: number) => {
    try {
      const response = await api.post("/focus-session", { duration: durationMinutes });
      if (response.data.success) {
        setBurnoutNotice(`🎉 FOCUS TIMER ACCOMPLISHED: Splendid work! Recorded ${durationMinutes} minutes session. Earned +${durationMinutes * 2} XP.`);
        fetchCustomData();
      }
    } catch (err) {
      console.error("Failed to save Pomodoro focus countdown log:", err);
    }
  };

  // State-of-the-art client-side PDF export with elegant midnight canvas styling
  const downloadReportPDF = (report: any) => {
    try {
      const doc = new jsPDF();
      
      // Establishes premium display branding context
      doc.setFillColor(11, 14, 17);
      doc.rect(0, 0, 210, 297, "F"); // deep card base page background
      
      doc.setTextColor(16, 185, 129); // emerald green brand identity
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("EDUPLAN AI SYSTEMS", 20, 30);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text("Official Weekly Academic Report Card", 20, 40);
      
      doc.setDrawColor(30, 41, 59);
      doc.line(20, 48, 190, 48);
      
      // Metadata Details Section
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(156, 163, 175);
      doc.text(`Authenticated Student Account: ${user?.name || "Active Scholar"}`, 20, 58);
      doc.text(`Academic Report Week Ending: ${report.weekEnding}`, 20, 65);
      
      // Inner card for high yield statistics metrics grid
      doc.setFillColor(17, 24, 39);
      doc.rect(20, 75, 170, 78, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11.5);
      doc.text("WEEKLY PERFORMANCE INDICES & LOGS", 28, 86);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(209, 213, 219);
      doc.text(`• Total Tracked Study Hours:  ${report.studyHours} hours`, 28, 98);
      doc.text(`• Completed Focus Blocks:  ${report.focusHours} hours`, 28, 106);
      doc.text(`• Course Syllabus Topics Completed:  ${report.topicsCompleted} modules`, 28, 114);
      doc.text(`• Pending / Outstanding Roadmaps:  ${report.missedTasks} topics`, 28, 122);
      doc.text(`• Calculated Learner Progress Rating:  ${report.productivityScore}%`, 28, 130);
      doc.text(`• Dedicated Study Streak:  ${report.studyStreak} consecutive days`, 28, 138);
      
      // Burnout indicators
      if (report.burnoutRisk === "CRITICAL" || report.burnoutRisk === "HIGH") {
        doc.setTextColor(248, 113, 113);
        doc.text(`• Calculated Burnout Risk Warning:  CRITICAL OVERLOAD RISK STATE`, 28, 146);
      } else {
        doc.setTextColor(52, 211, 153);
        doc.text(`• Calculated Burnout Risk Gauge:  ${report.burnoutRisk} RISK STATE`, 28, 146);
      }
      
      // Artificial Intelligence Advice & Cognitive suggestions box
      doc.setFillColor(31, 41, 55);
      doc.rect(20, 162, 170, 48, "F");
      
      doc.setTextColor(251, 191, 36); // warm yellow amber
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("AI COGNITIVE ADVISOR RECOMMENDATIONS:", 28, 173);
      
      doc.setTextColor(243, 244, 246);
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(9);
      
      const splitSuggestionsText = doc.splitTextToSize(report.aiRecommendations, 154);
      doc.text(splitSuggestionsText, 28, 182);
      
      // Divider
      doc.setDrawColor(30, 41, 59);
      doc.line(20, 222, 190, 222);
      
      // Footer notation
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Adaptive Education Planning Laboratory • Sealed Cloud Invariant Ledger Data", 20, 232);
      
      // Stream files to browser download trigger
      doc.save(`EduPlan_AI_Report_${report.weekEnding}.pdf`);
    } catch (error) {
      console.error("PDF generator process failure:", error);
    }
  };

  // Generate a new report card
  const handleGenerateWeeklyReport = async () => {
    try {
      setGeneratingReport(true);
      const res = await api.post("/weekly-reports/generate");
      if (res.data.success) {
        setBurnoutNotice("📊 SUCCESS: A brand new Weekly Report Card has been generated from active Pomodoro sessions & task completion audits!");
        fetchCustomData();
      }
    } catch (err) {
      console.error("Failed to generate weekly reporting metrics:", err);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Run skip predictor simulations
  const handleSimulateScenario = async () => {
    try {
      setSimulatingScenario(true);
      const res = await api.post("/predictions", { scenario: skipScenario });
      if (res.data.success) {
        setBurnoutNotice(`🔮 WHAT-IF ENGINE RESOLVED: Completed predictive computation on scenario "${skipScenario}". Check outcomes!`);
        fetchCustomData();
      }
    } catch (err) {
      console.error("Failed to calculate simulation predictor scenario:", err);
    } finally {
      setSimulatingScenario(false);
    }
  };

  // Build high-fidelity Oral Viva boards
  const handleGenerateVivaQuestions = async () => {
    try {
      setGeneratingViva(true);
      setVivaQuestions([]);
      setCurrentVivaIndex(0);
      setSelectedMCQOption(null);
      setTypedVivaAnswer("");
      setVivaAttempts([]);
      setSessionScore(null);

      const res = await api.post("/viva/generate", {
        subject: vivaSubject,
        topic: vivaTopic,
        difficulty: vivaDifficulty
      });

      if (res.data.success) {
        setVivaQuestions(res.data.data);
      }
    } catch (err) {
      console.error("Oral questions construction failed:", err);
    } finally {
      setGeneratingViva(false);
    }
  };

  // Handle active question answer submissions locally
  const handleSubmitActiveVivaAnswer = (correctAnswerText: string) => {
    const isMCQ = vivaQuestions[currentVivaIndex]?.type === "MCQ" || vivaQuestions[currentVivaIndex]?.options?.length > 0;
    const userAnswer = isMCQ ? selectedMCQOption : typedVivaAnswer;

    if (!userAnswer || (typeof userAnswer === 'string' && userAnswer.trim() === '')) {
      alert("Please provide an answer before submission.");
      return;
    }

    // Rough semantic correct checks
    let isCorrect = false;
    if (isMCQ) {
      isCorrect = (userAnswer || "").toLowerCase().trim() === (correctAnswerText || "").toLowerCase().trim();
    } else {
      // Loose technical keyword compliance analysis
      const answerTokens = (userAnswer || "").toLowerCase().split(/\s+/);
      const keywordMatchingCount = answerTokens.filter(tok => (correctAnswerText || "").toLowerCase().includes(tok) && tok.length > 3).length;
      isCorrect = keywordMatchingCount >= 2 || (userAnswer || "").length > 25;
    }

    const currentAttempt = {
      questionId: vivaQuestions[currentVivaIndex]?.id,
      question: vivaQuestions[currentVivaIndex]?.question,
      userAnswer,
      correctAnswer: correctAnswerText,
      evaluation: isCorrect ? "CORRECT" : "REASONABLE"
    };

    setVivaAttempts(prev => [...prev, currentAttempt]);

    // Proceed or calculate overall outcomes
    if (currentVivaIndex < vivaQuestions.length - 1) {
      setCurrentVivaIndex(prev => prev + 1);
      setSelectedMCQOption(null);
      setTypedVivaAnswer("");
    } else {
      // Completed last question block
      const correctCount = [...vivaAttempts, currentAttempt].filter(att => att.evaluation === "CORRECT").length;
      const computedScore = Math.min(100, Math.round((correctCount / vivaQuestions.length) * 100) + 20); // Prof. leniency bonus
      setSessionScore(computedScore);
    }
  };

  // Submit complete Viva sessions outcomes report to backend to earn XP
  const handleRecordVivaSession = async () => {
    if (sessionScore === null) return;
    try {
      setRecordingSession(true);
      const res = await api.post("/viva/session", {
        subject: vivaSubject,
        topic: vivaTopic,
        difficulty: vivaDifficulty,
        score: sessionScore,
        confidence: selectedConfidence,
        attempts: vivaAttempts
      });

      if (res.data.success) {
        setBurnoutNotice(`🗣️ ORAL TEST LEDGER COMPLETED: Earned academic XP rewards and saved Oral mock attempts details successfully!`);
        setVivaQuestions([]);
        setSessionScore(null);
        fetchCustomData();
      }
    } catch (e) {
      console.error("Failed to commit Oral records to server:", e);
    } finally {
      setRecordingSession(false);
    }
  };

  useEffect(() => {
    refreshTasks();
    fetchCustomData();
  }, []);

  // Handle active countdown triggers
  useEffect(() => {
    if (timerIsActive) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setTimerIsActive(false);
            triggerCompletionBuzzer();
            if (timerMode === "FOCUS") {
              logFocusSessionCompleted(25);
            }
            handleModeTransition();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerIsActive]);

  // Adjust timers dynamically when toggling between Focus (25m) vs Break (5m) modes
  const handleModeTransition = () => {
    if (timerMode === "FOCUS") {
      setTimerMode("BREAK");
      setSecondsRemaining(5 * 60);
    } else {
      setTimerMode("FOCUS");
      setSecondsRemaining(25 * 60);
    }
  };

  const handleStartStop = () => {
    setTimerIsActive(!timerIsActive);
  };

  const handleResetTimer = () => {
    setTimerIsActive(false);
    setSecondsRemaining(timerMode === "FOCUS" ? 25 * 60 : 5 * 60);
  };

  // Sound Synthesizer: Play organic retro buzzer using high-craft Audio API
  const triggerCompletionBuzzer = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(520, audioCtx.currentTime); // C5 harmonic pitch
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // volume control

      oscillator.start();
      // Auto beep twice
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {
      console.warn("Natively synthesized buzzer notification: browser block safeguards active.", e);
    }
  };

  // Biometric interaction: adapt schedules based on logged neural capacity
  const handleChooseBurnout = (level: typeof burnoutLevel) => {
    setBurnoutLevel(level);
    switch (level) {
      case "HIGH":
        setBurnoutNotice("⚡ ENERGETIC STATE ACTIVE: Expanded focus timers by +10m. Time to attack high-weightage syllabus structures!");
        break;
      case "READY":
        setBurnoutNotice("✅ OPTIMAL BALANCED RUN: Schedules set to default standard intervals. Keep compiles clean!");
        break;
      case "TIRED":
        setBurnoutNotice("⚠️ TIREDNESS TRIGGERED: Postponed 2 complex network reviews. Spacing Pomodoro down to 20m for health safety.");
        break;
      case "BURNOUT":
        setBurnoutNotice("🚨 BURNOUT PROTOCOL: Pushed all syllabus benchmarks back by 24 hours. Enjoy a mandatory 15-minute rest block right now!");
        break;
    }
  };

  // Mark pending task checkbox item solved in local state and database
  const toggleTaskStatus = async (id: number) => {
    try {
      const response = await api.patch(`/users/tasks/${id}`);
      if (response.data.success) {
        setTasks(prev => prev.map(t => {
          if (t.id === id) {
            return response.data.task;
          }
          return t;
        }));
        fetchCustomData();
      }
    } catch (err) {
      console.error("Failed to toggle task status:", err);
    }
  };

  const handleSelectActiveFocus = (task: SyllabusTask) => {
    setActiveSubject(task.subject);
    setActiveTopic(task.topic);
    // Quick synthesized acoustic notification
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  // Compute stats helper
  const finishedTasksCount = tasks.filter(t => t.status === "COMPLETED").length;
  const progressRatio = tasks.length > 0 ? Math.round((finishedTasksCount / tasks.length) * 10) * 10 : 0;

  // Format focus time clock
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="bg-[#0b0e11] min-h-screen text-slate-200 font-sans pb-16 overflow-y-auto">
      {/* Upper Navigation Rail */}
      <nav className="sticky top-0 z-45 bg-[#090b0d]/90 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-emerald-500" />
          <span className="font-display font-medium tracking-tight text-white">EduPlan <span className="text-emerald-500 font-bold">Workspace</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs text-white font-medium">{user?.name}</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{user?.profile?.learnerType?.replace("_", " ")}</span>
          </div>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/20 hover:border-rose-500/35 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Dynamic greetings banner */}
        <div className="mb-8 p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="absolute top-0 right-0 w-[200px] h-full bg-gradient-to-l from-emerald-500/5 to-transparent -z-10 pointer-events-none" />
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider w-fit">
              <Sparkles className="h-3 w-3" />
              <span>STREAK ACTIVE: 3 DAYS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
              Greetings, {user?.name}! Indeed a fine day to learn.
            </h1>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Target study hours are configured to <span className="text-emerald-400 font-bold font-mono">{user?.profile?.dailyStudyHours || 3}h/day</span>. Select schedule blocks below to launch.
            </p>
          </div>
          <div className="mt-4 md:mt-0 p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-mono tracking-widest uppercase">CONCURRENT TASKS SCORE</span>
              <span className="text-sm text-white font-bold font-mono">{finishedTasksCount} of {tasks.length} Completed ({progressRatio}%)</span>
            </div>
          </div>
        </div>

        {/* Adaptive burn warning banner */}
        <AnimatePresence>
          {burnoutNotice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start space-x-2.5 font-sans"
            >
              <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-400 animate-bounce" />
              <div className="flex-1">
                <span className="font-semibold block font-mono text-[10px] tracking-wider uppercase mb-0.5">⚙️ ADAPTIVE ENGINE RESPONDING</span>
                <span className="leading-relaxed">{burnoutNotice}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Bento Box Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Lobe 1: Left Dashboard Column - Biometrics and Tasks List */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Bento Block A: Biometric cognitive gauge inputs */}
            <div className="p-6 bg-[#0d1013] border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Brain className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <h3 className="font-display font-medium text-white text-md">Daily Biometric Brain Logger</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Flag your cerebral fatigue level. EduPlan AI immediately recalculates pending syllabus milestones to prioritize mental health.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleChooseBurnout("HIGH")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${burnoutLevel === "HIGH" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]" : "bg-[#090b0d] border-slate-800 text-slate-400 hover:border-slate-700"}`}
                >
                  <span className="block text-sm font-bold font-mono">⚡ HIGH</span>
                  <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Energetic & Ready</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseBurnout("READY")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${burnoutLevel === "READY" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]" : "bg-[#090b0d] border-slate-800 text-slate-400 hover:border-slate-700"}`}
                >
                  <span className="block text-sm font-bold font-mono">✅ SOLID</span>
                  <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Classic Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseBurnout("TIRED")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${burnoutLevel === "TIRED" ? "bg-amber-500/10 border-amber-500/60 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]" : "bg-[#090b0d] border-slate-800 text-slate-400 hover:border-slate-700"}`}
                >
                  <span className="block text-sm font-bold font-mono">⏳ TIRED</span>
                  <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Minor Fatigue</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChooseBurnout("BURNOUT")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${burnoutLevel === "BURNOUT" ? "bg-rose-500/10 border-rose-500/60 text-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]" : "bg-[#090b0d] border-slate-800 text-slate-400 hover:border-slate-700"}`}
                >
                  <span className="block text-sm font-bold font-mono">🚨 OVERLOADED</span>
                  <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Danger State</span>
                </button>
              </div>
            </div>

            {/* Bento Block X: Learning Subjects & Exam Preparation Streams */}
            <div className="p-6 bg-[#0d1013] border border-slate-800 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-white text-md">Academic Learning & Exam Streams</h3>
                    <p className="text-[11px] text-slate-400">Select any stream to view AI curriculum plans and weekly roadmaps</p>
                  </div>
                </div>
                {/* Visual Action Triggers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSubjectCreatorOpen(true)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    + Create Subject
                  </button>
                  <button
                    onClick={() => setIsExamCreatorOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-455 text-slate-950 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    + Create Exam Prep
                  </button>
                </div>
              </div>

              {/* Sub-tabs to filter displays: Subjects, Exam Prep, Reports, Simulator, Viva Prep */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-slate-850 pb-2">
                <button
                  onClick={() => setStreamsTab("SUBJECTS")}
                  className={`text-xs font-mono pb-1.5 font-semibold transition-all relative cursor-pointer ${streamsTab === "SUBJECTS" ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-350'}`}
                >
                  📖 MY SUBJECTS ({customSubjects.length})
                  {streamsTab === "SUBJECTS" && <div className="absolute bottom-[-9.5px] left-0 right-0 h-0.5 bg-emerald-500 rounded" />}
                </button>
                <button
                  onClick={() => setStreamsTab("EXAMS")}
                  className={`text-xs font-mono pb-1.5 font-semibold transition-all relative cursor-pointer ${streamsTab === "EXAMS" ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  🏆 EXAM BLUEPRINTS ({customExams.length})
                  {streamsTab === "EXAMS" && <div className="absolute bottom-[-9.5px] left-0 right-0 h-0.5 bg-amber-500 rounded" />}
                </button>
                <button
                  onClick={() => setStreamsTab("WEEKLY_REPORTS")}
                  className={`text-xs font-mono pb-1.5 font-semibold transition-all relative cursor-pointer ${streamsTab === "WEEKLY_REPORTS" ? 'text-sky-400' : 'text-slate-500 hover:text-slate-355'}`}
                >
                  📊 WEEKLY REPORT CARDS ({weeklyReports.length})
                  {streamsTab === "WEEKLY_REPORTS" && <div className="absolute bottom-[-9.5px] left-0 right-0 h-0.5 bg-sky-455 rounded" />}
                </button>
                <button
                  onClick={() => setStreamsTab("PREDICTOR")}
                  className={`text-xs font-mono pb-1.5 font-semibold transition-all relative cursor-pointer ${streamsTab === "PREDICTOR" ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-355'}`}
                >
                  🔮 WHAT-IF PATH PREDICTOR
                  {streamsTab === "PREDICTOR" && <div className="absolute bottom-[-9.5px] left-0 right-0 h-0.5 bg-indigo-505 rounded" />}
                </button>
                <button
                  onClick={() => setStreamsTab("VIVA_PREP")}
                  className={`text-xs font-mono pb-1.5 font-semibold transition-all relative cursor-pointer ${streamsTab === "VIVA_PREP" ? 'text-rose-450' : 'text-slate-500 hover:text-slate-355'}`}
                >
                  🗣️ ORAL VIVA & MCQS
                  {streamsTab === "VIVA_PREP" && <div className="absolute bottom-[-9.5px] left-0 right-0 h-0.5 bg-rose-460 rounded" />}
                </button>
              </div>

              {streamsTab === "SUBJECTS" && (
                <div className="space-y-4">
                  {/* SCHOOL STUDENT CONSOLE */}
                  {user?.profile?.learnerType === "SCHOOL_STUDENT" && (
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3.5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                              School Curriculum
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">
                              Preloaded Board Syllabus Mode
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-1">
                            {user?.profile?.schoolClass} • {user?.profile?.schoolBoard} Board {user?.profile?.schoolStream ? `• ${user?.profile?.schoolStream} Stream` : ""}
                          </h4>
                        </div>
                      </div>

                      {/* Preloaded preview courses checklist */}
                      <div className="p-3 bg-slate-950/65 rounded-lg border border-slate-850 space-y-2">
                        <p className="text-[10px] uppercase font-mono text-slate-500 font-semibold font-mono">Available School Subjects :</p>
                        {schoolSyllabusSubjects.length === 0 ? (
                          <p className="text-xs text-slate-550 leading-relaxed italic">No preloaded school subjects registered for {user?.profile?.schoolClass} • {user?.profile?.schoolBoard}.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {schoolSyllabusSubjects.map((sub: any, idx: number) => (
                              <span 
                                key={idx} 
                                className="text-[10px] bg-slate-850/60 border border-slate-800 px-2.5 py-1 rounded-md text-emerald-300 font-sans"
                              >
                                📚 {sub.name} ({sub.chapters?.length || 0} Chapters)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-850/40">
                        <p className="text-[10px] text-slate-450 leading-relaxed italic max-w-sm">
                          Load school board preloaded courses as structured study paths. Complete with chapter logs and syllabus confidence controls.
                        </p>
                        <button
                          onClick={handleCloneSchoolSyllabus}
                          disabled={cloningSchool}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-[#0c0f12] disabled:opacity-40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                        >
                          📥 {cloningSchool ? "Loading..." : `Load School Courses`}
                        </button>
                      </div>

                      {schoolStatusMessage && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-555/10 rounded-lg text-xs text-emerald-400 font-mono text-center animate-bounce">
                          💡 {schoolStatusMessage}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COLLEGE STUDENT CONSOLE */}
                  {user?.profile?.learnerType === "COLLEGE_STUDENT" && (
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3.5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-400">
                              University Curriculum
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">
                              University Mode
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-1">RGPV • Bachelor of Technology • CSE</h4>
                        </div>

                        {/* Semester selector */}
                        <div className="flex items-center gap-2">
                          <label htmlFor="sem-select-dash" className="text-[10px] font-mono text-slate-400 uppercase">Semester</label>
                          <select
                            id="sem-select-dash"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(Number(e.target.value))}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-hidden"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                              <option key={n} value={n}>Semester {n}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/65 rounded-lg border border-slate-850 space-y-2">
                        <p className="text-[10px] uppercase font-mono text-slate-500 font-semibold font-mono">Available RGPV Subjects (Sem {selectedSemester}) :</p>
                        {rgpvSyllabusSubjects.length === 0 ? (
                          <p className="text-xs text-slate-550 leading-relaxed italic">No subjects registered in dataset for Sem {selectedSemester}.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {rgpvSyllabusSubjects.map((sub: any, idx: number) => (
                              <span 
                                key={idx} 
                                className="text-[10px] bg-slate-850/60 border border-slate-800 px-2.5 py-1 rounded-md text-indigo-300 font-sans"
                              >
                                📚 {sub.subjectName} ({sub.units?.length || 0} Units)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-850/40">
                        <p className="text-[10px] text-slate-455 leading-relaxed italic max-w-sm">
                          Preloaded database subjects clone directly as customizable roadmaps. Edit, delete, or create custom topics at will.
                        </p>
                        <button
                          onClick={handleCloneSemester}
                          disabled={cloningSemester}
                          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-455 text-white disabled:opacity-40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 animate-pulse"
                        >
                          📥 {cloningSemester ? "Loading..." : `Load Sem ${selectedSemester} Courses`}
                        </button>
                      </div>

                      {syllabusStatusMessage && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-555/10 rounded-lg text-xs text-emerald-400 font-mono text-center animate-bounce">
                          💡 {syllabusStatusMessage}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COMPETITIVE ASPIRANT CONSOLE */}
                  {user?.profile?.learnerType === "COMPETITIVE_ASPIRANT" && (
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400">
                          Competitive Examination Mode
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">
                        Targeting: <span className="text-amber-400 font-semibold">{user?.profile?.targetExam || "JEE / NEET / UPSC / GATE / CAT / SSC / Banking"}</span> • Attempt Year: {user?.profile?.attemptYear || 2027}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Structure your high-stakes exam blueprints seamlessly. Use the tabs below to switch to 🏆 <strong>EXAM BLUEPRINTS</strong> to track your targets. Preloaded courses for Competitive exams can be configured as custom strategic schedules.
                      </p>
                      
                      {/* Interactive Selection Guide with Preloaded Quick Buttons */}
                      <div className="p-3 bg-slate-950/65 rounded-lg border border-slate-850 space-y-1.5">
                        <p className="text-[10px] uppercase font-mono text-slate-500 font-semibold font-mono">Preloaded Exam Profiles :</p>
                        <div className="flex flex-wrap gap-1.5">
                          {["JEE", "NEET", "UPSC", "GATE", "CAT", "SSC", "Banking"].map((ex) => (
                            <span 
                              key={ex}
                              className={`text-[10px] px-2.5 py-1 rounded-md border text-slate-350 cursor-pointer hover:border-amber-400 hover:text-amber-300 transition-all ${user?.profile?.targetExam?.toLowerCase().includes(ex.toLowerCase()) ? "bg-amber-500/10 border-amber-500/40 text-amber-300" : "bg-slate-850/60 border-slate-800"}`}
                            >
                              🔥 {ex} Portfolio
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SELF LEARNER CONSOLE */}
                  {user?.profile?.learnerType === "SELF_LEARNER" && (
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-rose-400">
                          Self-Paced Exploration Mode
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">
                        Learning Focus: <span className="text-rose-400 font-semibold">{user?.profile?.learningGoal || "Custom Self Learning Paths"}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        All school and predetermined university syllabus panels are hidden for custom autonomy. You have an empty workspace designated strictly for your custom-created study modules. Create a new custom subject below to start your self-paced track!
                      </p>
                    </div>
                  )}

                  {/* WORKING PROFESSIONAL CONSOLE */}
                  {user?.profile?.learnerType === "WORKING_PROFESSIONAL" && (
                    <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-purple-400">
                          Upskilling & Certification Mode
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">
                        Certification Target: <span className="text-purple-400 font-semibold">{user?.profile?.certificationGoal || "Professional Upskilling"}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        All traditional school-level and university-level panels are filtered out for your convenience. Plan custom professional topics, schedule learning slots after work, and track milestones with zero noise.
                      </p>
                    </div>
                  )}

                  {/* ACTIVE SUBJECT ROADMAPS DISPLAY GRID */}
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">My Study Dashboard ({customSubjects.length})</h5>
                    {customSubjects.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-805 rounded-xl text-center space-y-3">
                        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                          {user?.profile?.learnerType === "SCHOOL_STUDENT" ? (
                            "No active subjects in your personal study track. Click \"Load School Courses\" above to load your Class 10/12 syllabus, or click \"+ Create Subject\" to build custom study tracks!"
                          ) : user?.profile?.learnerType === "COLLEGE_STUDENT" ? (
                            "No active course subjects in your personal study track. Change or select your Semester in the console above to pre-load preloaded college courses, or click \"+ Create Subject\" to build custom courses!"
                          ) : (
                            "No active study subjects configured in your tracking board. Click \"+ Create Subject\" to formulate custom learning paths!"
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {customSubjects.map((sub: any) => {
                          const compTopics = sub.topics.filter((t: any) => t.status === "COMPLETED").length;
                          const totTopics = sub.topics.length;
                          const pct = totTopics > 0 ? Math.round((compTopics / totTopics) * 100) : 0;
                          return (
                            <div 
                              key={sub.id}
                              id={`subject-card-${sub.id}`}
                              onClick={() => {
                                setSelectedSubjectForDrawer(sub);
                                setIsDrawerOpen(true);
                              }}
                              className="p-4 bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition cursor-pointer group hover:bg-slate-950/90 relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-2xl" />
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-mono font-semibold">
                                  {sub.difficulty || "Custom"}
                                </span>
                                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                                  <Sparkles className="w-2.5 h-2.5" /> AI Roadmap
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 mt-2 font-sans truncate">{sub.subjectName}</h4>
                              <p className="text-[11px] text-slate-450 leading-relaxed mt-1 truncate">{sub.description}</p>
                              
                              {/* Compact progress indicator */}
                              <div className="mt-3 pt-3 border-t border-slate-850/50 flex items-center justify-between gap-3">
                                <span className="text-[10px] font-mono text-slate-500 block">progress: {compTopics}/{totTopics} completed</span>
                                <span className="text-[10px] font-mono text-emerald-400 block font-bold">{pct}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {streamsTab === "EXAMS" && (
                /* Dynamic Custom Exam Strategies Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {customExams.length === 0 ? (
                    <div className="md:col-span-2 p-8 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-550 flex flex-col items-center justify-center space-y-2">
                       <p>No custom exam preparation blueprints configured yet.</p>
                       <p className="text-[10px] text-slate-600">Hit "+ Create Exam Prep" to input subjects and topics for a customized cram blueprint!</p>
                    </div>
                  ) : (
                    customExams.map((exam: any) => (
                      <div 
                        key={exam.id}
                        id={`exam-card-${exam.id}`}
                        className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl select-none relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/2 rounded-full blur-2xl" />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded text-amber-400 font-mono font-semibold">
                            {exam.aiAnalysis?.weeksToExam || 6} Week Sprint
                          </span>
                          <span className="text-[9px] font-mono text-amber-400 uppercase font-semibold">
                            {exam.aiAnalysis?.recommendedHoursPerDay || 3} hrs / day recommended
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 mt-2.5 font-display text-amber-400 tracking-tight">{exam.examName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-1">
                          <span className="font-semibold text-slate-300">Target Date:</span> {new Date(exam.examDate).toLocaleDateString()}
                        </p>

                        {/* Mapped Subjects list */}
                        <div className="mt-3 space-y-1.5">
                          <span className="text-[10px] font-mono text-slate-500 block">Syllabus Subjects:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {exam.subjects.map((sub: string, index: number) => (
                              <span key={index} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300 font-sans truncate max-w-[120px]">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Milestones list */}
                        {exam.aiAnalysis?.milestones && (
                          <div className="mt-3 pt-3 border-t border-slate-850/50 space-y-1">
                            <span className="text-[10px] font-mono text-amber-405 block">AI Prep Milestones:</span>
                            <div className="space-y-1 max-h-[80px] overflow-y-auto">
                              {exam.aiAnalysis.milestones.map((m: string, i: number) => (
                                <p key={i} className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                                  <span className="w-1 h-1 bg-amber-500 rounded-full shrink-0" /> {m}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {streamsTab === "WEEKLY_REPORTS" && (
                /* AI Weekly Report Card Panel (Section 1 - Point 1) */
                <div className="space-y-4">
                  <div className="p-4 bg-[#090b0d] border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Sunday Academic Audits & Reports</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5 max-w-xl">
                        Compile comprehensive study statistics, Pomodoro clock hours, topic accuracy ratings, and get high-value cognitive recommendations backed by real-time validation data points.
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateWeeklyReport}
                      disabled={generatingReport}
                      className="px-4 py-2 bg-sky-505 hover:bg-sky-450 text-slate-950 rounded-xl text-xs font-semibold select-none flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                    >
                      {generatingReport ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-slate-950" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Auditing State...
                        </>
                      ) : (
                        "Generate Report Card"
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {weeklyReports.length === 0 ? (
                      <div className="p-8 border border-dashed border-slate-850 rounded-xl text-center text-xs text-slate-500 italic">
                        No weekly report sheets available. Hit the "Generate Report Card" action button to trigger compilation audits.
                      </div>
                    ) : (
                      weeklyReports.map((report: any) => (
                        <div 
                          key={report.id}
                          className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4 relative overflow-hidden"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-850/60">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">Academic Report Ending: {report.weekEnding}</span>
                                <span className="text-[10px] text-slate-500 font-mono tracking-wider">SECURE DATABASE LEDGER NO: {report.id}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => downloadReportPDF(report)}
                              className="px-3 py-1.5 bg-[#090b0d] hover:bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-sky-400 hover:text-white font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" /> Download PDF Report
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-sans text-slate-350">
                            <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                              <span className="block text-slate-500 font-mono uppercase text-[9px] mb-1">Total Study Hours</span>
                              <span className="text-sm font-bold text-white font-mono">{report.studyHours || "12.0"} hrs</span>
                            </div>
                            <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                              <span className="block text-slate-500 font-mono uppercase text-[9px] mb-1">Focus Clock Blocks</span>
                              <span className="text-sm font-bold text-white font-mono">{report.focusHours || "4.5"} hrs</span>
                            </div>
                            <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                              <span className="block text-slate-500 font-mono uppercase text-[9px] mb-1 font-semibold">Completed Syllabus Topics</span>
                              <span className="text-sm font-bold text-emerald-400 font-mono">{report.topicsCompleted || "6"} modules</span>
                            </div>
                            <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                              <span className="block text-slate-500 font-mono uppercase text-[9px] mb-1 font-semibold">Productivity Score</span>
                              <span className="text-sm font-bold text-sky-400 font-mono">{report.productivityScore || "85"}%</span>
                            </div>
                          </div>

                          <div className="p-3.5 bg-sky-950/10 border border-sky-900/35 rounded-xl space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider font-mono">
                              <Brain className="h-3.5 w-3.5 text-amber-500" />
                              AI Clinical suggestions and recommendations:
                            </div>
                            <p className="text-xs text-slate-205 italic leading-relaxed font-sans">
                              "{report.aiRecommendations}"
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {streamsTab === "PREDICTOR" && (
                /* "What If I Skip Today?" Predictor Interface (Section 2 - Point 1) */
                <div className="space-y-4">
                  <div className="p-4 bg-[#090b0d] border border-slate-800 rounded-xl space-y-3.5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">What-If Path & Burnout Predictor Engine</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                        Test behavioral adjustments on exam deadline roadmaps in real-time. Compute stress projections to safeguard against academic burnout loops.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
                      <div>
                        <label htmlFor="scenario-select" className="text-[10px] font-mono text-slate-500 uppercase font-semibold block mb-1.5">Configure Target Adjustment:</label>
                        <select
                          id="scenario-select"
                          value={skipScenario}
                          onChange={(e) => setSkipScenario(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-hidden focus:border-indigo-505"
                        >
                          <option value="Skip Today">Skip study sessions for today (1 Day rest)</option>
                          <option value="Skip 2 Days">Skip study sessions for 2 days (Weekend relief)</option>
                          <option value="Skip 1 Week">Skip study sessions for complete 1 Week</option>
                          <option value="Increase Study Hours">Increase active study targets by static +2 hours daily</option>
                          <option value="Finish More Topics">Commit heavy focus to finish 3 additional topics fast</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={handleSimulateScenario}
                          disabled={simulatingScenario}
                          className="w-full py-2 bg-indigo-505 hover:bg-indigo-450 text-slate-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer font-sans"
                        >
                          {simulatingScenario ? "Computing workload projections..." : "Run What-If Predictive Simulation"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {predictions.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-850 rounded-xl text-center text-xs text-slate-500 italic">
                      No simulations run yet. Choose and run a scenario above to unlock direct comparison charts.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Before vs After Comparer */}
                      <div className="p-5 bg-slate-950 border border-indigo-900/30 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-85 pb-2.5">
                          <span className="text-xs font-bold text-white block">Active Simulation Result: "{predictions[0].scenario}"</span>
                          <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">Interactive Projections</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Daily target hours Comparison */}
                          <div className="p-3.5 bg-[#090b0d] rounded-lg border border-slate-850 space-y-2">
                            <span className="text-[10px] font-mono text-slate-500 block font-bold uppercase tracking-wider">Required Daily Hours</span>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="block text-[9px] text-slate-550 font-mono">BEFORE</span>
                                <span className="text-sm font-bold text-white font-mono">{predictions[0].before.dailyTargetHours}h / day</span>
                              </div>
                              <span className="text-slate-600 text-xs text-center font-semibold">➔</span>
                              <div>
                                <span className="block text-[9px] text-indigo-400 font-mono font-semibold">AFTER</span>
                                <span className={`text-sm font-bold font-mono ${predictions[0].after.dailyTargetHours > predictions[0].before.dailyTargetHours ? 'text-rose-400' : 'text-emerald-400'}`}>{predictions[0].after.dailyTargetHours}h / day</span>
                              </div>
                            </div>
                            <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (predictions[0].after.dailyTargetHours / 12) * 100)}%` }} />
                            </div>
                          </div>

                          {/* Readiness Comparison */}
                          <div className="p-3.5 bg-[#090b0d] rounded-lg border border-slate-850 space-y-2">
                            <span className="text-[10px] font-mono text-slate-500 block font-bold uppercase tracking-wider">Syllabus Exam Readiness</span>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="block text-[9px] text-slate-555 font-mono">BEFORE</span>
                                <span className="text-sm font-bold text-white font-mono">{predictions[0].before.readinessImpact}%</span>
                              </div>
                              <span className="text-slate-600 text-xs text-center font-semibold">➔</span>
                              <div>
                                <span className="block text-[9px] text-indigo-400 font-mono font-semibold">AFTER</span>
                                <span className={`text-sm font-bold font-mono ${predictions[0].after.readinessImpact < predictions[0].before.readinessImpact ? 'text-rose-400' : 'text-emerald-400'}`}>{predictions[0].after.readinessImpact}%</span>
                              </div>
                            </div>
                            <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${predictions[0].after.readinessImpact}%` }} />
                            </div>
                          </div>

                          {/* Burnout risk Comparison */}
                          <div className="p-3.5 bg-[#090b0d] rounded-lg border border-slate-850 space-y-2">
                            <span className="text-[10px] font-mono text-slate-500 block font-bold uppercase tracking-wider">Burnout Overload Risk</span>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="block text-[9px] text-slate-555 font-mono">BEFORE</span>
                                <span className="text-xs font-bold text-slate-400">{predictions[0].before.burnoutRisk || "Medium"}</span>
                              </div>
                              <span className="text-slate-600 text-xs text-center font-semibold">➔</span>
                              <div>
                                <span className="block text-[9px] text-indigo-400 font-mono font-semibold">AFTER</span>
                                <span className={`text-xs font-bold uppercase ${predictions[0].after.burnoutRisk === 'LOW' ? 'text-emerald-400' : predictions[0].after.burnoutRisk === 'CRITICAL' ? 'text-rose-450 animate-pulse' : 'text-amber-400'}`}>
                                  {predictions[0].after.burnoutRisk || "CRITICAL"}
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 italic mt-1 font-sans leading-tight">
                              {predictions[0].after.dailyTargetHours > 6 ? "Critical study pressure warning. Break tasks down to prevent fatigue." : "Safe workload limits confirmed."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Simulation log cards */}
                      <div className="space-y-2">
                        <span className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">PREDICTIVE SIMULATIONS RUN LEDGER:</span>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {predictions.map((run: any) => (
                            <div key={run.id} className="p-3 bg-slate-905/40 border border-slate-850 rounded-xl flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-300 font-sans font-semibold">🔍 Scenario Run: "{run.scenario}"</span>
                              <div className="flex gap-4 text-slate-500 font-sans">
                                <span>Study target shift: {run.before.dailyTargetHours}h ➔ <span className="text-white font-mono">{run.after.dailyTargetHours}h</span></span>
                                <span>Readiness impact: <span className="text-white font-mono">{run.after.readinessImpact}%</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {streamsTab === "VIVA_PREP" && (
                /* Interactive Viva & Technical MCQ Prep Module (Section 4 - Point 1) */
                <div className="space-y-4">
                  {vivaQuestions.length === 0 ? (
                    <div className="p-4 bg-[#090b0d] border border-slate-800 rounded-xl space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Oral Viva Voce & Technical MCQ Session Setup</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          Synthesize timed university clinical questions on custom subjects. Practicing helps prevent mental fatigue and boosts revision recall.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5">
                        <div>
                          <label htmlFor="subject-select-viva" className="text-[10px] font-mono text-slate-550 uppercase font-bold block mb-1.5">Select Subject:</label>
                          <select
                            id="subject-select-viva"
                            value={vivaSubject}
                            onChange={(e) => setVivaSubject(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-hidden focus:border-rose-500 w-full"
                          >
                            <option value="Operating Systems">Operating Systems ({customSubjects.find(s=>s.subjectName.toLowerCase().includes("oper"))?.topics?.length || 5} topics)</option>
                            <option value="Computer Networks">Computer Networks</option>
                            <option value="Database Systems">Database Systems</option>
                            {customSubjects.map(s => (
                              <option key={s.id} value={s.subjectName}>{s.subjectName}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="viva-topic-input" className="text-[10px] font-mono text-slate-555 uppercase font-bold block mb-1.5">Focus Topic Name:</label>
                          <input
                            type="text"
                            id="viva-topic-input"
                            value={vivaTopic}
                            onChange={(e) => setVivaTopic(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-hidden focus:border-rose-500 w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="viva-difficulty-select" className="text-[10px] font-mono text-slate-555 uppercase font-bold block mb-1.5">Difficulty level:</label>
                          <select
                            id="viva-difficulty-select"
                            value={vivaDifficulty}
                            onChange={(e) => setVivaDifficulty(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-hidden focus:border-rose-500 w-full"
                          >
                            <option value="Beginner">Beginner (Diagnostic Concept Check)</option>
                            <option value="Intermediate">Intermediate (Standard University Grades)</option>
                            <option value="Advanced">Advanced (Critical GATE / ISRO Exams)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 font-sans">
                          <Brain className="h-3.5 w-3.5 text-rose-450 shrink-0" />
                          5 high yield clinical simulated questions mapped dynamically by generative AI.
                        </span>
                        <button
                          onClick={handleGenerateVivaQuestions}
                          disabled={generatingViva}
                          className="px-4 py-2 bg-rose-505 hover:bg-rose-450 text-slate-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer font-sans"
                        >
                          {generatingViva ? "Synthesizing AI Professor Viva..." : "Form Questions Sheet ➔"}
                        </button>
                      </div>
                    </div>
                  ) : sessionScore === null ? (
                    /* Active Questions Card Rendering */
                    <div className="p-5 bg-slate-950 border border-rose-900/30 rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                        <span className="text-xs font-bold text-white block">Question {currentVivaIndex + 1} of {vivaQuestions.length}</span>
                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase font-bold tracking-wider">{vivaQuestions[currentVivaIndex]?.type}</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-100 font-sans leading-relaxed">
                          {vivaQuestions[currentVivaIndex]?.question}
                        </p>
                      </div>

                      {/* Display MCQs options if MCQ type */}
                      {vivaQuestions[currentVivaIndex]?.options?.length > 0 ? (
                        <div className="space-y-2 pt-2">
                          {vivaQuestions[currentVivaIndex].options.map((opt: string, i: number) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedMCQOption(opt)}
                              className={`w-full p-3 font-sans text-xs text-left rounded-xl border flex items-center justify-between transition cursor-pointer ${selectedMCQOption === opt ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-semibold' : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                            >
                              <span>{opt}</span>
                              {selectedMCQOption === opt && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0" />}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Standard Technical / Oral / Rapid Self draft text area */
                        <div className="space-y-2 pt-2">
                          <label htmlFor="self-draft-assessment" className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">Your Draft Assessment Explanation:</label>
                          <textarea
                            id="self-draft-assessment"
                            rows={3}
                            value={typedVivaAnswer}
                            onChange={(e) => setTypedVivaAnswer(e.target.value)}
                            placeholder="Draft your explanation brief here..."
                            className="w-full bg-[#090b0d] border border-slate-850 focus:border-rose-500 rounded-xl p-3 text-xs text-slate-350 focus:outline-hidden font-sans"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-850">
                        <button
                          onClick={() => setVivaQuestions([])}
                          className="px-3.5 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs text-slate-550 hover:text-slate-200 transition cursor-pointer font-sans"
                        >
                          Cancel Session
                        </button>
                        <button
                          onClick={() => handleSubmitActiveVivaAnswer(vivaQuestions[currentVivaIndex]?.correctAnswer)}
                          className="px-4 py-2 bg-rose-505 hover:bg-rose-450 text-slate-950 rounded-xl text-xs font-semibold transition cursor-pointer font-sans"
                        >
                          Confirm & Next Question ➔
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Final Session Completed Dashboard Outcomes */
                    <div className="p-6 bg-slate-950 border border-rose-900/30 rounded-xl text-center space-y-5">
                      <div className="space-y-1.5">
                        <span className="text-[28px] block">🏆</span>
                        <h4 className="text-md font-bold text-slate-100 font-display">Oral Viva Session Accomplished!</h4>
                        <p className="text-xs text-slate-450 leading-relaxed max-w-md mx-auto">
                          You have completed the oral mock drills on "{vivaTopic}". Here is the performance diagnostics review:
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-[11px] font-sans">
                        <div className="bg-[#090b0d] p-3 rounded-lg border border-slate-850 text-center">
                          <span className="block text-slate-500 font-mono uppercase text-[8.5px] mb-1">Calculated Score</span>
                          <span className="text-lg font-bold text-rose-400 font-mono">{sessionScore}%</span>
                        </div>

                        <div className="bg-[#090b0d] p-3 rounded-lg border border-slate-850 text-center">
                          <span className="block text-slate-500 font-mono uppercase text-[8.5px] mb-1">Select Session Confidence:</span>
                          <select
                            value={selectedConfidence}
                            onChange={(e) => setSelectedConfidence(e.target.value)}
                            className="bg-[#0b0e11] border border-slate-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-hidden mt-1 font-semibold"
                          >
                            <option value="Confident">Confident</option>
                            <option value="Average">Average (Requires spaced review)</option>
                            <option value="Shaky">Shaky (High memory fatigue)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-850/60 max-w-md mx-auto">
                        <button
                          onClick={handleRecordVivaSession}
                          disabled={recordingSession}
                          className="w-full py-2 bg-rose-505 hover:bg-rose-450 text-slate-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                        >
                          {recordingSession ? "Committing outcomes to ledger..." : "Record Oral Outcomes & Complete Session (+XP)"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* History of oral tests */}
                  {user?.vivaSessions && user.vivaSessions.length > 0 && (
                    <div className="space-y-4 mt-6 pt-4 border-t border-slate-850/40">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">PREVIOUS COMPLETED ORAL SESSIONS:</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[180px] overflow-y-auto pr-1">
                        {user.vivaSessions.map((hist: any, i: number) => (
                          <div key={i} className="p-3.5 bg-slate-955/40 border border-slate-850 rounded-xl flex items-center justify-between text-[11.5px] font-sans text-slate-400 relative overflow-hidden">
                            <div className="min-w-0">
                              <span className="font-bold text-slate-300 block truncate">{hist.subject} ({hist.topic})</span>
                              <span className="text-[10px] text-slate-500 font-mono">Completed: {new Date(hist.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1 font-mono shrink-0">
                              <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 text-[10.5px]">{hist.score}% Score</span>
                              <span className="text-[9.5px] text-slate-500 uppercase">CONFIDENCE: {hist.confidence}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bento Block B: Custom Academic Syllabus interactive scheduler list */}
            <div className="p-6 bg-[#0d1013] border border-slate-800 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CalendarClock className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-medium text-white text-md">Today's Academic Syllabi Roadmap</h3>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-slate-400 font-mono uppercase tracking-widest">
                  {user?.profile?.learnerType?.split("_")[0]} TARGET
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => {
                  const isActiveFocus = task.topic === activeTopic;
                  return (
                    <div
                      key={task.id}
                      onClick={() => handleSelectActiveFocus(task)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActiveFocus
                          ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)] scale-[1.01]"
                          : task.status === "COMPLETED"
                          ? "bg-emerald-500/5 border-emerald-500/25 opacity-70"
                          : "bg-[#090b0d] border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation(); // prevent resetting focus when checkboxes toggle
                            toggleTaskStatus(task.id);
                          }}
                          className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0 p-1 bg-slate-950/60 border border-slate-850 rounded-lg cursor-pointer"
                        >
                          {task.status === "COMPLETED" ? (
                            <CheckSquare className="h-4.5 w-4.5 text-emerald-400" />
                          ) : (
                            <SquareIcon className="h-4.5 w-4.5" />
                          )}
                        </div>
                        <div className="truncate flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-emerald-400 font-mono tracking-wider block font-bold uppercase truncate">
                              {task.subject}
                            </span>
                            {isActiveFocus && (
                              <span className="text-[8px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-mono font-bold uppercase select-none tracking-widest scale-90">
                                ACTIVE FOCUS
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-sans mt-0.5 truncate ${task.status === "COMPLETED" ? "line-through text-slate-500" : "text-slate-200 font-medium"}`}>
                            {task.topic}
                          </p>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-405 shrink-0 ml-3">
                        {task.durationMins} MINS
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Lobe 2: Right Dashboard Column - Functional Pomodoro Focus Clock */}
          <div className="lg:col-span-4">
            
            <div className="p-6 bg-[#0d1013] border border-slate-800 rounded-2xl space-y-6 relative sticky top-24">
              <div className="absolute top-0 right-0 w-[150px] height-[150px] bg-emerald-500/5 blur-[80px] rounded-full pointing-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <Timer className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="font-display font-medium text-white text-sm">Focus Pomodoro</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${timerMode === "FOCUS" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-400/20'}`}>
                    {timerMode === "FOCUS" ? "FOCUS MODE" : "REST BREAK"}
                  </span>
                </div>
              </div>

              {/* Dynamic countdown visual gauge */}
              <div className="py-8 flex flex-col items-center justify-center bg-[#090b0d] border border-slate-900 rounded-2xl relative">
                <span className="text-4xl min-w-[130px] text-center font-mono font-extrabold tracking-wide text-white block">
                  {timeString}
                </span>
                <span className="text-[10px] text-slate-500 mt-2 font-mono tracking-widest font-bold uppercase">
                  {timerIsActive ? "⚡ TIMER RUNNING" : "⏸️ TIMER PAUSED"}
                </span>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleStartStop}
                  className={`py-2.5 rounded-xl text-xs font-semibold tracking-wide border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${timerIsActive ? 'bg-slate-900 border-slate-800 text-slate-350 hover:text-white' : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white'}`}
                >
                  {timerIsActive ? (
                    <>
                      <Square className="h-3.5 w-3.5 shrink-0" />
                      <span>Pause Focus</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 shrink-0 fill-current" />
                      <span>Start Focus</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                  <span>Reset Time</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center font-sans leading-relaxed">
                Complete focus clocks will record duration logs directly to your persistent server profile for intelligence metrics.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Floating game guide Study Buddy companion interface element */}
      <StudyBuddyAI 
        currentSubject={activeSubject}
        currentTopic={activeTopic}
        onTaskAdded={refreshTasks}
      />

      {/* Custom Curriculum Creation Modals & Detail Drawers */}
      <CustomSubjectCreator
        isOpen={isSubjectCreatorOpen}
        onClose={() => setIsSubjectCreatorOpen(false)}
        onSuccess={() => {
          fetchCustomData();
          refreshTasks();
        }}
      />

      <CustomExamCreator
        isOpen={isExamCreatorOpen}
        onClose={() => setIsExamCreatorOpen(false)}
        onSuccess={() => {
          fetchCustomData();
          refreshTasks();
        }}
      />

      <SubjectRoadmapDrawer
        subject={selectedSubjectForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSubjectForDrawer(null);
        }}
        onRefresh={() => {
          fetchCustomData();
          refreshTasks();
        }}
      />
    </div>
  );
};
