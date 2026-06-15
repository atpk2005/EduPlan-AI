package com.example.eduplan.seeder;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;

/**
 * Spring Boot seeder class to populate RGPV University CSE B.Tech 
 * Syllabus (Semester 1 - 8) upon system starting dynamically.
 */
@Component
public class RgpvSyllabusSeeder implements CommandLineRunner {

    // Mock Repositories reflecting database entities
    @Autowired private UniversityRepository universityRepository;
    @Autowired private DegreeRepository degreeRepository;
    @Autowired private BranchRepository branchRepository;
    @Autowired private SemesterRepository semesterRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private UnitRepository unitRepository;
    @Autowired private TopicRepository topicRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (universityRepository.findByCode("RGPV").isPresent()) {
            System.out.println("RGPV preloaded syllabus database is already initialized.");
            return;
        }

        System.out.println("Initializing RGPV CSE B.Tech Preloaded Syllabus Dataset (Semesters 1-8)...");

        // 1. Create University
        University rgpv = new University();
        rgpv.setName("Rajiv Gandhi Proudyogiki Vishwavidyalaya");
        rgpv.setCode("RGPV");
        rgpv = universityRepository.save(rgpv);

        // 2. Create Degree
        Degree btech = new Degree();
        btech.setUniversity(rgpv);
        btech.setName("Bachelor of Technology");
        btech.setCode("B.Tech");
        btech = degreeRepository.save(btech);

        // 3. Create Branch
        Branch cse = new Branch();
        cse.setDegree(btech);
        cse.setName("Computer Science Engineering");
        cse.setCode("CSE");
        cse = branchRepository.save(cse);

        // 4. Create Semesters 1 to 8 and seed nested Subjects, Units, and Topics
        for (int semNumber = 1; semNumber <= 8; semNumber++) {
            Semester semester = new Semester();
            semester.setBranch(cse);
            semester.setSemesterNumber(semNumber);
            semester = semesterRepository.save(semester);

            if (semNumber == 1) {
                seedSemesterOneSubjects(semester);
            } else if (semNumber == 3) {
                seedSemesterThreeSubjects(semester);
            } else if (semNumber == 5) {
                seedSemesterFiveSubjects(semester);
            } else {
                seedGenericSemesterSubjects(semester, semNumber);
            }
        }
        System.out.println("RGPV B.Tech CSE Syllabus seeded successfully inside Spring Boot engine.");
    }

    private void seedSemesterOneSubjects(Semester semester) {
        // Engineering Chemistry
        Subject chem = new Subject("Chemistry", "BT-101", "Basic Science", "Intermediate", semester);
        chem = subjectRepository.save(chem);
        
        Unit unit1 = new Unit("Water Analysis & Treatment", 1, chem);
        unit1 = unitRepository.save(unit1);
        topicRepository.save(new Topic("Hardness of water and EDTA titration metrics", "Intermediate", unit1));
        topicRepository.save(new Topic("Reverse Osmosis (RO) and electrodialysis", "Beginner", unit1));

        // Mathematics-I
        Subject math = new Subject("Mathematics-I", "BT-102", "Basic Science", "Advanced", semester);
        math = subjectRepository.save(math);
        
        Unit unitMath = new Unit("Differential Calculus I", 1, math);
        unitMath = unitRepository.save(unitMath);
        topicRepository.save(new Topic("Maclaurin’s & Taylor’s series expansion theorems", "Advanced", unitMath));
    }

    private void seedSemesterThreeSubjects(Semester semester) {
        Subject ds = new Subject("Data Structure", "CS-303", "Core Computer Science", "Advanced", semester);
        ds = subjectRepository.save(ds);

        Unit unitDS = new Unit("Linear Data Structures", 2, ds);
        unitDS = unitRepository.save(unitDS);
        topicRepository.save(new Topic("Singly, doubly, and circular linked lists implementation", "Intermediate", unitDS));
    }

    private void seedSemesterFiveSubjects(Semester semester) {
        Subject cn = new Subject("Computer Networks", "CS-503", "Core Computer Science", "Advanced", semester);
        cn = subjectRepository.save(cn);

        Unit unitCN = new Unit("Network Routing Codes", 4, cn);
        unitCN = unitRepository.save(unitCN);
        topicRepository.save(new Topic("IPv4 & IPv6 addressing schemas, subnetting CIDR metrics", "Advanced", unitCN));
    }

    private void seedGenericSemesterSubjects(Semester semester, int semNum) {
        Subject genSub = new Subject("Subject Placeholder Sem " + semNum, "CS-80" + semNum, "General CS", "Intermediate", semester);
        genSub = subjectRepository.save(genSub);

        Unit unitRef = new Unit("General Unit I", 1, genSub);
        unitRef = unitRepository.save(unitRef);
        topicRepository.save(new Topic("Core Principles and context review", "Intermediate", unitRef));
    }
}

// ---------------------------------------------------------
// JPA ENTITY REPRESENTATIONS (BLUEPRINT COPIES)
// ---------------------------------------------------------

class University {
    private Long id;
    private String name;
    private String code;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}

class Degree {
    private Long id;
    private University university;
    private String name;
    private String code;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public University getUniversity() { return university; }
    public void setUniversity(University university) { this.university = university; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}

class Branch {
    private Long id;
    private Degree degree;
    private String name;
    private String code;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Degree getDegree() { return degree; }
    public void setDegree(Degree degree) { this.degree = degree; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}

class Semester {
    private Long id;
    private Branch branch;
    private int semesterNumber;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Branch getBranch() { return branch; }
    public void setBranch(Branch branch) { this.branch = branch; }
    public int getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(int semesterNumber) { this.semesterNumber = semesterNumber; }
}

class Subject {
    private Long id;
    private String name;
    private String code;
    private String category;
    private String difficulty;
    private Semester semester;
    public Subject() {}
    public Subject(String name, String code, String category, String difficulty, Semester semester) {
        this.name = name;
        this.code = code;
        this.category = category;
        this.difficulty = difficulty;
        this.semester = semester;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Semester getSemester() { return semester; }
    public void setSemester(Semester semester) { this.semester = semester; }
}

class Unit {
    private Long id;
    private String name;
    private int order;
    private Subject subject;
    public Unit() {}
    public Unit(String name, int order, Subject subject) {
        this.name = name;
        this.order = order;
        this.subject = subject;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
}

class Topic {
    private Long id;
    private String name;
    private String difficulty;
    private Unit unit;
    public Topic() {}
    public Topic(String name, String difficulty, Unit unit) {
        this.name = name;
        this.difficulty = difficulty;
        this.unit = unit;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Unit getUnit() { return unit; }
    public void setUnit(Unit unit) { this.unit = unit; }
}

// Interfaces stub to let code compile & serve as Spring Boot reference
interface UniversityRepository { java.util.Optional<University> findByCode(String code); University save(University u); }
interface DegreeRepository { Degree save(Degree d); }
interface BranchRepository { Branch save(Branch b); }
interface SemesterRepository { Semester save(Semester s); }
interface SubjectRepository { Subject save(Subject s); }
interface UnitRepository { Unit save(Unit u); }
interface TopicRepository { Topic save(Topic t); }
