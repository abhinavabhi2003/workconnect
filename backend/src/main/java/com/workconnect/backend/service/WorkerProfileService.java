package com.workconnect.backend.service;

import com.workconnect.backend.dto.WorkerProfileRequest;
import com.workconnect.backend.dto.WorkerProfileResponse;
import com.workconnect.backend.entity.User;
import com.workconnect.backend.entity.UserRole;
import com.workconnect.backend.entity.WorkerProfile;
import com.workconnect.backend.repository.UserRepository;
import com.workconnect.backend.repository.WorkerProfileRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkerProfileService {

    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;

    public WorkerProfileService(
            UserRepository userRepository,
            WorkerProfileRepository workerProfileRepository) {

        this.userRepository = userRepository;
        this.workerProfileRepository = workerProfileRepository;
    }

    @Transactional
    public WorkerProfileResponse createProfile(
            WorkerProfileRequest request,
            String workerEmail) {

        User user = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != UserRole.WORKER) {
            throw new IllegalArgumentException(
                    "Only workers can create profiles");
        }

        if (workerProfileRepository
                .findByUserEmail(workerEmail).isPresent()) {

            throw new IllegalArgumentException(
                    "Worker profile already exists");
        }

        WorkerProfile profile = new WorkerProfile();

        profile.setUser(user);
        profile.setSkills(request.getSkills());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setServiceCategory(request.getServiceCategory());
        profile.setAvailability(request.getAvailability());
        profile.setBio(request.getBio());

        WorkerProfile savedProfile = workerProfileRepository.save(profile);

        return new WorkerProfileResponse(savedProfile);
    }

    @Transactional(readOnly = true)
    public WorkerProfileResponse getMyProfile(String workerEmail) {

        WorkerProfile profile = workerProfileRepository
                .findByUserEmail(workerEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Worker profile not found"));

        return new WorkerProfileResponse(profile);
    }
}