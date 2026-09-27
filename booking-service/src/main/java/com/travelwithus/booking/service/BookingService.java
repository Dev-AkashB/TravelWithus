package com.travelwithus.booking.service;

import com.travelwithus.booking.dto.*;
import com.travelwithus.booking.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {

    BookingResponseDto createBooking(CreateBookingRequest request);

    BookingResponseDto getBookingById(Long id);

    BookingResponseDto getBookingByNumber(String bookingNumber);

    Page<BookingResponseDto> getUserBookings(Long userId, Pageable pageable);

    BookingResponseDto cancelBooking(Long id, Long userId, CancelBookingRequest request);

    BookingResponseDto updatePaymentStatus(String bookingNumber, UpdatePaymentStatusRequest request);

    Page<BookingResponseDto> getAllBookings(BookingStatus status, Pageable pageable);

    BookingStatsDto getBookingStats();
}
