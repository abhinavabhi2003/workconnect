
package com.workconnect.backend.controller;

import com.workconnect.backend.dto.LoginRequest;
import com.workconnect.backend.dto.RegisterRequest;
import com.workconnect.backend.dto.UserResponse;
import com.workconnect.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Customer / Worker Registration
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody RegisterRequest request) {

        UserResponse response = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Customer / Worker Login
    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(
            @Valid @RequestBody LoginRequest request) {

        UserResponse response = userService.loginUser(request);

        return ResponseEntity.ok(response);
    }

    // Get currently authenticated user
    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(
            Authentication authentication) {

        return ResponseEntity.ok(
                "Authenticated user: " + authentication.getName());
    }
}
