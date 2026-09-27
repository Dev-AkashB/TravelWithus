package com.travelwithus.hotel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.hotel.dto.HotelDto;
import com.travelwithus.hotel.dto.RoomReservationRequest;
import com.travelwithus.hotel.service.HotelService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HotelController.class)
@AutoConfigureMockMvc(addFilters = false)
class HotelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private HotelService hotelService;

    @Test
    void testGetHotelsByDestination() throws Exception {
        HotelDto dto = new HotelDto(1L, "Grand Hotel", 1L, "Bali", "Ubud", "Indonesia",
                "Address", 5, new BigDecimal("4.8"), 150, "Description",
                List.of(), "http://img.jpg", List.of(), new BigDecimal("300.00"), true, List.of(),
                Instant.now(), Instant.now());

        when(hotelService.getHotelsByDestination(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/hotels/destination/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Grand Hotel"));
    }

    @Test
    void testReserveRoomsEndpoint() throws Exception {
        when(hotelService.reserveRooms(10L, 2)).thenReturn(true);

        RoomReservationRequest request = new RoomReservationRequest(2);

        mockMvc.perform(post("/api/v1/hotels/rooms/10/reserve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(true));
    }
}
