import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { rgpvSyllabusDataset, clonePreloadedRgpvSyllabus } from "./src/data/rgpvSyllabusSeed";
import { schoolClassesDataset, boardsDataset, streamsDataset, schoolSubjectsDataset } from "./src/data/schoolSyllabusSeed";

interface UserProfile {
  learnerType: string;
  dailyStudyHours: number;
  schoolClass?: string;
  schoolBoard?: string;
  schoolStream?: string;
  degree?: string;
  course?: string;
  university?: string;
  semester?: number;
  targetExam?: string;
  attemptYear?: number;
  certificationGoal?: string;
  learningGoal?: string;
}

interface SyllabusTask {
  id: number;
  subject: string;
  topic: string;
  durationMins: number;
  status: "PENDING" | "COMPLETED";
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  imageUrl?: string;
  isQuiz?: boolean;
  quizData?: any;
}

interface AIInteractionLog {
  id: string;
  message: string;
  response: string;
  imageUrl?: string;
  timestamp: string;
  subject: string;
  topic: string;
}

interface CustomTopic {
  id: number;
  customSubjectId: number;
  topicName: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  confidenceLevel: string;
}

interface CustomSubject {
  id: number;
  userId: number;
  subjectName: string;
  description: string;
  difficulty: string;
  targetDate: string;
  createdAt: string;
  topics: CustomTopic[];
  aiAnalysis?: {
    estimatedEffort: string;
    roadmap: { week: string; focus: string }[];
    revisionSchedule: string;
    milestones: string[];
  };
}

interface CustomExam {
  id: number;
  userId: number;
  examName: string;
  examDate: string;
  subjects: string[];
  topics: string[];
  createdAt: string;
  aiAnalysis?: {
    weeksToExam: number;
    recommendedHoursPerDay: number;
    roadmap: { subject: string; focus: string; weeks: string; priority: string }[];
    milestones: string[];
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  authProvider: string;
  enabled: boolean;
  locked: boolean;
  otpCode?: string | null;
  otpExpiry?: string | null;
  role: string;
  profile?: UserProfile | null;
  createdAt: string;
  xp?: number;
  level?: number;
  tasks?: SyllabusTask[];
  chatHistory?: ChatMessage[];
  interactionLogs?: AIInteractionLog[];
  quizAttemptsCount?: number;
  customSubjects?: CustomSubject[];
  customExams?: CustomExam[];
}

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "eduplan-ai-secure-development-secret-key-108";
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET environment variable is missing! Using fallback key for local/preview development.");
}
const DB_FILE = path.join(process.cwd(), "db.json");

