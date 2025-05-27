package com.codewithme.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:80", "http://localhost:5173", "http://localhost:3000", "http://localhost:8081", "http://127.0.0.1:80", "http://127.0.0.1:5173", "http://127.0.0.1:8081", "http://development-platform.local"})
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Development Platform Jihane Backend");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/health")
    public ResponseEntity<?> apiHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Development Platform Jihane API");
        response.put("timestamp", System.currentTimeMillis());
        response.put("message", "Backend API is running successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<?> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Development Platform Jihane Backend");
        response.put("status", "running");
        response.put("endpoints", new String[]{
            "/health - Health check",
            "/api/health - API health check", 
            "/api/test-cors - CORS test",
            "/api/space/* - Space data endpoints",
            "/api/signup - User registration",
            "/api/login - User login"
        });
        return ResponseEntity.ok(response);
    }
} 