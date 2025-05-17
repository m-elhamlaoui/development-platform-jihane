package com.codewithme.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class SpaceDataService {
    private static final Logger logger = LoggerFactory.getLogger(SpaceDataService.class);
    private final RestTemplate restTemplate;
    private final String SPACE_API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0";

    @Autowired
    public SpaceDataService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getLaunches(String type, int limit) {
        try {
            String url = SPACE_API_BASE_URL + "/launch/";
            if (type != null) {
                url += "?type=" + type;
            }
            url += (url.contains("?") ? "&" : "?") + "limit=" + limit;
            logger.info("Fetching launches from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Launch API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching launches: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch launches data: " + e.getMessage());
        }
    }

    public Object getLaunchDetails(String id) {
        try {
            String url = SPACE_API_BASE_URL + "/launch/" + id + "/";
            logger.info("Fetching launch details from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Launch details API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching launch details: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch launch details: " + e.getMessage());
        }
    }

    public Object getAstronauts(int limit) {
        try {
            String url = SPACE_API_BASE_URL + "/astronaut/?limit=" + limit + "&format=json";
            logger.info("Fetching astronauts from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Astronauts API response status: {}", response.getStatusCode());
            
            // Log the full response body for debugging
            Object responseBody = response.getBody();
            if (responseBody != null) {
                logger.info("Astronauts API response body structure: {}", responseBody.getClass().getName());
                // Log the first item if it's a map with results
                try {
                    if (responseBody instanceof Map) {
                        Map<String, Object> responseMap = (Map<String, Object>) responseBody;
                        logger.info("Astronauts API response keys: {}", responseMap.keySet());
                        
                        if (responseMap.containsKey("results") && responseMap.get("results") instanceof List) {
                            List<Object> results = (List<Object>) responseMap.get("results");
                            if (!results.isEmpty()) {
                                Object firstItem = results.get(0);
                                logger.info("First astronaut object keys: {}", 
                                    firstItem instanceof Map ? ((Map<String, Object>) firstItem).keySet() : "Not a map");
                            }
                        }
                    }
                } catch (Exception e) {
                    logger.error("Error analyzing astronaut response", e);
                }
            }
            
            return responseBody;
        } catch (Exception e) {
            logger.error("Error fetching astronauts: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch astronauts data: " + e.getMessage());
        }
    }

    public Object getAstronautDetails(String id) {
        try {
            String url = SPACE_API_BASE_URL + "/astronaut/" + id + "/?format=json";
            logger.info("Fetching astronaut details from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Astronaut details API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching astronaut details: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch astronaut details: " + e.getMessage());
        }
    }

    public Object getAgencies(int limit) {
        try {
            String url = SPACE_API_BASE_URL + "/agencies/?limit=" + limit;
            logger.info("Fetching agencies from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Agencies API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching agencies: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch agencies data: " + e.getMessage());
        }
    }

    public Object getAgencyDetails(String id) {
        try {
            String url = SPACE_API_BASE_URL + "/agencies/" + id + "/";
            logger.info("Fetching agency details from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Agency details API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching agency details: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch agency details: " + e.getMessage());
        }
    }

    public Object getPrograms(int limit) {
        try {
            String url = SPACE_API_BASE_URL + "/program/?limit=" + limit + "&format=json";
            logger.info("Fetching programs from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Programs API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching programs: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch programs data: " + e.getMessage());
        }
    }

    public Object getProgramDetails(String id) {
        try {
            String url = SPACE_API_BASE_URL + "/program/" + id + "/?format=json";
            logger.info("Fetching program details from URL: {}", url);
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            logger.info("Program details API response status: {}", response.getStatusCode());
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error fetching program details: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch program details: " + e.getMessage());
        }
    }
} 