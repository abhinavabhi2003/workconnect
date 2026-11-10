package com.workconnect.backend.controller;

import com.workconnect.backend.dto.ApplicationResponse;
import com.workconnect.backend.service.CustomerApplicationService;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/customer/applications")
public class CustomerApplicationController {

    private final CustomerApplicationService applicationService;

    public CustomerApplicationController(
            CustomerApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // View applications for a particular job
    @GetMapping("/job/{jobId}")
    public List<ApplicationResponse> getApplications(
            @PathVariable Long jobId,
            Authentication authentication) {

        return applicationService.getApplications(
                jobId,
                authentication.getName());
    }

    // Accept a worker's application
    @PutMapping("/{applicationId}/accept")
    public ApplicationResponse acceptApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {

        return applicationService.acceptApplication(
                applicationId,
                authentication.getName());
    }

    // Reject a worker's application
    @PutMapping("/{applicationId}/reject")
    public ApplicationResponse rejectApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {

        return applicationService.rejectApplication(
                applicationId,
                authentication.getName());
    }
}