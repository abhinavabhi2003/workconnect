package com.workconnect.backend.controller;

import com.workconnect.backend.dto.JobResponse;
import com.workconnect.backend.dto.JobStatusRequest;
import com.workconnect.backend.service.JobProgressService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/worker/jobs")
public class JobProgressController {

    private final JobProgressService progressService;

    public JobProgressController(JobProgressService progressService) {
        this.progressService = progressService;
    }

    @PutMapping("/{jobId}/status")
    public JobResponse updateJobStatus(
            @PathVariable Long jobId,
            @Valid @RequestBody JobStatusRequest request,
            Authentication authentication) {

        return progressService.updateJobStatus(
                jobId,
                request,
                authentication.getName());
    }
}