package com.eduplan.ai.controller;

import com.eduplan.ai.dto.*;
import com.eduplan.ai.model.User;
import com.eduplan.ai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User registered = userService.registerUser(registerRequest);
        ApiResponse<User> response = ApiResponse.<User>builder()
                .success(true)
                .message("User registered successfully. Continue to onboarding profile steps.")
                .data(registered)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.authenticateUser(loginRequest);
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Authentication successful")
                .data(authResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestParam String email, @RequestParam String name) {
        AuthResponse authResponse = userService.verifyGoogleLogin(email, name);
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Google authentication verified successfully")
                .data(authResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam String email) {
        userService.initiateForgotPassword(email);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("OTP passcode has been sent to your registered email address")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestParam String otp, @RequestParam String newPassword) {
        userService.verifyOtpAndResetPassword(otp, newPassword);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Password has been reset successfully. Please login with your new credentials.")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
