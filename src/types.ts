/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LearnerType {
  SCHOOL_STUDENT = "SCHOOL_STUDENT",
  COLLEGE_STUDENT = "COLLEGE_STUDENT",
  COMPETITIVE_ASPIRANT = "COMPETITIVE_ASPIRANT",
  WORKING_PROFESSIONAL = "WORKING_PROFESSIONAL",
  SELF_LEARNER = "SELF_LEARNER"
}

export interface UserProfile {
  id?: number;
  learnerType: LearnerType;
  dailyStudyHours: number;
  
  // School Student Specifics
  schoolClass?: string;
  schoolBoard?: string;
  schoolStream?: string;

  // College Student Specifics
  degree?: string;
  course?: string;
  university?: string;
  semester?: number;

  // Competitive Aspirant Specifics
  targetExam?: string;
  attemptYear?: number;

  // Working Professional Specifics
  certificationGoal?: string;

  // Self Learner Specifics
  learningGoal?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  authProvider: "LOCAL" | "GOOGLE";
  enabled: boolean;
  locked: boolean;
  role: string;
  profile?: UserProfile | null;
  createdAt: string;
}

export interface AuthResponseData {
  accessToken: string;
  tokenType: string;
  email: string;
  name: string;
  role: string;
  completedOnboarding: boolean;
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
