<div align="center">

# 📚 EduPlan AI

### *Study Smarter, Not Harder.*

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

<br/>

> **EduPlan AI** is an intelligent study planning and productivity platform designed to help students reduce exam stress, manage their syllabus efficiently, and stay consistent throughout their learning journey — powered by AI.

<br/>

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](#) · [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Supported User Categories](#-supported-user-categories)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Feature Highlights](#-feature-highlights)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Most students struggle not because they don't want to study — but because they don't know **where to start**, **how to plan**, or **how to stay consistent**.

**EduPlan AI** acts as a personal AI study coach that:

- 🗺️ Creates customized study roadmaps
- ⚖️ Distributes workload intelligently
- 📈 Tracks your progress in real time
- 🤖 Assists with doubts using AI
- 🔄 Continuously adapts until your exam day

---

## 🎯 Problem Statement

| Problem | How EduPlan AI Solves It |
|---|---|
| Large syllabus, limited time | AI breaks it into daily achievable goals |
| No personalized roadmap | Generates a roadmap unique to your exam & confidence |
| Poor time management | Task-based scheduling instead of rigid timetables |
| No revision strategy | Built-in Spaced Repetition system |
| Procrastination & burnout | Energy tracking + adaptive rescheduling |
| No progress tracking | Real-time analytics dashboard |
| Stuck on doubts | Study Buddy AI for instant explanations |

---

## 🚀 Key Features

### 🧠 AI Study Roadmap Generator
The core USP. Considers exam date, topic count, subject difficulty, confidence level, and available hours to generate **personalized daily study plans**.

```
Today's Plan Example:
  ✅ Complete Binary Trees
  📝 Solve 5 Practice Questions
  🔁 Revise Operating Systems Notes
```

### 🔄 Adaptive Scheduling
Missed a day? No panic. The system automatically **redistributes remaining workload** and recalculates future plans.

### 📖 Smart Revision (Spaced Repetition)
Auto-generated revision schedule:
- Day 1 → First Revision
- Day 3 → Second Revision
- Day 7 → Final Revision

### 🤖 Study Buddy AI
An AI-powered doubt solver integrated directly into the platform. Explains concepts, provides examples, and simplifies difficult topics — powered by **Google Gemini API**.

### ⏳ Pomodoro Focus System
Built-in Pomodoro timer with custom sessions, break management, and session tracking linked directly to your study tasks.

### 📊 Analytics Dashboard
Visual charts for focus hours, task completion, productivity trends, weekly performance, and study consistency.

### 💙 Energy & Mood Tracking
Daily check-in system (Burnout → High Energy) that helps the AI **adjust your workload** based on how you're feeling.

### 🏆 Study Streak System
Tracks consecutive productive days with achievement badges to keep motivation high.

---

## 👥 Supported User Categories

```
┌─────────────────────────────────────────────────┐
│              WHO IS THIS FOR?                   │
├──────────────────┬──────────────────────────────┤
│ 🏫 School        │ Class 10 & 12 (CBSE, ICSE,  │
│                  │ State Boards)                │
├──────────────────┼──────────────────────────────┤
│ 🎓 College       │ University → Degree →        │
│                  │ Course → Semester            │
├──────────────────┼──────────────────────────────┤
│ 📝 Competitive   │ JEE, NEET, GATE, UPSC,       │
│    Exams         │ CAT, SSC, Banking & more     │
├──────────────────┼──────────────────────────────┤
│ 📅 Drop Year     │ Independent exam prep        │
├──────────────────┼──────────────────────────────┤
│ 💡 Self Learners │ Any skill, course, or cert   │
└──────────────────┴──────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | Core UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling & responsive design |

### Backend
| Technology | Purpose |
|---|---|
| Java + Spring Boot | REST API & business logic |
| Spring Security + JWT | Authentication & authorization |

### Database & AI
| Technology | Purpose |
|---|---|
| MySQL | Persistent data storage |
| Google Gemini API | AI roadmap generation & Study Buddy |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render / Railway | Backend hosting |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────┐
│                   FRONTEND                     │
│          React + TypeScript + Vite             │
│  Dashboard │ Roadmap │ Analytics │ Study Buddy │
└──────────────────┬─────────────────────────────┘
                   │ REST API (JWT Secured)
┌──────────────────▼─────────────────────────────┐
│                   BACKEND                      │
│            Spring Boot + Java                  │
│  Auth │ Roadmap Engine │ Scheduler │ Analytics │
└──────────┬─────────────────────┬───────────────┘
           │                     │
┌──────────▼──────┐   ┌──────────▼──────────────┐
│      MySQL      │   │    Google Gemini API     │
│  (User & Study  │   │  (AI Roadmap + Doubts)  │
│     Data)       │   │                         │
└─────────────────┘   └─────────────────────────┘
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- Java 17+
- MySQL 8.0+
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eduplan-ai.git
cd eduplan-ai
```

### 2. Backend Setup

```bash
cd backend

# Configure application.properties
cp src/main/resources/application.example.properties src/main/resources/application.properties
# Fill in your MySQL credentials and Gemini API key

# Run the Spring Boot application
./mvnw spring-boot:run
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your backend API URL

# Start dev server
npm run dev
```

### 4. Open in Browser

```
http://localhost:5173
```

---

## 📚 Preloaded Syllabus Support

EduPlan AI comes with pre-loaded syllabi so you don't have to enter everything manually:

**College:** RGPV CSE — Semester 1 through 8

**School:** Class 10 | Class 12

> Visibility is filtered automatically based on user category — a Class 10 student only sees Class 10 content.

### ✍️ Custom Subject Creator

Not limited to preloaded content. Add any custom subject, topic, skill, or certification:

- Web Development, Data Science, ML
- Java, Python, AWS
- Competitive exam topics

The AI analyzes your custom syllabus and generates a suitable roadmap automatically.

---

## 🔐 Authentication System

- ✅ User Registration & Secure Login
- ✅ JWT-based Authentication
- ✅ Role-Based Access Control
- ✅ Password Encryption
- ✅ Forgot Password with OTP Verification
- ✅ Google OAuth Integration

---

## 📊 Feature Highlights

```
Dashboard Metrics at a Glance:
├── 📌 Study Roadmap (Today / Upcoming / Revision)
├── 📈 Progress Stats (Daily & Weekly %)
├── ⏱️  Focus Analytics (Hours + Productivity Score)
├── 🔥 Study Streaks
└── ⏳ Exam Countdown Timer
```

---

## 🔮 Roadmap

- [ ] 📱 Mobile Application (iOS & Android)
- [ ] 📄 Weekly PDF Progress Reports
- [ ] 🎤 AI Viva Preparation Module
- [ ] 🔮 Smart Exam Prediction System
- [ ] 👥 Peer Study Groups
- [ ] 🎙️ AI Voice Assistant
- [ ] 📝 Smart Note Generation
- [ ] 💼 Resume & Career Guidance Integration

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and contribution process.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">

### 💡 *EduPlan AI transforms study planning from a stressful task into a guided, structured, and personalized learning experience.*

<br/>

Made with ❤️ by the EduPlan AI Team

⭐ **Star this repo if you found it helpful!** ⭐

</div>
