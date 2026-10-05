package com.travelwithus.auth.service;

import com.travelwithus.auth.dto.*;
import com.travelwithus.auth.entity.PasswordResetToken;
import com.travelwithus.auth.entity.RefreshToken;
import com.travelwithus.auth.entity.Role;
import com.travelwithus.auth.entity.User;
import com.travelwithus.auth.exception.BadRequestException;
import com.travelwithus.auth.exception.ResourceNotFoundException;
import com.travelwithus.auth.exception.UnauthorizedException;
import com.travelwithus.auth.repository.PasswordResetTokenRepository;
import com.travelwithus.auth.repository.UserRepository;
import com.travelwithus.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    public AuthServiceImpl(AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            RefreshTokenService refreshTokenService,
            PasswordResetTokenRepository passwordResetTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setEnabled(true);
        user.setRoles(Set.of(Role.ROLE_USER));

        User savedUser = userRepository.save(user);

        // Auto authenticate after registration
        List<String> roleNames = savedUser.getRoles().stream().map(Role::name).collect(Collectors.toList());
        String accessToken = tokenProvider.generateTokenFromUser(savedUser.getId(), savedUser.getEmail(), roleNames);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getExpirationMs(),
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                roleNames);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        List<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toList());

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getExpirationMs(),
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roles);
    }

    @Override
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    List<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toList());
                    String accessToken = tokenProvider.generateTokenFromUser(user.getId(), user.getEmail(), roles);
                    return new AuthResponse(
                            accessToken,
                            requestRefreshToken,
                            tokenProvider.getExpirationMs(),
                            user.getId(),
                            user.getEmail(),
                            user.getFirstName(),
                            user.getLastName(),
                            roles);
                })
                .orElseThrow(() -> new BadRequestException("Refresh token is not in database!"));
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeRefreshToken(refreshToken);
        }
        SecurityContextHolder.clearContext();
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setExpiryDate(Instant.now().plusSeconds(3600)); // 1 hour validity
        resetToken.setUsed(false);

        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Password reset token is expired or has already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    public UserDto validateToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!tokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Token is invalid or expired");
        }

        String email = tokenProvider.getUsernameFromJwt(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Set<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toSet());

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.isEnabled(),
                roles);
    }
}
