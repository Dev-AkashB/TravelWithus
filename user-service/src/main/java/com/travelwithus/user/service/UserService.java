package com.travelwithus.user.service;

import com.travelwithus.user.dto.*;

import java.util.List;

public interface UserService {
    UserProfileDto getProfile(Long userId, String email);
    UserProfileDto updateProfile(Long userId, String email, UpdateProfileRequest request);
    UserPreferenceDto getPreferences(Long userId);
    UserPreferenceDto updatePreferences(Long userId, UpdatePreferenceRequest request);
    List<FavoriteDto> getFavorites(Long userId);
    FavoriteDto addFavorite(Long userId, Long destinationId);
    void removeFavorite(Long userId, Long destinationId);
    PagedResponse<UserProfileDto> getAllUsers(String search, int page, int size);
    UserProfileDto updateUserStatus(Long userId, String status);
}
