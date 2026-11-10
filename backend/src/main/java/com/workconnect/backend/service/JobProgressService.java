package com.workconnect.backend.service;

import com.workconnect.backend.dto.JobResponse;
import com.workconnect.backend.dto.JobStatusRequest;
import com.workconnect.backend.entity.*;
import com.workconnect.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobProgressService {

    private final JobRepository jobRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final JobApplicationRepository applicationRepository;

    public JobProgressService(
            JobRepository jobRepository,
            WorkerProfileRepository workerProfileRepository,
            JobApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public JobResponse updateJobStatus(
            Long jobId,
            JobStatusRequest request,
            String workerEmail) {

        WorkerProfile worker = workerProfileRepository
                .findByUserEmail(workerEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Worker profile not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        applicationRepository
                .findByJobJobIdAndWorkerWorkerIdAndStatus(
                        jobId,
                        worker.getWorkerId(),
                        ApplicationStatus.ACCEPTED)
                .orElseThrow(() -> new IllegalArgumentException(
                        "You are not assigned to this job"));

        JobStatus newStatus = request.getStatus();

        if (newStatus == JobStatus.IN_PROGRESS
                && job.getStatus() == JobStatus.ASSIGNED) {

            job.setStatus(JobStatus.IN_PROGRESS);

        } else if (newStatus == JobStatus.COMPLETED
                && job.getStatus() == JobStatus.IN_PROGRESS) {

            job.setStatus(JobStatus.COMPLETED);

        } else {
            throw new IllegalArgumentException(
                    "Invalid job status transition");
        }

        Job updatedJob = jobRepository.save(job);

        return new JobResponse(updatedJob);
    }
}