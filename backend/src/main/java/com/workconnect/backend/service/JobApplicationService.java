
package com.workconnect.backend.service;

import com.workconnect.backend.dto.ApplicationRequest;
import com.workconnect.backend.dto.ApplicationResponse;
import com.workconnect.backend.entity.*;
import com.workconnect.backend.repository.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobApplicationService {

        private final JobRepository jobRepository;
        private final WorkerProfileRepository workerProfileRepository;
        private final JobApplicationRepository applicationRepository;
        private final UserRepository userRepository;

        public JobApplicationService(
                        JobRepository jobRepository,
                        WorkerProfileRepository workerProfileRepository,
                        JobApplicationRepository applicationRepository,
                        UserRepository userRepository) {

                this.jobRepository = jobRepository;
                this.workerProfileRepository = workerProfileRepository;
                this.applicationRepository = applicationRepository;
                this.userRepository = userRepository;
        }

        // Worker applies for a job
        @Transactional
        public ApplicationResponse applyForJob(
                        ApplicationRequest request,
                        String workerEmail) {

                User user = userRepository.findByEmail(workerEmail)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Worker not found"));

                if (user.getRole() != UserRole.WORKER) {
                        throw new IllegalArgumentException(
                                        "Only workers can apply for jobs");
                }

                Job job = jobRepository.findById(request.getJobId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Job not found"));

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

        // Worker views their own applications
        @Transactional(readOnly = true)
        public List<ApplicationResponse> getMyApplications(
                        String workerEmail) {

                WorkerProfile worker = workerProfileRepository
                                .findByUserEmail(workerEmail)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Worker profile not found"));

                return applicationRepository
                                .findByWorkerWorkerId(worker.getWorkerId())
                                .stream()
                                .map(ApplicationResponse::new)
                                .collect(Collectors.toList());
        }

        // Customer views applications for their own job
        @Transactional(readOnly = true)
        public List<ApplicationResponse> getJobApplications(
                        Long jobId,
                        String customerEmail) {

                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Customer not found"));

                if (customer.getRole() != UserRole.CUSTOMER) {
                        throw new IllegalArgumentException(
                                        "Only customers can view applications");
                }

                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Job not found"));

                if (!job.getCustomer().getUserId().equals(customer.getUserId())) {
                        throw new IllegalArgumentException(
                                        "You are not authorized to view these applications");
                }

                return applicationRepository
                                .findByJobJobIdAndJobCustomerUserId(
                                                jobId,
                                                customer.getUserId())
                                .stream()
                                .map(ApplicationResponse::new)
                                .collect(Collectors.toList());
        }

        // Customer accepts a worker's application
        @Transactional
        public ApplicationResponse acceptApplication(
                        Long applicationId,
                        String customerEmail) {

                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Customer not found"));

                if (customer.getRole() != UserRole.CUSTOMER) {
                        throw new IllegalArgumentException(
                                        "Only customers can accept applications");
                }

                JobApplication application = applicationRepository
                                .findByApplicationIdAndJobCustomerUserId(
                                                applicationId,
                                                customer.getUserId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Application not found or unauthorized"));

                Job job = application.getJob();

                if (job.getStatus() != JobStatus.OPEN) {
                        throw new IllegalArgumentException(
                                        "This job is no longer available");
                }

                if (application.getStatus() != ApplicationStatus.PENDING) {
                        throw new IllegalArgumentException(
                                        "Only pending applications can be accepted");
                }

                application.setStatus(ApplicationStatus.ACCEPTED);
                job.setStatus(JobStatus.ASSIGNED);

                // Reject other pending applications for this job
                List<JobApplication> otherApplications = applicationRepository.findByJobJobId(job.getJobId());

                for (JobApplication other : otherApplications) {
                        if (!other.getApplicationId().equals(applicationId)
                                        && other.getStatus() == ApplicationStatus.PENDING) {

                                other.setStatus(ApplicationStatus.REJECTED);
                        }
                }

                return new ApplicationResponse(application);
        }

        // Customer rejects a worker's application
        @Transactional
        public ApplicationResponse rejectApplication(
                        Long applicationId,
                        String customerEmail) {

                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Customer not found"));

                if (customer.getRole() != UserRole.CUSTOMER) {
                        throw new IllegalArgumentException(
                                        "Only customers can reject applications");
                }

                JobApplication application = applicationRepository
                                .findByApplicationIdAndJobCustomerUserId(
                                                applicationId,
                                                customer.getUserId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Application not found or unauthorized"));

                if (application.getJob().getStatus() != JobStatus.OPEN) {
                        throw new IllegalArgumentException(
                                        "Applications can only be rejected while the job is open");
                }

                if (application.getStatus() != ApplicationStatus.PENDING) {
                        throw new IllegalArgumentException(
                                        "Only pending applications can be rejected");
                }

                application.setStatus(ApplicationStatus.REJECTED);

                return new ApplicationResponse(application);
        }
}
