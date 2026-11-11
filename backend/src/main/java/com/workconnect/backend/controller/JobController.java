
package com.workconnect.backend.controller;

import com.workconnect.backend.dto.JobRequest;
import com.workconnect.backend.dto.JobResponse;
import com.workconnect.backend.service.JobService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create a new job
    @PostMapping
    public JobResponse createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {

        return jobService.createJob(
                request,
                authentication.getName());
    }

    // Get all jobs posted by the logged-in customer
    @GetMapping
    public List<JobResponse> getCustomerJobs(
            Authentication authentication) {

        return jobService.getCustomerJobs(
                authentication.getName());
    }
}
