package com.codewithme.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password should have at least 6 characters")
    private String password;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    @Override
    public String toString() {
        return "UserDTO{" +
                "email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}