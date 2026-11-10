package com.workconnect.backend.dto;

import com.workconnect.backend.entity.JobStatus;
import jakarta.validation.constraints.NotNull;

public class JobStatusRequest {

    @NotNull(message = "Job status is required")
    private JobStatus status;

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}