-- =========================================================================
-- PostgreSQL Seed Script for RGPV B.Tech CSE Syllabus Database System
-- =========================================================================

-- 1. Create Schema Tables
CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS degrees (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    degree_id INT REFERENCES degrees(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id) ON DELETE CASCADE,
    semester_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, semester_number)
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    semester_id INT REFERENCES semesters(id) ON DELETE CASCADE,
    subject_code VARCHAR(50) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    difficulty_level VARCHAR(50) DEFAULT 'Intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    unit_name VARCHAR(255) NOT NULL,
    unit_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    unit_id INT REFERENCES units(id) ON DELETE CASCADE,
    topic_name VARCHAR(550) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Populate Universities, Degrees, and Branches Seed
INSERT INTO universities (id, name, code) 
VALUES (1, 'Rajiv Gandhi Proudyogiki Vishwavidyalaya', 'RGPV')
ON CONFLICT (name) DO UPDATE SET code = EXCLUDED.code;

INSERT INTO degrees (id, university_id, name, code)
VALUES (1, 1, 'Bachelor of Technology', 'B.Tech')
ON CONFLICT DO NOTHING;

INSERT INTO branches (id, degree_id, name, code)
VALUES (1, 1, 'Computer Science Engineering', 'CSE')
ON CONFLICT DO NOTHING;

-- 3. Populate Semesters (1 to 8)
INSERT INTO semesters (id, branch_id, semester_number) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8)
ON CONFLICT (branch_id, semester_number) DO NOTHING;

-- 4. Populate Subjects, Units & Topics Seeds (Excerpt matching primary modules)
-- Semester 1: Mathematics-I (BT-102)
INSERT INTO subjects (id, semester_id, subject_code, subject_name, category, difficulty_level)
VALUES (102, 1, 'BT-102', 'Mathematics-I', 'Basic Science', 'Advanced')
ON CONFLICT DO NOTHING;

INSERT INTO units (id, subject_id, unit_name, unit_order) VALUES
(1021, 102, 'Differential Calculus I', 1),
(1022, 102, 'Differential Calculus II', 2)
ON CONFLICT DO NOTHING;

INSERT INTO topics (unit_id, topic_name, difficulty) VALUES
(1021, 'Maclaurin’s & Taylor’s series expansion theorems', 'Advanced'),
(1021, 'Asymptotes, Curvature, and Singularity tracing', 'Advanced'),
(1022, 'Partial differential equations & Euler’s homogeneous theorem', 'Intermediate'),
(1022, 'Jacobians and Maxima-Minima of multi-variable functions', 'Advanced');

-- Semester 3: Discrete Structure (CS-302)
INSERT INTO subjects (id, semester_id, subject_code, subject_name, category, difficulty_level)
VALUES (302, 3, 'CS-302', 'Discrete Structure', 'Core Computer Science', 'Advanced')
ON CONFLICT DO NOTHING;

INSERT INTO units (id, subject_id, unit_name, unit_order) VALUES
(3021, 302, 'Set Theory & Relations', 1),
(3022, 302, 'Functions & Algebraic Structures', 2)
ON CONFLICT DO NOTHING;

INSERT INTO topics (unit_id, topic_name, difficulty) VALUES
(3021, 'Cartesian products, equivalence relations and partitions', 'Intermediate'),
(3021, 'Hasse diagrams and Partial Ordered Sets (Posets) lattices', 'Advanced'),
(3022, 'Injective, surjective, and bijective mapping calculations', 'Intermediate'),
(3022, 'Groups, subgroups, rings, fields, and Lagrange groups theorem', 'Advanced');

-- Semester 5: Database Management Systems (CS-502)
INSERT INTO subjects (id, semester_id, subject_code, subject_name, category, difficulty_level)
VALUES (502, 5, 'CS-502', 'Database Management Systems', 'Core Computer Science', 'Intermediate')
ON CONFLICT DO NOTHING;

INSERT INTO units (id, subject_id, unit_name, unit_order) VALUES
(5023, 502, 'Normalisation Theory', 3),
(5024, 502, 'Transaction & Concurrency Control', 4)
ON CONFLICT DO NOTHING;

INSERT INTO topics (unit_id, topic_name, difficulty) VALUES
(5023, 'Functional dependencies (FD) and closure algorithms', 'Intermediate'),
(5023, '1NF, 2NF, 3NF, and BCNF normalization lossy validation', 'Advanced'),
(5024, 'ACID properties, serializability schedules determination', 'Advanced'),
(5024, 'Two-Phase Locking (2PL) and timestamp multi-version locks', 'Advanced');
