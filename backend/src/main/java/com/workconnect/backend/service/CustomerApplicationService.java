
package com.workconnect.backend.service;

import com.workconnect.backend.dto.ApplicationResponse;
import com.workconnect.backend.entity.*;
import com.workconnect.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerApplicationService {

        private final JobApplicationRepository applicationRepository;
        private final UserRepository userRepository;

        public CustomerApplicationService(
                        JobApplicationRepository applicationRepository,
                        UserRepository userRepository) {

                this.applicationRepository = applicationRepository;
                this.userRepository = userRepository;
        }

        // Verify the logged-in customer
        private User getCustomer(String email) {

                User customer = userRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

                if (customer.getRole() != UserRole.CUSTOMER) {
                        throw new IllegalArgumentException(
                                        "Only customers can manage applications");
                }

                return customer;
        }

        // View applications for a customer's job
        @Transactional(readOnly = true)
        public List<ApplicationResponse> getApplications(
                        Long jobId,
                        String customerEmail) {

                User customer = getCustomer(customerEmail);

                return applicationRepository
                                .findByJobJobIdAndJobCustomerUserId(
                                                jobId,
                                                customer.getUserId())
                                .stream()
                                .map(ApplicationResponse::new)
                                .toList();
        }

        // Accept a worker's application
        @Transactional
        public ApplicationResponse acceptApplication(
                        Long applicationId,
                        String customerEmail) {

                User customer = getCustomer(customerEmail);

                JobApplication application = applicationRepository
                                .findByApplicationIdAndJobCustomerUserId(
                                                applicationId,
                                                customer.getUserId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Application not found"));

                if (application.getStatus() != ApplicationStatus.PENDING) {
                        throw new IllegalArgumentException(
                                        "This application has already been processed");
                }

                Job job = application.getJob();

                if (job.getStatus() != JobStatus.OPEN) {
                        throw new IllegalArgumentException(
                                        "This job is no longer available");
                }

                // Accept the selected worker
                application.setStatus(ApplicationStatus.ACCEPTED);

                // Change job status
                job.setStatus(JobStatus.ASSIGNED);

                // Automatically reject other pending applications
                List<JobApplication> otherApplications = applicationRepository.findByJobJobId(job.getJobId());

                for (JobApplication other : otherApplications) {

                        if (!other.getApplicationId().equals(applicationId)
                                        && other.getStatus() == ApplicationStatus.PENDING) {

                                other.setStatus(ApplicationStatus.REJECTED);
                        }
                }

                return new ApplicationResponse(application);
        }

        // Reject a worker's application
        @Transactional
        public ApplicationResponse rejectApplication(
                        Long applicationId,
                        String customerEmail) {

                User customer = getCustomer(customerEmail);

                JobApplication application = applicationRepository
                                .findByApplicationIdAndJobCustomerUserId(
                                                applicationId,
                                                customer.getUserId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Application not found"));

                if (application.getStatus() != ApplicationStatus.PENDING) {
                        throw new IllegalArgumentException(
                                        "This application has already been processed");
                }

                application.setStatus(ApplicationStatus.REJECTED);

                return new ApplicationResponse(application);
        }
}
