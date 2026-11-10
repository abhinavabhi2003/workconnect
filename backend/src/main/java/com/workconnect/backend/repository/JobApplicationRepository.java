package com.workconnect.backend.repository;

import com.workconnect.backend.entity.JobApplication;
import com.workconnect.backend.entity.ApplicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    boolean existsByJobJobIdAndWorkerWorkerId(
            Long jobId, Long workerId);

    List<JobApplication> findByWorkerWorkerId(Long workerId);

    List<JobApplication> findByJobJobId(Long jobId);

    List<JobApplication> findByStatus(ApplicationStatus status);

    List<JobApplication> findByJobJobIdAndJobCustomerUserId(
            Long jobId, Long customerId);

    Optional<JobApplication> findByApplicationIdAndJobCustomerUserId(
            Long applicationId, Long customerId);
            Optional<JobApplication>
findByJobJobIdAndWorkerWorkerIdAndStatus(
        Long jobId,
        Long workerId,
        ApplicationStatus status
);
}