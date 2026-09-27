package com.travelwithus.destination.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.destination.dto.DestinationDto;
import com.travelwithus.destination.service.DestinationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DestinationController.class)
@AutoConfigureMockMvc(addFilters = false)
class DestinationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DestinationService destinationService;

    @Test
    void testGetPopularDestinations() throws Exception {
        DestinationDto dto = new DestinationDto(1L, "Paris", "France", "Paris", "City of Light",
                "City", "http://paris.jpg", List.of(), List.of(), List.of(), "Summer",
                new BigDecimal("800.00"), new BigDecimal("3000.00"), true, true, Instant.now(), Instant.now());

        when(destinationService.getPopularDestinations()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/destinations/popular"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Paris"));
    }

    @Test
    void testGetDestinationById() throws Exception {
        DestinationDto dto = new DestinationDto(1L, "Paris", "France", "Paris", "City of Light",
                "City", "http://paris.jpg", List.of(), List.of(), List.of(), "Summer",
                new BigDecimal("800.00"), new BigDecimal("3000.00"), true, true, Instant.now(), Instant.now());

        when(destinationService.getDestinationById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/destinations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Paris"));
    }
}
