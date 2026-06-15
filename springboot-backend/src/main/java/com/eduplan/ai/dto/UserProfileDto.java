package com.eduplan.ai.dto;

import com.eduplan.ai.model.LearnerType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    @NotNull(message = "Learner type is required")
    private LearnerType learnerType;

    @NotNull(message = "Daily study hours is required")
    private Integer dailyStudyHours;

    // School Student Profile Fields
    private String schoolClass;
    private String schoolBoard;
    private String schoolStream;

    // College Student Profile Fields
    private String degree;
    private String course;
    private String university;
    private Integer semester;

    // Competitive Aspirant Specifics
    private String targetExam;
    private Integer attemptYear;

    // Working Professional Specifics
    private String certificationGoal;

    // Self Learner Specifics
    private String learningGoal;
}
