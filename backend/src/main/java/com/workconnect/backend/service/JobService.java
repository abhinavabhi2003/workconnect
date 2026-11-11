
package com.workconnect.backend.service;

import com.workconnect.backend.dto.JobRequest;
import com.workconnect.backend.dto.JobResponse;
import com.workconnect.backend.entity.Job;
import com.workconnect.backend.entity.JobStatus;
import com.workconnect.backend.entity.User;
import com.workconnect.backend.entity.UserRole;
import com.workconnect.backend.repository.JobRepository;
import com.workconnect.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Create a new job for the logged-in customer
    @Transactional
    public JobResponse createJob(
            JobRequest request,
            String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (customer.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException(
                    "Only customers can create jobs");
        }

        Job job = new Job();

        job.setCustomer(customer);
        job.setServiceCategory(request.getServiceCategory());
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setScheduledAt(request.getScheduledAt());
        job.setBudget(request.getBudget());
        job.setStatus(JobStatus.OPEN);

        Job savedJob = jobRepository.save(job);

        return new JobResponse(savedJob);
    }

    // Get all open jobs for workers
    @Transactional(readOnly = true)
    public List<JobResponse> getAvailableJobs() {

        return jobRepository.findByStatus(JobStatus.OPEN)
                .stream()
                .map(JobResponse::new)
                .collect(Collectors.toList());
    }

    // Get jobs posted by the logged-in customer
    @Transactional(readOnly = true)
    public List<JobResponse> getCustomerJobs(String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (customer.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException(
                    "Only customers can view their jobs");
        }

        return jobRepository.findByCustomerUserId(customer.getUserId())
                .stream()
                .map(JobResponse::new)
                .collect(Collectors.toList());
    }
}
