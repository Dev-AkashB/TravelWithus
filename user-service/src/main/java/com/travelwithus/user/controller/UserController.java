package com.travelwithus.user.controller;

import com.travelwithus.user.dto.*;
import com.travelwithus.user.exception.ForbiddenException;
import com.travelwithus.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    private Long resolveUserId(Long headerUserId) {
        if (headerUserId == null) {
            throw new ForbiddenException("Authenticated user identity missing from request");
        }
        return headerUserId;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        Long resolvedId = resolveUserId(userId);
        UserProfileDto profile = userService.getProfile(resolvedId, email);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @Valid @RequestBody UpdateProfileRequest request) {
        Long resolvedId = resolveUserId(userId);
        UserProfileDto updated = userService.updateProfile(resolvedId, email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<UserPreferenceDto>> getPreferences(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long resolvedId = resolveUserId(userId);
        UserPreferenceDto preferences = userService.getPreferences(resolvedId);
        return ResponseEntity.ok(ApiResponse.success("Preferences retrieved successfully", preferences));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserPreferenceDto>> updatePreferences(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody UpdatePreferenceRequest request) {
        Long resolvedId = resolveUserId(userId);
        UserPreferenceDto updated = userService.updatePreferences(resolvedId, request);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", updated));
    }

    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteDto>>> getFavorites(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long resolvedId = resolveUserId(userId);
        List<FavoriteDto> favorites = userService.getFavorites(resolvedId);
        return ResponseEntity.ok(ApiResponse.success("Favorites retrieved successfully", favorites));
    }

    @PostMapping("/favorites/{destinationId}")
    public ResponseEntity<ApiResponse<FavoriteDto>> addFavorite(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long destinationId) {
        Long resolvedId = resolveUserId(userId);
        FavoriteDto added = userService.addFavorite(resolvedId, destinationId);
        return ResponseEntity.ok(ApiResponse.success("Added to favorites", added));
    }

    @DeleteMapping("/favorites/{destinationId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long destinationId) {
        Long resolvedId = resolveUserId(userId);
        userService.removeFavorite(resolvedId, destinationId);
        return ResponseEntity.ok(ApiResponse.success("Removed from favorites", null));
    }
}
