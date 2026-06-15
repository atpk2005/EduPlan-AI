package com.eduplan.ai.service;

import com.eduplan.ai.config.JwtTokenProvider;
import com.eduplan.ai.dto.AuthResponse;
import com.eduplan.ai.dto.LoginRequest;
import com.eduplan.ai.dto.RegisterRequest;
import com.eduplan.ai.dto.UserProfileDto;
import com.eduplan.ai.exception.BadRequestException;
import com.eduplan.ai.exception.ResourceNotFoundException;
import com.eduplan.ai.model.Role;
import com.eduplan.ai.model.User;
import com.eduplan.ai.model.UserProfile;
import com.eduplan.ai.repository.RoleRepository;
import com.eduplan.ai.repository.UserProfileRepository;
import com.eduplan.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        // Creating student's account
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAuthProvider("LOCAL");
        user.setEnabled(true);
        user.setLocked(false);

        // Assign standard STUDENT role
        Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(Role.RoleName.ROLE_STUDENT);
                    return roleRepository.save(role);
                });

        user.setRoles(new HashSet<>(Collections.singletonList(studentRole)));

        return userRepository.save(user);
    }

    @Override
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.getEmail()));

        String roleName = user.getRoles().stream()
                .map(role -> role.getName().name())
                .findFirst()
                .orElse("ROLE_STUDENT");

        return AuthResponse.builder()
                .accessToken(jwt)
                .email(user.getEmail())
                .name(user.getName())
                .role(roleName)
                .completedOnboarding(user.getProfile() != null)
                .build();
    }

    @Override
    @Transactional
    public User saveUserProfile(String email, UserProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile();
        }

        profile.setLearnerType(profileDto.getLearnerType());
        profile.setDailyStudyHours(profileDto.getDailyStudyHours());
        
        // Conditionally populate based on Learner Type
        switch (profileDto.getLearnerType()) {
            case SCHOOL_STUDENT:
                profile.setSchoolClass(profileDto.getSchoolClass());
                profile.setSchoolBoard(profileDto.getSchoolBoard());
                profile.setSchoolStream(profileDto.getSchoolStream());
                break;
            case COLLEGE_STUDENT:
                profile.setDegree(profileDto.getDegree());
                profile.setCourse(profileDto.getCourse());
                profile.setUniversity(profileDto.getUniversity());
                profile.setSemester(profileDto.getSemester());
                break;
            case COMPETITIVE_ASPIRANT:
                profile.setTargetExam(profileDto.getTargetExam());
                profile.setAttemptYear(profileDto.getAttemptYear());
                break;
            case WORKING_PROFESSIONAL:
                profile.setCertificationGoal(profileDto.getCertificationGoal());
                break;
            case SELF_LEARNER:
                profile.setLearningGoal(profileDto.getLearningGoal());
                break;
        }

        profile.setUser(user);
        UserProfile savedProfile = userProfileRepository.save(profile);
        user.setProfile(savedProfile);

        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Override
    @Transactional
    public AuthResponse verifyGoogleLogin(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Verify if provider transitions cleanly
            if ("LOCAL".equals(user.getAuthProvider()) && user.getPassword() == null) {
                user.setAuthProvider("GOOGLE");
                user = userRepository.save(user);
            }
        } else {
            // First time registration via Google OAuth
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setAuthProvider("GOOGLE");
            user.setEnabled(true);
            user.setLocked(false);

            Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName(Role.RoleName.ROLE_STUDENT);
                        return roleRepository.save(role);
                    });
            user.setRoles(new HashSet<>(Collections.singletonList(studentRole)));
            user = userRepository.save(user);
        }

        String jwt = tokenProvider.generateTokenFromEmail(user.getEmail());
        String roleName = user.getRoles().stream()
                .map(role -> role.getName().name())
                .findFirst()
                .orElse("ROLE_STUDENT");

        return AuthResponse.builder()
                .accessToken(jwt)
                .email(user.getEmail())
                .name(user.getName())
                .role(roleName)
                .completedOnboarding(user.getProfile() != null)
                .build();
    }

    @Override
    @Transactional
    public void initiateForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Generate 6 digit pin OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15)); // Valid for 15 minutes
        userRepository.save(user);

        // In production, trigger Email Service. Here we simulate it.
        System.out.println(">>> SENT OTP: " + otp + " TO EMAIL: " + email);
    }

    @Override
    @Transactional
    public boolean verifyOtpAndResetPassword(String otp, String newPassword) {
        User user = userRepository.findByOtpCode(otp)
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP code"));

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP code has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        return true;
    }
}
