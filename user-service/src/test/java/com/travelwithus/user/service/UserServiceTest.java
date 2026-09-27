package com.travelwithus.user.service;

import com.travelwithus.user.dto.FavoriteDto;
import com.travelwithus.user.dto.UpdatePreferenceRequest;
import com.travelwithus.user.dto.UpdateProfileRequest;
import com.travelwithus.user.dto.UserProfileDto;
import com.travelwithus.user.entity.UserFavorite;
import com.travelwithus.user.entity.UserPreference;
import com.travelwithus.user.entity.UserProfile;
import com.travelwithus.user.exception.BadRequestException;
import com.travelwithus.user.repository.UserFavoriteRepository;
import com.travelwithus.user.repository.UserPreferenceRepository;
import com.travelwithus.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @Mock
    private UserFavoriteRepository userFavoriteRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserProfile sampleProfile;

    @BeforeEach
    void setUp() {
        sampleProfile = new UserProfile(5L, "david@example.com", "David", "Miller", "+1122334455");
        sampleProfile.setId(1L);
    }

    @Test
    void testGetProfileSuccess() {
        when(userProfileRepository.findByUserId(5L)).thenReturn(Optional.of(sampleProfile));

        UserProfileDto result = userService.getProfile(5L, "david@example.com");

        assertNotNull(result);
        assertEquals("David", result.getFirstName());
        assertEquals("david@example.com", result.getEmail());
    }

    @Test
    void testUpdateProfileSuccess() {
        when(userProfileRepository.findByUserId(5L)).thenReturn(Optional.of(sampleProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateProfileRequest request = new UpdateProfileRequest("David", "Smith", "+1999888777", "123 Main St", "New York", "USA", "http://avatar.jpg", "Travel lover");

        UserProfileDto result = userService.updateProfile(5L, "david@example.com", request);

        assertNotNull(result);
        assertEquals("Smith", result.getLastName());
        assertEquals("New York", result.getCity());
    }

    @Test
    void testAddFavoriteSuccess() {
        when(userFavoriteRepository.existsByUserIdAndDestinationId(5L, 101L)).thenReturn(false);
        UserFavorite savedFavorite = new UserFavorite(5L, 101L);
        savedFavorite.setId(1L);
        when(userFavoriteRepository.save(any(UserFavorite.class))).thenReturn(savedFavorite);

        FavoriteDto favoriteDto = userService.addFavorite(5L, 101L);

        assertNotNull(favoriteDto);
        assertEquals(101L, favoriteDto.getDestinationId());
    }

    @Test
    void testAddFavoriteDuplicateThrowsBadRequest() {
        when(userFavoriteRepository.existsByUserIdAndDestinationId(5L, 101L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.addFavorite(5L, 101L));
        verify(userFavoriteRepository, never()).save(any());
    }
}
