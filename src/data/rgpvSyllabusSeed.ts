/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RgpvTopic {
  id: number;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface RgpvUnit {
  id: number;
  name: string;
  order: number;
  topics: RgpvTopic[];
}

export interface RgpvSubject {
  id: number;
  code: string;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  units: RgpvUnit[];
}

export interface RgpvSemester {
  semesterNumber: number;
  subjects: RgpvSubject[];
}

export const rgpvSyllabusDataset: RgpvSemester[] = [
  {
    semesterNumber: 1,
    subjects: [
      {
        id: 101,
        code: "BT-101",
        name: "Engineering Chemistry",
        category: "Basic Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 1011,
            name: "Water Analysis & Treatment",
            order: 1,
            topics: [
              { id: 10111, name: "Hardness of water and EDTA titration metrics", difficulty: "Intermediate" },
              { id: 10112, name: "Lime-Soda process and Zeolite softeners", difficulty: "Intermediate" },
              { id: 10113, name: "Reverse Osmosis (RO) and electrodialysis", difficulty: "Beginner" }
            ]
          },
          {
            id: 1012,
            name: "Boiler Troubles & Core Corrosion",
            order: 2,
            topics: [
              { id: 10121, name: "Boiler scales, sludge and caustic embrittlement", difficulty: "Advanced" },
              { id: 10122, name: "Wet and dry corrosion mechanisms & prevention", difficulty: "Intermediate" }
            ]
          },
          {
            id: 1013,
            name: "Lubricants & Phase Rule",
            order: 3,
            topics: [
              { id: 10131, name: "Flash point, aniline point, and viscosity index", difficulty: "Beginner" },
              { id: 10132, name: "One-component water system and Phase rule", difficulty: "Advanced" }
            ]
          },
          {
            id: 1014,
            name: "Polymers & Engineering Materials",
            order: 4,
            topics: [
              { id: 10141, name: "Thermosetting and thermoplastic resin synthesis", difficulty: "Intermediate" },
              { id: 10142, name: "Preparation & properties of Bakelite and PMMA", difficulty: "Intermediate" }
            ]
          },
          {
            id: 1015,
            name: "Spectroscopic Techniques",
            order: 5,
            topics: [
              { id: 10151, name: "UV-Visible and Fourier-transform Infrared (FTIR) principles", difficulty: "Advanced" },
              { id: 10152, name: "Lambert-Beer's law and quantitative calculations", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 102,
        code: "BT-102",
        name: "Mathematics-I",
        category: "Basic Science",
        difficulty: "Advanced",
        units: [
          {
            id: 1021,
            name: "Differential Calculus I",
            order: 1,
            topics: [
              { id: 10211, name: "Maclaurin's & Taylor's series expansion theorems", difficulty: "Advanced" },
              { id: 10212, name: "Asymptotes, Curvature, and Singularity tracing", difficulty: "Advanced" }
            ]
          },
          {
            id: 1022,
            name: "Differential Calculus II",
            order: 2,
            topics: [
              { id: 10221, name: "Partial differential equations & Euler's homogeneous theorem", difficulty: "Intermediate" },
              { id: 10222, name: "Jacobians and Maxima-Minima of multi-variable functions", difficulty: "Advanced" }
            ]
          },
          {
            id: 1023,
            name: "Integral Calculus",
            order: 3,
            topics: [
              { id: 10231, name: "Beta and Gamma functions & surface integration", difficulty: "Intermediate" },
              { id: 10232, name: "Double and triple integrals & Dirichlet's theorem", difficulty: "Advanced" }
            ]
          },
          {
            id: 1024,
            name: "Vector Calculus",
            order: 4,
            topics: [
              { id: 10241, name: "Gradient, Divergence and Curl vector operators", difficulty: "Intermediate" },
              { id: 10242, name: "Green's, Gauss Divergence, and Stokes' theorems", difficulty: "Advanced" }
            ]
          },
          {
            id: 1025,
            name: "Matrices & Linear Systems",
            order: 5,
            topics: [
              { id: 10251, name: "Rank of matrix, consistency of linear systems", difficulty: "Intermediate" },
              { id: 10252, name: "Eigenvalues, Eigenvectors, and Cayley-Hamilton theorem", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 103,
        code: "BT-103",
        name: "English for Communication",
        category: "Humanities",
        difficulty: "Beginner",
        units: [
          {
            id: 1031,
            name: "Fundamentals of Communication",
            order: 1,
            topics: [
              { id: 10311, name: "Communication channels, barriers, and feedback loops", difficulty: "Beginner" },
              { id: 10312, name: "Verbal and non-verbal communication frameworks", difficulty: "Beginner" }
            ]
          },
          {
            id: 1032,
            name: "Writing Skills & Grammar Essentials",
            order: 2,
            topics: [
              { id: 10321, name: "Sentence structure, tenses, and active/passive voice", difficulty: "Beginner" },
              { id: 10322, name: "Precise paragraph structuring and lexical cohesion", difficulty: "Beginner" }
            ]
          },
          {
            id: 1033,
            name: "Technical Composition",
            order: 3,
            topics: [
              { id: 10331, name: "Report writing, research abstracts, and executive briefs", difficulty: "Intermediate" },
              { id: 10332, name: "Writing resumes and formal email messages", difficulty: "Beginner" }
            ]
          },
          {
            id: 1034,
            name: "Reading and Comprehension",
            order: 4,
            topics: [
              { id: 10341, name: "Skimming, scanning, and analytical text evaluation", difficulty: "Beginner" }
            ]
          },
          {
            id: 1035,
            name: "Professional Oral Skills",
            order: 5,
            topics: [
              { id: 10351, name: "Phonetics, accentuation, and group discussion formats", difficulty: "Intermediate" },
              { id: 10352, name: "Making high-impact technical presentations", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 104,
        code: "BT-104",
        name: "Basic Electrical & Electronics",
        category: "Engineering Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 1041,
            name: "DC Circuits Analysis",
            order: 1,
            topics: [
              { id: 10411, name: "Kirchhoff's laws (KVL & KCL) circuit solving", difficulty: "Intermediate" },
              { id: 10412, name: "Thevenin, Norton, and Superposition network theorems", difficulty: "Advanced" }
            ]
          },
          {
            id: 1042,
            name: "AC Circuits Concepts",
            order: 2,
            topics: [
              { id: 10421, name: "R-L-C series & parallel resonance parameters", difficulty: "Intermediate" },
              { id: 10422, name: "Active, reactive, and complex power concepts", difficulty: "Advanced" }
            ]
          },
          {
            id: 1043,
            name: "Single Phase Transformers",
            order: 3,
            topics: [
              { id: 10431, name: "Transformer EMF equations and equivalent circuit modeling", difficulty: "Intermediate" },
              { id: 10432, name: "Open & short circuit efficiency testing", difficulty: "Advanced" }
            ]
          },
          {
            id: 1044,
            name: "Rotating Electrical Machines",
            order: 4,
            topics: [
              { id: 10441, name: "DC machines construction, torque, and excitation types", difficulty: "Intermediate" },
              { id: 10442, name: "Three-phase induction motor working and slip metrics", difficulty: "Advanced" }
            ]
          },
          {
            id: 1045,
            name: "Basic Electronics Devices",
            order: 5,
            topics: [
              { id: 10451, name: "PN junction diodes, Zener diodes, and bridge rectifiers", difficulty: "Intermediate" },
              { id: 10452, name: "Bipolar Junction Transistor (BJT) CE configuration", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 105,
        code: "BT-105",
        name: "Engineering Graphics",
        category: "Engineering Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 1051,
            name: "Scales and Curves",
            order: 1,
            topics: [
              { id: 10511, name: "Plain, diagonal, and vernier scales construction", difficulty: "Intermediate" },
              { id: 10512, name: "Cycloids, epicycloids, and involute curves drawing", difficulty: "Advanced" }
            ]
          },
          {
            id: 1052,
            name: "Projections of Points & Lines",
            order: 2,
            topics: [
              { id: 10521, name: "Projections in absolute quadrants & line traces", difficulty: "Intermediate" },
              { id: 10522, name: "Lines inclined to both H.P. and V.P. projections", difficulty: "Advanced" }
            ]
          },
          {
            id: 1053,
            name: "Projections of Planes & Solids",
            order: 3,
            topics: [
              { id: 10531, name: "Projection of polygonal and circular lamina templates", difficulty: "Intermediate" },
              { id: 10532, name: "Projection of prisms, pyramids, cones, and cylinders", difficulty: "Advanced" }
            ]
          },
          {
            id: 1054,
            name: "Section of Solids",
            order: 4,
            topics: [
              { id: 10541, name: "Development of lateral surfaces of sectioned solids", difficulty: "Advanced" }
            ]
          },
          {
            id: 1055,
            name: "Isometric & Perspective View",
            order: 5,
            topics: [
              { id: 10551, name: "Isometric drawings and orthographic projection conversion", difficulty: "Intermediate" },
              { id: 10552, name: "Basic CAD command lists and drawing primitives", difficulty: "Beginner" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 2,
    subjects: [
      {
        id: 201,
        code: "BT-201",
        name: "Engineering Physics",
        category: "Basic Science",
        difficulty: "Advanced",
        units: [
          {
            id: 2011,
            name: "Wave Optics",
            order: 1,
            topics: [
              { id: 20111, name: "Interference by division of wavefront, Newton's Rings", difficulty: "Intermediate" },
              { id: 20112, name: "Fraunhofer Diffraction at a single slit, Grating indices", difficulty: "Advanced" }
            ]
          },
          {
            id: 2012,
            name: "Lasers and Fiber Optics",
            order: 2,
            topics: [
              { id: 20121, name: "Einstein's A & B coefficients, He-Ne laser systems", difficulty: "Intermediate" },
              { id: 20122, name: "Optical fiber propagation, Numerical Aperture (NA) formula", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2013,
            name: "Quantum Mechanics",
            order: 3,
            topics: [
              { id: 20131, name: "De-Broglie waves, Heisenberg Uncertainty relation", difficulty: "Advanced" },
              { id: 20132, name: "Time-Independent Schrodinger equation, 1D particle in a box", difficulty: "Advanced" }
            ]
          },
          {
            id: 2014,
            name: "Solid State & Semiconductor Physics",
            order: 4,
            topics: [
              { id: 20141, name: "Kronig-Penney crystal band model details", difficulty: "Advanced" },
              { id: 20142, name: "Hall Effect measurement and semiconductor mechanics", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2015,
            name: "Nuclear Physics & Nanomaterials",
            order: 5,
            topics: [
              { id: 20151, name: "Geiger-Mueller gas counters & particle accelerators", difficulty: "Intermediate" },
              { id: 20152, name: "Carbon nanotubes (CNTs) chemical synthesis & applications", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 202,
        code: "BT-202",
        name: "Mathematics-II",
        category: "Basic Science",
        difficulty: "Advanced",
        units: [
          {
            id: 2021,
            name: "Ordinary Differential Equations I",
            order: 1,
            topics: [
              { id: 20211, name: "First-order exact and linear differential equations", difficulty: "Intermediate" },
              { id: 20212, name: "Equations solvable for P, Y, and X (Clairaut's form)", difficulty: "Advanced" }
            ]
          },
          {
            id: 2022,
            name: "Ordinary Differential Equations II",
            order: 2,
            topics: [
              { id: 20221, name: "Higher-order linear equations with constant coefficients", difficulty: "Intermediate" },
              { id: 20222, name: "Variation of Parameters method and Cauchy-Euler solver", difficulty: "Advanced" }
            ]
          },
          {
            id: 2023,
            name: "Series Solutions & Special functions",
            order: 3,
            topics: [
              { id: 20231, name: "Legendre and Bessel polynomial equations", difficulty: "Advanced" },
              { id: 20232, name: "Orthogonality constants of Bessel formulas", difficulty: "Advanced" }
            ]
          },
          {
            id: 2024,
            name: "Partial Differential Equations",
            order: 4,
            topics: [
              { id: 20241, name: "First-order Lagrange PDE solving structures", difficulty: "Intermediate" },
              { id: 20242, name: "Method of separation of variables for wave/heat equations", difficulty: "Advanced" }
            ]
          },
          {
            id: 2025,
            name: "Laplace Transform",
            order: 5,
            topics: [
              { id: 20251, name: "First & second shifting Laplace properties", difficulty: "Intermediate" },
              { id: 20252, name: "Convolution theorem and solving ODEs using transform methods", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 203,
        code: "BT-203",
        name: "Basic Mechanical Engineering",
        category: "Engineering Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 2031,
            name: "Engineering Materials",
            order: 1,
            topics: [
              { id: 20311, name: "Stress-Strain curve for mild steel and alloy behaviors", difficulty: "Intermediate" },
              { id: 20312, name: "Rockwell, Brinell, and Vickers hardness tests", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2032,
            name: "Thermodynamics Laws",
            order: 2,
            topics: [
              { id: 20321, name: "First and Second laws of thermodynamics with open systems", difficulty: "Intermediate" },
              { id: 20322, name: "Carnot Engine ideal efficiency mathematical proofs", difficulty: "Advanced" }
            ]
          },
          {
            id: 2033,
            name: "Boilers and Steam Generators",
            order: 3,
            topics: [
              { id: 20331, name: "Cochran, Babcock & Wilcox water tube boilers", difficulty: "Intermediate" },
              { id: 20332, name: "Boiler mountings, accessories, and draft systems", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2034,
            name: "Internal Combustion Engines",
            order: 4,
            topics: [
              { id: 20341, name: "Working of 2-stroke and 4-stroke Otto and Diesel cycles", difficulty: "Intermediate" },
              { id: 20342, name: "Comparison of SI and CI engine performance parameters", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2035,
            name: "Machine Tools & Processing",
            order: 5,
            topics: [
              { id: 20351, name: "Lathe machining, drilling, and milling operations", difficulty: "Beginner" },
              { id: 20352, name: "Basic welding joints, brazing, and soldering steps", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        id: 204,
        code: "BT-204",
        name: "Basic Civil Engineering",
        category: "Engineering Science",
        difficulty: "Beginner",
        units: [
          {
            id: 2041,
            name: "Building Materials and Structures",
            order: 1,
            topics: [
              { id: 20411, name: "Bricks, cement classification, concrete ratios, and grading", difficulty: "Beginner" }
            ]
          },
          {
            id: 2042,
            name: "Surveying and Leveling",
            order: 2,
            topics: [
              { id: 20421, name: "Chain, compass and leveling surveys, calculations", difficulty: "Intermediate" },
              { id: 20422, name: "Contours, profile leveling, GPS and GIS basics", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2043,
            name: "Static Mechanics & Forces",
            order: 3,
            topics: [
              { id: 20431, name: "Lami's Theorem and Newton's laws coplanar force parsing", difficulty: "Intermediate" },
              { id: 20432, name: "Laws of dry friction, angle of friction, and sliding", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2044,
            name: "Shear Force & Bending Moments",
            order: 4,
            topics: [
              { id: 20441, name: "SFD and BMD diagrams for cantilever and simply supported beams", difficulty: "Advanced" }
            ]
          },
          {
            id: 2045,
            name: "Environmental Planning",
            order: 5,
            topics: [
              { id: 20451, name: "Water supply systems, sewage treatment, municipal waste systems", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        id: 205,
        code: "BT-205",
        name: "Basic Computer Engineering",
        category: "Engineering Science",
        difficulty: "Beginner",
        units: [
          {
            id: 2051,
            name: "Computer Fundamentals",
            order: 1,
            topics: [
              { id: 20511, name: "CPU block diagram, input/output structures, and bus architectures", difficulty: "Beginner" },
              { id: 20512, name: "Octal, Hexadecimal, Binary systems conversion and 2's complements", difficulty: "Beginner" }
            ]
          },
          {
            id: 2052,
            name: "Operating Systems Intro",
            order: 2,
            topics: [
              { id: 20521, name: "Functions of operating systems (Windows, Linux, macOS)", difficulty: "Beginner" },
              { id: 20522, name: "Process states, scheduling queues, and basic multi-programming", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2053,
            name: "Database Foundations",
            order: 3,
            topics: [
              { id: 20531, name: "Database definition, ER diagram mapping, and structural components", difficulty: "Beginner" },
              { id: 20532, name: "Basic relational algebra and SQL queries (CRUD actions)", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2054,
            name: "C++ Programming Basics",
            order: 4,
            topics: [
              { id: 20541, name: "Classes, objects, constructors, and encapsulation parameters", difficulty: "Intermediate" },
              { id: 20542, name: "C++ Control flow, iterative loops, and modular code arrays", difficulty: "Intermediate" }
            ]
          },
          {
            id: 2055,
            name: "Internet & Computer Security",
            order: 5,
            topics: [
              { id: 20551, name: "Network topologies, OSI layered reference models", difficulty: "Intermediate" },
              { id: 20552, name: "Malware, virus signatures, firewalls and encryption basics", difficulty: "Beginner" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 3,
    subjects: [
      {
        id: 301,
        code: "CS-301",
        name: "Energy & Environmental Engineering",
        category: "Engineering Science",
        difficulty: "Beginner",
        units: [
          {
            id: 3011,
            name: "Ecosystems and Biodiversity",
            order: 1,
            topics: [
              { id: 30111, name: "Energy flow in ecosystems, food webs, and food chains", difficulty: "Beginner" },
              { id: 30112, name: "Threats and conservation models for critical biodiversity", difficulty: "Beginner" }
            ]
          },
          {
            id: 3012,
            name: "Air Pollution and Controls",
            order: 2,
            topics: [
              { id: 30121, name: "Sources, impacts, and mechanisms of greenhouse emissions", difficulty: "Beginner" },
              { id: 30122, name: "Electrostatic precipitators (ESP) and scrubbing systems", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3013,
            name: "Water and Land Pollution",
            order: 3,
            topics: [
              { id: 30131, name: "BOD and COD indicators of wastewater contamination", difficulty: "Intermediate" },
              { id: 30132, name: "Eutrophication and primary treatment of sewage flows", difficulty: "Beginner" }
            ]
          },
          {
            id: 3014,
            name: "Solid Waste & Noise Control",
            order: 4,
            topics: [
              { id: 30141, name: "Municipal waste management and pyrolysis treatments", difficulty: "Beginner" }
            ]
          },
          {
            id: 3015,
            name: "Renewable Energy Sources",
            order: 5,
            topics: [
              { id: 30151, name: "Solar photovoltaics, wind energy converters, and biomass conversion", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 302,
        code: "CS-302",
        name: "Discrete Structure",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 3021,
            name: "Set Theory & Relations",
            order: 1,
            topics: [
              { id: 30211, name: "Cartesian products, equivalence relations and partitions", difficulty: "Intermediate" },
              { id: 30212, name: "Hasse diagrams and Partial Ordered Sets (Posets) lattices", difficulty: "Advanced" }
            ]
          },
          {
            id: 3022,
            name: "Functions & Algebraic Structures",
            order: 2,
            topics: [
              { id: 30221, name: "Injective, surjective, and bijective mapping calculations", difficulty: "Intermediate" },
              { id: 30222, name: "Groups, subgroups, rings, fields, and Lagrange groups theorem", difficulty: "Advanced" }
            ]
          },
          {
            id: 3023,
            name: "Propositional Logic",
            order: 3,
            topics: [
              { id: 30231, name: "Tautology, contradictions, quantifiers and logic tables", difficulty: "Intermediate" },
              { id: 30232, name: "Rules of inference and boolean algebra identities", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3024,
            name: "Graph Theory",
            order: 4,
            topics: [
              { id: 30241, name: "Isomorphism, planar graphs, and Euler formula metrics", difficulty: "Advanced" },
              { id: 30242, name: "Eulerian and Hamiltonian pathways, graph coloring indexes", difficulty: "Advanced" }
            ]
          },
          {
            id: 3025,
            name: "Trees and Recurrence relations",
            order: 5,
            topics: [
              { id: 30251, name: "Spanning trees, Prim and Kruskal algorithm proofs", difficulty: "Intermediate" },
              { id: 30252, name: "Solving linear recurrence relations using generating functions", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 303,
        code: "CS-303",
        name: "Data Structure",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 3031,
            name: "Algorithm Complexity Basics",
            order: 1,
            topics: [
              { id: 30311, name: "Big Oh, Omega, and Theta asymptotic notation calculations", difficulty: "Intermediate" },
              { id: 30312, name: "Space vs. Time complexity analysis of linear arrays", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3032,
            name: "Linear Data Structures",
            order: 2,
            topics: [
              { id: 30321, name: "Singly, doubly, and circular linked lists implementation", difficulty: "Intermediate" },
              { id: 30322, name: "Josephus problem application using circular structures", difficulty: "Advanced" }
            ]
          },
          {
            id: 3033,
            name: "Stacks and Queues",
            order: 3,
            topics: [
              { id: 30331, name: "Postfix, prefix expression evaluation and recursion", difficulty: "Intermediate" },
              { id: 30332, name: "Circular queues, deques, and priority queues implementation", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3034,
            name: "Trees & Binary Search Trees",
            order: 4,
            topics: [
              { id: 30341, name: "Inorder, preorder, and postorder tree traversal recursion", difficulty: "Intermediate" },
              { id: 30342, name: "AVL Trees self-balancing height rotation steps", difficulty: "Advanced" },
              { id: 30343, name: "Red-black trees and B-Trees structure concepts", difficulty: "Advanced" }
            ]
          },
          {
            id: 3035,
            name: "Graphs and Hashing",
            order: 5,
            topics: [
              { id: 30351, name: "Adjacency matrix, lists, DFS and BFS traversal paths", difficulty: "Intermediate" },
              { id: 30352, name: "Collision resolution techniques (linear probing, chaining)", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 304,
        code: "CS-304",
        name: "Digital Systems",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 3041,
            name: "Number Systems and Codes",
            order: 1,
            topics: [
              { id: 30411, name: "Binary, Gray, Ex-3 and alpha-numeric codes structure", difficulty: "Beginner" },
              { id: 30412, name: "Boolean algebraic simplification and universal gates", difficulty: "Beginner" }
            ]
          },
          {
            id: 3042,
            name: "Combinational Logic Circuits",
            order: 2,
            topics: [
              { id: 30421, name: "K-Map minimization with Don't Care condition slots", difficulty: "Intermediate" },
              { id: 30422, name: "Multiplexers, de-multiplexers, encoders, and carry-lookahead adders", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3043,
            name: "Sequential Logic Circuits",
            order: 3,
            topics: [
              { id: 30431, name: "SR, JK, D, and T flip-flops operation & parameters", difficulty: "Intermediate" },
              { id: 30432, name: "Master-Slave JK flip-flop race-around hazard resolution", difficulty: "Advanced" }
            ]
          },
          {
            id: 3044,
            name: "Counters & Shift Registers",
            order: 4,
            topics: [
              { id: 30441, name: "design of synchronous and asynchronous Modulo-N counters", difficulty: "Advanced" },
              { id: 30442, name: "Universal shift registers and Ring/Johnson counters", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3045,
            name: "Logic Families & Converters",
            order: 5,
            topics: [
              { id: 30451, name: "TTL, CMOS logic families thresholds, comparative indices", difficulty: "Intermediate" },
              { id: 30452, name: "R-2R Ladder Digital to Analog Converters (DAC)", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 305,
        code: "CS-305",
        name: "Object Oriented Programming (C++)",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 3051,
            name: "Basics of OOP",
            order: 1,
            topics: [
              { id: 30511, name: "Structured vs. Object Oriented paradigm comparisons", difficulty: "Beginner" },
              { id: 30512, name: "C++ classes, structures, memory allocation, and references", difficulty: "Beginner" }
            ]
          },
          {
            id: 3052,
            name: "Classes & Objects Details",
            order: 2,
            topics: [
              { id: 30521, name: "Constructors overload, destructors, copy constructor details", difficulty: "Intermediate" },
              { id: 30522, name: "Friend functions and static member scope properties", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3053,
            name: "Inheritance and Polymorphism",
            order: 3,
            topics: [
              { id: 30531, name: "Multiple, multilevel and virtual base class inheritance", difficulty: "Intermediate" },
              { id: 30532, name: "Virtual functions, late binding, and abstract classes", difficulty: "Advanced" }
            ]
          },
          {
            id: 3054,
            name: "Templates & Exception Handling",
            order: 4,
            topics: [
              { id: 30541, name: "Function and Class templates generic implementation", difficulty: "Intermediate" },
              { id: 30542, name: "Standard try-catch-throw mechanisms in C++ codes", difficulty: "Intermediate" }
            ]
          },
          {
            id: 3055,
            name: "Files and Streams",
            order: 5,
            topics: [
              { id: 30551, name: "Fstream library, file pointer seekg/tellg operations", difficulty: "Intermediate" },
              { id: 30552, name: "Standard Template Library (STL) vectors, lists, maps", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 4,
    subjects: [
      {
        id: 401,
        code: "CS-401",
        name: "Mathematics-III",
        category: "Basic Science",
        difficulty: "Advanced",
        units: [
          {
            id: 4011,
            name: "Complex Variable Functions",
            order: 1,
            topics: [
              { id: 40111, name: "Cauchy-Riemann equations, analytic functions verification", difficulty: "Advanced" },
              { id: 40112, name: "Cauchy's Integral Theorem & Residue integration methods", difficulty: "Advanced" }
            ]
          },
          {
            id: 4012,
            name: "Numerical Analysis I",
            order: 2,
            topics: [
              { id: 40121, name: "Bisection, Newton-Raphson, and Regula-Falsi methods", difficulty: "Intermediate" },
              { id: 40122, name: "Gauss-Seidel and Jacobi iterative matrix methods", difficulty: "Advanced" }
            ]
          },
          {
            id: 4013,
            name: "Numerical Analysis II",
            order: 3,
            topics: [
              { id: 40131, name: "Newton forward, backward and Lagrange interpolations", difficulty: "Intermediate" },
              { id: 40132, name: "Simpson's 1/3 and 3/8 integration rules calculations", difficulty: "Intermediate" }
            ]
          },
          {
            id: 4014,
            name: "Probability Distributions",
            order: 4,
            topics: [
              { id: 40141, name: "Binomial, Poisson, and Normal density variables", difficulty: "Advanced" }
            ]
          },
          {
            id: 4015,
            name: "Hypothesis Testing",
            order: 5,
            topics: [
              { id: 40151, name: "T-test, Chi-square test, and F-test evaluation scales", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 402,
        code: "CS-402",
        name: "Analysis & Design of Algorithms",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 4021,
            name: "Algorithm Complexity & Recursion",
            order: 1,
            topics: [
              { id: 40211, name: "Solving recurrences: Master Theorem and recursion trees", difficulty: "Advanced" },
              { id: 40212, name: "Lower bound theory and amortized complexity basics", difficulty: "Advanced" }
            ]
          },
          {
            id: 4022,
            name: "Divide and Conquer Strategy",
            order: 2,
            topics: [
              { id: 40221, name: "Binary Search, Quick Sort and Merge Sort analysis", difficulty: "Intermediate" },
              { id: 40222, name: "Strassen's matrix multiplication algorithm bounds", difficulty: "Advanced" }
            ]
          },
          {
            id: 4023,
            name: "Greedy Method Design",
            order: 3,
            topics: [
              { id: 40231, name: "Fractional Knapsack problem greedy solver proofs", difficulty: "Intermediate" },
              { id: 40232, name: "Huffman coding, Single source shortest path Dijkstra design", difficulty: "Advanced" }
            ]
          },
          {
            id: 4024,
            name: "Dynamic Programming",
            order: 4,
            topics: [
              { id: 40241, name: "0/1 Knapsack, Longest Common Subsequence (LCS) matrix", difficulty: "Advanced" },
              { id: 40242, name: "Floyd-Warshall all-pairs shortest paths formula", difficulty: "Advanced" }
            ]
          },
          {
            id: 4025,
            name: "Backtracking & Complexity Classes",
            order: 5,
            topics: [
              { id: 40251, name: "N-Queens problem, Graph Coloring backtracking bounds", difficulty: "Advanced" },
              { id: 40252, name: "P, NP, NP-Complete, and NP-Hard reduction proofs", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 403,
        code: "CS-403",
        name: "Software Engineering",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 4031,
            name: "Software Development Lifecycle",
            order: 1,
            topics: [
              { id: 40311, name: "Waterfall, Spiral, Prototyping, and RAD lifecycle models", difficulty: "Beginner" },
              { id: 40312, name: "Agile Development SCRUM sprints and stories", difficulty: "Beginner" }
            ]
          },
          {
            id: 4032,
            name: "Requirements Modeling & SRS",
            order: 2,
            topics: [
              { id: 40321, name: "Requirements elicitation, IEEE SRS document templates", difficulty: "Intermediate" },
              { id: 40322, name: "Data Flow Diagrams (DFD) and UML Class diagrams mapping", difficulty: "Intermediate" }
            ]
          },
          {
            id: 4033,
            name: "Software Design Principles",
            order: 3,
            topics: [
              { id: 40331, name: "Cohesion and Coupling metrics optimization levels", difficulty: "Advanced" },
              { id: 40332, name: "Function-oriented design vs Object-oriented design architectures", difficulty: "Intermediate" }
            ]
          },
          {
            id: 4034,
            name: "Software Testing Strategies",
            order: 4,
            topics: [
              { id: 40341, name: "White-box baseline path testing and cyclomatic complexity", difficulty: "Advanced" },
              { id: 40342, name: "Black-box boundary value analysis and equivalence partitions", difficulty: "Intermediate" }
            ]
          },
          {
            id: 4035,
            name: "Software Estimation & Maintenance",
            order: 5,
            topics: [
              { id: 40351, name: "COCOMO estimation modeling and software metrics (LOC)", difficulty: "Advanced" },
              { id: 40352, name: "Software configuration management & versioning models", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 404,
        code: "CS-404",
        name: "Computer Organization & Architecture",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 4041,
            name: "Register Transfer & Microoperations",
            order: 1,
            topics: [
              { id: 40411, name: "Register transfer language (RTL), bus and memory transfers", difficulty: "Intermediate" },
              { id: 40412, name: "Arithmetic, logic, and shift microoperations circuit layouts", difficulty: "Advanced" }
            ]
          },
          {
            id: 4042,
            name: "Basic Computer Organization",
            order: 2,
            topics: [
              { id: 40421, name: "Instruction codes, computer registers, and timing cycles", difficulty: "Intermediate" },
              { id: 40422, name: "Design of simple accumulators & microprogrammed controls", difficulty: "Advanced" }
            ]
          },
          {
            id: 4043,
            name: "Central Processing Unit Design",
            order: 3,
            topics: [
              { id: 40431, name: "General register organization, stack architecture, and addressing styles", difficulty: "Intermediate" },
              { id: 40432, name: "RISC vs. CISC micro-architectural differences", difficulty: "Advanced" }
            ]
          },
          {
            id: 4044,
            name: "Computer Arithmetic Operations",
            order: 4,
            topics: [
              { id: 40441, name: "Booth's multiplication algorithm for signed numbers", difficulty: "Advanced" },
              { id: 40442, name: "Floating-point arithmetic hardware operations configuration", difficulty: "Advanced" }
            ]
          },
          {
            id: 4045,
            name: "Memory & Input-Output Structures",
            order: 5,
            topics: [
              { id: 40451, name: "Cache memory mapping (Direct, Associative, Set-Associative)", difficulty: "Advanced" },
              { id: 40452, name: "DMA controller structures and interrupt-driven transfers", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 405,
        code: "CS-405",
        name: "OOP using Java",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 4051,
            name: "Java Language Foundations",
            order: 1,
            topics: [
              { id: 40511, name: "JVM, JRE, bytecodes, garbage collection mechanisms", difficulty: "Beginner" },
              { id: 40512, name: "Primitive types, arrays, arrays methods, scanner inputs", difficulty: "Beginner" }
            ]
          },
          {
            id: 4052,
            name: "Classes & Inheritance in Java",
            order: 2,
            topics: [
              { id: 40521, name: "Method overloading, overriding, dynamic method dispatch", difficulty: "Intermediate" },
              { id: 40522, name: "Abstract classes and interfaces multiple implementation rules", difficulty: "Intermediate" }
            ]
          },
          {
            id: 4053,
            name: "Packages and Exceptions",
            order: 3,
            topics: [
              { id: 40531, name: "Creating custom packages and package accessibility namespaces", difficulty: "Intermediate" },
              { id: 40532, name: "Multi-catch layouts, user-defined exceptions throwing", difficulty: "Intermediate" }
            ]
          },
          {
            id: 4054,
            name: "Multithreading & Concurrency",
            order: 4,
            topics: [
              { id: 40541, name: "Thread states, Runnable interface, thread synchronization blocks", difficulty: "Advanced" },
              { id: 40542, name: "Inter-thread communication using wait(), notify()", difficulty: "Advanced" }
            ]
          },
          {
            id: 4055,
            name: "Collections & Streams",
            order: 5,
            topics: [
              { id: 40551, name: "ArrayList, HashMap, HashSet generic structures", difficulty: "Intermediate" },
              { id: 40552, name: "File readers, writers, serialization operations", difficulty: "Intermediate" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 5,
    subjects: [
      {
        id: 501,
        code: "CS-501",
        name: "Theory of Computation",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 5011,
            name: "Finite Automata",
            order: 1,
            topics: [
              { id: 50111, name: "DFA, NFA equivalence and subset construction algorithms", difficulty: "Advanced" },
              { id: 50112, name: "Regular expressions, Myhill-Nerode minimization theorems", difficulty: "Advanced" }
            ]
          },
          {
            id: 5012,
            name: "Context Free Grammars",
            order: 2,
            topics: [
              { id: 50121, name: "Chomsky grammar hierarchies, parsing structural trees", difficulty: "Intermediate" },
              { id: 50122, name: "Chomsky Normal Form (CNF) and GNF transformation algorithms", difficulty: "Advanced" }
            ]
          },
          {
            id: 5013,
            name: "Pushdown Automata",
            order: 3,
            topics: [
              { id: 50131, name: "NPDA and DPDA states, transition model mappings", difficulty: "Advanced" },
              { id: 50132, name: "Pumping Lemma proofs for non-context free languages", difficulty: "Advanced" }
            ]
          },
          {
            id: 5014,
            name: "Turing Machines",
            order: 4,
            topics: [
              { id: 50141, name: "Turing Machine transition tables, multi-tape machine extensions", difficulty: "Advanced" },
              { id: 50142, name: "Church-Turing thesis and recursive enumerables boundaries", difficulty: "Advanced" }
            ]
          },
          {
            id: 5015,
            name: "Computability and Decidability",
            order: 5,
            topics: [
              { id: 50151, name: "Halting problem decidability proofs, Rice's theorem", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 502,
        code: "CS-502",
        name: "Database Management Systems",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 5021,
            name: "Database Foundations",
            order: 1,
            topics: [
              { id: 50211, name: "3-tier database architecture levels, schema isolation", difficulty: "Intermediate" },
              { id: 50212, name: "ER Diagrams, weak entities, and key attributes mapping", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5022,
            name: "Relational Algebra & SQL",
            order: 2,
            topics: [
              { id: 50221, name: "Relational algebra selectors, projects, joins, divisions", difficulty: "Intermediate" },
              { id: 50222, name: "SQL subqueries, group by having, outer joins", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5023,
            name: "Normalisation Theory",
            order: 3,
            topics: [
              { id: 50231, name: "Functional dependencies (FD) and closure algorithms", difficulty: "Intermediate" },
              { id: 50232, name: "1NF, 2NF, 3NF, and BCNF normalization lossy validation", difficulty: "Advanced" }
            ]
          },
          {
            id: 5024,
            name: "Transaction & Concurrency Control",
            order: 4,
            topics: [
              { id: 50241, name: "ACID properties, serializability schedules determination", difficulty: "Advanced" },
              { id: 50242, name: "Two-Phase Locking (2PL) and timestamp multi-version locks", difficulty: "Advanced" }
            ]
          },
          {
            id: 5025,
            name: "Database Indexes & Recovery",
            order: 5,
            topics: [
              { id: 50251, name: "B+ Tree indexes, hashing structures config", difficulty: "Advanced" },
              { id: 50252, name: "Log-based recovery, checkpoints, shadow paging", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 503,
        code: "CS-503",
        name: "Computer Networks",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 5031,
            name: "Physical Layer & Network Models",
            order: 1,
            topics: [
              { id: 50311, name: "ISO/OSI model vs TCP/IP network layers design", difficulty: "Intermediate" },
              { id: 50312, name: "Transmission media, nyquist/shannon bandwidth capacity", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5032,
            name: "Data Link Layer",
            order: 2,
            topics: [
              { id: 50321, name: "Framing, parity, checksum, and CRC bit error checks", difficulty: "Intermediate" },
              { id: 50322, name: "Stop-&-Wait, Go-Back-N, and Selective Repeat sliding sliding windows", difficulty: "Advanced" }
            ]
          },
          {
            id: 5033,
            name: "Medium Access Sublayer",
            order: 3,
            topics: [
              { id: 50331, name: "ALOHA, CSMA/CD, CSMA/CA carrier protocols", difficulty: "Intermediate" },
              { id: 50332, name: "Ethernet collision detection, IEEE 802.11 Wi-Fi frames", difficulty: "Advanced" }
            ]
          },
          {
            id: 5034,
            name: "Network Routing Codes",
            order: 4,
            topics: [
              { id: 50341, name: "IPv4 & IPv6 addressing schemas, subnetting CIDR metrics", difficulty: "Advanced" },
              { id: 50342, name: "Dijkstra link-state, distance vector Bellman-Ford paths", difficulty: "Advanced" }
            ]
          },
          {
            id: 5035,
            name: "Transport & Application Layer",
            order: 5,
            topics: [
              { id: 50351, name: "TCP three-way handshakes, congestion control windows", difficulty: "Advanced" },
              { id: 50352, name: "DNS resolving, HTTP message structures, SMTP channels", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 504,
        code: "CS-504",
        name: "Cyber Security",
        category: "Core Elective",
        difficulty: "Intermediate",
        units: [
          {
            id: 5041,
            name: "Threats & Security Principles",
            order: 1,
            topics: [
              { id: 50411, name: "Confidentiality, Integrity, and Availability (CIA) triage", difficulty: "Beginner" },
              { id: 50412, name: "Buffer overflows, SQL injections and scripting vulnerabilities", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5042,
            name: "Applied Cryptography",
            order: 2,
            topics: [
              { id: 50421, name: "Symmetric DES and AES encryption matrix operations", difficulty: "Advanced" },
              { id: 50422, name: "Asymmetric RSA key generation proofs and hashes", difficulty: "Advanced" }
            ]
          },
          {
            id: 5043,
            name: "Network Perimeter Defense",
            order: 3,
            topics: [
              { id: 50431, name: "Firewall rule arrays, host and network intrusion checks", difficulty: "Intermediate" },
              { id: 50432, name: "VPN, IPsec and Secure Socket Layer (SSL) workflows", difficulty: "Advanced" }
            ]
          },
          {
            id: 5044,
            name: "Cyber Jurisprudence & Laws",
            order: 4,
            topics: [
              { id: 50441, name: "India Information Technology Act (2000), amendments", difficulty: "Beginner" }
            ]
          },
          {
            id: 5045,
            name: "Forensics and Mitigation",
            order: 5,
            topics: [
              { id: 50451, name: "Evidentiary disk cloning, forensic file parsing tools", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 505,
        code: "CS-505",
        name: "Artificial Intelligence",
        category: "Core Elective",
        difficulty: "Advanced",
        units: [
          {
            id: 5051,
            name: "AI & State Heuristics",
            order: 1,
            topics: [
              { id: 50511, name: "DFS, BFS, and heuristic search processes (A* & AO*)", difficulty: "Advanced" },
              { id: 50512, name: "Adversarial game trees playing and Alpha-Beta minimax prunings", difficulty: "Advanced" }
            ]
          },
          {
            id: 5052,
            name: "Knowledge Representations",
            order: 2,
            topics: [
              { id: 50521, name: "Propositional & First-Order Predicate Logic resolution", difficulty: "Advanced" },
              { id: 50522, name: "Semantic nets, inheritance, frames, conceptual schemas", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5053,
            name: "Reasoning with Uncertainty",
            order: 3,
            topics: [
              { id: 50531, name: "Bayesian networks joint probabilities structures", difficulty: "Advanced" },
              { id: 50532, name: "Fuzzy logic representation and membership values", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5054,
            name: "Machine Learning & Experts",
            order: 4,
            topics: [
              { id: 50541, name: "Supervised ID3 decision tree classifier algorithms", difficulty: "Intermediate" },
              { id: 50542, name: "Rule-based expert systems backward reasoning shells", difficulty: "Intermediate" }
            ]
          },
          {
            id: 5055,
            name: "Natural Language Processing",
            order: 5,
            topics: [
              { id: 50551, name: "Syntactic parsing, transition networks, context models", difficulty: "Intermediate" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 6,
    subjects: [
      {
        id: 601,
        code: "CS-601",
        name: "Compiler Design",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 6011,
            name: "Lexical Analysis",
            order: 1,
            topics: [
              { id: 60111, name: "Lexical tokens parsing, Lex tool specs regex", difficulty: "Intermediate" },
              { id: 60112, name: "Converting RE to DFA via Thompson's algorithm", difficulty: "Advanced" }
            ]
          },
          {
            id: 6012,
            name: "Syntax Analysis I",
            order: 2,
            topics: [
              { id: 60121, name: "Top-down LL(1) parsing table calculations, FIRST/FOLLOW", difficulty: "Advanced" },
              { id: 60122, name: "Left recursion elimination and lookahead parsers", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6013,
            name: "Syntax Analysis II & Bottom-Up",
            order: 3,
            topics: [
              { id: 60131, name: "LR(0), SLR(1), and LALR(1) item sets states tracking", difficulty: "Advanced" },
              { id: 60132, name: "Shift-Reduce parsing model conflicts resolving", difficulty: "Advanced" }
            ]
          },
          {
            id: 6014,
            name: "Code Generations & Intermediate Symbolics",
            order: 4,
            topics: [
              { id: 60141, name: "Three-address codes quad representation records", difficulty: "Intermediate" },
              { id: 60142, name: "Syntax-Directed Translation (SDT) synthesis rules", difficulty: "Advanced" }
            ]
          },
          {
            id: 6015,
            name: "Code Optimizations",
            order: 5,
            topics: [
              { id: 60151, name: "Basic blocks mapping graphs, DAG reductions", difficulty: "Advanced" },
              { id: 60152, name: "Loop invariants elimination, strength reduction compilers", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 602,
        code: "CS-602",
        name: "Computer Graphics",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 6021,
            name: "Output Primitives",
            order: 1,
            topics: [
              { id: 60211, name: "Bresenham's and DDA line rasterizing algorithm proofs", difficulty: "Intermediate" },
              { id: 60212, name: "Midpoint circle and ellipse mathematical formulations", difficulty: "Advanced" }
            ]
          },
          {
            id: 6022,
            name: "2D Geometry & Clipping",
            order: 2,
            topics: [
              { id: 60221, name: "2D Translation, scaling, rotation homogeneous matrices", difficulty: "Intermediate" },
              { id: 60222, name: "Cohen-Sutherland line and Sutherland-Hodgman polygon clipping", difficulty: "Advanced" }
            ]
          },
          {
            id: 6023,
            name: "3D Graphics & Curves",
            order: 3,
            topics: [
              { id: 60231, name: "3D Translation, rotation, perspective projection transforms", difficulty: "Advanced" },
              { id: 60232, name: "Hermite, Bezier, and B-Spline curve synthesis formulas", difficulty: "Advanced" }
            ]
          },
          {
            id: 6024,
            name: "Rendering & Shading",
            order: 4,
            topics: [
              { id: 60241, name: "Flat, Gouraud, and Phong shading models comparisons", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6025,
            name: "Visible Surface Detection",
            order: 5,
            topics: [
              { id: 60251, name: "Z-Buffer algorithm, Scan-line and Back-face culling geometry", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 603,
        code: "CS-603",
        name: "Project Management",
        category: "Humanities",
        difficulty: "Beginner",
        units: [
          {
            id: 6031,
            name: "Software Project Planning",
            order: 1,
            topics: [
              { id: 60311, name: "Project estimation, WBS structures, scheduling loops", difficulty: "Beginner" }
            ]
          },
          {
            id: 6032,
            name: "Agile Development",
            order: 2,
            topics: [
              { id: 60321, name: "Agile development frameworks, SCRUM boards, metrics tracking", difficulty: "Beginner" }
            ]
          },
          {
            id: 6033,
            name: "Risk Management",
            order: 3,
            topics: [
              { id: 60331, name: "Risk identification matrices and hazard control loops", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6034,
            name: "Configuration & DevOps",
            order: 4,
            topics: [
              { id: 60341, name: "CI/CD automated pipeline builds, git flows orchestration", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6035,
            name: "Professional Quality",
            order: 5,
            topics: [
              { id: 60351, name: "CMMI levels, ISO 9001 compliance, audits", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 604,
        code: "CS-604",
        name: "Machine Learning",
        category: "Professional Elective",
        difficulty: "Advanced",
        units: [
          {
            id: 6041,
            name: "Linear Models",
            order: 1,
            topics: [
              { id: 60411, name: "Linear Regression, gradient descent minimization functions", difficulty: "Intermediate" },
              { id: 60412, name: "Logistic Regression, sigmoid decision log-loss calculations", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6042,
            name: "Supervised Classifiers",
            order: 2,
            topics: [
              { id: 60421, name: "Support Vector Machines (SVM) maximum margin hyperplanes", difficulty: "Advanced" },
              { id: 60422, name: "Random Forests and decision tree pruning parameters", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6043,
            name: "Unsupervised Clustering",
            order: 3,
            topics: [
              { id: 60431, name: "K-Means algorithms, choosing optimum centroids via elbow, silhouette", difficulty: "Intermediate" },
              { id: 60432, name: "Principal Component Analysis (PCA) eigenvector variance", difficulty: "Advanced" }
            ]
          },
          {
            id: 6044,
            name: "Neural Networks Intro",
            order: 4,
            topics: [
              { id: 60441, name: "Multilayer Perceptron (MLP) backpropagation algorithm calculus", difficulty: "Advanced" },
              { id: 60442, name: "Activation functions (ReLU, Sigmoid, Softmax) bounds", difficulty: "Intermediate" }
            ]
          },
          {
            id: 6045,
            name: "Model Tuning & Bias",
            order: 5,
            topics: [
              { id: 60451, name: "Precision, Recall, ROC-AUC metric calculations, cross validation", difficulty: "Intermediate" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 7,
    subjects: [
      {
        id: 701,
        code: "CS-701",
        name: "Software Architecture",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 7011,
            name: "Architecture Styles",
            order: 1,
            topics: [
              { id: 70111, name: "Repository, Client-Server, Layered, Pipe-and-Filter configurations", difficulty: "Intermediate" }
            ]
          },
          {
            id: 7012,
            name: "Software Design Patterns",
            order: 2,
            topics: [
              { id: 70121, name: "Creational Singleton, Factory patterns structural models", difficulty: "Intermediate" },
              { id: 70122, name: "Behavioral Observer and Structural Adapter patterns use cases", difficulty: "Intermediate" }
            ]
          },
          {
            id: 7013,
            name: "Quality Attributes",
            order: 3,
            topics: [
              { id: 70131, name: "Analyzing scalability, security, availability and latency tactics", difficulty: "Advanced" }
            ]
          },
          {
            id: 7014,
            name: "Services & Microservices",
            order: 4,
            topics: [
              { id: 70141, name: "Monolith to Microservices decomposition, API gateways, service discovery", difficulty: "Advanced" }
            ]
          },
          {
            id: 7015,
            name: "Evaluations & QA",
            order: 5,
            topics: [
              { id: 70151, name: "Architecture Trade-off Analysis Method (ATAM) framework steps", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 702,
        code: "CS-702",
        name: "Cloud Computing",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 7021,
            name: "Cloud Architectures",
            order: 1,
            topics: [
              { id: 70211, name: "IaaS, PaaS, SaaS delivery models, public vs. private clouds", difficulty: "Beginner" }
            ]
          },
          {
            id: 7022,
            name: "Virtualization & Containers",
            order: 2,
            topics: [
              { id: 70221, name: "Hypervisor models, Docker container engine mechanics", difficulty: "Intermediate" },
              { id: 70222, name: "Kubernetes pod orchestration, services, and workloads", difficulty: "Advanced" }
            ]
          },
          {
            id: 7023,
            name: "Infrastructure & Networks",
            order: 3,
            topics: [
              { id: 70231, name: "VPC virtual private clouds setups, load balancing networks", difficulty: "Intermediate" }
            ]
          },
          {
            id: 7024,
            name: "Resource Scheduling",
            order: 4,
            topics: [
              { id: 70241, name: "Auto-scaling parameters, cloud resource scheduling, provisioning", difficulty: "Intermediate" }
            ]
          },
          {
            id: 7025,
            name: "Security & Future trends",
            order: 5,
            topics: [
              { id: 70251, name: "Serverless architectures, Lambda computing, multi-cloud strategy", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 703,
        code: "CS-703",
        name: "Information Security",
        category: "Professional Elective",
        difficulty: "Advanced",
        units: [
          {
            id: 7031,
            name: "Security Paradigms",
            order: 1,
            topics: [
              { id: 70311, name: "Active vs. passive network attacks, security auditing models", difficulty: "Intermediate" }
            ]
          },
          {
            id: 7032,
            name: "Symmetric Cryptography",
            order: 2,
            topics: [
              { id: 70321, name: "DES and AES block cipher internal structure iterations", difficulty: "Advanced" }
            ]
          },
          {
            id: 7033,
            name: "PKI and Digital Signatures",
            order: 3,
            topics: [
              { id: 70331, name: "Public Key Infrastructure (PKI), digital signature standards (DSS)", difficulty: "Advanced" }
            ]
          },
          {
            id: 7034,
            name: "Network Security Protocols",
            order: 4,
            topics: [
              { id: 70341, name: "SSL/TLS handshake, IPsec payload & transportation modes", difficulty: "Advanced" }
            ]
          },
          {
            id: 7035,
            name: "System Intrusions",
            order: 5,
            topics: [
              { id: 70351, name: "Intrusion Detection Systems (IDS), firewalls configuration", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 704,
        code: "CS-704",
        name: "Blockchain Technology",
        category: "Professional Elective",
        difficulty: "Advanced",
        units: [
          {
            id: 7041,
            name: "Distributed Ledger Basics",
            order: 1,
            topics: [
              { id: 70411, name: "Decentralization, SHA-256 hash chains, block headers", difficulty: "Intermediate" }
            ]
          },
          {
            id: 7042,
            name: "Consensus Algorithms",
            order: 2,
            topics: [
              { id: 70421, name: "Proof of Work (PoW) mathematics, Proof of Stake (PoS) algorithms", difficulty: "Advanced" }
            ]
          },
          {
            id: 7043,
            name: "Smart Contracts",
            order: 3,
            topics: [
              { id: 70431, name: "Solidity language syntax, Ethereum Virtual Machine (EVM) architecture", difficulty: "Advanced" }
            ]
          },
          {
            id: 7044,
            name: "Enterprise Blockchains",
            order: 4,
            topics: [
              { id: 70441, name: "Hyperledger Fabric channels, private chains, smart contracts", difficulty: "Advanced" }
            ]
          },
          {
            id: 7045,
            name: "Case Studies",
            order: 5,
            topics: [
              { id: 70451, name: "Supply chain mapping, Decentralized Finance (DeFi) use cases", difficulty: "Intermediate" }
            ]
          }
        ]
      }
    ]
  },
  {
    semesterNumber: 8,
    subjects: [
      {
        id: 801,
        code: "CS-801",
        name: "Internet of Things",
        category: "Core Computer Science",
        difficulty: "Intermediate",
        units: [
          {
            id: 8011,
            name: "IoT Architectures",
            order: 1,
            topics: [
              { id: 80111, name: "4-layer physical to application IoT architectures", difficulty: "Beginner" }
            ]
          },
          {
            id: 8012,
            name: "Connectivity & Protocols",
            order: 2,
            topics: [
              { id: 80121, name: "RFID, Bluetooth Low Energy (BLE), Zigbee networks", difficulty: "Intermediate" },
              { id: 80122, name: "MQTT, CoAP, and HTTP lightweight messaging comparisons", difficulty: "Advanced" }
            ]
          },
          {
            id: 8013,
            name: "IoT Hardware & Sensors",
            order: 3,
            topics: [
              { id: 80131, name: "Raspberry Pi & Arduino MCU sensor integration pins", difficulty: "Intermediate" }
            ]
          },
          {
            id: 8014,
            name: "Lightweight Databases",
            order: 4,
            topics: [
              { id: 80141, name: "Time-series databases InfluxDB, relational IoT caches", difficulty: "Intermediate" }
            ]
          },
          {
            id: 8015,
            name: "Industrial IoT",
            order: 5,
            topics: [
              { id: 80151, name: "Industry 4.0, smart cities, and edge computing nodes", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        id: 802,
        code: "CS-802",
        name: "Soft Computing",
        category: "Core Computer Science",
        difficulty: "Advanced",
        units: [
          {
            id: 8021,
            name: "Neural Networks Overview",
            order: 1,
            topics: [
              { id: 80211, name: "Hebbian learning, ADALINE, and MADALINE network parameters", difficulty: "Intermediate" }
            ]
          },
          {
            id: 8022,
            name: "Fuzzy Logic Systems",
            order: 2,
            topics: [
              { id: 80221, name: "Fuzzy relation composition, Mamdani and Sugeno inference models", difficulty: "Advanced" }
            ]
          },
          {
            id: 8023,
            name: "Genetic Algorithms",
            order: 3,
            topics: [
              { id: 80231, name: "Selection, Crossover, and Mutation GA chromosome operations", difficulty: "Advanced" }
            ]
          },
          {
            id: 8024,
            name: "Neuro-Fuzzy Hybridization",
            order: 4,
            topics: [
              { id: 80241, name: "Adaptive Neuro-Fuzzy Inference System (ANFIS) tuning", difficulty: "Advanced" }
            ]
          },
          {
            id: 8025,
            name: "Swarm Optimizations",
            order: 5,
            topics: [
              { id: 80251, name: "Particle Swarm Optimization (PSO) velocity equations", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 803,
        code: "CS-803",
        name: "Big Data Analytics",
        category: "Professional Elective",
        difficulty: "Advanced",
        units: [
          {
            id: 8031,
            name: "Introduction & HDFS",
            order: 1,
            topics: [
              { id: 80311, name: "Hadoop distributed file system master-slave layouts", difficulty: "Intermediate" }
            ]
          },
          {
            id: 8032,
            name: "MapReduce Programming",
            order: 2,
            topics: [
              { id: 80321, name: "Map and Reduce functional matrices, wordcount logic", difficulty: "Advanced" }
            ]
          },
          {
            id: 8033,
            name: "Apache Spark Core",
            order: 3,
            topics: [
              { id: 80331, name: "RDD transformations, lazy execution, streaming pipelines", difficulty: "Advanced" }
            ]
          },
          {
            id: 8034,
            name: "NoSQL DBs & Mongo",
            order: 4,
            topics: [
              { id: 80341, name: "Sharding, replica-sets, document queries mongo", difficulty: "Intermediate" }
            ]
          },
          {
            id: 8035,
            name: "Real-time streamings",
            order: 5,
            topics: [
              { id: 80351, name: "Apache Kafka publisher subscriber brokers, topics partitions", difficulty: "Advanced" }
            ]
          }
        ]
      },
      {
        id: 804,
        code: "CS-804",
        name: "Deep Learning",
        category: "Professional Elective",
        difficulty: "Advanced",
        units: [
          {
            id: 8041,
            name: "Deep Networks Foundations",
            order: 1,
            topics: [
              { id: 80411, name: "Vanishing & exploding gradient corrections, batchnorm", difficulty: "Advanced" }
            ]
          },
          {
            id: 8042,
            name: "Convolutional Networks (CNN)",
            order: 2,
            topics: [
              { id: 80421, name: "Convolution kernels, pooling layers, ResNet skip connection math", difficulty: "Advanced" }
            ]
          },
          {
            id: 8043,
            name: "Recurrent Networks (RNN)",
            order: 3,
            topics: [
              { id: 80431, name: "Gated Recurrent Units (GRU), LSTM cell state gating equations", difficulty: "Advanced" }
            ]
          },
          {
            id: 8044,
            name: "Generative Models",
            order: 4,
            topics: [
              { id: 80441, name: "Generative Adversarial Networks optimization loss, Variational Autoencoders (VAEs)", difficulty: "Advanced" }
            ]
          },
          {
            id: 8045,
            name: "Transformers & LLMs",
            order: 5,
            topics: [
              { id: 80451, name: "Self-Attention scaled dot-product math, multi-head layers", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ]
  }
];

// Helper to seed a newly registered RGPV CSE student with custom syllabus subjects
export function clonePreloadedRgpvSyllabus(semesterNumber: number, customSubjectStartIndex: number): any[] {
  const semData = rgpvSyllabusDataset.find((s) => s.semesterNumber === semesterNumber);
  if (!semData) return [];

  return semData.subjects.map((sub, idx) => {
    const subjectId = customSubjectStartIndex + idx + 1;
    // Map units & topics into the CustomTopic sub-array schema
    const topicsList: any[] = [];
    sub.units.forEach((unit) => {
      unit.topics.forEach((topic) => {
        topicsList.push({
          id: topicsList.length + 1,
          customSubjectId: subjectId,
          topicName: `${unit.name}: ${topic.name}`,
          description: `Syllabus Unit: ${unit.name} of RGPV Official Coursework.`,
          status: "PENDING",
          confidenceLevel: "Medium"
        });
      });
    });

    // Simulated AI schedule planning analysis
    const milestones = [
      `Complete 100% of Unit 1 and Unit 2 syllabus topics`,
      `Practice prior year RGPV exam questions for ${sub.name}`,
      `Conduct a comprehensive mock review and active recall test`
    ];

    const weeklySyllabus = sub.units.map((u, i) => ({
      week: `Week ${i + 1}`,
      focus: `Master Unit ${i + 1}: ${u.name}`
    }));

    return {
      id: subjectId,
      subjectName: `${sub.code} - ${sub.name}`,
      description: `RGPV Official Curriculum | Category: ${sub.category}`,
      difficulty: sub.difficulty,
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // default 60 days
      createdAt: new Date().toISOString(),
      topics: topicsList,
      aiAnalysis: {
        estimatedEffort: sub.difficulty === "Advanced" ? "8-10 hours per week of active recall study" : "5-7 hours per week of study",
        milestones,
        revisionSchedule: "Spaced repetition: check back in 1-day, 7-day, and 14-days after reviewing.",
        roadmap: weeklySyllabus
      }
    };
  });
}
