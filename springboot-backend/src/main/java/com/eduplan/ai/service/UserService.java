package com.eduplan.ai.service;

import com.eduplan.ai.dto.AuthResponse;
import com.eduplan.ai.dto.LoginRequest;
import com.eduplan.ai.dto.RegisterRequest;
import com.eduplan.ai.dto.UserProfileDto;
import com.eduplan.ai.model.User;

public interface UserService {
    
    User registerUser(RegisterRequest registerRequest);
    
    AuthResponse authenticateUser(LoginRequest loginRequest);
    
    User saveUserProfile(String email, UserProfileDto profileDto);
    
    User getUserByEmail(String email);
    
    AuthResponse verifyGoogleLogin(String email, String name);
    
    void initiateForgotPassword(String email);
    
    boolean verifyOtpAndResetPassword(String otp, String newPassword);
}
