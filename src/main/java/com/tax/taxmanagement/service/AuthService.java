package com.tax.taxmanagement.service;

import com.tax.taxmanagement.dto.AuthResponse;
import com.tax.taxmanagement.dto.LoginRequest;
import com.tax.taxmanagement.dto.SignupRequest;

public interface AuthService {

    String signup(SignupRequest request);

    AuthResponse login(LoginRequest request);

}