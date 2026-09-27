package com.travelwithus.booking.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.travelwithus.booking.dto.BookingResponseDto;
import com.travelwithus.booking.dto.CreateBookingRequest;
import com.travelwithus.booking.dto.TravelerDto;
import com.travelwithus.booking.entity.BookingStatus;
import com.travelwithus.booking.entity.BookingType;
import com.travelwithus.booking.entity.PaymentStatus;
import com.travelwithus.booking.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void testCreateBookingEndpoint() throws Exception {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setUserId(1L);
        request.setCustomerEmail("traveler@travelwithus.com");
        request.setCustomerName("Alex Mercer");
        request.setBookingType(BookingType.PACKAGE);
        request.setItemReferenceId(10L);
        request.setItemTitle("Bali Tropical Paradise & Cultural Discovery");
        request.setStartDate(LocalDate.now().plusDays(10));
        request.setEndDate(LocalDate.now().plusDays(17));
        request.setNumberOfGuests(1);
        request.setTotalAmount(new BigDecimal("1299.00"));
        request.setTravelers(List.of(new TravelerDto("Alex Mercer", 32, "Male", "P12345678", true)));

        BookingResponseDto response = new BookingResponseDto();
        response.setId(1L);
        response.setBookingNumber("TWU-BKG-ABCD1234");
        response.setUserId(1L);
        response.setStatus(BookingStatus.PENDING);
        response.setPaymentStatus(PaymentStatus.PENDING);
        response.setTotalAmount(new BigDecimal("1299.00"));

        when(bookingService.createBooking(any(CreateBookingRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingNumber").value("TWU-BKG-ABCD1234"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void testGetBookingByIdEndpoint() throws Exception {
        BookingResponseDto response = new BookingResponseDto();
        response.setId(1L);
        response.setBookingNumber("TWU-BKG-ABCD1234");
        response.setStatus(BookingStatus.CONFIRMED);

        when(bookingService.getBookingById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/bookings/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingNumber").value("TWU-BKG-ABCD1234"))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }
}
