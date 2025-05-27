package com.codewithme.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:80",              // Docker frontend
                    "http://localhost:5173",            // Vite dev server
                    "http://localhost:3000",            // Alternative React dev server
                    "http://127.0.0.1:80",              // Alternative localhost
                    "http://127.0.0.1:5173",            // Alternative localhost
                    "http://development-platform.local" // Minikube frontend
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
