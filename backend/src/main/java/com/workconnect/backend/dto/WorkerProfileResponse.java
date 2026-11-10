package com.workconnect.backend.dto;

import com.workconnect.backend.entity.WorkerProfile;

public class WorkerProfileResponse {

    private Long workerId;
    private Long userId;
    private String fullName;
    private String skills;
    private Integer experienceYears;
    private String serviceCategory;
    private String availability;
    private String bio;

    public WorkerProfileResponse(WorkerProfile profile) {

        this.workerId = profile.getWorkerId();
        this.userId = profile.getUser().getUserId();
        this.fullName = profile.getUser().getFullName();
        this.skills = profile.getSkills();
        this.experienceYears = profile.getExperienceYears();
        this.serviceCategory = profile.getServiceCategory();
        this.availability = profile.getAvailability();
        this.bio = profile.getBio();
    }

    public Long getWorkerId() {
        return workerId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getSkills() {
        return skills;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public String getAvailability() {
        return availability;
    }

    public String getBio() {
        return bio;
    }
}