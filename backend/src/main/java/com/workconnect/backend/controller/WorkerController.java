
package com.workconnect.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/worker")
public class WorkerController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard(
            Authentication authentication) {

        return ResponseEntity.ok(
                "Welcome Worker: " + authentication.getName());
    }
}
