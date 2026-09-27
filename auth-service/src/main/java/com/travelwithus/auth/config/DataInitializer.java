package com.travelwithus.auth.config;

import com.travelwithus.auth.entity.Role;
import com.travelwithus.auth.entity.User;
import com.travelwithus.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUserIfNotExists("superadmin@travelwithus.com", "SuperAdmin@12345", "Super", "Admin", "+1234567890",
                Set.of(Role.ROLE_SUPER_ADMIN, Role.ROLE_ADMIN, Role.ROLE_USER));

        seedUserIfNotExists("admin@travelwithus.com", "Admin@12345", "System", "Admin", "+1234567891",
                Set.of(Role.ROLE_ADMIN, Role.ROLE_USER));

        seedUserIfNotExists("user@travelwithus.com", "User@12345", "John", "Doe", "+1234567892",
                Set.of(Role.ROLE_USER));
    }

    private void seedUserIfNotExists(String email, String rawPassword, String firstName, String lastName, String phone, Set<Role> roles) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhone(phone);
            user.setEnabled(true);
            user.setRoles(roles);
            userRepository.save(user);
            log.info("Initialized default user: {} with roles: {}", email, roles);
        }
    }
}
