package com.workconnect.backend.controller;

import com.workconnect.backend.dto.JobResponse;
import com.workconnect.backend.service.JobService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/worker/jobs")
public class WorkerJobController {

    private final JobService jobService;

    public WorkerJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobResponse> getAvailableJobs() {
        return jobService.getAvailableJobs();
    }
}