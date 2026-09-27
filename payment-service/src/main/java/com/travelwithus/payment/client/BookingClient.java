package com.travelwithus.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "booking-service", fallback = BookingClientFallback.class)
public interface BookingClient {

    @PutMapping("/api/v1/bookings/{bookingNumber}/payment-status")
    void updateBookingPaymentStatus(@PathVariable("bookingNumber") String bookingNumber,
                                   @RequestBody UpdatePaymentStatusRequest request);
}
