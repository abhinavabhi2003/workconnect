package com.workconnect.backend.controller;

import com.workconnect.backend.dto.WorkerProfileRequest;
import com.workconnect.backend.dto.WorkerProfileResponse;
import com.workconnect.backend.service.WorkerProfileService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker/profile")
public class WorkerProfileController {

    private final WorkerProfileService profileService;

    public WorkerProfileController(
            WorkerProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<WorkerProfileResponse> createProfile(
            @Valid @RequestBody WorkerProfileRequest request,
            Authentication authentication) {

        WorkerProfileResponse response = profileService.createProfile(
                request,
                authentication.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public WorkerProfileResponse getMyProfile(
            Authentication authentication) {

        return profileService.getMyProfile(
                authentication.getName());
    }
}