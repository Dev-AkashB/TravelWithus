package com.travelwithus.booking.service;

import com.travelwithus.booking.client.HotelClient;
import com.travelwithus.booking.client.PackageClient;
import com.travelwithus.booking.dto.CancelBookingRequest;
import com.travelwithus.booking.dto.CreateBookingRequest;
import com.travelwithus.booking.dto.TravelerDto;
import com.travelwithus.booking.dto.UpdatePaymentStatusRequest;
import com.travelwithus.booking.entity.Booking;
import com.travelwithus.booking.entity.BookingStatus;
import com.travelwithus.booking.entity.BookingType;
import com.travelwithus.booking.entity.PaymentStatus;
import com.travelwithus.booking.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PackageClient packageClient;

    @Mock
    private HotelClient hotelClient;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private CreateBookingRequest createRequest;

    @BeforeEach
    void setUp() {
        createRequest = new CreateBookingRequest();
        createRequest.setUserId(1L);
        createRequest.setCustomerEmail("traveler@travelwithus.com");
        createRequest.setCustomerName("Alex Mercer");
        createRequest.setBookingType(BookingType.PACKAGE);
        createRequest.setItemReferenceId(10L);
        createRequest.setItemTitle("Bali Tropical Paradise & Cultural Discovery");
        createRequest.setStartDate(LocalDate.now().plusDays(10));
        createRequest.setEndDate(LocalDate.now().plusDays(17));
        createRequest.setNumberOfGuests(2);
        createRequest.setTotalAmount(new BigDecimal("2598.00"));
        createRequest.setTravelers(List.of(
                new TravelerDto("Alex Mercer", 32, "Male", "P12345678", true),
                new TravelerDto("Elena Mercer", 30, "Female", "P87654321", false)
        ));
    }

    @Test
    void testCreateBooking_Success() {
        when(bookingRepository.findByBookingNumber(any())).thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(100L);
            return b;
        });

        var response = bookingService.createBooking(createRequest);

        assertNotNull(response);
        assertNotNull(response.getBookingNumber());
        assertEquals("Bali Tropical Paradise & Cultural Discovery", response.getItemTitle());
        assertEquals(BookingStatus.PENDING, response.getStatus());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());
        assertEquals(2, response.getTravelers().size());

        verify(packageClient, times(1)).reserveSlots(eq(10L), eq(2));
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void testCancelBooking_Success() {
        Booking booking = new Booking();
        booking.setId(100L);
        booking.setBookingNumber("TWU-BKG-TEST1234");
        booking.setUserId(1L);
        booking.setBookingType(BookingType.PACKAGE);
        booking.setItemReferenceId(10L);
        booking.setNumberOfGuests(2);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.PAID);

        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = bookingService.cancelBooking(100L, 1L, new CancelBookingRequest("Plans changed"));

        assertEquals(BookingStatus.CANCELLED, response.getStatus());
        assertEquals(PaymentStatus.REFUNDED, response.getPaymentStatus());
        assertEquals("Plans changed", response.getCancellationReason());
        verify(packageClient, times(1)).releaseSlots(eq(10L), eq(2));
    }

    @Test
    void testUpdatePaymentStatus_Confirmed() {
        Booking booking = new Booking();
        booking.setId(100L);
        booking.setBookingNumber("TWU-BKG-TEST1234");
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        when(bookingRepository.findByBookingNumber("TWU-BKG-TEST1234")).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = bookingService.updatePaymentStatus("TWU-BKG-TEST1234",
                new UpdatePaymentStatusRequest(PaymentStatus.PAID, "TXN-998877"));

        assertEquals(PaymentStatus.PAID, response.getPaymentStatus());
        assertEquals(BookingStatus.CONFIRMED, response.getStatus());
        assertEquals("TXN-998877", response.getPaymentTransactionId());
    }
}
