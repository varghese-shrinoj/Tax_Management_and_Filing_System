package com.tax.taxmanagement.service;

import java.util.List;

import com.tax.taxmanagement.dto.LoginRequest;
import com.tax.taxmanagement.dto.SignupRequest;
import com.tax.taxmanagement.entity.User;

public interface UserService {
	

    User saveUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    User updateProfile(String email, com.tax.taxmanagement.dto.ProfileUpdateRequest request);
}