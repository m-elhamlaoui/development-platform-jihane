package com.codewithme.backend.Controller;

import com.codewithme.backend.service.UserService;
import com.codewithme.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:80", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:80", "http://127.0.0.1:5173", "http://development-platform.local"})
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        logger.info("Received registration request for email: {}", userDTO.getEmail());
        try {
            userService.registerUser(userDTO);
            logger.info("Registration successful for email: {}", userDTO.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration failed for email: {}: {}", userDTO.getEmail(), e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        logger.info("Received login request for email: {}", userDTO.getEmail());
        try {
            String token = userService.loginUser(userDTO);
            logger.info("Login successful for email: {}", userDTO.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {}: {}", userDTO.getEmail(), e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    // Add this endpoint to test CORS
    @GetMapping("/test-cors")
    public ResponseEntity<?> testCors() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "CORS is working!");
        return ResponseEntity.ok(response);
    }
}