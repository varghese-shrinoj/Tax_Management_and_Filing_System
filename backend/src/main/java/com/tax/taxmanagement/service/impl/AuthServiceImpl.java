package com.tax.taxmanagement.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.dto.AuthResponse;
import com.tax.taxmanagement.dto.LoginRequest;
import com.tax.taxmanagement.dto.SignupRequest;
import com.tax.taxmanagement.entity.Role;
import com.tax.taxmanagement.entity.User;
import com.tax.taxmanagement.repository.UserRepository;
import com.tax.taxmanagement.service.AuthService;
import com.tax.taxmanagement.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String signup(SignupRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        Role selectedRole = Role.TAXPAYER;
        if ("VERIFIER".equalsIgnoreCase(request.getRole())) {
            selectedRole = Role.VERIFIER;
        }
        user.setRole(selectedRole);

        userRepository.save(user);

        return "Signup Successful";
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if(user == null) {
            return new AuthResponse("Invalid Email");
        }

        if(!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse("Invalid Password");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                "Login Successful",
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

}