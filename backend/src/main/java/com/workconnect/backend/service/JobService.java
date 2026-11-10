package com.workconnect.backend.service;

import com.workconnect.backend.dto.JobRequest;
import com.workconnect.backend.dto.JobResponse;
import com.workconnect.backend.entity.Job;
import com.workconnect.backend.entity.JobStatus;
import com.workconnect.backend.entity.User;
import com.workconnect.backend.entity.UserRole;
import com.workconnect.backend.repository.JobRepository;
import com.workconnect.backend.repository.UserRepository;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository,
            UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobResponse createJob(JobRequest request, String customerEmail) {

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

    @Transactional(readOnly = true)
    public List<JobResponse> getAvailableJobs() {

        return jobRepository.findByStatus(JobStatus.OPEN)
                .stream()
                .map(JobResponse::new)
                .collect(Collectors.toList());
    }
}