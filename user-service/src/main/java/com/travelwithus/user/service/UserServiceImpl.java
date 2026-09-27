package com.travelwithus.user.service;

import com.travelwithus.user.dto.*;
import com.travelwithus.user.entity.UserFavorite;
import com.travelwithus.user.entity.UserPreference;
import com.travelwithus.user.entity.UserProfile;
import com.travelwithus.user.exception.BadRequestException;
import com.travelwithus.user.exception.ResourceNotFoundException;
import com.travelwithus.user.repository.UserFavoriteRepository;
import com.travelwithus.user.repository.UserPreferenceRepository;
import com.travelwithus.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserFavoriteRepository userFavoriteRepository;

    @Autowired
    public UserServiceImpl(UserProfileRepository userProfileRepository,
                           UserPreferenceRepository userPreferenceRepository,
                           UserFavoriteRepository userFavoriteRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.userFavoriteRepository = userFavoriteRepository;
    }

    @Override
    @Transactional
    public UserProfileDto getProfile(Long userId, String email) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Create default profile if lazily visited for first time
                    UserProfile newProfile = new UserProfile(userId, email != null ? email : "user" + userId + "@travelwithus.com",
                            "Traveler", "", "");
                    return userProfileRepository.save(newProfile);
                });

        return mapToProfileDto(profile);
    }

    @Override
    @Transactional
    public UserProfileDto updateProfile(Long userId, String email, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> new UserProfile(userId, email != null ? email : "user" + userId + "@travelwithus.com",
                        request.getFirstName() != null ? request.getFirstName() : "Traveler",
                        request.getLastName() != null ? request.getLastName() : "",
                        request.getPhone()));

        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName().trim());
        if (request.getLastName() != null) profile.setLastName(request.getLastName().trim());
        if (request.getPhone() != null) profile.setPhone(request.getPhone().trim());
        if (request.getAddress() != null) profile.setAddress(request.getAddress().trim());
        if (request.getCity() != null) profile.setCity(request.getCity().trim());
        if (request.getCountry() != null) profile.setCountry(request.getCountry().trim());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl().trim());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());

        UserProfile saved = userProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    @Override
    @Transactional
    public UserPreferenceDto getPreferences(Long userId) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreference defaultPref = new UserPreference(userId);
                    return userPreferenceRepository.save(defaultPref);
                });

        return new UserPreferenceDto(
                preference.getId(),
                preference.getUserId(),
                preference.getCurrency(),
                preference.getLanguage(),
                preference.getDietaryRequirements(),
                preference.getTravelInterests()
        );
    }

    @Override
    @Transactional
    public UserPreferenceDto updatePreferences(Long userId, UpdatePreferenceRequest request) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> new UserPreference(userId));

        if (request.getCurrency() != null) preference.setCurrency(request.getCurrency().trim());
        if (request.getLanguage() != null) preference.setLanguage(request.getLanguage().trim());
        if (request.getDietaryRequirements() != null) preference.setDietaryRequirements(request.getDietaryRequirements().trim());
        if (request.getTravelInterests() != null) preference.setTravelInterests(request.getTravelInterests().trim());

        UserPreference saved = userPreferenceRepository.save(preference);
        return new UserPreferenceDto(
                saved.getId(),
                saved.getUserId(),
                saved.getCurrency(),
                saved.getLanguage(),
                saved.getDietaryRequirements(),
                saved.getTravelInterests()
        );
    }

    @Override
    public List<FavoriteDto> getFavorites(Long userId) {
        return userFavoriteRepository.findByUserId(userId).stream()
                .map(fav -> new FavoriteDto(fav.getId(), fav.getUserId(), fav.getDestinationId(), fav.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FavoriteDto addFavorite(Long userId, Long destinationId) {
        if (userFavoriteRepository.existsByUserIdAndDestinationId(userId, destinationId)) {
            throw new BadRequestException("Destination already added to favorites");
        }

        UserFavorite favorite = new UserFavorite(userId, destinationId);
        UserFavorite saved = userFavoriteRepository.save(favorite);
        return new FavoriteDto(saved.getId(), saved.getUserId(), saved.getDestinationId(), saved.getCreatedAt());
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, Long destinationId) {
        userFavoriteRepository.deleteByUserIdAndDestinationId(userId, destinationId);
    }

    @Override
    public PagedResponse<UserProfileDto> getAllUsers(String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        Page<UserProfile> userPage = userProfileRepository.searchUsers(search, pageRequest);

        List<UserProfileDto> content = userPage.getContent().stream()
                .map(this::mapToProfileDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Override
    @Transactional
    public UserProfileDto updateUserStatus(Long userId, String status) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for user id: " + userId));

        profile.setStatus(status.toUpperCase());
        UserProfile saved = userProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    private UserProfileDto mapToProfileDto(UserProfile profile) {
        return new UserProfileDto(
                profile.getId(),
                profile.getUserId(),
                profile.getEmail(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getCity(),
                profile.getCountry(),
                profile.getAvatarUrl(),
                profile.getBio(),
                profile.getStatus(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