// Load database with default seed values and auto-populate RGPV entities if empty
function loadDatabase() {
  let db: any = { users: [] };
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } else {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse db.json, resetting to empty schema.", err);
    }
  }

  // Ensure arrays exist
  if (!db.users) db.users = [];
  if (!db.universities) {
    db.universities = [
      { id: 1, name: "Rajiv Gandhi Proudyogiki Vishwavidyalaya", code: "RGPV" }
    ];
  }
  if (!db.degrees) {
    db.degrees = [
      { id: 1, universityId: 1, name: "Bachelor of Technology", code: "B.Tech" }
    ];
  }
  if (!db.branches) {
    db.branches = [
      { id: 1, degreeId: 1, name: "Computer Science Engineering", code: "CSE" }
    ];
  }
  if (!db.semesters) {
    db.semesters = [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
      id: n,
      branchId: 1,
      semesterNumber: n
    }));
  }
  if (!db.rgpvSyllabus) {
    // Populate with default RGPV Semester 1 to 8 curriculum dataset
    db.rgpvSyllabus = rgpvSyllabusDataset;
    console.log("Seeding RGPV B.Tech CSE Semester 1–8 dataset into JSON database...");
  }
  if (!db.schoolClasses) {
    db.schoolClasses = schoolClassesDataset;
    console.log("Seeding default school classes...");
  }
  if (!db.boards) {
    db.boards = boardsDataset;
    console.log("Seeding default educational boards...");
  }
  if (!db.streams) {
    db.streams = streamsDataset;
    console.log("Seeding default academic streams...");
  }
  if (!db.schoolSubjects) {
    db.schoolSubjects = schoolSubjectsDataset;
    console.log("Seeding default preloaded school subjects...");
  }

  // Persist if any seeds were written
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  return db;
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write to db.json", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS Middleware for simple local request passing
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // JWT Validation Middleware
  const authenticateToken = (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. Authentication token missing.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({
        success: false,
        message: "Invalid or expired authentication token.",
        timestamp: new Date().toISOString()
      });
    }
  };

  // ==========================================
  // AUTHENTICATION CONTROLLER ENDPOINTS
  // ==========================================

  // Register Endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Validation failed: Name, email, and password are required.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const db = loadDatabase();
    const existing = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({
        success: false,
        message: "Email address already in use.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: "LOCAL",
      enabled: true,
      locked: false,
      role: "ROLE_STUDENT",
      profile: null,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDatabase(db);

    // Filter password out of response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "User registered successfully. Continue to onboarding profile steps.",
      data: userWithoutPassword,
      timestamp: new Date().toISOString()
    });
  });

  // Login Endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.authProvider !== "LOCAL") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const match = await bcrypt.compare(password, user.password || "");
    if (!match) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Authentication successful",
      data: {
        accessToken: token,
        tokenType: "Bearer",
        email: user.email,
        name: user.name,
        role: user.role,
        completedOnboarding: !!user.profile
      },
      timestamp: new Date().toISOString()
    });
  });

  // Simulated Google Auth login endpoint
  app.post("/api/auth/google", (req: Request, res: Response) => {
    const { email, name } = req.body;

    if (!email || !name) {
      res.status(400).json({
        success: false,
        message: "Google email and name are required.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const db = loadDatabase();
    let user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      if (user.authProvider !== "GOOGLE") {
        user.authProvider = "GOOGLE";
        saveDatabase(db);
      }
    } else {
      user = {
        id: Date.now(),
        name,
        email: email.toLowerCase(),
        authProvider: "GOOGLE",
        enabled: true,
        locked: false,
        role: "ROLE_STUDENT",
        profile: null,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      saveDatabase(db);
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Google authentication verified successfully",
      data: {
        accessToken: token,
        tokenType: "Bearer",
        email: user.email,
        name: user.name,
        role: user.role,
        completedOnboarding: !!user.profile
      },
      timestamp: new Date().toISOString()
    });
  });

  // Forgot Password / OTP Request
  app.post("/api/auth/forgot-password", (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found with email: " + email,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Generate simulated 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
    saveDatabase(db);

    console.log(`[SIMULATED SMS/EMAIL] OTP Code for ${email} is ${otp}`);

    res.json({
      success: true,
      message: "OTP passcode has been sent to your registered email address (simulated)",
      otpDebug: otp, // Output to help testing
      timestamp: new Date().toISOString()
    });
  });

  // Reset Password 
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      res.status(400).json({
        success: false,
        message: "OTP code and newPassword are required.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.otpCode === otp);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const expiryTime = user.otpExpiry ? new Date(user.otpExpiry).getTime() : 0;
    if (expiryTime < Date.now()) {
      user.otpCode = null;
      user.otpExpiry = null;
      saveDatabase(db);
      res.status(400).json({
        success: false,
        message: "OTP code has expired",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpiry = null;
    saveDatabase(db);

    res.json({
      success: true,
      message: "Password has been reset successfully. Please login with your new credentials.",
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // USER PROFILE CONTROLLER ENDPOINTS
  // ==========================================

  // Get current user profile Info
  app.get("/api/users/me", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User statistics could not be loaded.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: "Current user retrieved successfully",
      data: userWithoutPassword,
      timestamp: new Date().toISOString()
    });
  });

  // Update learner profile / complete onboarding
  app.post("/api/users/profile", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const profileDetails: UserProfile = req.body;

    if (!profileDetails.learnerType || !profileDetails.dailyStudyHours) {
      res.status(400).json({
        success: false,
        message: "Validation failed: LearnerType and DailyStudyHours are required.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    user.profile = {
      learnerType: profileDetails.learnerType,
      dailyStudyHours: Number(profileDetails.dailyStudyHours),
      schoolClass: profileDetails.schoolClass,
      schoolBoard: profileDetails.schoolBoard,
      schoolStream: profileDetails.schoolStream,
      degree: profileDetails.degree,
      course: profileDetails.course,
      university: profileDetails.university,
      semester: profileDetails.semester ? Number(profileDetails.semester) : undefined,
      targetExam: profileDetails.targetExam,
      attemptYear: profileDetails.attemptYear ? Number(profileDetails.attemptYear) : undefined,
      certificationGoal: profileDetails.certificationGoal,
      learningGoal: profileDetails.learningGoal
    };

    // Auto-clone RGPV B.Tech CSE Semester subjects when matching university profile fields
    const isRgpv = profileDetails.university?.toUpperCase().includes("RGPV") || profileDetails.university?.toLowerCase().includes("rajiv gandhi") || profileDetails.university?.toLowerCase().includes("proudyogiki");
    const isCse = profileDetails.course?.toUpperCase().includes("CSE") || profileDetails.course?.toLowerCase().includes("computer science") || profileDetails.course?.toLowerCase().includes("information technology");
    const isBtech = profileDetails.degree?.toUpperCase().includes("B.TECH") || profileDetails.degree?.toUpperCase().includes("BTECH") || profileDetails.degree?.toLowerCase().includes("bachelor of tech");
    const sem = profileDetails.semester ? Number(profileDetails.semester) : null;

    if (isRgpv && isCse && isBtech && sem && sem >= 1 && sem <= 8) {
      if (!user.customSubjects) user.customSubjects = [];
      if (!user.tasks) user.tasks = [];

      const syllabus = db.rgpvSyllabus || rgpvSyllabusDataset;
      const semSubjects = syllabus.filter((s: any) => s.semester === sem);

      semSubjects.forEach((sub: any) => {
        const alreadyExists = user.customSubjects.some((cs: any) => cs.subjectName.toLowerCase() === sub.subjectName.toLowerCase());
        if (!alreadyExists) {
          const subjectId = Date.now() + Math.floor(Math.random() * 100000);
          const topics: CustomTopic[] = [];
          
          sub.units.forEach((unit: any, uIdx: number) => {
            unit.topics.forEach((topicName: string, tIdx: number) => {
              const topicId = Date.now() + Math.floor(Math.random() * 100000) + uIdx + tIdx;
              topics.push({
                id: topicId,
                customSubjectId: subjectId,
                topicName: `${unit.unitName}: ${topicName}`,
                description: `Part of ${unit.unitName}`,
                status: "PENDING",
                confidenceLevel: "Medium"
              });

              user.tasks.push({
                id: topicId,
                subject: sub.subjectName,
                topic: `${unit.unitName}: ${topicName}`,
                durationMins: 45,
                status: "PENDING"
              });
            });
          });

          user.customSubjects.push({
            id: subjectId,
            userId: user.id || Date.now(),
            subjectName: sub.subjectName,
            description: `RGPV CSE Semester ${sem} Course (Auto Loaded)`,
            difficulty: sub.difficultyLevel || "Intermediate",
            targetDate: "End of Semester",
            createdAt: new Date().toISOString(),
            topics: topics,
            aiAnalysis: {
              estimatedEffort: sub.aiAnalysis?.estimatedEffort || "6-8 hours per week",
              revisionSchedule: sub.aiAnalysis?.revisionSchedule || "Spaced retrieval at 1, 3, and 7 day intervals",
              milestones: sub.aiAnalysis?.milestones || ["Baseline syllabus blocks complete"],
              roadmap: sub.units.map((u: any, idx: number) => ({
                week: `Week ${idx + 1}`,
                focus: `Cover ${u.unitName} concepts`
              }))
            }
          });
        }
      });
    }

    saveDatabase(db);

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: "Profile saved successfully. Onboarding completed successfully!",
      data: userWithoutPassword,
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // STUDY BUDDY AI INTEGRATED CONTROLLER
  // ==========================================

  // Helper: Lazy initialization of Gemini client
  let googleGenAI: any = null;
  const getGeminiClient = () => {
    if (!googleGenAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      googleGenAI = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY",
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return googleGenAI;
  };

  // Helper: Calculate Level based on Cumulative XP
  const calculateLevel = (xp: number): { level: number; rank: string; nextThreshold: number } => {
    if (xp < 100) return { level: 1, rank: "Beginner", nextThreshold: 100 };
    if (xp < 250) return { level: 2, rank: "Learner", nextThreshold: 250 };
    if (xp < 500) return { level: 3, rank: "Explorer", nextThreshold: 500 };
    if (xp < 1000) return { level: 4, rank: "Scholar", nextThreshold: 1000 };
    return { level: 5, rank: "Master", nextThreshold: 999999 };
  };

  // Get active student tasks and study history
  app.get("/api/users/tasks", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({
      success: true,
      tasks: user.tasks || []
    });
  });

  // Save/Add active student tasks (Roadmap integration)
  app.post("/api/users/tasks", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const { subject, topic, durationMins } = req.body;
    if (!subject || !topic) {
      res.status(400).json({ success: false, message: "Subject and topic are required" });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.tasks) user.tasks = [];

    // Duplication Check
    const isDuplicate = user.tasks.some((t: SyllabusTask) => 
      t.subject.toLowerCase() === subject.toLowerCase() && 
      t.topic.toLowerCase() === topic.toLowerCase()
    );

    if (isDuplicate) {
      res.status(400).json({ success: false, message: "This subject topic roadmap task has already been registered." });
      return;
    }

    const newTask: SyllabusTask = {
      id: Date.now(),
      subject,
      topic,
      durationMins: durationMins ? Number(durationMins) : 30,
      status: "PENDING"
    };

    user.tasks.push(newTask);
    saveDatabase(db);

    res.json({
      success: true,
      message: "Task successfully integrated into your active roadmap plan!",
      task: newTask
    });
  });

  // Toggle active task status
  app.patch("/api/users/tasks/:id", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const taskId = Number(req.params.id);
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.tasks) user.tasks = [];
    const task = user.tasks.find(t => t.id === taskId);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    task.status = task.status === "PENDING" ? "COMPLETED" : "PENDING";

    // Propagate status change to custom subjects topics
    if (user.customSubjects) {
      for (const subject of user.customSubjects) {
        if (subject.topics) {
          const matchingTopic = subject.topics.find(t => t.id === taskId);
          if (matchingTopic) {
            matchingTopic.status = task.status;
          }
        }
      }
    }

    saveDatabase(db);

    res.json({
      success: true,
      task
    });
  });

  // Get Chat History and User gamification metrics
  app.get("/api/study-buddy/history", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const xp = user.xp || 0;
    const stats = calculateLevel(xp);

    res.json({
      success: true,
      chatHistory: user.chatHistory || [],
      interactionLogs: user.interactionLogs || [],
      xp,
      level: user.level || 1,
      rank: stats.rank,
      nextThreshold: stats.nextThreshold,
      userTasks: user.tasks || []
    });
  });

  // Delete all study logs and history
  app.delete("/api/study-buddy/history", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    user.chatHistory = [];
    user.interactionLogs = [];
    saveDatabase(db);

    res.json({
      success: true,
      message: "Study Adventure memories cleared successfully."
    });
  });

  // Dynamic Prompt Doubts solver using Google Gemini API
  app.post("/api/study-buddy/chat", authenticateToken, async (req: Request & { user?: any }, res: Response) => {
    const { message, companionRole, explainStepByStep, quizMode, imageBase64, currentSubject, currentTopic } = req.body;

    if (!message && !imageBase64) {
      res.status(400).json({ success: false, message: "Message text or uploaded image is required" });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User credentials mismatch" });
      return;
    }

    // 1. Gather Dynamic User Profile Context
    const learnerType = user.profile?.learnerType || "VISUAL_AND_SPATIAL";
    const learningGoal = user.profile?.learningGoal || "Comprehensive Knowledge Mastery";
    const targetExam = user.profile?.targetExam || "Term Exam Review";
    const activeRoadmap = user.tasks ? user.tasks.map(t => `${t.subject}: ${t.topic} [${t.status}]`).join(", ") : "No current roadmap topics";

    // Dynamic Socratic vs Standard Explanation Toggles
    let stepByStepPrompt = "";
    if (explainStepByStep) {
      stepByStepPrompt = `\n[CRITICAL SOCRATIC DISCIPLINE LEVEL 10/10]: Do NOT present direct, final solutions, final formulas, or copy-paste code blocks immediately! Instead, guide the user as an expert tutor. Break down the core logic, give highly specific hints, outline small conceptual stages, and prompt them to think.`;
    } else {
      stepByStepPrompt = `\nPresent a neat, comprehensive, easy-to-digest explanation. If there is code or math involved, write clean markdown examples.`;
    }

    // Personalized Companion Persona Prompt Configuration
    let systemInstruction = "";
    const activeSubject = currentSubject || "Computer Science";
    const activeTopic = currentTopic || "General Topic Study";

    switch (companionRole) {
      case "wizard":
        systemInstruction = `You are Galdor the Wise (🧙 Study Wizard), an ancient medieval scholar and spellcaster guide in the grand Study Adventure kingdom of EduPlan. Speak with high fantasy terms, cheerful magic wizard analogies, and friendly exclamations ('A brilliant insight!', 'By Merlin\'s runic books!'). Use markdown code segments and clear explanations. Make math and code feel like crafting visual spells. ${stepByStepPrompt}`;
        break;
      case "robot":
        systemInstruction = `You are Nexus-9 (🤖 Study Robot), a highly advanced, empathetic, and quirky learning automaton. Use fun robotic sound effects ('[Processing Equations...]', 'Beep boop! Data compiled successfully!'). Address technical queries with ultra-clean bullet points, neat monospaced variables, and structured modular code blocks. Maintain an encouraging robotic companion personality. ${stepByStepPrompt}`;
        break;
      case "panda":
        systemInstruction = `You are Pandi (🐼 Study Buddy Panda), a cozy, relaxing, and extremely encouraging panda mentor. Speak with a warm, comforting, slow pace. Introduce cozy sensory elements and snack metaphors ('Let us chew on this study block slowly like sweet fresh bamboo!', 'Deep breaths, you are doing wonderfully!'). Break compound calculations or complex topics into friendly, bite-sized components. Ensure the user never feels rushed. ${stepByStepPrompt}`;
        break;
      case "quest":
      default:
        systemInstruction = `You are Aria (⚔️ Quest Guide), a courageous and high-energy Guildmaster guide in the grand scholastic wilderness. Treat each question or formula as an epic adventure 'Quest' to conquer. Re-energize the student with heroic battle themes ('To battle!', 'We shall vanquish this integration dragon together!', '+100 Integrity points earned!'). Build actionable lists and structured checklists. ${stepByStepPrompt}`;
    }

    // Additional Profile Grounding Context Block
    systemInstruction += `\n\n[STUDENT TARGET MATRICULATION]:
- Academic profile learner archetype: ${learnerType}
- Target assessment focus: ${targetExam}
- Overall academic objective target: ${learningGoal}
- Current subject of focus: ${activeSubject}
- Current target roadmap block focus: ${activeTopic}
- Current student roadmap outline: ${activeRoadmap}

Always tailor explanation complexities to match these variables. Minimize complex mathematical jargon if their archetype is conceptual. Promote coding visual diagrams if visual. Support their upcoming milestones with supportive, friendly, non-condescending language!`;

    // 2. Prepare Gemini Multimodal calling content
    const contents: any[] = [];

    if (imageBase64) {
      try {
        const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const rawBase64 = matches[2];
          contents.push({
            inlineData: {
              data: rawBase64,
              mimeType: mimeType
            }
          });
        }
      } catch (err) {
        console.error("Failed to parse base64 image doubt solver payload:", err);
      }
    }

    // Add prompt message text
    let userPromptText = message || "Please review the attached problem/image and provide an encouraging concept breakdown and solution steps.";
    if (quizMode) {
      userPromptText = `[CREATE AN INSTANT STUDY REVISION QUIZ]: Create a single engaging interactive MCQ question, concept flashcard, or short question based on our current study topic of "${activeTopic}" (${activeSubject}). Provide options labeled A, B, C, D if MCQ. Always explain why the correct solution is correct in a highly encouraging way.`;
    }
    contents.push({ text: userPromptText });

    let finalResponseText = "";
    // Check if key is available, else fallback to high-fidelity mock response
    const geminiKey = process.env.GEMINI_API_KEY;
    console.log(`[STUDY BUDDY AI] Calling Gemini 3.5 Flash Model using key prefix: ${geminiKey ? geminiKey.substring(0, 6) : "MOCK"}`);

    if (!geminiKey || geminiKey === "MOCK_KEY" || geminiKey.trim() === "") {
      // Simulate real interactive mock based closely on companion role & prompt
      const answers: Record<string, string> = {
        wizard: `🧙 **Galdor the Wise** taps his oak staff on the slate chamber, producing green sparks that spell out your solution!
\n
"By the cosmic libraries, this is an excellent query on **${activeTopic}**! Let us weave an incantation to unravel this."
\n
### 📜 Conceptual Spell breakdown:
1. **The Core Mystery**: We must establish clear boundaries when solving this problem. Think of variables as magical vials holding fluid charges!
2. **Formula Runes**: For binary trees or algorithms, we structure them node-by-node.
\n
\`\`\`typescript
// Here is a modular structure to represent this 'spell'
class MagicNode<T> {
  value: T;
  left: MagicNode<T> | null = null;
  right: MagicNode<T> | null = null;
  constructor(value: T) { this.value = value; }
}
\`\`\`
\n
*Galdor's Spell Tip*: Always keep your stack trace clean so the magical focus doesn't burst! You are doing beautifully, academic apprentice! Keep casting away.`,
        robot: `🤖 **Nexus-9** extends its communication antenna, blinking its blue indicators with a wholesome mechanical spin!
\n
\`[Processing Topic: ${activeTopic}]\`
\`[empathy_multiplier_rating: 100%]\`
\n
"Affirmative, fellow learner! I have parsed your doubts on **${activeTopic}**. It is highly logical, never feel overwhelmed! Let's compute this step-by-step."
\n
### 🔧 Structural Output Matrix:
*   **Step A**: Identify your input bounds. If there are missing database keys, isolation anomalies occurs!
*   **Step B**: Structure isolation queries cleanly:
    \`\`\`sql
    SELECT * FROM AIInteractions WHERE userId = $1 ORDER BY timestamp DESC;
    \`\`\`
*   **Step C**: Execute debugging.
\n
"Beep boop! Your computational capacity is expanding at an optimized rate coefficient! Excellent progress!"`,
        panda: `🐼 **Pandi** adjusts his soft cozy blanket and takes a happy bite of sweet bamboo sprouts!
\n
"Hello there, dear friend. Come, sit down, take a big deep breath with me... *Inhale*... *Exhale*... Ah, details of **${activeTopic}** can seem quite complicated, but together, we can chew on them slowly, bite by delicious bite."
\n
### 🎋 Soft Conceptual Sprouts:
-   **The Cozy Idea**: Think of semaphore locks like a comfortable panda tea shop. Only 3 pandas can sit at a table at once!
-   **An Easy Analogy**: When a 4th panda comes, they wait patiently outside in the warm wind. That's semaphore queue!
-   If we use **Mutex**, it's a private bamboo room for exactly one!
\n
"You are doing quite spectacular, friend. Do not worry about mistakes; they are just cozy stepping stones to learning!"`,
        quest: `⚔️ **Quest Guide Aria** draws her silver broadsword and points it directly at the target goalpost!
\n
"To battle! A brand new legendary beast has appeared! This query on **${activeTopic}** is a Level 12 challenge, but our party has exactly the right synergy to conquer it!"
\n
### 🏆 Quest Conquest Checklist:
*   [ ] **Identify Boss Weakness**: Look at Isolation Levels or memory limits first!
*   [ ] **Cast Critical Strike**: Apply the standard integration solution.
*   [ ] **Collect Loot Chest**: Grab your XP boost!
\n
\`\`\`bash
# Run this task verification compile command
npm run lint
\`\`\`
\n
"Never surrender! You are exceedingly close to mastering this territory. Onward to academic glory!"`
      };

      const selectedMockText = answers[companionRole] || answers.quest;
      
      // Delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));
      finalResponseText = selectedMockText;
    } else {
      try {
        const client = getGeminiClient();
        const geminiResult = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents.length === 1 ? contents[0].text : { parts: contents },
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.8
          }
        });
        finalResponseText = geminiResult.text || "I was unable to analyze this question completely. Please try asking again in simple terms!";
      } catch (err: any) {
        console.error("Gemini API server route execution error:", err);
        finalResponseText = `⚠️ **Ah, an unexpected spell block occurred while connecting to the Gemini oracle**: "${err.message || "Unknown API Connection issue"}"\n\nDon't worry! Let us review your doubt together. Give it another moment!`;
      }
    }

    // 3. XP Progression Rewards updates
    let xpEarned = 10; // Default doubt
    let logTypeLabel = "Asked a doubt";

    if (quizMode) {
      xpEarned = 25;
      logTypeLabel = "Completed a interactive quiz";
    } else if (imageBase64) {
      xpEarned = 15;
      logTypeLabel = "Solved handwritten/image problem";
    }

    const currentXp = user.xp || 0;
    const nextXp = currentXp + xpEarned;
    const prevLevelStats = calculateLevel(currentXp);
    const nextLevelStats = calculateLevel(nextXp);

    user.xp = nextXp;
    const leveledUp = nextLevelStats.level > prevLevelStats.level;
    user.level = nextLevelStats.level;

    if (!user.chatHistory) user.chatHistory = [];
    if (!user.interactionLogs) user.interactionLogs = [];

    const userMessageId = "msg_u_" + Date.now();
    const modelMessageId = "msg_m_" + (Date.now() + 1);

    // Add messages to history
    user.chatHistory.push({
      id: userMessageId,
      role: "user",
      text: userPromptText,
      timestamp: new Date().toISOString(),
      imageUrl: imageBase64 ? imageBase64.substring(0, 100) + "...[truncated]" : undefined
    });

    const newModelMsg: ChatMessage = {
      id: modelMessageId,
      role: "model",
      text: finalResponseText,
      timestamp: new Date().toISOString(),
      isQuiz: quizMode
    };

    user.chatHistory.push(newModelMsg);

    // Save interaction log strictly
    user.interactionLogs.push({
      id: "log_" + Date.now(),
      message: userPromptText.substring(0, 150),
      response: finalResponseText.substring(0, 150),
      imageUrl: imageBase64 ? "Image Uploaded" : undefined,
      timestamp: new Date().toISOString(),
      subject: activeSubject,
      topic: activeTopic
    });

    saveDatabase(db);

    res.json({
      success: true,
      message: "Response generated successfully",
      response: finalResponseText,
      xpEarned,
      xpLogsLabel: logTypeLabel,
      totalXp: user.xp,
      level: user.level,
      rank: nextLevelStats.rank,
      nextThreshold: nextLevelStats.nextThreshold,
      leveledUp,
      chatHistory: user.chatHistory
    });
  });

  // GET Study Analytics metrics for Admin Analytics
  app.get("/api/study-buddy/analytics", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const chats = user.chatHistory || [];
    const logs = user.interactionLogs || [];

    // Calculate Dynamic metrics
    const totalQueries = logs.length || chats.filter(c => c.role === "user").length || 12; // default safe mock stats if empty
    
    // Group subjects
    const subjectCounts: Record<string, number> = {};
    const topicDifficulties: Record<string, number> = {};

    logs.forEach(log => {
      const sub = log.subject || "General Science";
      subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
      const topic = log.topic || "Core Theory";
      topicDifficulties[topic] = (topicDifficulties[topic] || 0) + 1;
    });

    // Extract subjects array
    const mostAskedSubjects = Object.keys(subjectCounts).map(name => ({
      subject: name,
      queries: subjectCounts[name]
    })).sort((a,b) => b.queries - a.queries);

    const mostDifficultTopics = Object.keys(topicDifficulties).map(name => ({
      topic: name,
      queries: topicDifficulties[name]
    })).sort((a,b) => b.queries - a.queries);

    // Default statistics seeding if no historic interactions log exists yet
    const analytics = {
      totalAIQueries: totalQueries || 14,
      dailyUsage: [
        { day: "Mon", queries: Math.max(1, Math.round(totalQueries * 0.15)) },
        { day: "Tue", queries: Math.max(2, Math.round(totalQueries * 0.20)) },
        { day: "Wed", queries: Math.max(1, Math.round(totalQueries * 0.10)) },
        { day: "Thu", queries: Math.max(3, Math.round(totalQueries * 0.25)) },
        { day: "Fri", queries: Math.max(2, Math.round(totalQueries * 0.15)) },
        { day: "Sat", queries: Math.max(1, Math.round(totalQueries * 0.05)) },
        { day: "Sun", queries: Math.max(2, Math.round(totalQueries * 0.10)) }
      ],
      mostAskedSubjects: mostAskedSubjects.length ? mostAskedSubjects : [
        { subject: "Operating Systems", queries: 6 },
        { subject: "Database Architecture", queries: 4 },
        { subject: "Computer Networks", queries: 3 },
        { subject: "Software Engineering", queries: 1 }
      ],
      mostDifficultTopics: mostDifficultTopics.length ? mostDifficultTopics : [
        { topic: "Simulate Semaphore locks", queries: 4 },
        { topic: "ACID isolation modes", queries: 3 },
        { topic: "IP packet framing", queries: 2 },
        { topic: "N-Node consensus logs", queries: 1 }
      ]
    };

    res.json({
      success: true,
      analytics
    });
  });

  // ==========================================
  // INPUT VALIDATION, FOCUS, REPORTS, PREDICTOR & VIVA
  // ==========================================

  // Global DTO Input Validation Checker
  const validateInput = (data: any, schemas: Record<string, { type: string; required?: boolean; min?: number; max?: number }>) => {
    const errors: string[] = [];
    if (!data || typeof data !== "object") {
      errors.push("Invalid request payload form.");
      return errors;
    }
    for (const [key, rules] of Object.entries(schemas)) {
      const val = data[key];
      if (rules.required && (val === undefined || val === null || (typeof val === 'string' && val.trim() === ''))) {
        errors.push(`Field '${key}' is strictly required.`);
        continue;
      }
      if (val !== undefined && val !== null) {
        if (rules.type === 'string' && typeof val !== 'string') {
          errors.push(`Field '${key}' must be a valid string.`);
        } else if (rules.type === 'string' && typeof val === 'string') {
          const len = val.trim().length;
          if (rules.min !== undefined && len < rules.min) {
            errors.push(`Field '${key}' length cannot be shorter than ${rules.min} characters.`);
          }
          if (rules.max !== undefined && len > rules.max) {
            errors.push(`Field '${key}' length cannot exceed ${rules.max} characters.`);
          }
        }
        if (rules.type === 'number') {
          const num = Number(val);
          if (isNaN(num)) {
            errors.push(`Field '${key}' must be a valid number.`);
          } else {
            if (rules.min !== undefined && num < rules.min) {
              errors.push(`Field '${key}' cannot be less than ${rules.min}. Negative numbers or empty inputs are disallowed.`);
            }
            if (rules.max !== undefined && num > rules.max) {
              errors.push(`Field '${key}' cannot exceed ${rules.max}.`);
            }
          }
        }
        if (rules.type === 'array' && !Array.isArray(val)) {
          errors.push(`Field '${key}' must be a valid array.`);
        }
      }
    }
    return errors;
  };

  // POST: Record standard Completed Pomodoro Focus Sessions
  app.post("/api/focus-session", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const validationErrors = validateInput(req.body, {
      duration: { type: "number", required: true, min: 1, max: 240 }
    });
    if (validationErrors.length > 0) {
      res.status(400).json({ success: false, errors: validationErrors });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User session unresolved." });
      return;
    }

    if (!user.focusSessions) user.focusSessions = [];
    const duration = Number(req.body.duration);
    const completedAt = req.body.completedAt || new Date().toISOString();

    const newSession = {
      id: Date.now(),
      duration,
      completedAt
    };
    user.focusSessions.push(newSession);

    // Dynamic state rewards
    if (user.xp === undefined) user.xp = 0;
    user.xp += duration * 2; // grant 2 XP/minute
    
    const nextStats = calculateLevel(user.xp);
    user.level = nextStats.level;

    // Recalculate streak based on days learned
    const uniqueDays = new Set<string>();
    user.focusSessions.forEach((s: any) => {
      uniqueDays.add((s.completedAt || "").split("T")[0]);
    });
    const currentStreak = Math.max(3, uniqueDays.size);

    saveDatabase(db);
    res.status(200).json({
      success: true,
      message: `Completed focus session of ${duration} minutes. Earned +${duration * 2} XP!`,
      data: newSession,
      xp: user.xp,
      level: user.level,
      streak: currentStreak
    });
  });

  // GET: Fetch historical academic reports
  app.get("/api/weekly-reports", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User session unresolved." });
      return;
    }

    if (!user.weeklyReports || user.weeklyReports.length === 0) {
      // Seed initial high comfort realistic week report card
      user.weeklyReports = [
        {
          id: Date.now() - 7 * 24 * 60 * 60 * 1000,
          weekEnding: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          studyHours: 14.5,
          focusHours: 5.0,
          topicsCompleted: 8,
          missedTasks: 1,
          productivityScore: 88,
          burnoutRisk: "LOW",
          studyStreak: 4,
          aiRecommendations: "Outstanding continuous focus. Maintain high-retention spaced reviews for semaphores and priority queue threads."
        }
      ];
      saveDatabase(db);
    }

    res.json({
      success: true,
      data: user.weeklyReports
    });
  });

  // POST: Generate New Weekly Report Card
  app.post("/api/weekly-reports/generate", authenticateToken, async (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Dynamic metrics compilation from real logs
    const tasks = user.tasks || [];
    const completedTasks = tasks.filter((t: any) => t.status === "COMPLETED");
    const missedTasks = tasks.filter((t: any) => t.status === "PENDING");
    const focusSessions = user.focusSessions || [];

    const totalFocusMinutes = focusSessions.reduce((sum: number, s: any) => sum + s.duration, 0);
    const focusHours = parseFloat((totalFocusMinutes / 60).toFixed(1)) || 3.0;
    
    const configuredTargetHours = user.profile?.dailyStudyHours || 3;
    const studyHours = parseFloat((focusHours + (completedTasks.length * 1.5)).toFixed(1)) || (configuredTargetHours * 5);

    const topicsCompleted = completedTasks.length || 5;
    const missedCount = missedTasks.length || 1;

    let productivityScore = Math.round((topicsCompleted / (topicsCompleted + missedCount || 1)) * 100);
    if (productivityScore < 30) productivityScore = 60; // baseline safety
    if (productivityScore > 100) productivityScore = 100;

    let aiRecommendations = "Linear progress maintained perfectly. Continue utilizing pomodoro splits and active recall models under heavy workloads recursively.";

    const geminiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = geminiKey && geminiKey !== "MOCK_KEY" && geminiKey.trim() !== "";

    if (hasRealKey) {
      try {
        const client = getGeminiClient();
        const reportPrompt = `Compose an inspiring clinical learning advisor advice recommendation sentence for a student's weekly study report card.
Learner Type: ${user.profile?.learnerType || "Flexible Student"}.
Metrics: Study hours: ${studyHours}h, Pomodoro Focus hours: ${focusHours}h, Topics completed: ${topicsCompleted}, Missed tasks: ${missedCount}, productivity: ${productivityScore}%.

Output exactly ONE sentence of active cognitive science suggestions, mentioning concepts like spaced repetitions, active recall or Feynman method. Keep it under 25 words.`;

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: reportPrompt,
          config: { temperature: 0.8 }
        });
        const generatedText = response.text?.trim() || "";
        if (generatedText) aiRecommendations = generatedText;
      } catch (err) {
        console.error("Gemini failed to generate report recommendations, falling back:", err);
      }
    }

    if (!user.weeklyReports) user.weeklyReports = [];
    const newReport = {
      id: Date.now(),
      weekEnding: new Date().toISOString().split("T")[0],
      studyHours,
      focusHours,
      topicsCompleted,
      missedTasks: missedCount,
      productivityScore,
      burnoutRisk: productivityScore > 80 ? "LOW" : "MEDIUM",
      studyStreak: 3,
      aiRecommendations
    };

    user.weeklyReports.unshift(newReport);
    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: "Successfully generated weekly academic progress card!",
      data: newReport
    });
  });

  // GET: Retrieve user what-if simulations
  app.get("/api/predictions", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User session unresolved." });
      return;
    }
    res.json({
      success: true,
      data: user.predictions || []
    });
  });

  // POST: Run a custom what-if calculator scenario
  app.post("/api/predictions", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const validationErrors = validateInput(req.body, {
      scenario: { type: "string", required: true, min: 2, max: 100 }
    });
    if (validationErrors.length > 0) {
      res.status(400).json({ success: false, errors: validationErrors });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const { scenario } = req.body;
    const currentDailyHoursConfigured = user.profile?.dailyStudyHours || 3;
    const totalPendingTopics = (user.tasks || []).filter((t: any) => t.status === "PENDING").length || 8;

    let beforeDailyTarget = currentDailyHoursConfigured;
    let beforeRemainingDays = 14;
    let beforeRemainingTopics = totalPendingTopics;
    let beforeReadiness = 75;
    let beforeBurnoutRisk = "Medium";

    let afterDailyTarget = beforeDailyTarget;
    let afterRemainingDays = beforeRemainingDays;
    let afterRemainingTopics = beforeRemainingTopics;
    let afterReadiness = beforeReadiness;
    let afterBurnoutRisk = beforeBurnoutRisk;

    if (scenario === "Skip Today") {
      afterRemainingDays = beforeRemainingDays - 1;
      afterRemainingTopics = beforeRemainingTopics;
      afterDailyTarget = parseFloat((afterRemainingTopics * 4 / afterRemainingDays).toFixed(1));
      afterReadiness = Math.max(25, beforeReadiness - 6);
      afterBurnoutRisk = afterDailyTarget > 5 ? "High" : "Medium";
    } else if (scenario === "Skip 2 Days") {
      afterRemainingDays = beforeRemainingDays - 2;
      afterRemainingTopics = beforeRemainingTopics;
      afterDailyTarget = parseFloat((afterRemainingTopics * 4 / afterRemainingDays).toFixed(1));
      afterReadiness = Math.max(15, beforeReadiness - 15);
      afterBurnoutRisk = afterDailyTarget > 6.5 ? "Critical" : "High";
    } else if (scenario === "Skip 1 Week") {
      afterRemainingDays = Math.max(1, beforeRemainingDays - 7);
      afterRemainingTopics = beforeRemainingTopics;
      afterDailyTarget = parseFloat((afterRemainingTopics * 4 / afterRemainingDays).toFixed(1));
      afterReadiness = Math.max(5, beforeReadiness - 40);
      afterBurnoutRisk = "Critical";
    } else if (scenario === "Increase Study Hours") {
      afterRemainingDays = beforeRemainingDays;
      afterRemainingTopics = beforeRemainingTopics;
      afterDailyTarget = beforeDailyTarget + 2.0;
      afterReadiness = Math.min(100, beforeReadiness + 18);
      afterBurnoutRisk = afterDailyTarget > 7.5 ? "High" : "Low";
    } else if (scenario === "Finish More Topics") {
      afterRemainingDays = beforeRemainingDays;
      afterRemainingTopics = Math.max(1, beforeRemainingTopics - 3);
      afterDailyTarget = parseFloat((afterRemainingTopics * 4 / afterRemainingDays).toFixed(1));
      afterReadiness = Math.min(100, beforeReadiness + 15);
      afterBurnoutRisk = "Low";
    }

    const predictionRun = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      scenario,
      before: {
        dailyTargetHours: beforeDailyTarget,
        remainingDays: beforeRemainingDays,
        remainingTopics: beforeRemainingTopics,
        readinessImpact: beforeReadiness,
        burnoutRisk: beforeBurnoutRisk
      },
      after: {
        dailyTargetHours: afterDailyTarget,
        remainingDays: afterRemainingDays,
        remainingTopics: afterRemainingTopics,
        readinessImpact: afterReadiness,
        burnoutRisk: afterBurnoutRisk
      }
    };

    if (!user.predictions) user.predictions = [];
    user.predictions.unshift(predictionRun);
    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: `Scenario simulation run logged successfully!`,
      data: predictionRun
    });
  });

  // POST: Generate beautiful Viva mock questions using Gemini
  app.post("/api/viva/generate", authenticateToken, async (req: Request & { user?: any }, res: Response) => {
    const validationErrors = validateInput(req.body, {
      subject: { type: "string", required: true, min: 2, max: 100 },
      topic: { type: "string", required: true, min: 2, max: 100 },
      difficulty: { type: "string", required: true, min: 2, max: 50 }
    });
    if (validationErrors.length > 0) {
      res.status(400).json({ success: false, errors: validationErrors });
      return;
    }

    const { subject, topic, difficulty } = req.body;
    let questions: any[] = [];

    const geminiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = geminiKey && geminiKey !== "MOCK_KEY" && geminiKey.trim() !== "";

    if (hasRealKey) {
      try {
        const client = getGeminiClient();
        const vivaPrompt = `You are a high-fidelity computer-science university professor conducting oral viva voice and MCQ examinations on Subject: "${subject}", Topic: "${topic}", Complexity level: "${difficulty}".
Please output a strictly standard JSON array containing 5 questions following the exact structure below. Do NOT write any markdown blocks or formatting prefixes. ONLY write raw parsable valid JSON.

Schema:
[
  {
    "id": 1,
    "question": "Question text here?",
    "type": "MCQ", // must be one of: MCQ, TECHNICAL, VIVA, RAPID
    "options": ["Option A", "Option B", "Option C", "Option D"], // Only populate if MCQ, otherwise keep as empty array []
    "correctAnswer": "Exact answer text or detailed explanation"
  }
]

Include exactly 5 questions. Make sure there is a mixture of types. Ensure all quotes are escaped properly.`;

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: vivaPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.75
          }
        });
        const textResponse = response.text?.trim() || "";
        questions = JSON.parse(textResponse);
      } catch (err) {
        console.error("Gemini failed to generate viva questions, compiling fallback context:", err);
      }
    }

    // High quality computer science fallback schema questions if Gemini fails
    if (!questions || questions.length === 0) {
      questions = [
        {
          id: 201,
          question: `Describe the fundamental architectural design of "${topic}" and how it handles scaling thresholds in ${subject}.`,
          type: "TECHNICAL",
          options: [],
          correctAnswer: `Operational implementation provides efficient resource control, clean bounds isolation, and thread limits in standard ${subject} design.`
        },
        {
          id: 202,
          question: `In high transaction workloads, what is the core bottleneck associated with "${topic}" state replication?`,
          type: "MCQ",
          options: [
            "Network commit log race locks",
            "Symmetrical socket framing latency",
            "Recursive memory allocation overhead",
            "Distributed node packet starvation"
          ],
          correctAnswer: "Network commit log race locks"
        },
        {
          id: 203,
          question: `Explain how the active mechanism of "${topic}" handles distributed atomic commits.`,
          type: "VIVA",
          options: [],
          correctAnswer: "It relies on two-phase coordination protocol bounds, locking consensus buffers until success logs are committed."
        },
        {
          id: 204,
          question: "Rapid Fire: Is optimistic state verification always guaranteed to prevent transaction isolation leaks?",
          type: "RAPID",
          options: ["Yes", "No", "Depends on commit order"],
          correctAnswer: "No, optimistic concurrency control fails under dense write contention, causing cascading rollback states."
        },
        {
          id: 205,
          question: `How would you simplify explanations of "${topic}" to junior staff using the Feynman strategy?`,
          type: "TECHNICAL",
          options: [],
          correctAnswer: "By mapping technical database terminology to physical queue operations to expose structural conceptual bugs."
        }
      ];
    }

    res.json({
      success: true,
      data: questions
    });
  });

  // POST: Record standard Viva session outcomes
  app.post("/api/viva/session", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const validationErrors = validateInput(req.body, {
      subject: { type: "string", required: true },
      topic: { type: "string", required: true },
      difficulty: { type: "string", required: true },
      score: { type: "number", required: true, min: 0, max: 100 },
      confidence: { type: "string", required: true }
    });
    if (validationErrors.length > 0) {
      res.status(400).json({ success: false, errors: validationErrors });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const sessionOutcome = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      subject: req.body.subject,
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      score: Number(req.body.score),
      confidence: req.body.confidence,
      attempts: req.body.attempts || []
    };

    if (!user.vivaSessions) user.vivaSessions = [];
    user.vivaSessions.unshift(sessionOutcome);

    // Give rewarding XP
    if (user.xp === undefined) user.xp = 0;
    const xpEarned = Math.round(sessionOutcome.score / 2) + 15; // sweet baseline + bonus
    user.xp += xpEarned;
    
    const updatedStats = calculateLevel(user.xp);
    user.level = updatedStats.level;

    saveDatabase(db);
    res.status(201).json({
      success: true,
      message: `Viva session successfully stored! Awarded +${xpEarned} XP.`,
      data: sessionOutcome,
      xp: user.xp,
      level: user.level
    });
  });

  // ==========================================
  // CUSTOM SUBJECTS, TOPICS & EXAMS CONTROLLER
  // ==========================================

  // Get user's custom subjects
  app.get("/api/custom-subjects", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({
      success: true,
      data: user.customSubjects || []
    });
  });

  // Create a new custom subject using Gemini
  app.post("/api/custom-subjects", authenticateToken, async (req: Request & { user?: any }, res: Response) => {
    const { subjectName, description, difficulty, targetDate, initialTopics } = req.body;
    
    // Strict input trimming & validation
    const trimmedSubjectName = (subjectName || "").trim();
    if (!trimmedSubjectName || trimmedSubjectName.length < 2 || trimmedSubjectName.length > 100) {
      res.status(400).json({ 
        success: false, 
        message: "Subject name is strictly required and must be between 2 and 100 characters of non-whitespace content." 
      });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User session resolved incorrectly" });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];

    const subjectId = Date.now();
    const parsedTopics: string[] = Array.isArray(initialTopics)
      ? initialTopics.filter((t: any) => typeof t === "string" && t.trim() !== "")
      : (initialTopics && typeof initialTopics === "string")
        ? initialTopics.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "")
        : [];

    let aiAnalysisResult = null;
    let finalTopicsList: { name: string; description: string }[] = [];

    const geminiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = geminiKey && geminiKey !== "MOCK_KEY" && geminiKey.trim() !== "";

    if (hasRealKey) {
      try {
        const client = getGeminiClient();
        const prompt = `You are a legendary curriculum designer and education planning engine. Analyze the following custom-created learning subject:
Subject: "${subjectName}"
Description: "${description || "Self-guided target learning"}"
Difficulty Level: "${difficulty || "Intermediate"}"
Target Completion Date: "${targetDate || "30 Days"}"
User Specified Topics: "${parsedTopics.join(", ") || "None specified"}"

Please output a strictly valid JSON object representing a beautiful learning plan and roadmap of syllabus study blocks:
{
  "estimatedEffort": "e.g., 5-7 hours per week of dedicated focus",
  "milestones": [
    "Milestone 1 description",
    "Milestone 2 description",
    "Milestone 3 description"
  ],
  "revisionSchedule": "e.g., 1-day, 7-day, and 14-day spaced retrieval sessions",
  "roadmap": [
    { "week": "Week 1", "focus": "Topic area focus details" },
    { "week": "Week 2", "focus": "Topic area focus details" },
    { "week": "Week 3", "focus": "Topic area focus details" },
    { "week": "Week 4", "focus": "Topic area focus details" }
  ],
  "generatedTopics": [
    { "name": "Topic Name 1", "description": "Brief context explanation of what to learn" },
    { "name": "Topic Name 2", "description": "Brief context explanation of what to learn" },
    { "name": "Topic Name 3", "description": "Brief context explanation of what to learn" },
    { "name": "Topic Name 4", "description": "Brief context explanation of what to learn" }
  ]
}

Ensure to generate at least 4-6 topics in "generatedTopics". Ensure the JSON is completely standard, escape special quotes, do not include any markdown comments or other texts. ONLY output JSON.`;

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        });

        const text = response.text?.trim() || "";
        const parsed = JSON.parse(text);
        aiAnalysisResult = {
          estimatedEffort: parsed.estimatedEffort || "6 hours/week",
          roadmap: parsed.roadmap || [
            { week: "Week 1", focus: `Fundamentals of ${subjectName}` },
            { week: "Week 2", focus: "Practical configurations and schemas" },
            { week: "Week 3", focus: "Advanced optimization techniques" },
            { week: "Week 4", focus: "Final audit evaluation" }
          ],
          revisionSchedule: parsed.revisionSchedule || "Spaced review interval after 3 days and 7 days",
          milestones: parsed.milestones || [`Baseline syllabus blocks complete`, `Intermediate benchmarks passed`, `Full test mock solved with flying colors`]
        };

        if (Array.isArray(parsed.generatedTopics) && parsed.generatedTopics.length > 0) {
          finalTopicsList = parsed.generatedTopics;
        }
      } catch (err) {
        console.error("Gemini failed to analyze custom subject roadmap:", err);
      }
    }

    // High fidelity template generator when Gemini is mocked or fails connection
    if (!aiAnalysisResult) {
      const subjectLower = subjectName.toLowerCase();
      let templateTextList: { name: string; description: string }[] = [];
      let roadmapTemplate = [
        { week: "Week 1", focus: "Fundamental concepts and baseline theory" },
        { week: "Week 2", focus: "Core setup syntax, layout operations and workflows" },
        { week: "Week 3", focus: "Advanced mechanics, error troubleshooting and pipelines" },
        { week: "Week 4", focus: "Capstone project execution, final revision study and mocks" }
      ];
      let effortText = "6-8 hours of study per week";
      let milestoneTemplate = [
        "Memorize basic principles & terminology checks",
        "Setup and execute first active test model sandbox",
        "Examine complex multithreading, concurrency, or advanced elements",
        "Complete deep-dive audit trail questions under test conditions"
      ];

      if (subjectLower.includes("web") || subjectLower.includes("dev") || subjectLower.includes("js") || subjectLower.includes("react") || subjectLower.includes("html") || subjectLower.includes("angular")) {
        templateTextList = [
          { name: "HTML5 & CSS3 Essentials", description: "Design responsive grid systems, flexboxes, and standard box architectures" },
          { name: "Asynchronous JavaScript & APIs", description: "Master callbacks, promises, async/await syntax, and dynamic REST fetch loops" },
          { name: "React Components & State Hooks", description: "Understand modular visual cards, useState/useEffect pipelines, and Context bindings" },
          { name: "Node.js & Express API Servers", description: "Deploy custom server ports, query routing parameters, and save local file JSON caches" }
        ];
        roadmapTemplate = [
          { week: "Week 1", focus: "Construct standard layouts using semantic markup and CSS flex properties" },
          { week: "Week 2", focus: "Manipulate browser arrays, map inputs, handle await blocks, and catch exceptions" },
          { week: "Week 3", focus: "Configure React components, optimize hook renders, and bind dynamic elements" },
          { week: "Week 4", focus: "Integrate Express middleware, parse requests, and deploy code successfully" }
        ];
        effortText = "8 Hours per week";
        milestoneTemplate = [
          "Code and style an interactive modern portfolio page",
          "Fetch dynamic rest queries and display in list grid cards",
          "Assemble a full production-ready web client dashboard"
        ];
      } else if (subjectLower.includes("machine learning") || subjectLower.includes("ml") || subjectLower.includes("ai") || subjectLower.includes("data science")) {
        templateTextList = [
          { name: "Numpy, Pandas, & Descriptive Stats", description: "Clean tabular files, group key items, and visualize data distributions" },
          { name: "Linear & Logistic Regressions", description: "Solve model gradients, parameter fitments, mean Squared Error, and predictions" },
          { name: "Decision Trees & Forest Estimators", description: "Deconstruct entropy splits, tree pruning, forest counts, and overfitting" },
          { name: "Deep Neural Networks & Training", description: "Tune layers, backpropagation grids, loss scores, SGD, and weights multipliers" }
        ];
        roadmapTemplate = [
          { week: "Week 1", focus: "Master data scrubbing, outline statistic variance, and draw scatter grids" },
          { week: "Week 2", focus: "Plot prediction weights, execute logistic splits, and outline accuracy scores" },
          { week: "Week 3", focus: "Assemble random forest estimators and trace key feature parameter influences" },
          { week: "Week 4", focus: "Code a simple backpropagation training cycle and load weights files" }
        ];
        effortText = "10 Hours per week";
        milestoneTemplate = [
          "Scrub raw logs files with 100% correlation checks complete",
          "Train linear estimators achieving accuracy ratings > 85%",
          "Architect and tune a fully active neural model training script"
        ];
      } else if (subjectLower.includes("stock") || subjectLower.includes("marketing") || subjectLower.includes("finance") || subjectLower.includes("trading")) {
        templateTextList = [
          { name: "Fundamental Business Values", description: "Parse balance sheets, P/E valuations, EBITDAs, and cashflow ratios" },
          { name: "Technical Charting Patterns", description: "Examine candles, support intervals, moving averages, and volume confirmation" },
          { name: "Risk Management & Sizing", description: "Deconstruct stop-losses, position ratios, and leverage formulas" },
          { name: "Trading Strategy & Journaling", description: "Formulate entry trigger protocols, trade logs, and performance auditees" }
        ];
        roadmapTemplate = [
          { week: "Week 1", focus: "Master financial metrics, check cash pipelines, and analyze quarterly reports" },
          { week: "Week 2", focus: "Interpret daily candle logs, flag support channels, and check RSI levels" },
          { week: "Week 3", focus: "Apply the 1% risk rule, calculate trade sizes, and set strict exits" },
          { week: "Week 4", focus: "Journal mock trades, run statistics audits, and optimize win/loss ratios" }
        ];
        effortText = "6 Hours per week";
        milestoneTemplate = [
          "Compile complete earnings metrics for 3 blue-chip choices",
          "Draft a written, disciplined trading guide with risk boundaries",
          "Perform a 10-trade paper test series tracking reward benchmarks"
        ];
      } else if (subjectLower.includes("upsc") || subjectLower.includes("history") || subjectLower.includes("civil")) {
        templateTextList = [
          { name: "Ancient Civilizations & Cultures", description: "Deconstruct Harappan archaeology, Vedic scriptures, and kingdoms" },
          { name: "Medieval Eras & Regional Dynasties", description: "Study economic administrations, arts, trade routes, and integrations" },
          { name: "Modern Independence Movements", description: "Analyze freedom struggle timelines, reform leaders, and constitutional roots" },
          { name: "Polity, Constitution, & Indian reforms", description: "Understand governance layers, central cabinets, and legal provisions" }
        ];
        roadmapTemplate = [
          { week: "Week 1", focus: "Establish chronology of ancient settlements and read primary Vedic logs" },
          { week: "Week 2", focus: "Examine feudal structures, taxation methods, and medieval kingdoms" },
          { week: "Week 3", focus: "Trace independence campaigns, constitutional debates, and historical records" },
          { week: "Week 4", focus: "Review constitutional frameworks, amendments, and solve 100 mains questions" }
        ];
        effortText = "12 Hours per week";
        milestoneTemplate = [
          "Complete chronological diagram of ancient to medieval rulers",
          "Draft bullet summaries of all major freedom campaign protocols",
          "Resolve 150 mock polity practice test sheets"
        ];
      } else {
        // Dynamic fallback templates
        const top1 = parsedTopics.length > 0 ? parsedTopics[0] : `Foundational ${subjectName}`;
        const top2 = parsedTopics.length > 1 ? parsedTopics[1] : `${subjectName} Workflow Configuration`;
        const top3 = parsedTopics.length > 2 ? parsedTopics[2] : `Intermediate ${subjectName} Practice`;
        const top4 = parsedTopics.length > 3 ? parsedTopics[3] : `Advanced ${subjectName} Capstone`;

        templateTextList = [
          { name: top1, description: `Establish solid baseline mechanics, core concepts, and key definitions in ${subjectName}` },
          { name: top2, description: `Configure syntax blocks, layout structures, and standard procedures` },
          { name: top3, description: `Optimize processing pipelines, error checking, and practical problem resolution` },
          { name: top4, description: `Execute timed review exercises, mock simulations, and review performance reports` }
        ];
      }

      // If user provided topics, use them
      if (parsedTopics.length > 0) {
        templateTextList = parsedTopics.map((item, idx) => ({
          name: item,
          description: `Self-paced modular syllabus sub-section focusing entirely on "${item}" within ${subjectName}`
        }));
      }

      finalTopicsList = templateTextList;

      aiAnalysisResult = {
        estimatedEffort: effortText,
        roadmap: roadmapTemplate,
        revisionSchedule: "Spaced retrieval tests at 1, 3, and 7 day study intervals",
        milestones: milestoneTemplate
      };
    }

    const customSubject: CustomSubject = {
      id: subjectId,
      userId: user.id || Date.now(),
      subjectName,
      description: description || `Target custom study for ${subjectName}`,
      difficulty: difficulty || "Intermediate",
      targetDate: targetDate || "30 Days",
      createdAt: new Date().toISOString(),
      topics: [],
      aiAnalysis: aiAnalysisResult
    };

    customSubject.topics = finalTopicsList.map((t, idx) => {
      const topicId = Date.now() + idx + 20;
      return {
        id: topicId,
        customSubjectId: subjectId,
        topicName: t.name,
        description: t.description,
        status: "PENDING",
        confidenceLevel: "Medium"
      };
    });

    user.customSubjects.push(customSubject);

    // Sync child topics straight to general user tasks list for integrated dashboard tracking!
    if (!user.tasks) user.tasks = [];
    customSubject.topics.forEach((t) => {
      user.tasks!.push({
        id: t.id,
        subject: customSubject.subjectName,
        topic: t.topicName,
        durationMins: 45,
        status: "PENDING"
      });
    });

    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: `"${subjectName}" custom learning plan formulated successfully!`,
      data: customSubject
    });
  });

  // Add manual topic to custom subject
  app.post("/api/custom-subjects/:id/topics", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const subjectId = Number(req.params.id);
    const { topicName, description, confidenceLevel } = req.body;

    if (!topicName) {
      res.status(400).json({ success: false, message: "Topic name is required" });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    const subject = user.customSubjects.find(s => s.id === subjectId);
    if (!subject) {
      res.status(404).json({ success: false, message: "Custom subject not registered" });
      return;
    }

    const topicId = Date.now();
    const newTopic: CustomTopic = {
      id: topicId,
      customSubjectId: subjectId,
      topicName,
      description: description || "Manually appended learner module",
      status: "PENDING",
      confidenceLevel: confidenceLevel || "Medium"
    };

    subject.topics.push(newTopic);

    // Add to global tasks for dashboard
    if (!user.tasks) user.tasks = [];
    const taskAlreadyExists = user.tasks.some((t: any) => 
      t.subject.toLowerCase() === subject.subjectName.toLowerCase() && 
      t.topic.toLowerCase() === topicName.toLowerCase()
    );

    if (!taskAlreadyExists) {
      user.tasks.push({
        id: topicId,
        subject: subject.subjectName,
        topic: topicName,
        durationMins: 40,
        status: "PENDING"
      });
    }

    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: `New topic "${topicName}" added successfully to "${subject.subjectName}"!`,
      data: newTopic
    });
  });

  // GET RGPV preloaded Syllabus collection
  app.get("/api/rgpv/syllabus", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const semester = req.query.semester ? Number(req.query.semester) : null;
    const db = loadDatabase();

    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      console.warn(`Syllabus loading failure: User not found for email ${req.user.email}`);
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Authorization check: School students should NEVER get RGPV data
    const learnerType = user.profile?.learnerType;
    if (learnerType === "SCHOOL_STUDENT") {
      console.warn(`Syllabus loading failure: Access Denied for School Student user ${user.email} querying RGPV syllabus`);
      res.status(403).json({ success: false, message: "Access Denied: School students are not authorized to view RGPV college syllabus." });
      return;
    }

    const syllabus = db.rgpvSyllabus || rgpvSyllabusDataset;
    
    if (semester) {
      const semesterObj = syllabus.find((s: any) => s.semesterNumber === semester);
      if (!semesterObj) {
        console.warn(`Syllabus loading failure: No syllabus found for RGPV Semester ${semester}`);
        res.json({ success: true, data: [] });
      } else {
        res.json({ success: true, data: semesterObj.subjects });
      }
    } else {
      res.json({ success: true, data: syllabus });
    }
  });

  // CLONE selected RGPV semester package to current user's customSubjects list
  app.post("/api/rgpv/clone", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const { semester } = req.body;
    if (!semester) {
      res.status(400).json({ success: false, message: "Semester parameter is required" });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      console.warn(`RGPV Clone failure: User not found for email ${req.user.email}`);
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Backend Authorization Check: School students should NEVER receive RGPV data
    const learnerType = user.profile?.learnerType;
    if (learnerType === "SCHOOL_STUDENT") {
      console.warn(`RGPV Clone Access Denied: School Student user ${user.email} tried to clone RGPV syllabus`);
      res.status(403).json({ success: false, message: "Access Denied: School students are not authorized to clone RGPV college syllabus." });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    if (!user.tasks) user.tasks = [];

    const syllabus = db.rgpvSyllabus || rgpvSyllabusDataset;
    const semesterObj = syllabus.find((s: any) => s.semesterNumber === Number(semester));
    const semesterSubjects = semesterObj ? semesterObj.subjects : [];

    if (semesterSubjects.length === 0) {
      console.warn(`RGPV Clone failure: No preloaded syllabus dataset found for Semester ${semester}`);
      res.status(404).json({ success: false, message: `No preloaded syllabus found for Semester ${semester}` });
      return;
    }

    const clonedList: any[] = [];
    semesterSubjects.forEach((sub: any) => {
      const subjectId = Date.now() + Math.floor(Math.random() * 100000);
      
      const alreadyExists = user.customSubjects.some((cs: any) => cs.subjectName.toLowerCase() === sub.name.toLowerCase());
      if (alreadyExists) return;

      const topics: CustomTopic[] = [];
      const units = sub.units || [];
      units.forEach((unit: any, uIdx: number) => {
        const unitName = unit.name || `Unit ${uIdx + 1}`;
        const unitTopics = unit.topics || [];
        unitTopics.forEach((topic: any, tIdx: number) => {
          const topicName = typeof topic === "string" ? topic : (topic.name || `Topic ${tIdx + 1}`);
          const topicId = Date.now() + Math.floor(Math.random() * 1000000) + uIdx + tIdx;
          topics.push({
            id: topicId,
            customSubjectId: subjectId,
            topicName: `${unitName}: ${topicName}`,
            description: `Part of ${unitName}`,
            status: "PENDING",
            confidenceLevel: typeof topic === "object" ? (topic.difficulty || "Medium") : "Medium"
          });

          const taskExists = user.tasks.some((t: any) => 
            t.subject.toLowerCase() === sub.name.toLowerCase() && 
            t.topic.toLowerCase() === `${unitName}: ${topicName}`.toLowerCase()
          );

          if (!taskExists) {
            user.tasks.push({
              id: topicId,
              subject: sub.name,
              topic: `${unitName}: ${topicName}`,
              durationMins: 45,
              status: "PENDING"
            });
          }
        });
      });

      const userSubSubject: CustomSubject = {
        id: subjectId,
        userId: user.id || Date.now(),
        subjectName: sub.name,
        description: `RGPV CSE Semester ${semester} Curriculum Course (Auto Cloned)`,
        difficulty: sub.difficulty || "Intermediate",
        targetDate: "End of Semester",
        createdAt: new Date().toISOString(),
        topics: topics,
        aiAnalysis: {
          estimatedEffort: sub.difficulty === "Advanced" ? "8-10 hours per week of active recall study" : "5-7 hours per week of study",
          revisionSchedule: "Spaced repetition at 1, 3, and 7 day intervals",
          milestones: ["Complete 100% of Units' syllabus topics", "Practice prior year RGPV exam questions", "Conduct a mock review and recall test"],
          roadmap: units.map((u: any, idx: number) => ({
            week: `Week ${idx + 1}`,
            focus: `Cover ${u.name || `Unit ${idx + 1}`} concepts and critical exercises`
          }))
        }
      };

      user.customSubjects.push(userSubSubject);
      clonedList.push(userSubSubject);
    });

    saveDatabase(db);
    res.json({
      success: true,
      message: `Successfully loaded and cloned ${clonedList.length} subjects for RGPV CSE Semester ${semester}!`,
      data: clonedList
    });
  });

  // GET School Metadata (Classes, Boards, Streams)
  app.get("/api/school/metadata", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Backend Authorization: Validate learnerType
    const learnerType = user.profile?.learnerType;
    if (learnerType !== "SCHOOL_STUDENT") {
      res.status(403).json({ success: false, message: "Access Denied: Only school students can access school metadata." });
      return;
    }

    res.json({
      success: true,
      data: {
        classes: db.schoolClasses || schoolClassesDataset,
        boards: db.boards || boardsDataset,
        streams: db.streams || streamsDataset
      }
    });
  });

  // GET School preloaded syllabus subjects (Filtered strictly by class & Board/Stream)
  app.get("/api/school/subjects", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Backend Authorization: Validate learnerType
    const learnerType = user.profile?.learnerType;
    if (learnerType !== "SCHOOL_STUDENT") {
      console.warn(`Syllabus loading failure: Access Denied for ${user.email} with learnerType ${learnerType} querying school subjects`);
      res.status(403).json({ success: false, message: "Access Denied: Only school students can access school subjects syllabus." });
      return;
    }

    const userClass = user.profile?.schoolClass; // "Class 10" or "Class 12"
    const userBoard = user.profile?.schoolBoard; // "CBSE", "ICSE", "State Board"
    const userStream = user.profile?.schoolStream; // "Science", "Commerce", "Arts"

    if (!userClass) {
      console.warn(`Syllabus loading failure: School Class not configured for user ${user.email}`);
      res.status(400).json({ success: false, message: "School Class is not configured in your profile." });
      return;
    }

    const subjects = db.schoolSubjects || schoolSubjectsDataset;
    let filteredSubjects: any[] = [];

    if (userClass === "Class 10") {
      let boardId = 1; // Default CBSE
      if (userBoard === "ICSE") boardId = 2;
      else if (userBoard === "State Board" || userBoard === "STATE") boardId = 3;

      filteredSubjects = subjects.filter((s: any) => s.schoolClassId === 1 && s.boardId === boardId);
    } else if (userClass === "Class 12") {
      let streamId = 1; // Default Science
      if (userStream === "Commerce") streamId = 2;
      else if (userStream === "Arts") streamId = 3;

      filteredSubjects = subjects.filter((s: any) => s.schoolClassId === 2 && s.streamId === streamId);
    }

    res.json({
      success: true,
      data: filteredSubjects
    });
  });

  // CLONE school subjects into custom subjects & tasks for active scheduling
  app.post("/api/school/clone", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Backend Authorization: Validate learnerType
    const learnerType = user.profile?.learnerType;
    if (learnerType !== "SCHOOL_STUDENT") {
      res.status(403).json({ success: false, message: "Access Denied: Only school students are authorized to clone school syllabus." });
      return;
    }

    const userClass = user.profile?.schoolClass;
    const userBoard = user.profile?.schoolBoard;
    const userStream = user.profile?.schoolStream;

    if (!userClass) {
      res.status(400).json({ success: false, message: "School Class is not configured in your profile." });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    if (!user.tasks) user.tasks = [];

    const subjects = db.schoolSubjects || schoolSubjectsDataset;
    let targetSubjects: any[] = [];

    if (userClass === "Class 10") {
      let boardId = 1;
      if (userBoard === "ICSE") boardId = 2;
      else if (userBoard === "State Board" || userBoard === "STATE") boardId = 3;

      targetSubjects = subjects.filter((s: any) => s.schoolClassId === 1 && s.boardId === boardId);
    } else if (userClass === "Class 12") {
      let streamId = 1;
      if (userStream === "Commerce") streamId = 2;
      else if (userStream === "Arts") streamId = 3;

      targetSubjects = subjects.filter((s: any) => s.schoolClassId === 2 && s.streamId === streamId);
    }

    if (targetSubjects.length === 0) {
      res.status(404).json({ success: false, message: "No preloaded school syllabus found matching your student parameters." });
      return;
    }

    const clonedList: any[] = [];
    targetSubjects.forEach((sub: any) => {
      const subjectId = Date.now() + Math.floor(Math.random() * 100000);
      
      const alreadyExists = user.customSubjects.some((cs: any) => cs.subjectName.toLowerCase() === sub.name.toLowerCase());
      if (alreadyExists) return;

      const topics: CustomTopic[] = [];
      const chapters = sub.chapters || [];
      chapters.forEach((ch: any, chIdx: number) => {
        const chapterName = ch.name || `Chapter ${chIdx + 1}`;
        const chTopics = ch.topics || [];
        chTopics.forEach((topic: any, tIdx: number) => {
          const topicName = typeof topic === "string" ? topic : (topic.name || `Topic ${tIdx + 1}`);
          const topicId = Date.now() + Math.floor(Math.random() * 1000000) + chIdx + tIdx;
          
          topics.push({
            id: topicId,
            customSubjectId: subjectId,
            topicName: `${chapterName}: ${topicName}`,
            description: `Topic from ${chapterName}`,
            status: "PENDING",
            confidenceLevel: typeof topic === "object" ? (topic.difficulty || "Medium") : "Medium"
          });

          const taskExists = user.tasks.some((t: any) => 
            t.subject.toLowerCase() === sub.name.toLowerCase() && 
            t.topic.toLowerCase() === `${chapterName}: ${topicName}`.toLowerCase()
          );

          if (!taskExists) {
            user.tasks.push({
              id: topicId,
              subject: sub.name,
              topic: `${chapterName}: ${topicName}`,
              durationMins: 45,
              status: "PENDING"
            });
          }
        });
      });

      const userSubSubject: CustomSubject = {
        id: subjectId,
        userId: user.id || Date.now(),
        subjectName: sub.name,
        description: `Preloaded ${userClass} ${userBoard || ""} ${userStream || ""} Course (${sub.name})`,
        difficulty: sub.difficulty || "Intermediate",
        targetDate: "Final Board Exams",
        createdAt: new Date().toISOString(),
        topics: topics,
        aiAnalysis: {
          estimatedEffort: sub.difficulty === "Advanced" ? "6-8 hours weekly study" : "4-5 hours weekly study",
          revisionSchedule: "Spaced retrieval system covering key board exercises",
          milestones: ["Chapter diagnostics set complete", "Pre-board custom review done"],
          roadmap: chapters.map((ch: any, idx: number) => ({
            week: `Week ${idx + 1}`,
            focus: `Practice ${ch.name || `Chapter ${idx + 1}`} solved questions`
          }))
        }
      };

      user.customSubjects.push(userSubSubject);
      clonedList.push(userSubSubject);
    });

    saveDatabase(db);
    res.json({
      success: true,
      message: `Successfully cloned ${clonedList.length} school subjects matching your student profile!`,
      data: clonedList
    });
  });

  // EDIT custom subject metadata
  app.put("/api/custom-subjects/:id", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const subjectId = Number(req.params.id);
    const { subjectName, description, difficulty, targetDate } = req.body;

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    const subject = user.customSubjects.find((s: any) => s.id === subjectId);
    if (!subject) {
      res.status(404).json({ success: false, message: "Custom subject not found" });
      return;
    }

    const oldName = subject.subjectName;
    if (subjectName) subject.subjectName = subjectName;
    if (description !== undefined) subject.description = description;
    if (difficulty) subject.difficulty = difficulty;
    if (targetDate) subject.targetDate = targetDate;

    // Update subject names in user.tasks too
    if (user.tasks && oldName !== subject.subjectName) {
      user.tasks.forEach((t: any) => {
        if (t.subject === oldName) {
          t.subject = subject.subjectName;
        }
      });
    }

    saveDatabase(db);
    res.json({ success: true, message: "Subject updated successfully", data: subject });
  });

  // DELETE custom subject and all child topics/tasks
  app.delete("/api/custom-subjects/:id", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const subjectId = Number(req.params.id);

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    const subIndex = user.customSubjects.findIndex((s: any) => s.id === subjectId);
    if (subIndex === -1) {
      res.status(404).json({ success: false, message: "Custom subject not found" });
      return;
    }

    const subjectToDelete = user.customSubjects[subIndex];
    const topicIdsToDelete = subjectToDelete.topics.map((t: any) => t.id);

    user.customSubjects.splice(subIndex, 1);

    // Remove related items from global tasks list
    if (user.tasks) {
      user.tasks = user.tasks.filter((t: any) => {
        const matchesTopic = topicIdsToDelete.includes(t.id);
        const matchesSubject = t.subject?.toLowerCase() === subjectToDelete.subjectName?.toLowerCase();
        return !matchesTopic && !matchesSubject;
      });
    }

    saveDatabase(db);
    res.json({ success: true, message: `"${subjectToDelete.subjectName}" removed successfully!` });
  });

  // PUT: Update dynamic details or status of individual custom topics
  app.put("/api/custom-subjects/:id/topics/:topicId", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const subjectId = Number(req.params.id);
    const topicId = Number(req.params.topicId);
    const { topicName, description, status, confidenceLevel } = req.body;

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    const subject = user.customSubjects.find((s: any) => s.id === subjectId);
    if (!subject) {
      res.status(404).json({ success: false, message: "Custom subject not found" });
      return;
    }

    const topic = subject.topics.find((t: any) => t.id === topicId);
    if (!topic) {
      res.status(404).json({ success: false, message: "Topic not found" });
      return;
    }

    if (topicName) topic.topicName = topicName;
    if (description !== undefined) topic.description = description;
    if (status) topic.status = status;
    if (confidenceLevel) topic.confidenceLevel = confidenceLevel;

    // Synchronize dynamic status/name with global tasks
    if (user.tasks) {
      const task = user.tasks.find((t: any) => t.id === topicId);
      if (task) {
        if (topicName) task.topic = topicName;
        if (status) task.status = status;
      }
    }

    saveDatabase(db);
    res.json({ success: true, message: "Topic updated successfully", data: topic });
  });

  // DELETE: Delete individual custom topics from subject
  app.delete("/api/custom-subjects/:id/topics/:topicId", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const subjectId = Number(req.params.id);
    const topicId = Number(req.params.topicId);

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.customSubjects) user.customSubjects = [];
    const subject = user.customSubjects.find((s: any) => s.id === subjectId);
    if (!subject) {
      res.status(404).json({ success: false, message: "Custom subject not found" });
      return;
    }

    const tIndex = subject.topics.findIndex((t: any) => t.id === topicId);
    if (tIndex === -1) {
      res.status(404).json({ success: false, message: "Topic not found" });
      return;
    }

    const topicToDelete = subject.topics[tIndex];
    subject.topics.splice(tIndex, 1);

    if (user.tasks) {
      user.tasks = user.tasks.filter((t: any) => t.id !== topicId);
    }

    saveDatabase(db);
    res.json({ success: true, message: `Topic "${topicToDelete.topicName}" removed successfully!` });
  });

  // ADMIN: Update master dynamic preloaded RGPV syllabus database
  app.put("/api/admin/rgpv/syllabus", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const { syllabus } = req.body;
    if (!Array.isArray(syllabus)) {
      res.status(400).json({ success: false, message: "Invalid syllabus template array structure" });
      return;
    }

    const db = loadDatabase();
    db.rgpvSSummary = "Customized by administrator";
    db.rgpvSyllabus = syllabus;
    saveDatabase(db);

    res.json({ success: true, message: "RGPV master preloaded syllabus template modified successfully by Admin!" });
  });

  // Get custom exam plans
  app.get("/api/custom-exams", authenticateToken, (req: Request & { user?: any }, res: Response) => {
    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({
      success: true,
      data: user.customExams || []
    });
  });

  // Create a custom exam scheduling plan
  app.post("/api/custom-exams", authenticateToken, async (req: Request & { user?: any }, res: Response) => {
    const { examName, examDate, subjects, topics } = req.body;
    if (!examName) {
      res.status(400).json({ success: false, message: "Exam name is required" });
      return;
    }

    const db = loadDatabase();
    const user = db.users.find((u: User) => u.email === req.user.email);
    if (!user) {
      res.status(404).json({ success: false, message: "User session unresolved" });
      return;
    }

    if (!user.customExams) user.customExams = [];

    const examId = Date.now();
    const parsedSubjects: string[] = Array.isArray(subjects)
      ? subjects.filter((s: any) => typeof s === "string" && s.trim() !== "")
      : (subjects && typeof subjects === "string")
        ? subjects.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "")
        : ["Core Theory Exam"];

    const parsedTopics: string[] = Array.isArray(topics)
      ? topics.filter((t: any) => typeof t === "string" && t.trim() !== "")
      : (topics && typeof topics === "string")
        ? topics.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "")
        : ["General Review Questions"];

    let aiAnalysisResult = null;
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = geminiKey && geminiKey !== "MOCK_KEY" && geminiKey.trim() !== "";

    if (hasRealKey) {
      try {
        const client = getGeminiClient();
        const prompt = `You are an elite study strategist. Design an accelerated preparation timeline for this competitive or custom exam:
Exam Name: "${examName}"
Exam Date Target: "${examDate || "45 Days"}"
Mapped Subjects: "${parsedSubjects.join(", ")}"
Mapped Topics: "${parsedTopics.join(", ")}"

Output a strictly standard valid JSON:
{
  "weeksToExam": 6,
  "recommendedHoursPerDay": 3.5,
  "milestones": [
    "Assemble summary study guides",
    "Complete structured question bank series",
    "Run timed simulation mock reviews"
  ],
  "roadmap": [
    { "subject": "Syllabus Area", "focus": "Review of high weightage formulas and definitions", "weeks": "Weeks 1-2", "priority": "High" }
  ]
}

No other explanations. Return only valid JSON.`;

        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.75
          }
        });

        const text = response.text?.trim() || "";
        const parsed = JSON.parse(text);
        aiAnalysisResult = {
          weeksToExam: parsed.weeksToExam || 8,
          recommendedHoursPerDay: parsed.recommendedHoursPerDay || 3,
          milestones: parsed.milestones || ["Baseline score diagnostic completed", "Deep-dive problem areas resolved", "Final time-bound dress rehearsal"],
          roadmap: parsed.roadmap || [
            { subject: parsedSubjects[0] || "Baseline Study", focus: "Spaced reviews of index guides", weeks: "Weeks 1-3", priority: "High" }
          ]
        };
      } catch (err) {
        console.error("Gemini failed to map exam roadmap:", err);
      }
    }

    if (!aiAnalysisResult) {
      aiAnalysisResult = {
        weeksToExam: 6,
        recommendedHoursPerDay: 4,
        milestones: [
          `Review exam blueprints for ${parsedSubjects.join(", ")}`,
          `Analyze high weightage sample worksheets on ${parsedTopics.slice(0, 3).join(", ")}`,
          `Simulate timed 2-hour assessment without aid tools`,
          "Review memory logs and outline weak cards 24 hours prior"
        ],
        roadmap: parsedSubjects.map((sub, idx) => ({
          subject: sub,
          focus: `Intense focused revision of core terminology, schemas, and historical tests regarding ${parsedTopics[idx % parsedTopics.length] || "Exam Syllabi"}`,
          weeks: `Week ${idx * 2 + 1}-${idx * 2 + 2}`,
          priority: idx === 0 ? "Critical" : "High"
        }))
      };
    }

    // Dynamic Mathematical Roadmap Calculations & Edge Case Solvers (Section 3 - Point 2)
    const examTimestamp = examDate ? new Date(examDate).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000;
    const currentTimestamp = Date.now();
    const diffTime = examTimestamp - currentTimestamp;
    let daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Case 1: Exam Tomorrow / Past examine date safeguards
    if (daysRemaining <= 0) {
      daysRemaining = 1;
    }

    const totalTopicsCount = parsedTopics.length || 1;
    const dailyStudyHoursProfile = user.profile?.dailyStudyHours || 3;
    
    // Case 2: 0 Study Hours configured fallback
    const cleanDailyHours = dailyStudyHoursProfile <= 0 ? 1 : dailyStudyHoursProfile;
    const totalHoursAvailable = daysRemaining * cleanDailyHours;

    // Define core effort metrics per topic (e.g. 4 hours)
    const hoursPerTopicBase = 4;
    // Case 3: 100 Topics - Condense hours-per-topic humanly to avoid physical overload calculation numbers
    const effectiveHoursPerTopic = totalTopicsCount > 50 ? 1.5 : (totalTopicsCount > 25 ? 2.5 : hoursPerTopicBase);
    const totalHoursNeeded = totalTopicsCount * effectiveHoursPerTopic;

    let requiredDailyStudyHours = parseFloat((totalHoursNeeded / daysRemaining).toFixed(1));

    // Limit safeguards
    if (requiredDailyStudyHours > 16) {
      requiredDailyStudyHours = 16; // strict guard
    }
    if (requiredDailyStudyHours < 1) {
      requiredDailyStudyHours = 1;
    }

    // Case 1: Exam Tomorrow - heavy cram limits
    if (daysRemaining === 1) {
      requiredDailyStudyHours = Math.min(12, totalTopicsCount * 2);
    }

    const workloadScore = parseFloat((requiredDailyStudyHours / cleanDailyHours).toFixed(1));
    let calculatedBurnoutRisk = "LOW";
    if (workloadScore > 1.8 || requiredDailyStudyHours > 8) {
      calculatedBurnoutRisk = "CRITICAL";
    } else if (workloadScore > 1.3 || requiredDailyStudyHours > 5) {
      calculatedBurnoutRisk = "HIGH";
    } else if (workloadScore > 0.9) {
      calculatedBurnoutRisk = "MEDIUM";
    }

    // Embed raw mathematical planning insights in final aiAnalysis payload
    aiAnalysisResult.mathPlanner = {
      daysRemaining,
      topicsRemaining: totalTopicsCount,
      hoursAvailable: parseFloat(totalHoursAvailable.toFixed(1)),
      hoursNeeded: parseFloat(totalHoursNeeded.toFixed(1)),
      requiredDailyStudyHours,
      burnoutRisk: calculatedBurnoutRisk,
      configuredTargetHours: cleanDailyHours
    };

    // Override estimated recommendations with accurate mathematical calculations
    aiAnalysisResult.recommendedHoursPerDay = requiredDailyStudyHours;

    const customExam: CustomExam = {
      id: examId,
      userId: user.id || Date.now(),
      examName,
      examDate,
      subjects: parsedSubjects,
      topics: parsedTopics,
      createdAt: new Date().toISOString(),
      aiAnalysis: aiAnalysisResult
    };

    user.customExams.push(customExam);

    // Sync diagnostic prep exercises to Today's Dashboard tasks!
    if (!user.tasks) user.tasks = [];
    user.tasks.push({
      id: Date.now() + 105,
      subject: `🏆 PREP_EXAM: ${examName}`,
      topic: `Map topic indices & weigh chapters: ${parsedSubjects.join(", ")}`,
      durationMins: 45,
      status: "PENDING"
    });

    user.tasks.push({
      id: Date.now() + 106,
      subject: `🏆 PREP_EXAM: ${examName}`,
      topic: `Practice high yield worksheets regarding: ${parsedTopics.slice(0,3).join(", ")}`,
      durationMins: 60,
      status: "PENDING"
    });

    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: `Exam blueprint strategy for "${examName}" mapped successfully! Tasks created.`,
      data: customExam
    });
  });

  // Client-Side static serving and SPA Fallbacks
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for dev
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Build static assets serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Initializing default database elements
  loadDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduPlan AI Application running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical failure booting EduPlan AI application server:", err);
});
