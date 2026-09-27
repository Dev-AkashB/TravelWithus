package com.travelwithus.payment.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class BookingClientFallback implements BookingClient {

    private static final Logger log = LoggerFactory.getLogger(BookingClientFallback.class);

    @Override
    public void updateBookingPaymentStatus(String bookingNumber, UpdatePaymentStatusRequest request) {
        log.warn("BookingClient fallback: could not reach booking-service to update bookingNumber={}, status={}",
                bookingNumber, request.getPaymentStatus());
    }
}
