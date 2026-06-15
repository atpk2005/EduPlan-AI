package com.eduplan.ai.controller;

import com.eduplan.ai.dto.ApiResponse;
import com.eduplan.ai.dto.UserProfileDto;
import com.eduplan.ai.model.User;
import com.eduplan.ai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        ApiResponse<User> response = ApiResponse.<User>builder()
                .success(true)
                .message("Current user retrieved successfully")
                .data(user)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile")
    public ResponseEntity<ApiResponse<User>> saveProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileDto profileDto) {
        
        User updatedUser = userService.saveUserProfile(userDetails.getUsername(), profileDto);
        ApiResponse<User> response = ApiResponse.<User>builder()
                .success(true)
                .message("Profile saved successfully. Onboarding completed successfully!")
                .data(updatedUser)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
