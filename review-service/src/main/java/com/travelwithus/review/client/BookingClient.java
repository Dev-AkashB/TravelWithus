package com.travelwithus.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "booking-service", fallback = BookingClientFallback.class)
public interface BookingClient {

    @GetMapping("/api/v1/bookings/user/{userId}")
    PageResponse<BookingResponse> getUserBookings(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "50") int size
    );
}
