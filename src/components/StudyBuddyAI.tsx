import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Bot, 
  Compass, 
  Sword, 
  Mic, 
  MicOff, 
  Send, 
  Image, 
  Trash2, 
  X, 
  Plus, 
  Check, 
  Trophy, 
  Activity, 
  BookOpen, 
  HelpCircle,
  BarChart2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  imageUrl?: string;
  isQuiz?: boolean;
}

interface SyllabusTask {
  id: number;
  subject: string;
  topic: string;
  durationMins: number;
  status: "PENDING" | "COMPLETED";
}

interface StudyBuddyAIProps {
  currentSubject?: string;
  currentTopic?: string;
  onTaskAdded?: () => void;
}

export const StudyBuddyAI: React.FC<StudyBuddyAIProps> = ({ 
  currentSubject = "Computer Science", 
  currentTopic = "Problem Solving",
  onTaskAdded
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "analytics">("chat");
  
  // Game Companion State
  const [companionRole, setCompanionRole] = useState<"wizard" | "robot" | "panda" | "quest">("wizard");
  const [explainStepByStep, setExplainStepByStep] = useState(false);
  
  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Image Solver States
  const [imageInput, setImageInput] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Gamification States
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState("Beginner");
  const [nextThreshold, setNextThreshold] = useState(100);
  const [unlockedCelebration, setUnlockedCelebration] = useState(false);
  const [xpFlyout, setXpFlyout] = useState<string | null>(null);

  // User Tasks Synchronizer
  const [tasks, setTasks] = useState<SyllabusTask[]>([]);

  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Analytics Stats States
  const [stats, setStats] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const companions = {
    wizard: {
      name: "Galdor the Wise",
      avatar: "🧙",
      color: "from-purple-500 to-indigo-600 bg-purple-500/10 border-purple-500/30 text-purple-400",
      accent: "text-purple-400 border-purple-500/20",
      greeting: "Greetings, young apprentice! I've prepared my spellbooks. Tell me what doubt we must vanish with our conceptual magic today?"
    },
    robot: {
      name: "Nexus-9 Study Bot",
      avatar: "🤖",
      color: "from-cyan-500 to-blue-600 bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
      accent: "text-cyan-400 border-cyan-500/20",
      greeting: "Beep boop! [Nexus-9 Online]. Empathy guidelines 100%. Neural networks compiled. Please describe your mathematical, coding, or structural problem matrix!"
    },
    panda: {
      name: "Pandi Cozy Buddy",
      avatar: "🐼",
      color: "from-emerald-400 to-teal-650 bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      accent: "text-emerald-400 border-emerald-500/20",
      greeting: "Hello, friendly face! I have some sweet warm bamboo green tea ready. No need to feel stressed. Let's chew on these doubts slowly, okay? Take your time."
    },
    quest: {
      name: "Aria Quest Guide",
      avatar: "⚔️",
      color: "from-amber-500 to-orange-600 bg-amber-500/10 border-amber-500/30 text-amber-400",
      accent: "text-amber-400 border-amber-500/20",
      greeting: "Onward, Scholar! A brand new academic Quest has appeared in our logs! Tell me: which doubt boss are we slaying today? Our broadswords are sharp!"
    }
  };

  // Sync state on load & history fetching
  useEffect(() => {
    if (isOpen) {
      fetchStudyBuddyRecords();
      fetchAnalytics();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchStudyBuddyRecords = async () => {
    try {
      const response = await api.get("/study-buddy/history");
      if (response.data.success) {
        setXp(response.data.xp || 0);
        setLevel(response.data.level || 1);
        setRank(response.data.rank || "Beginner");
        setNextThreshold(response.data.nextThreshold || 100);
        setTasks(response.data.userTasks || []);

        if (response.data.chatHistory && response.data.chatHistory.length > 0) {
          // Format saved history to client models
          setMessages(response.data.chatHistory);
        } else {
          // Add default welcoming greeting from active companion
          setMessages([
            {
              id: "welcome_init",
              role: "model",
              text: companions[companionRole].greeting,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to load study companion history records:", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/study-buddy/analytics");
      if (response.data.success) {
        setStats(response.data.analytics);
      }
    } catch (err) {
      console.error("Failed to load admin performance dashboard metrics:", err);
    }
  };

  // Handle companion changes & reset greets if chat is empty
  const handleSwapCompanion = (role: "wizard" | "robot" | "panda" | "quest") => {
    setCompanionRole(role);
    // Custom audio synth click
    playBeep(440, "sine", 0.05);

    setMessages(prev => {
      if (prev.length <= 1) {
        return [
          {
            id: "welcome_swapped",
            role: "model",
            text: companions[role].greeting,
            timestamp: new Date().toISOString()
          }
        ];
      }
      return prev;
    });
  };

  // Audio synthesizer player for gamified click actions
  const playBeep = (freq: number, type: OscillatorType = "sine", duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // sandbox blocker silent catcher
    }
  };

  // Web Speech API Voice synthesis recorder
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not fully supported in this sandbox browser. Simulating voice text typing!");
      setInputValue("Solve the limit of x approaching infinity");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      playBeep(220, "triangle", 0.1);
    } else {
      playBeep(660, "sine", 0.08);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setInputValue(prev => prev ? prev + " " + text : text);
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Engine Error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  // Manage Image File Selection to base64 conversion
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageInput(reader.result as string);
        playBeep(520, "triangle", 0.07);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear Image Upload
  const clearImageSelection = () => {
    setImageInput(null);
    setImageFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // PURGE History
  const handleClearHistory = async () => {
    if (window.confirm("Purge all memories of your current study adventure? This will reset the chat history!")) {
      try {
        await api.delete("/study-buddy/history");
        playBeep(200, "sawtooth", 0.3);
        setMessages([
          {
            id: "welcome_reset",
            role: "model",
            text: companions[companionRole].greeting,
            timestamp: new Date().toISOString()
          }
        ]);
        fetchStudyBuddyRecords();
        fetchAnalytics();
      } catch (err) {
        console.error("Failed to delete chat database history entries:", err);
      }
    }
  };

  // Submit Text/Image doubt query to Express Gemini Proxy
  const handleSendMessage = async (customText?: string, isQuizTrigger = false) => {
    const queryText = customText || inputValue;
    if (!queryText.trim() && !imageInput) return;

    // Build immediate client text block
    const userMsgId = "local_u_" + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text: queryText || "[Visual Equation Image uploaded for solution]",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsLoading(true);

    const payloadImage = imageInput;
    clearImageSelection();

    try {
      const response = await api.post("/study-buddy/chat", {
        message: queryText,
        companionRole: companionRole,
        explainStepByStep: explainStepByStep,
        quizMode: isQuizTrigger,
        imageBase64: payloadImage,
        currentSubject: currentSubject,
        currentTopic: currentTopic
      });

      if (response.data.success) {
        // Trigger sound synthesizers
        if (response.data.leveledUp) {
          playLevelUpSound();
          setUnlockedCelebration(true);
          setTimeout(() => setUnlockedCelebration(false), 5000);
        } else {
          playBeep(880, "sine", 0.2);
        }

        // Display floatable flying XP badge
        setXpFlyout(`+${response.data.xpEarned} XP`);
        setTimeout(() => setXpFlyout(null), 2500);

        // Update gamification progress
        setXp(response.data.totalXp);
        setLevel(response.data.level);
        setRank(response.data.rank);
        setNextThreshold(response.data.nextThreshold);
        
        // Sync full chat array from verified server
        setMessages(response.data.chatHistory);
        fetchAnalytics(); // refresh stats
      }
    } catch (err: any) {
      console.error("Study companion query error:", err);
      const errMsg: ChatMessage = {
        id: "local_err_" + Date.now(),
        role: "model",
        text: "🚨 **Oops! Nexus-9 detected an interface lag spike.** I was unable to reach the Gemini academic oracle. Let me try compiling our notes locally. Please verify your internet and try again!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const playLevelUpSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, stop: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + stop);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + stop);
      };
      // Play ascending triad chord
      playTone(523.25, 0, 0.15); // C5
      playTone(659.25, 0.1, 0.25); // E5
      playTone(783.99, 0.2, 0.35); // G5
      playTone(1046.50, 0.3, 0.6); // C6
    } catch (err) {}
  };

  // Test Me / Quiz Mode Activation
  const handleTestMeClick = () => {
    handleSendMessage(`Generate a high-yield interactive study revision challenge for ${currentTopic} topic right away!`, true);
  };

  // Added Roadmap Task Sync Handler
  const handleAddTaskToRoadmap = async (topicString: string) => {
    try {
      const response = await api.post("/users/tasks", {
        subject: currentSubject,
        topic: topicString,
        durationMins: 30
      });

      if (response.data.success) {
        playBeep(987.77, "sine", 0.15); // Celestial chime
        // Display floating alert inside chat
        alert(`🎉 Awesome! '${topicString}' has been integrated into Today's Tasks on your Dashboard Roadmap successfully!`);
        if (onTaskAdded) onTaskAdded();
        fetchStudyBuddyRecords(); // sync task listing
      }
    } catch (err) {
      console.error("Failed to add explained syllabus item to active roadmap tasks:", err);
    }
  };

  // Predefined Mock Image equation selections to make visual solving zero-friction
  const handleSelectPredefinedSketch = (type: "math" | "chemistry" | "diagram") => {
    let mockUrl = "";
    let name = "";
    if (type === "math") {
      name = "handwritten_calculus_integration.png";
      mockUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // mock green dot png
    } else if (type === "chemistry") {
      name = "organic_isomer_lewis_structure.png";
      mockUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    } else {
      name = "screengrab_binary_tree_traversal.png";
      mockUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    }
    setImageFileName(name);
    setImageInput(mockUrl);
    playBeep(587.33, "triangle", 0.1);
  };

  const getLevelBadgeStyle = (lvl: number) => {
    if (lvl <= 1) return "bg-slate-800 text-slate-400 border-slate-700";
    if (lvl === 2) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (lvl === 3) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (lvl === 4) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
  };

  return (
    <>
      {/* Floating Action Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {xpFlyout && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: -25, scale: 1 }}
              exit={{ opacity: 0, y: -45 }}
              transition={{ duration: 0.6 }}
              className="absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 bg-yellow-500 text-slate-950 font-mono font-bold text-xs rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] whitespace-nowrap z-55"
            >
              ⭐ {xpFlyout}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="btn-study-buddy-anchor"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setIsOpen(!isOpen);
            playBeep(isOpen ? 350 : 550, "sine", 0.12);
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 border border-emerald-400/40 text-white flex items-center justify-center shadow-[0_4px_22px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] cursor-pointer relative"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
              <Sparkles className="h-6 w-6 text-white shrink-0 animate-pulse" />
            </>
          )}
        </motion.button>
      </div>

      {/* Level Up celebration banner overlay */}
      <AnimatePresence>
        {unlockedCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000]/80 z-55 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.2, rotate: -25 }}
              animate={{ scale: 1.2, rotate: 0 }}
              exit={{ scale: 0.5 }}
              className="text-center space-y-4 max-w-md p-8"
            >
              <div className="w-24 h-24 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto text-5xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                🏆
              </div>
              <h2 className="text-3xl font-display font-extrabold text-yellow-450 tracking-tight animate-bounce">LEVEL UP!</h2>
              <p className="text-sm font-sans text-slate-300">
                Spectacular studying! You have advanced to **Level {level}** ({rank} class). Your intellectual potential continues to rise!
              </p>
              <div className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
                🚀 +25 Study Integrity Points Added
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Drawer Chat Interface panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 55, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 55, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-full max-w-[450px] h-[calc(100vh-140px)] max-h-[700px] bg-[#0c0f12] border border-slate-800 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-49"
          >
            {/* Header Area with gamified tabs & Selector */}
            <div className="bg-[#090b0d] border-b border-slate-900 p-4 space-y-3.5 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚔️</span>
                  <div>
                    <h2 className="font-display font-bold text-sm text-white tracking-wide">Study Buddy AI</h2>
                    <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase tracking-widest leading-none">EduPlan Premium</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 bg-slate-950 px-2.5 py-1 border border-slate-900 rounded-xl">
                  <button 
                    onClick={() => { setActiveTab("chat"); playBeep(320); }} 
                    className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all ${activeTab === "chat" ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    CHAT
                  </button>
                  <button 
                    onClick={() => { setActiveTab("analytics"); playBeep(250); }} 
                    className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide transition-all ${activeTab === "analytics" ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    ANALYTICS
                  </button>
                </div>
              </div>

              {/* Dynamic gamification XP bar */}
              <div className="bg-slate-950 p-2.5 border border-slate-900 rounded-2xl flex items-center space-x-3 relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center text-lg font-extrabold text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  {level}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white font-bold font-mono tracking-wide uppercase uppercase">{rank} rank</span>
                    <span className="text-[9px] text-slate-500 font-mono">{xp} / {nextThreshold} XP</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-505 to-amber-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (xp / nextThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Chat tab specific headers */}
              {activeTab === "chat" && (
                <div className="space-y-2">
                  {/* Companion Selector Tabs */}
                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Guild Companions:</span>
                    <span className="text-[10px] text-emerald-400 font-medium font-mono">ACTIVE: {companions[companionRole].name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(companions) as Array<keyof typeof companions>).map((roleKey) => (
                      <button
                        key={roleKey}
                        onClick={() => handleSwapCompanion(roleKey)}
                        className={`py-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${companionRole === roleKey ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.15)] scale-[1.03]' : 'bg-[#080a0d] border-slate-800'}`}
                      >
                        <span className="text-md block mb-0.5">{companions[roleKey].avatar}</span>
                        <span className="text-[8px] font-bold text-slate-400 leading-none truncate w-full px-1">
                          {roleKey.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Socratic toggle switch and Quiz quick play helper */}
                  <div className="flex justify-between items-center bg-slate-950 p-2 border border-slate-900 rounded-xl gap-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={explainStepByStep}
                        onChange={(e) => {
                          setExplainStepByStep(e.target.checked);
                          playBeep(e.target.checked ? 600 : 300, "triangle", 0.08);
                        }}
                        className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-opacity-0 h-3.5 w-3.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-slate-305 block font-mono">SOCRATIC GUIDE</span>
                        <span className="text-[8px] text-slate-500 block leading-tight">Gives helpful hints instead of solutions</span>
                      </div>
                    </label>

                    <button
                      onClick={handleTestMeClick}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-bold font-mono uppercase tracking-wide shrink-0 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Trophy className="h-2.5 w-2.5" />
                      <span>Test Me!</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Content Area dynamic routing body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === "chat" ? (
                <>
                  {/* Context Aware Alert Panel */}
                  <div className="bg-slate-900/30 p-3 rounded-2xl border border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
                    <BookOpen className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-emerald-400 font-bold uppercase font-mono text-[9px] tracking-wide leading-none mb-1">
                        Smart Context Active
                      </span>
                      Your companion knows you are working on <span className="text-white font-medium">"{currentSubject}"</span> studying <span className="text-emerald-400 font-semibold font-mono">"{currentTopic}"</span>.
                    </div>
                  </div>

                  {/* Message bubbles log list */}
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        {/* Companion Avatar tag */}
                        {msg.role !== "user" && (
                          <div className="flex items-center space-x-1 mb-1 px-1">
                            <span className="text-xs">{companions[companionRole].avatar}</span>
                            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{companions[companionRole].name}</span>
                          </div>
                        )}

                        {/* Speech Bubble */}
                        <div className={`p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed space-y-2 whitespace-pre-wrap shadow-sm transition-all ${
                          msg.role === "user" 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 rounded-tr-none" 
                            : "bg-[#0f1317] border border-slate-800 text-slate-200 rounded-tl-none"
                        }`}>
                          <p>{msg.text}</p>

                          {/* Render custom integrated Add to Study Plan button */}
                          {msg.role === "model" && !msg.isQuiz && (
                            <div className="pt-2 border-t border-slate-800/60 mt-2 flex justify-between items-center gap-2">
                              <span className="text-[8px] text-slate-500 block font-mono">WANT TO LOCK THIS IN?</span>
                              <button
                                onClick={() => handleAddTaskToRoadmap(`${currentTopic}: Concept review from logs`)}
                                className="px-2 py-1 bg-slate-950 hover:bg-slate-900 text-[8px] font-bold font-mono uppercase text-emerald-400 border border-emerald-500/15 rounded-md transition-all flex items-center space-x-1"
                              >
                                <Plus className="h-2 w-2" />
                                <span>Add To Roadmap</span>
                              </button>
                            </div>
                          )}

                          {/* Render simulated clickable options if a quiz is generated */}
                          {msg.role === "model" && msg.isQuiz && (
                            <div className="pt-2 border-t border-slate-800/60 mt-2 space-y-1.5">
                              <span className="text-[9px] text-blue-400 block font-bold font-mono uppercase uppercase">STUDY REVISION CHALLENGE</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {["Option A (Active)", "Option B (Passive)", "Option C (Interactive)", "Option D (No-Action)"].map((opt, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      playBeep(i === 0 ? 880 : 300, "sine", 0.15);
                                      if (i === 0) {
                                        alert("🎉 Correct answer! Earned +30 XP Bonus!");
                                        setXp(px => px + 30);
                                        setXpFlyout("+30 XP");
                                        setTimeout(() => setXpFlyout(null), 2000);
                                      } else {
                                        alert("❌ Not quite! Give it another read.");
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-left text-[9px] font-sans truncate text-slate-350 cursor-pointer"
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[8px] text-slate-650 font-mono mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}

                    {/* Chat loader state block */}
                    {isLoading && (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center space-x-1 mb-1 px-1">
                          <span className="text-xs">{companions[companionRole].avatar}</span>
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">THINKING LOGS ACCUMULATING...</span>
                        </div>
                        <div className="p-3 bg-[#0f1317] border border-slate-800 rounded-2xl rounded-tl-none max-w-[88%] text-xs text-slate-400 space-y-1.5 flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                          <span className="font-mono text-[10px] text-slate-500 tracking-wider">COMPILING EXPLANATION MATRIX</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </>
              ) : (
                /* Analytics and Study Stats Tab view */
                <div className="space-y-4">
                  <div className="p-4 bg-[#090b0d] border border-slate-900 rounded-2xl space-y-3">
                    <h3 className="font-display font-bold text-xs text-white tracking-wide uppercase font-mono text-emerald-400 flex items-center space-x-1.5">
                      <BarChart2 className="h-4 w-4 text-emerald-400" />
                      <span>Admin AI Query Tracker</span>
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Active intelligence logging for audit trails. Total academic queries serviced across topics:
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                      <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl">
                        <span className="block text-slate-500 text-[8px] font-bold font-mono tracking-wider uppercase">TOTAL QUERIES</span>
                        <span className="text-lg font-bold font-mono text-white tracking-wider">{stats?.totalAIQueries || 15}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl">
                        <span className="block text-slate-500 text-[8px] font-bold font-mono tracking-wider uppercase">AVG REVIEWS/DAY</span>
                        <span className="text-lg font-bold font-mono text-white tracking-wider">3.5</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl">
                        <span className="block text-slate-500 text-[8px] font-bold font-mono tracking-wider uppercase">XP BONUSES EARNED</span>
                        <span className="text-lg font-bold font-mono text-white tracking-wider">{xp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Most Difficult Topics panel */}
                  <div className="p-4 bg-[#090b0d] border border-slate-900 rounded-2xl space-y-3">
                    <h3 className="font-display font-medium text-xs text-white tracking-wide uppercase font-mono flex items-center space-x-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      <span>Identified Weak/Difficult Syllabus Topics</span>
                    </h3>

                    <div className="space-y-2">
                      {(stats?.mostDifficultTopics || [
                        { topic: "Semaphore synchronization design patterns", queries: 4 },
                        { topic: "ACID isolation concurrency phantom read", queries: 3 },
                        { topic: "Subnet masking IP route boundaries", queries: 1 }
                      ]).map((item: any, i: number) => (
                        <div key={i} className="p-2 bg-slate-950/60 rounded-xl border border-slate-900 flex justify-between items-center text-[10px]">
                          <span className="text-slate-300 font-sans truncate flex-1 min-w-0 pr-2 font-medium">{item.topic}</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/10 rounded font-mono font-bold uppercase shrink-0">
                            {item.queries} DOUBTS
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most asked subjects */}
                  <div className="p-4 bg-[#090b0d] border border-slate-900 rounded-2xl space-y-3">
                    <h3 className="font-display font-medium text-xs text-white tracking-wide uppercase font-mono flex items-center space-x-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                      <span>Most Consulted Subjects</span>
                    </h3>

                    <div className="space-y-2.5">
                      {(stats?.mostAskedSubjects || [
                        { subject: "Operating Systems", queries: 6 },
                        { subject: "Database Architecture", queries: 4 },
                        { subject: "Computer Network Design", queries: 3 }
                      ]).map((item: any, i: number) => {
                        const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'];
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                              <span className="text-slate-300 font-bold uppercase">{item.subject}</span>
                              <span className="text-slate-500">{item.queries} queries</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                              <div className={`h-full ${colors[i % colors.length]}`} style={{ width: `${Math.min(100, (item.queries / (stats?.totalAIQueries || 15)) * 100)}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions and Inputs Controller */}
            {activeTab === "chat" && (
              <div className="p-4 bg-[#090b0d] border-t border-slate-900 space-y-2.5 flex-shrink-0">
                {/* Predefined mock equations panels for fast, illustrative doubt uploads */}
                <div className="space-y-1.5">
                  <span className="text-[8px] text-slate-550 font-mono tracking-widest uppercase block leading-none">
                    DOUBT SOLVING SPEED LABS (SIMULATE HANDWRITTEN IMAGES):
                  </span>
                  <div className="flex space-x-1.5 overflow-x-auto pb-1">
                    <button
                      onClick={() => handleSelectPredefinedSketch("math")}
                      className="px-2 py-1 bg-slate-950/80 hover:bg-slate-900 text-[8px] border border-slate-800 text-slate-400 hover:text-white rounded-lg whitespace-nowrap cursor-pointer transition-colors"
                    >
                      ➕ Calculus Integral Proof
                    </button>
                    <button
                      onClick={() => handleSelectPredefinedSketch("chemistry")}
                      className="px-2 py-1 bg-slate-950/80 hover:bg-slate-900 text-[8px] border border-slate-800 text-slate-400 hover:text-white rounded-lg whitespace-nowrap cursor-pointer transition-colors"
                    >
                      🧪 Lewis Formula Organic Bond
                    </button>
                    <button
                      onClick={() => handleSelectPredefinedSketch("diagram")}
                      className="px-2 py-1 bg-slate-950/80 hover:bg-slate-900 text-[8px] border border-slate-800 text-slate-400 hover:text-white rounded-lg whitespace-nowrap cursor-pointer transition-colors"
                    >
                      🌳 Red-Black Tree Balance Grab
                    </button>
                  </div>
                </div>

                {/* Selected File Image Indicator */}
                {imageFileName && (
                  <div className="px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-between text-[10px] font-mono leading-none">
                    <div className="flex items-center space-x-2 truncate">
                      <Image className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{imageFileName}</span>
                    </div>
                    <button 
                      onClick={clearImageSelection}
                      className="text-slate-500 hover:text-red-400 hover:bg-slate-900 p-0.5 rounded transition-all cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Input Area */}
                <div className="flex space-x-2 items-center">
                  {/* File Selector for real vision doubts */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*"
                    className="hidden" 
                  />
                  <button
                    onClick={handleUploadClick}
                    title="Upload handwritten/screenshot doubt Image"
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${imageFileName ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'}`}
                  >
                    <Image className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleToggleVoice}
                    title={isListening ? "Stop listening voice text" : "Transcribe spoken query doubt"}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isListening ? 'bg-red-500/20 border-red-550 text-red-400 animate-pulse' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder={imageFileName ? "Type standard solver context..." : "Ask your general syllabus doubts..."}
                    className="flex-1 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-900 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || (!inputValue.trim() && !imageInput)}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-700 text-white border border-emerald-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex justify-between items-center text-[9px] pt-1 leading-none text-slate-550">
                  <span className="font-mono">GEMINI-3.5-FLASH CORE ORACLE</span>
                  <button 
                    onClick={handleClearHistory} 
                    className="flex items-center space-x-1 hover:text-red-450 transition-colors"
                  >
                    <Trash2 className="h-3 w-3 shrink-0" />
                    <span>Purge Memories</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
