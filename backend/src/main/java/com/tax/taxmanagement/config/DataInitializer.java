package com.tax.taxmanagement.config;

import com.tax.taxmanagement.entity.Role;
import com.tax.taxmanagement.entity.User;
import com.tax.taxmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Automatically creates the default Admin account when the application starts,
 * if one does not already exist.
 *
 * Admin credentials:
 *   Email:    admin@taxmanagement.com
 *   Password: Admin@123
 *
 * To change the admin credentials, edit the fields below and restart the backend.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL    = "admin@taxmanagement.com";
    private static final String ADMIN_PASSWORD = "Admin@123";
    private static final String ADMIN_NAME     = "System Administrator";

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            User admin = new User();
            admin.setFullName(ADMIN_NAME);
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(ADMIN_PASSWORD);
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Default admin account created: " + ADMIN_EMAIL);
        } else {
            System.out.println("ℹ️  Admin account already exists: " + ADMIN_EMAIL);
        }
    }
}
