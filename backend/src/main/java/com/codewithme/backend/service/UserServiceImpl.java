package com.codewithme.backend.service;

import com.codewithme.backend.User;
import com.codewithme.backend.UserRepository;
import com.codewithme.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void registerUser(UserDTO userDTO) {
        if(userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new RuntimeException("Email is already registered");
        }
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userRepository.save(user);
    }


    public String loginUser(UserDTO loginDTO) throws Exception {
        User user = userRepository.findByEmail(loginDTO.getEmail());

        if (user == null) {
            throw new Exception("User not found");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new Exception("Invalid password");
        }

        // Here, you could generate and return a JWT token or just a success message
        return "Login successful";
    }
}
