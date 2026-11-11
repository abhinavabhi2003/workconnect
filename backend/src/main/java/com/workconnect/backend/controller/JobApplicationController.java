
package com.workconnect.backend.controller;

import com.workconnect.backend.dto.ApplicationRequest;
import com.workconnect.backend.dto.ApplicationResponse;
import com.workconnect.backend.service.JobApplicationService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(
            JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Worker applies for a job
    @PostMapping
    public ResponseEntity<ApplicationResponse> applyForJob(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {

        ApplicationResponse response = applicationService.applyForJob(
                request,
                authentication.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Worker views their own applications
    @GetMapping
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication) {

        return applicationService.getMyApplications(
                authentication.getName());
    }
}
