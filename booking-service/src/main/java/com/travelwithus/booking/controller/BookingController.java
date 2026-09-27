package com.travelwithus.booking.controller;

import com.travelwithus.booking.dto.*;
import com.travelwithus.booking.entity.BookingStatus;
import com.travelwithus.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking Management", description = "Endpoints for creating, managing, and tracking travel reservations")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new booking reservation")
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        BookingResponseDto response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve booking by ID")
    public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/number/{bookingNumber}")
    @Operation(summary = "Retrieve booking by booking reference number")
    public ResponseEntity<BookingResponseDto> getBookingByNumber(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.getBookingByNumber(bookingNumber));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Retrieve all bookings for a user with pagination")
    public ResponseEntity<Page<BookingResponseDto>> getUserBookings(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.getUserBookings(userId, pageable));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an existing booking")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userIdHeader,
            @RequestParam(required = false) Long userId,
            @Valid @RequestBody CancelBookingRequest request) {
        Long resolvedUserId = userIdHeader != null ? userIdHeader : userId;
        return ResponseEntity.ok(bookingService.cancelBooking(id, resolvedUserId, request));
    }

    @PutMapping("/{bookingNumber}/payment-status")
    @Operation(summary = "Internal callback to update payment status and confirm booking")
    public ResponseEntity<BookingResponseDto> updatePaymentStatus(
            @PathVariable String bookingNumber,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(bookingService.updatePaymentStatus(bookingNumber, request));
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Admin endpoint: list all bookings with optional status filter")
    public ResponseEntity<Page<BookingResponseDto>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.getAllBookings(status, pageable));
    }

    @GetMapping("/admin/stats")
    @Operation(summary = "Admin endpoint: get booking analytics and revenue statistics")
    public ResponseEntity<BookingStatsDto> getBookingStats() {
        return ResponseEntity.ok(bookingService.getBookingStats());
    }
}
