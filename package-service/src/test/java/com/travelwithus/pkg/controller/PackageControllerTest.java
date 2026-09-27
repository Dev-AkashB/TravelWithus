package com.travelwithus.pkg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.pkg.dto.SlotUpdateRequest;
import com.travelwithus.pkg.dto.TravelPackageDto;
import com.travelwithus.pkg.service.PackageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PackageController.class)
@AutoConfigureMockMvc(addFilters = false)
class PackageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PackageService packageService;

    @Test
    void testGetFeaturedPackages() throws Exception {
        TravelPackageDto dto = new TravelPackageDto(1L, "Paris Tour", 2L, "Paris", "Description",
                5, 4, new BigDecimal("1200.00"), 10, new BigDecimal("1080.00"),
                10, 8, "Hotel Paris", "Itinerary", List.of(), "http://img.jpg",
                List.of(), LocalDate.now(), LocalDate.now().plusDays(5), "ACTIVE", true, Instant.now(), Instant.now());

        when(packageService.getFeaturedPackages()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/packages/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Paris Tour"));
    }

    @Test
    void testReserveSlotsEndpoint() throws Exception {
        when(packageService.reserveSlots(1L, 2)).thenReturn(true);

        SlotUpdateRequest request = new SlotUpdateRequest(2);

        mockMvc.perform(post("/api/v1/packages/1/reserve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(true));
    }
}
