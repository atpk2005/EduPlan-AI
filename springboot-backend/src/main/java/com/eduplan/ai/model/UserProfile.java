package com.eduplan.ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "profile")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "learner_type", nullable = false)
    private LearnerType learnerType;

    @Column(name = "daily_study_hours", nullable = false)
    private Integer dailyStudyHours = 3;

    // School Student Specifics
    @Column(name = "school_class")
    private String schoolClass; // e.g., Class 10

    @Column(name = "school_board")
    private String schoolBoard; // e.g., CBSE, ICSE

    @Column(name = "school_stream")
    private String schoolStream; // e.g., Science, Commerce, Arts

    // College Student Specifics
    @Column(name = "degree")
    private String degree; // e.g., B.Tech, B.Sc, MBA

    @Column(name = "course")
    private String course; // e.g., Computer Science

    @Column(name = "university")
    private String university; // e.g., RGPV, Stanford

    @Column(name = "semester")
    private Integer semester; // e.g., 5

    // Competitive Aspirant Specifics
    @Column(name = "target_exam")
    private String targetExam; // e.g., JEE, SAT, UPSC

    @Column(name = "attempt_year")
    private Integer attemptYear;

    // Working Professional Specifics
    @Column(name = "certification_goal")
    private String certificationGoal; // e.g., AWS Architect, PMP

    // Self Learner Specifics
    @Column(name = "learning_goal")
    private String learningGoal; // e.g., Deep Learning, Web Development
}
