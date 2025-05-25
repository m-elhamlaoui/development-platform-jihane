package com.codewithme.backend.config;

import com.codewithme.backend.service.SpaceDataService;
import com.codewithme.backend.service.UserService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.web.client.RestTemplate;

@TestConfiguration
@Profile("test")
public class TestConfig {

    @Bean
    @Primary
    public RestTemplate testRestTemplate() {
        return Mockito.mock(RestTemplate.class);
    }

    @Bean
    @Primary
    public SpaceDataService mockSpaceDataService() {
        return Mockito.mock(SpaceDataService.class);
    }

    @Bean
    @Primary
    public UserService mockUserService() {
        return Mockito.mock(UserService.class);
    }
} 