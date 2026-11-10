package com.workconnect.backend.dto;

import com.workconnect.backend.entity.JobApplication;
import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long applicationId;
    private Long jobId;
    private Long workerId;
    private String workerName;
    private String message;
    private String status;
    private LocalDateTime appliedAt;

    public ApplicationResponse(JobApplication application) {
        this.applicationId = application.getApplicationId();
        this.jobId = application.getJob().getJobId();
        this.workerId = application.getWorker().getWorkerId();
        this.workerName = application.getWorker()
                .getUser().getFullName();
        this.message = application.getMessage();
        this.status = application.getStatus().name();
        this.appliedAt = application.getAppliedAt();
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public Long getJobId() {
        return jobId;
    }

    public Long getWorkerId() {
        return workerId;
    }

    public String getWorkerName() {
        return workerName;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}