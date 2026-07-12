package com.tax.taxmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tax.taxmanagement.entity.User;
import com.tax.taxmanagement.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // Create User
    @PostMapping
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get User By Id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Update User
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // Delete User
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User Deleted Successfully";
    }

    @Autowired
    private com.tax.taxmanagement.util.JwtUtil jwtUtil;

    @PutMapping("/profile")
    public User updateProfile(@RequestHeader("Authorization") String authHeader,
                             @RequestBody com.tax.taxmanagement.dto.ProfileUpdateRequest request) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String email = jwtUtil.extractEmail(token);
        return userService.updateProfile(email, request);
    }
}