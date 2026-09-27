package com.travelwithus.auth.service;

import com.travelwithus.auth.dto.AuthResponse;
import com.travelwithus.auth.dto.LoginRequest;
import com.travelwithus.auth.dto.RegisterRequest;
import com.travelwithus.auth.entity.RefreshToken;
import com.travelwithus.auth.entity.Role;
import com.travelwithus.auth.entity.User;
import com.travelwithus.auth.exception.BadRequestException;
import com.travelwithus.auth.repository.PasswordResetTokenRepository;
import com.travelwithus.auth.repository.UserRepository;
import com.travelwithus.auth.security.JwtTokenProvider;
import com.travelwithus.auth.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    private JwtTokenProvider tokenProvider;
    private AuthServiceImpl authService;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "TestSecretKeyMustBeLongEnoughForHmacSha256AlgorithmEnterpriseGrade12345");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 86400000L);
        ReflectionTestUtils.setField(tokenProvider, "jwtIssuer", "test-auth");
        tokenProvider.init();

        authService = new AuthServiceImpl(
                authenticationManager,
                userRepository,
                passwordEncoder,
                tokenProvider,
                refreshTokenService,
                passwordResetTokenRepository
        );

        sampleUser = new User("alice@example.com", "encodedPassword", "Alice", "Wonder", "+1987654321");
        sampleUser.setId(10L);
        sampleUser.setRoles(Set.of(Role.ROLE_USER));
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("alice@example.com", "Password@123", "Alice", "Wonder", "+1987654321");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        RefreshToken refreshToken = new RefreshToken("mock-refresh-token", sampleUser, Instant.now().plusSeconds(86400));
        when(refreshTokenService.createRefreshToken(10L)).thenReturn(refreshToken);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals("alice@example.com", response.getEmail());
    }

    @Test
    void testRegisterDuplicateEmailThrowsBadRequest() {
        RegisterRequest request = new RegisterRequest("alice@example.com", "Password@123", "Alice", "Wonder", "+1987654321");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("alice@example.com", "Password@123");

        UserPrincipal principal = UserPrincipal.create(sampleUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(sampleUser));

        RefreshToken refreshToken = new RefreshToken("mock-refresh-token-login", sampleUser, Instant.now().plusSeconds(86400));
        when(refreshTokenService.createRefreshToken(10L)).thenReturn(refreshToken);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertEquals("alice@example.com", response.getEmail());
    }
}
