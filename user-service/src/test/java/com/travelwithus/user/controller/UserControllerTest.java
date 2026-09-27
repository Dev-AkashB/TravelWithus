package com.travelwithus.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.user.dto.FavoriteDto;
import com.travelwithus.user.dto.UpdateProfileRequest;
import com.travelwithus.user.dto.UserProfileDto;
import com.travelwithus.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void testGetProfileSuccess() throws Exception {
        UserProfileDto profileDto = new UserProfileDto(1L, 10L, "test@travelwithus.com", "John", "Doe",
                "+1234567890", "Street 1", "Paris", "France", null, "Bio", "ACTIVE", Instant.now(), Instant.now());

        when(userService.getProfile(eq(10L), eq("test@travelwithus.com"))).thenReturn(profileDto);

        mockMvc.perform(get("/api/v1/users/profile")
                        .header("X-User-Id", "10")
                        .header("X-User-Email", "test@travelwithus.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test@travelwithus.com"))
                .andExpect(jsonPath("$.data.firstName").value("John"));
    }

    @Test
    void testGetFavoritesSuccess() throws Exception {
        FavoriteDto fav = new FavoriteDto(1L, 10L, 201L, Instant.now());
        when(userService.getFavorites(10L)).thenReturn(List.of(fav));

        mockMvc.perform(get("/api/v1/users/favorites")
                        .header("X-User-Id", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].destinationId").value(201));
    }
}
