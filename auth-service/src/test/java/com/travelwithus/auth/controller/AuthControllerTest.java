package com.travelwithus.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.auth.dto.AuthResponse;
import com.travelwithus.auth.dto.LoginRequest;
import com.travelwithus.auth.dto.RegisterRequest;
import com.travelwithus.auth.security.JwtAuthenticationFilter;
import com.travelwithus.auth.security.JwtTokenProvider;
import com.travelwithus.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void testRegisterEndpointSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest("bob@example.com", "Password@123", "Bob", "Smith", "+1234567890");
        AuthResponse response = new AuthResponse("access-token-123", "refresh-token-123", 86400000L, 1L, "bob@example.com", "Bob", "Smith", List.of("ROLE_USER"));

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("bob@example.com"))
                .andExpect(jsonPath("$.data.accessToken").value("access-token-123"));
    }

    @Test
    void testLoginEndpointSuccess() throws Exception {
        LoginRequest request = new LoginRequest("bob@example.com", "Password@123");
        AuthResponse response = new AuthResponse("access-token-123", "refresh-token-123", 86400000L, 1L, "bob@example.com", "Bob", "Smith", List.of("ROLE_USER"));

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("access-token-123"));
    }
}
