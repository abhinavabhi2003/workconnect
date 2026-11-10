package com.workconnect.backend.service;

import com.workconnect.backend.dto.ApplicationRequest;
import com.workconnect.backend.dto.ApplicationResponse;
import com.workconnect.backend.entity.*;
import com.workconnect.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobApplicationService {

    private final JobRepository jobRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final JobApplicationRepository applicationRepository;

    public JobApplicationService(
            JobRepository jobRepository,
            WorkerProfileRepository workerProfileRepository,
            JobApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public ApplicationResponse applyForJob(
            ApplicationRequest request,
            String workerEmail) {

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException(
                    "This job is no longer available");
        }

        WorkerProfile worker = workerProfileRepository
                .findByUserEmail(workerEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Worker profile not found. Please create your profile first"));

        boolean alreadyApplied = applicationRepository.existsByJobJobIdAndWorkerWorkerId(
                job.getJobId(),
                worker.getWorkerId());

        if (alreadyApplied) {
            throw new IllegalArgumentException(
                    "You have already applied for this job");
        }

        JobApplication application = new JobApplication();

        application.setJob(job);
        application.setWorker(worker);
        application.setMessage(request.getMessage());
        application.setStatus(ApplicationStatus.PENDING);

        JobApplication savedApplication = applicationRepository.save(application);

        return new ApplicationResponse(savedApplication);
    }
}