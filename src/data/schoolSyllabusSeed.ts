/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolTopic {
  id: number;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface SchoolChapter {
  id: number;
  name: string;
  order: number;
  topics: SchoolTopic[];
}

export interface SchoolSubject {
  id: number;
  schoolClassId: number; // 1 for Class 10, 2 for Class 12
  boardId?: number;     // 1 for CBSE, 2 for ICSE, 3 for State Board (optional or general)
  streamId?: number;    // 1 for Science, 2 for Commerce, 3 for Arts (for Class 12)
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  chapters: SchoolChapter[];
}

export interface SchoolClass {
  id: number;
  name: string;
}

export interface Board {
  id: number;
  name: string;
  code: string;
}

export interface Stream {
  id: number;
  schoolClassId: number;
  name: string;
  code: string;
}

export const schoolClassesDataset: SchoolClass[] = [
  { id: 1, name: "Class 10" },
  { id: 2, name: "Class 12" }
];

export const boardsDataset: Board[] = [
  { id: 1, name: "CBSE", code: "CBSE" },
  { id: 2, name: "ICSE", code: "ICSE" },
  { id: 3, name: "State Board", code: "STATE" }
];

export const streamsDataset: Stream[] = [
  { id: 1, schoolClassId: 2, name: "Science", code: "SCIENCE" },
  { id: 2, schoolClassId: 2, name: "Commerce", code: "COMMERCE" },
  { id: 3, schoolClassId: 2, name: "Arts", code: "ARTS" }
];

export const schoolSubjectsDataset: SchoolSubject[] = [
  // ==========================================
  // CLASS 10 SUBJECTS (CBSE, ICSE, STATE)
  // ==========================================
  // Mathematics for CBSE Class 10
  {
    id: 1001,
    schoolClassId: 1,
    boardId: 1,
    name: "Mathematics",
    difficulty: "Advanced",
    chapters: [
      {
        id: 10011,
        name: "Real Numbers",
        order: 1,
        topics: [
          { id: 100111, name: "Euclid's Division Lemma and Algorithm", difficulty: "Beginner" },
          { id: 100112, name: "Fundamental Theorem of Arithmetic", difficulty: "Intermediate" },
          { id: 100113, name: "Irrationality Proof of sqrt(2), sqrt(3), sqrt(5)", difficulty: "Advanced" }
        ]
      },
      {
        id: 100114,
        name: "Polynomials",
        order: 2,
        topics: [
          { id: 100115, name: "Geometrical meaning of zeroes of a polynomial", difficulty: "Beginner" },
          { id: 100116, name: "Relationship between zeroes and coefficients", difficulty: "Intermediate" }
        ]
      },
      {
        id: 100117,
        name: "Quadratic Equations",
        order: 3,
        topics: [
          { id: 100118, name: "Standard form and solutions by factorization", difficulty: "Intermediate" },
          { id: 100119, name: "Discriminant and nature of roots with applications", difficulty: "Advanced" }
        ]
      }
    ]
  },
  // Science for CBSE Class 10
  {
    id: 1002,
    schoolClassId: 1,
    boardId: 1,
    name: "Science",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 10021,
        name: "Chemical Reactions & Equations",
        order: 1,
        topics: [
          { id: 100211, name: "Writing and balancing word and chemical equations", difficulty: "Intermediate" },
          { id: 100212, name: "Types of chemical reactions: combination, decomposition", difficulty: "Beginner" }
        ]
      },
      {
        id: 100213,
        name: "Carbon and its Compounds",
        order: 2,
        topics: [
          { id: 100214, name: "Covalent bonding in carbon compounds & allotropes", difficulty: "Intermediate" },
          { id: 100215, name: "Homologous series and functional groups nomenclature", difficulty: "Advanced" }
        ]
      },
      {
        id: 100216,
        name: "Life Processes",
        order: 3,
        topics: [
          { id: 100217, name: "Autotrophic and heterotrophic nutrition processes", difficulty: "Intermediate" },
          { id: 100218, name: "Human respiratory, circulatory, and excretory systems", difficulty: "Advanced" }
        ]
      }
    ]
  },
  // English for CBSE Class 10
  {
    id: 1003,
    schoolClassId: 1,
    boardId: 1,
    name: "English",
    difficulty: "Beginner",
    chapters: [
      {
        id: 10031,
        name: "Reading Comprehension Skills",
        order: 1,
        topics: [
          { id: 100311, name: "Discursive or factual passage inference techniques", difficulty: "Intermediate" }
        ]
      },
      {
        id: 100312,
        name: "First Flight Prose",
        order: 2,
        topics: [
          { id: 100313, name: "A Letter to God central themes analysis", difficulty: "Beginner" },
          { id: 100314, name: "Nelson Mandela: Long Walk to Freedom study", difficulty: "Intermediate" }
        ]
      },
      {
        id: 100315,
        name: "Grammar & Sentence Syntax",
        order: 3,
        topics: [
          { id: 100316, name: "Tenses, Modals and Subject-Verb Concord checks", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  // Social Science for CBSE Class 10
  {
    id: 1004,
    schoolClassId: 1,
    boardId: 1,
    name: "Social Science",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 10041,
        name: "Rise of Nationalism in Europe",
        order: 1,
        topics: [
          { id: 100411, name: "French Revolution and the Idea of the Nation", difficulty: "Intermediate" },
          { id: 100412, name: "Unification of Germany and Italy milestones", difficulty: "Advanced" }
        ]
      },
      {
        id: 100413,
        name: "Resources and Development",
        order: 2,
        topics: [
          { id: 100414, name: "Classification of resources and planning in India", difficulty: "Beginner" },
          { id: 100415, name: "Soil errosion, conservation and land degradation", difficulty: "Intermediate" }
        ]
      },
      {
        id: 100416,
        name: "Power Sharing",
        order: 3,
        topics: [
          { id: 100417, name: "Case studies of Belgium and Sri Lanka power systems", difficulty: "Intermediate" },
          { id: 100418, name: "Why power sharing is desirable: Prudential and Moral", difficulty: "Beginner" }
        ]
      }
    ]
  },
  // Hindi for CBSE Class 10
  {
    id: 1005,
    schoolClassId: 1,
    boardId: 1,
    name: "Hindi",
    difficulty: "Beginner",
    chapters: [
      {
        id: 10051,
        name: "Kshitij Prose Works",
        order: 1,
        topics: [
          { id: 100511, name: "Do Bailon ki Katha summary and question guides", difficulty: "Beginner" }
        ]
      },
      {
        id: 100512,
        name: "Vyakaran & Rachna",
        order: 2,
        topics: [
          { id: 100513, name: "Shabd, Pad, Sandhi, and Samas logic rules", difficulty: "Intermediate" }
        ]
      }
    ]
  },

  // ICSE Class 10
  {
    id: 1011,
    schoolClassId: 1,
    boardId: 2,
    name: "Mathematics",
    difficulty: "Advanced",
    chapters: [
      {
        id: 10111,
        name: "Commercial Mathematics",
        order: 1,
        topics: [
          { id: 101111, name: "Goods and Services Tax (GST) calculation", difficulty: "Intermediate" },
          { id: 101112, name: "Banking recurrent deposit accounts formulation", difficulty: "Intermediate" }
        ]
      },
      {
        id: 101113,
        name: "Algebraic Systems",
        order: 2,
        topics: [
          { id: 101114, name: "Linear Inequations solvability on number lines", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1012,
    schoolClassId: 1,
    boardId: 2,
    name: "Science",
    difficulty: "Advanced",
    chapters: [
      {
        id: 10121,
        name: "Force, Work, Power and Energy",
        order: 1,
        topics: [
          { id: 101211, name: "Turning effect of force, torque and equilibrium", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1013,
    schoolClassId: 1,
    boardId: 2,
    name: "English",
    difficulty: "Beginner",
    chapters: [
      {
        id: 10131,
        name: "Drama (Merchant of Venice)",
        order: 1,
        topics: [
          { id: 101311, name: "Act I, Scene I and II dramatic analysis", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1014,
    schoolClassId: 1,
    boardId: 2,
    name: "Social Science",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 10141,
        name: "Civics: The Union Parliament",
        order: 1,
        topics: [
          { id: 101411, name: "Lok Sabha and Rajya Sabha powers and structures", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1015,
    schoolClassId: 1,
    boardId: 2,
    name: "Hindi",
    difficulty: "Beginner",
    chapters: [
      {
        id: 10151,
        name: "Sahitya Sagar Stories",
        order: 1,
        topics: [
          { id: 101511, name: "Baat Athanni Ki central character summary", difficulty: "Beginner" }
        ]
      }
    ]
  },

  // State Board Class 10
  {
    id: 1021,
    schoolClassId: 1,
    boardId: 3,
    name: "Mathematics",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 10211,
        name: "Arithmetic Progressions",
        order: 1,
        topics: [
          { id: 102111, name: "Deriving nth term and Sum of n terms of AP", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1022,
    schoolClassId: 1,
    boardId: 3,
    name: "Science",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 10221,
        name: "Refraction of Light",
        order: 1,
        topics: [
          { id: 102211, name: "Snell's Law and refractive indexes calculations", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1023,
    schoolClassId: 1,
    boardId: 3,
    name: "English",
    difficulty: "Beginner",
    chapters: [
      {
        id: 10231,
        name: "General prose and writing pieces",
        order: 1,
        topics: [
          { id: 102311, name: "Report writing on local events exercises", difficulty: "Beginner" }
        ]
      }
    ]
  },
  {
    id: 1024,
    schoolClassId: 1,
    boardId: 3,
    name: "Social Science",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 10241,
        name: "Democratic Politics & Constitution",
        order: 1,
        topics: [
          { id: 102411, name: "Federal system of government in India outline", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1025,
    schoolClassId: 1,
    boardId: 3,
    name: "Hindi",
    difficulty: "Beginner",
    chapters: [
      {
        id: 10251,
        name: "Hindi Nibandh & grammar keys",
        order: 1,
        topics: [
          { id: 102511, name: "Patra Lekhan and general essay syntax drafts", difficulty: "Beginner" }
        ]
      }
    ]
  },

  // ==========================================
  // CLASS 12 SUBJECTS (SCIENCE, COMMERCE, ARTS)
  // ==========================================
  // CLASS 12 SCIENCE
  {
    id: 1201,
    schoolClassId: 2,
    streamId: 1,
    name: "Physics",
    difficulty: "Advanced",
    chapters: [
      {
        id: 12011,
        name: "Electrostatics",
        order: 1,
        topics: [
          { id: 120111, name: "Coulomb's Law, Electric forces, and fields", difficulty: "Intermediate" },
          { id: 120112, name: "Gauss's Theorem and electrostatic potential math", difficulty: "Advanced" }
        ]
      },
      {
        id: 120113,
        name: "Current Electricity",
        order: 2,
        topics: [
          { id: 120114, name: "Ohm's Law, drift velocity, and cell internal resistance", difficulty: "Intermediate" },
          { id: 120115, name: "Kirchhoff's Rules and Wheatstone Bridge configurations", difficulty: "Advanced" }
        ]
      },
      {
        id: 120116,
        name: "Electromagnetic Induction",
        order: 3,
        topics: [
          { id: 120117, name: "Faraday's Laws and self/mutual inductance coefficients", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1202,
    schoolClassId: 2,
    streamId: 1,
    name: "Chemistry",
    difficulty: "Advanced",
    chapters: [
      {
        id: 12021,
        name: "Solutions",
        order: 1,
        topics: [
          { id: 120211, name: "Raoult's Law and ideal/non-ideal systems profiles", difficulty: "Intermediate" },
          { id: 120212, name: "Colligative properties and Van 't Hoff factor calculations", difficulty: "Advanced" }
        ]
      },
      {
        id: 120213,
        name: "Electrochemistry",
        order: 2,
        topics: [
          { id: 120214, name: "Nernst Equation and electrochemical cell potential math", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1203,
    schoolClassId: 2,
    streamId: 1,
    name: "Mathematics",
    difficulty: "Advanced",
    chapters: [
      {
        id: 12031,
        name: "Relations & Functions",
        order: 1,
        topics: [
          { id: 120311, name: "Equivalence relations and bijection proofs", difficulty: "Intermediate" }
        ]
      },
      {
        id: 120312,
        name: "Calculus Limits",
        order: 2,
        topics: [
          { id: 120313, name: "Continuity, differentiability, and derivative applications", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1204,
    schoolClassId: 2,
    streamId: 1,
    name: "Biology",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 12041,
        name: "Sexual Reproduction",
        order: 1,
        topics: [
          { id: 120411, name: "Double fertilization and seed development in angiosperms", difficulty: "Intermediate" }
        ]
      },
      {
        id: 120412,
        name: "Biotechnology & PCR",
        order: 2,
        topics: [
          { id: 120413, name: "Recombinant DNA tools and polymerse chain reaction processes", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1205,
    schoolClassId: 2,
    streamId: 1,
    name: "English",
    difficulty: "Beginner",
    chapters: [
      {
        id: 12051,
        name: "Flamingo Literature",
        order: 1,
        topics: [
          { id: 120511, name: "The Last Lesson prose summary and theme deepdive", difficulty: "Beginner" }
        ]
      }
    ]
  },

  // CLASS 12 COMMERCE
  {
    id: 1221,
    schoolClassId: 2,
    streamId: 2,
    name: "Accountancy",
    difficulty: "Advanced",
    chapters: [
      {
        id: 12211,
        name: "Partnership Accounting",
        order: 1,
        topics: [
          { id: 122111, name: "Partnership Deed and Profit & Loss Appropriation statements", difficulty: "Intermediate" },
          { id: 122112, name: "Reconstitution of partnership: admission of standard partners", difficulty: "Advanced" }
        ]
      },
      {
        id: 122113,
        name: "Company Accounts",
        order: 2,
        topics: [
          { id: 122114, name: "Accounting for share capital, forfeiture and reissue steps", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    id: 1222,
    schoolClassId: 2,
    streamId: 2,
    name: "Business Studies",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 12221,
        name: "Principles of Management",
        order: 1,
        topics: [
          { id: 122211, name: "Fayol's 14 principles vs Taylor's scientific principles", difficulty: "Intermediate" }
        ]
      },
      {
        id: 122212,
        name: "Marketing Management",
        order: 2,
        topics: [
          { id: 122213, name: "Marketing Mix: Product, Price, Place, Promotion components", difficulty: "Beginner" }
        ]
      }
    ]
  },
  {
    id: 1223,
    schoolClassId: 2,
    streamId: 2,
    name: "Economics",
    difficulty: "Advanced",
    chapters: [
      {
        id: 12231,
        name: "National Income Accounting",
        order: 1,
        topics: [
          { id: 122311, name: "Circular flow of income and GDP measurement methods", difficulty: "Advanced" }
        ]
      },
      {
        id: 122312,
        name: "Money & Banking",
        order: 2,
        topics: [
          { id: 122313, name: "Central Bank tools for credit control & monetary systems", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1224,
    schoolClassId: 2,
    streamId: 2,
    name: "English",
    difficulty: "Beginner",
    chapters: [
      {
        id: 12241,
        name: "Compositions & Writing",
        order: 1,
        topics: [
          { id: 122411, name: "Direct business letters drafting and notice formats", difficulty: "Beginner" }
        ]
      }
    ]
  },

  // CLASS 12 ARTS
  {
    id: 1241,
    schoolClassId: 2,
    streamId: 3,
    name: "History",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 12411,
        name: "Harappan Civilisation",
        order: 1,
        topics: [
          { id: 124111, name: "Bricks, Beads and Bones archaeological layouts", difficulty: "Intermediate" }
        ]
      },
      {
        id: 124112,
        name: "Mahatma Gandhi Movement",
        order: 2,
        topics: [
          { id: 124113, name: "Civil Disobedience and satyagraha event analysis", difficulty: "Beginner" }
        ]
      }
    ]
  },
  {
    id: 1242,
    schoolClassId: 2,
    streamId: 3,
    name: "Political Science",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 12421,
        name: "Cold War Era",
        order: 1,
        topics: [
          { id: 124211, name: "Emergence of two power blocks and NAM origins", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    id: 1243,
    schoolClassId: 2,
    streamId: 3,
    name: "Geography",
    difficulty: "Intermediate",
    chapters: [
      {
        id: 12431,
        name: "Human Geography",
        order: 1,
        topics: [
          { id: 124311, name: "Nature, scope, and environmental determinism", difficulty: "Beginner" }
        ]
      }
    ]
  },
  {
    id: 1244,
    schoolClassId: 2,
    streamId: 3,
    name: "English",
    difficulty: "Beginner",
    chapters: [
      {
        id: 12441,
        name: "Vocabulary & Comprehensions",
        order: 1,
        topics: [
          { id: 124411, name: "Advanced reading comprehension and active syntax drafting", difficulty: "Intermediate" }
        ]
      }
    ]
  }
];
