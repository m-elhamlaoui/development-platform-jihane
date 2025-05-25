package com.codewithme.backend.Controller;

import com.codewithme.backend.service.UserService;
import com.codewithme.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@ActiveProfiles("test")
@DisplayName("UserController Unit Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDTO validUserDTO;

    @BeforeEach
    void setUp() {
        validUserDTO = new UserDTO("test@example.com", "password123");
    }

    @Test
    @DisplayName("Should register user successfully")
    void registerUser_Success() throws Exception {
        // Given
        doNothing().when(userService).registerUser(any(UserDTO.class));

        // When & Then
        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUserDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("User registered successfully"));

        verify(userService).registerUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should return bad request when registration fails")
    void registerUser_Failure() throws Exception {
        // Given
        doThrow(new RuntimeException("Email is already registered"))
            .when(userService).registerUser(any(UserDTO.class));

        // When & Then
        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUserDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Email is already registered"));

        verify(userService).registerUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should return bad request for invalid JSON")
    void registerUser_InvalidJson() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());

        verify(userService, never()).registerUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should login user successfully")
    void loginUser_Success() throws Exception {
        // Given
        when(userService.loginUser(any(UserDTO.class))).thenReturn("Login successful");

        // When & Then
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUserDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").value("Login successful"));

        verify(userService).loginUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should return unauthorized when login fails")
    void loginUser_Failure() throws Exception {
        // Given
        when(userService.loginUser(any(UserDTO.class)))
            .thenThrow(new Exception("Invalid password"));

        // When & Then
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUserDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Invalid password"));

        verify(userService).loginUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should return unauthorized for user not found")
    void loginUser_UserNotFound() throws Exception {
        // Given
        when(userService.loginUser(any(UserDTO.class)))
            .thenThrow(new Exception("User not found"));

        // When & Then
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUserDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("User not found"));

        verify(userService).loginUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should test CORS endpoint successfully")
    void testCors_Success() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/test-cors"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("CORS is working!"));
    }

    @Test
    @DisplayName("Should handle missing request body")
    void registerUser_MissingBody() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        verify(userService, never()).registerUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should handle empty UserDTO")
    void registerUser_EmptyUserDTO() throws Exception {
        // Given
        UserDTO emptyUserDTO = new UserDTO();

        // When & Then
        mockMvc.perform(post("/api/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyUserDTO)))
                .andExpect(status().isOk()); // Controller doesn't validate, service will handle

        verify(userService).registerUser(any(UserDTO.class));
    }

    @Test
    @DisplayName("Should handle UserDTO with null values")
    void loginUser_NullValues() throws Exception {
        // Given
        UserDTO nullUserDTO = new UserDTO(null, null);

        // When & Then
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nullUserDTO)))
                .andExpect(status().isOk()); // Controller doesn't validate, service will handle

        verify(userService).loginUser(any(UserDTO.class));
    }
} 