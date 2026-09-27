package com.travelwithus.gateway.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private final String secret = "TestSecretKeyMustBeLongEnoughForHmacSha256AlgorithmEnterpriseGrade12345";

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", secret);
        jwtUtils.init();
    }

    private String generateTestToken(String subject, Long userId, List<String> roles, long expirationOffset) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject(subject)
                .claim("userId", userId)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationOffset))
                .signWith(key)
                .compact();
    }

    @Test
    void testValidToken() {
        String token = generateTestToken("john@example.com", 101L, List.of("ROLE_USER"), 60000);
        assertTrue(jwtUtils.validateToken(token));
        assertEquals("john@example.com", jwtUtils.getUsername(token));
        assertEquals(101L, jwtUtils.getUserId(token));
        assertTrue(jwtUtils.getRoles(token).contains("ROLE_USER"));
    }

    @Test
    void testExpiredToken() {
        String token = generateTestToken("expired@example.com", 102L, List.of("ROLE_USER"), -1000);
        assertFalse(jwtUtils.validateToken(token));
    }

    @Test
    void testTamperedToken() {
        String token = generateTestToken("john@example.com", 101L, List.of("ROLE_USER"), 60000);
        String tampered = token + "xyz";
        assertFalse(jwtUtils.validateToken(tampered));
    }
}
