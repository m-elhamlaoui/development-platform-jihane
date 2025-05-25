package com.codewithme.backend.integration;

import com.codewithme.backend.User;
import com.codewithme.backend.UserRepository;
import com.codewithme.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@AutoConfigureWebMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("User API Integration Tests")
class UserIntegrationTest extends BaseIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String baseUrl;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUpTest() {
        baseUrl = "http://localhost:" + port + "/api";
        testUserDTO = new UserDTO("integration@test.com", "password123");
        
        // Clean database before each test
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should register user successfully with complete flow")
    void registerUser_CompleteFlow() {
        // When
        ResponseEntity<Map> response = restTemplate.postForEntity(
            baseUrl + "/signup",
            testUserDTO,
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("message")).isEqualTo("User registered successfully");

        // Verify user is saved in database
        User savedUser = userRepository.findByEmail(testUserDTO.getEmail());
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo(testUserDTO.getEmail());
        assertThat(savedUser.getPassword()).isNotEqualTo(testUserDTO.getPassword()); // Should be encoded
    }

    @Test
    @DisplayName("Should prevent duplicate user registration")
    void registerUser_DuplicateEmail() {
        // Given - Register user first time
        restTemplate.postForEntity(baseUrl + "/signup", testUserDTO, Map.class);

        // When - Try to register same user again
        ResponseEntity<Map> response = restTemplate.postForEntity(
            baseUrl + "/signup",
            testUserDTO,
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Email is already registered");

        // Verify only one user exists in database
        long userCount = userRepository.count();
        assertThat(userCount).isEqualTo(1);
    }

    @Test
    @DisplayName("Should login user successfully after registration")
    void loginUser_AfterRegistration() {
        // Given - Register user first
        restTemplate.postForEntity(baseUrl + "/signup", testUserDTO, Map.class);

        // When - Login with same credentials
        ResponseEntity<Map> response = restTemplate.postForEntity(
            baseUrl + "/login",
            testUserDTO,
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("message")).isEqualTo("Login successful");
        assertThat(response.getBody().get("token")).isEqualTo("Login successful");
    }

    @Test
    @DisplayName("Should fail login with wrong password")
    void loginUser_WrongPassword() {
        // Given - Register user first
        restTemplate.postForEntity(baseUrl + "/signup", testUserDTO, Map.class);

        // When - Login with wrong password
        UserDTO wrongPasswordDTO = new UserDTO(testUserDTO.getEmail(), "wrongpassword");
        ResponseEntity<Map> response = restTemplate.postForEntity(
            baseUrl + "/login",
            wrongPasswordDTO,
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("Invalid password");
    }

    @Test
    @DisplayName("Should fail login with non-existent user")
    void loginUser_NonExistentUser() {
        // When - Login with non-existent user
        UserDTO nonExistentUser = new UserDTO("nonexistent@test.com", "password123");
        ResponseEntity<Map> response = restTemplate.postForEntity(
            baseUrl + "/login",
            nonExistentUser,
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("error")).isEqualTo("User not found");
    }

    @Test
    @DisplayName("Should test CORS endpoint")
    void testCors() {
        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/test-cors",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("message")).isEqualTo("CORS is working!");
    }

    @Test
    @DisplayName("Should handle invalid JSON gracefully")
    void registerUser_InvalidJson() {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>("invalid json", headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/signup",
            request,
            String.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Should handle missing request body")
    void registerUser_MissingBody() {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(headers);

        // When
        ResponseEntity<String> response = restTemplate.postForEntity(
            baseUrl + "/signup",
            request,
            String.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Should handle complete user lifecycle")
    void userLifecycle_CompleteFlow() {
        // Step 1: Register user
        ResponseEntity<Map> registerResponse = restTemplate.postForEntity(
            baseUrl + "/signup",
            testUserDTO,
            Map.class
        );
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Step 2: Verify user exists in database
        User savedUser = userRepository.findByEmail(testUserDTO.getEmail());
        assertThat(savedUser).isNotNull();

        // Step 3: Login with correct credentials
        ResponseEntity<Map> loginResponse = restTemplate.postForEntity(
            baseUrl + "/login",
            testUserDTO,
            Map.class
        );
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Step 4: Try to register again (should fail)
        ResponseEntity<Map> duplicateResponse = restTemplate.postForEntity(
            baseUrl + "/signup",
            testUserDTO,
            Map.class
        );
        assertThat(duplicateResponse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

        // Step 5: Verify still only one user in database
        long userCount = userRepository.count();
        assertThat(userCount).isEqualTo(1);
    }
} 