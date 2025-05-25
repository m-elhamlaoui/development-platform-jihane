package com.codewithme.backend.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("SpaceDataService Unit Tests")
class SpaceDataServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SpaceDataService spaceDataService;

    @Test
    @DisplayName("Should get launches successfully")
    void getLaunches_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("count", 10);
        mockResponse.put("results", "launch data");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getLaunches("upcoming", 20);

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should get launches with null type")
    void getLaunches_NullType() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("count", 10);
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getLaunches(null, 20);

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should throw exception when launches API fails")
    void getLaunches_ApiFailure() {
        // Given
        when(restTemplate.getForEntity(anyString(), eq(Object.class)))
            .thenThrow(new RestClientException("API Error"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> spaceDataService.getLaunches("upcoming", 20));
        
        assertTrue(exception.getMessage().contains("Failed to fetch launches data"));
    }

    @Test
    @DisplayName("Should get launch details successfully")
    void getLaunchDetails_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("id", "123");
        mockResponse.put("name", "Test Launch");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getLaunchDetails("123");

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should throw exception when launch details API fails")
    void getLaunchDetails_ApiFailure() {
        // Given
        when(restTemplate.getForEntity(anyString(), eq(Object.class)))
            .thenThrow(new RestClientException("API Error"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> spaceDataService.getLaunchDetails("123"));
        
        assertTrue(exception.getMessage().contains("Failed to fetch launch details"));
    }

    @Test
    @DisplayName("Should get astronauts successfully")
    void getAstronauts_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("count", 5);
        mockResponse.put("results", "astronaut data");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getAstronauts(10);

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should throw exception when astronauts API fails")
    void getAstronauts_ApiFailure() {
        // Given
        when(restTemplate.getForEntity(anyString(), eq(Object.class)))
            .thenThrow(new RestClientException("API Error"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> spaceDataService.getAstronauts(10));
        
        assertTrue(exception.getMessage().contains("Failed to fetch astronauts data"));
    }

    @Test
    @DisplayName("Should get astronaut details successfully")
    void getAstronautDetails_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("id", "456");
        mockResponse.put("name", "Test Astronaut");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getAstronautDetails("456");

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should get agencies successfully")
    void getAgencies_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("count", 3);
        mockResponse.put("results", "agency data");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getAgencies(10);

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should get agency details successfully")
    void getAgencyDetails_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("id", "789");
        mockResponse.put("name", "Test Agency");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getAgencyDetails("789");

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should get programs successfully")
    void getPrograms_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("count", 2);
        mockResponse.put("results", "program data");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getPrograms(10);

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should get program details successfully")
    void getProgramDetails_Success() {
        // Given
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("id", "101");
        mockResponse.put("name", "Test Program");
        
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getProgramDetails("101");

        // Then
        assertNotNull(result);
        assertEquals(mockResponse, result);
    }

    @Test
    @DisplayName("Should handle empty response gracefully")
    void handleEmptyResponse() {
        // Given
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(null, HttpStatus.OK);
        when(restTemplate.getForEntity(anyString(), eq(Object.class))).thenReturn(responseEntity);

        // When
        Object result = spaceDataService.getLaunches("upcoming", 20);

        // Then
        assertNull(result);
    }
} 