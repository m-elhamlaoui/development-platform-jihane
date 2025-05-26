package com.codewithme.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.codewithme.backend.service.SpaceDataService;

@RestController
@RequestMapping("/api/space")
@CrossOrigin(origins = {"http://localhost:80", "http://localhost:5173", "http://localhost:3000", "http://localhost:8081", "http://127.0.0.1:80", "http://127.0.0.1:5173", "http://127.0.0.1:8081", "http://development-platform.local"}, allowCredentials = "true")
public class SpaceDataController {
    private static final Logger logger = LoggerFactory.getLogger(SpaceDataController.class);
    private final SpaceDataService spaceDataService;

    @Autowired
    public SpaceDataController(SpaceDataService spaceDataService) {
        this.spaceDataService = spaceDataService;
        logger.info("SpaceDataController initialized");
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        try {
            logger.info("Test endpoint called");
            return ResponseEntity.ok("API is working");
        } catch (Exception e) {
            logger.error("Error in test endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/launches")
    public ResponseEntity<?> getLaunches(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            logger.info("GET /api/space/launches called with type={}, limit={}", type, limit);
            Object data = spaceDataService.getLaunches(type, limit);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching launches", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch launches data: " + e.getMessage());
        }
    }

    @GetMapping("/launches/{id}")
    public ResponseEntity<?> getLaunchDetails(@PathVariable String id) {
        try {
            logger.info("GET /api/space/launches/{} called", id);
            Object data = spaceDataService.getLaunchDetails(id);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching launch details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch launch details: " + e.getMessage());
        }
    }

    @GetMapping("/astronauts")
    public ResponseEntity<?> getAstronauts(@RequestParam(defaultValue = "20") int limit) {
        try {
            logger.info("GET /api/space/astronauts called with limit={}", limit);
            Object data = spaceDataService.getAstronauts(limit);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching astronauts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch astronauts data: " + e.getMessage());
        }
    }

    @GetMapping("/astronauts/{id}")
    public ResponseEntity<?> getAstronautDetails(@PathVariable String id) {
        try {
            logger.info("GET /api/space/astronauts/{} called", id);
            Object data = spaceDataService.getAstronautDetails(id);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching astronaut details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch astronaut details: " + e.getMessage());
        }
    }

    @GetMapping("/agencies")
    public ResponseEntity<?> getAgencies(@RequestParam(defaultValue = "20") int limit) {
        try {
            logger.info("GET /api/space/agencies called with limit={}", limit);
            Object data = spaceDataService.getAgencies(limit);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching agencies", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch agencies data: " + e.getMessage());
        }
    }

    @GetMapping("/agencies/{id}")
    public ResponseEntity<?> getAgencyDetails(@PathVariable String id) {
        try {
            logger.info("GET /api/space/agencies/{} called", id);
            Object data = spaceDataService.getAgencyDetails(id);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching agency details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch agency details: " + e.getMessage());
        }
    }

    @GetMapping("/programs")
    public ResponseEntity<?> getPrograms(@RequestParam(defaultValue = "20") int limit) {
        try {
            logger.info("GET /api/space/programs called with limit={}", limit);
            Object data = spaceDataService.getPrograms(limit);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching programs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch programs data: " + e.getMessage());
        }
    }

    @GetMapping("/programs/{id}")
    public ResponseEntity<?> getProgramDetails(@PathVariable String id) {
        try {
            logger.info("GET /api/space/programs/{} called", id);
            Object data = spaceDataService.getProgramDetails(id);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching program details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch program details: " + e.getMessage());
        }
    }
} 