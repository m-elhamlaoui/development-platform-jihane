package com.codewithme.backend.integration;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;

@AutoConfigureWebMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("Space Data API Integration Tests")
class SpaceDataIntegrationTest extends BaseIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl;
    private static WireMockServer wireMockServer;

    @BeforeAll
    static void setUpWireMock() {
        wireMockServer = new WireMockServer(8089);
        wireMockServer.start();
        WireMock.configureFor("localhost", 8089);
    }

    @AfterAll
    static void tearDownWireMock() {
        wireMockServer.stop();
    }

    @BeforeEach
    void setUpTest() {
        baseUrl = "http://localhost:" + port + "/api/space";
        wireMockServer.resetAll();
    }

    @Test
    @DisplayName("Should get launches successfully")
    void getLaunches_Success() {
        // Given
        String mockResponse = """
            {
                "count": 2,
                "results": [
                    {
                        "id": "123",
                        "name": "Test Launch 1",
                        "status": "upcoming"
                    },
                    {
                        "id": "124",
                        "name": "Test Launch 2",
                        "status": "upcoming"
                    }
                ]
            }
            """;

        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/launch/.*"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/launches?type=upcoming&limit=20",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("count")).isEqualTo(2);
        assertThat(response.getBody().get("results")).isNotNull();
    }

    @Test
    @DisplayName("Should get launch details successfully")
    void getLaunchDetails_Success() {
        // Given
        String mockResponse = """
            {
                "id": "123",
                "name": "Test Launch",
                "status": "upcoming",
                "rocket": {
                    "name": "Test Rocket"
                }
            }
            """;

        wireMockServer.stubFor(get(urlEqualTo("/2.2.0/launch/123/"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/launches/123",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("id")).isEqualTo("123");
        assertThat(response.getBody().get("name")).isEqualTo("Test Launch");
    }

    @Test
    @DisplayName("Should get astronauts successfully")
    void getAstronauts_Success() {
        // Given
        String mockResponse = """
            {
                "count": 1,
                "results": [
                    {
                        "id": "456",
                        "name": "Test Astronaut",
                        "nationality": "American"
                    }
                ]
            }
            """;

        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/astronaut/.*"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/astronauts?limit=10",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("count")).isEqualTo(1);
        assertThat(response.getBody().get("results")).isNotNull();
    }

    @Test
    @DisplayName("Should get astronaut details successfully")
    void getAstronautDetails_Success() {
        // Given
        String mockResponse = """
            {
                "id": "456",
                "name": "Test Astronaut",
                "nationality": "American",
                "bio": "Test astronaut biography"
            }
            """;

        wireMockServer.stubFor(get(urlEqualTo("/2.2.0/astronaut/456/?format=json"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/astronauts/456",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("id")).isEqualTo("456");
        assertThat(response.getBody().get("name")).isEqualTo("Test Astronaut");
    }

    @Test
    @DisplayName("Should get agencies successfully")
    void getAgencies_Success() {
        // Given
        String mockResponse = """
            {
                "count": 1,
                "results": [
                    {
                        "id": "789",
                        "name": "Test Agency",
                        "type": "Government"
                    }
                ]
            }
            """;

        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/agencies/.*"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/agencies?limit=10",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("count")).isEqualTo(1);
        assertThat(response.getBody().get("results")).isNotNull();
    }

    @Test
    @DisplayName("Should get programs successfully")
    void getPrograms_Success() {
        // Given
        String mockResponse = """
            {
                "count": 1,
                "results": [
                    {
                        "id": "101",
                        "name": "Test Program",
                        "description": "Test space program"
                    }
                ]
            }
            """;

        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/program/.*"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/programs?limit=10",
            Map.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("count")).isEqualTo(1);
        assertThat(response.getBody().get("results")).isNotNull();
    }

    @Test
    @DisplayName("Should handle external API failure gracefully")
    void getLaunches_ExternalApiFailure() {
        // Given
        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/launch/.*"))
            .willReturn(aResponse()
                .withStatus(500)
                .withBody("Internal Server Error")));

        // When
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl + "/launches?type=upcoming&limit=20",
            String.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should handle external API timeout")
    void getLaunches_Timeout() {
        // Given
        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/launch/.*"))
            .willReturn(aResponse()
                .withStatus(200)
                .withFixedDelay(10000) // 10 second delay
                .withBody("{}")));

        // When
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl + "/launches?type=upcoming&limit=20",
            String.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should handle malformed JSON response")
    void getLaunches_MalformedJson() {
        // Given
        wireMockServer.stubFor(get(urlPathMatching("/2.2.0/launch/.*"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("invalid json")));

        // When
        ResponseEntity<String> response = restTemplate.getForEntity(
            baseUrl + "/launches?type=upcoming&limit=20",
            String.class
        );

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should verify correct API URLs are called")
    void verifyCorrectApiUrls() {
        // Given
        String mockResponse = """
            {
                "count": 0,
                "results": []
            }
            """;

        wireMockServer.stubFor(get(anyUrl())
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockResponse)));

        // When - Call different endpoints
        restTemplate.getForEntity(baseUrl + "/launches?type=upcoming&limit=20", Map.class);
        restTemplate.getForEntity(baseUrl + "/launches/123", Map.class);
        restTemplate.getForEntity(baseUrl + "/astronauts?limit=10", Map.class);
        restTemplate.getForEntity(baseUrl + "/astronauts/456", Map.class);
        restTemplate.getForEntity(baseUrl + "/agencies?limit=10", Map.class);
        restTemplate.getForEntity(baseUrl + "/programs?limit=10", Map.class);

        // Then - Verify correct URLs were called
        wireMockServer.verify(getRequestedFor(urlMatching("/2.2.0/launch/\\?type=upcoming&limit=20")));
        wireMockServer.verify(getRequestedFor(urlEqualTo("/2.2.0/launch/123/")));
        wireMockServer.verify(getRequestedFor(urlMatching("/2.2.0/astronaut/\\?limit=10&format=json")));
        wireMockServer.verify(getRequestedFor(urlEqualTo("/2.2.0/astronaut/456/?format=json")));
        wireMockServer.verify(getRequestedFor(urlMatching("/2.2.0/agencies/\\?limit=10")));
        wireMockServer.verify(getRequestedFor(urlMatching("/2.2.0/program/\\?limit=10&format=json")));
    }
} 