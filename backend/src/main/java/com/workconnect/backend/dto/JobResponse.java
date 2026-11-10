package com.workconnect.backend.dto;

import com.workconnect.backend.entity.Job;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class JobResponse {

    private Long jobId;
    private Long customerId;
    private String serviceCategory;
    private String title;
    private String description;
    private String location;
    private LocalDateTime scheduledAt;
    private BigDecimal budget;
    private String status;
    private LocalDateTime createdAt;

    public JobResponse(Job job) {
        this.jobId = job.getJobId();
        this.customerId = job.getCustomer().getUserId();
        this.serviceCategory = job.getServiceCategory();
        this.title = job.getTitle();
        this.description = job.getDescription();
        this.location = job.getLocation();
        this.scheduledAt = job.getScheduledAt();
        this.budget = job.getBudget();
        this.status = job.getStatus().name();
        this.createdAt = job.getCreatedAt();
    }

    public Long getJobId() {
        return jobId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}