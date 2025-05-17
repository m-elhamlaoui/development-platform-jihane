package com.codewithme.backend.service;

import com.codewithme.dto.UserDTO;

public interface UserService {

    void registerUser(UserDTO userDTO);
    String loginUser(UserDTO loginDTO) throws Exception;
}
