package com.travelwithus.review.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class BookingClientFallback implements BookingClient {

    private static final Logger log = LoggerFactory.getLogger(BookingClientFallback.class);

    @Override
    public PageResponse<BookingResponse> getUserBookings(Long userId, int page, int size) {
        log.warn("BookingClient fallback: could not reach booking-service for user={}", userId);
        PageResponse<BookingResponse> empty = new PageResponse<>();
        empty.setContent(Collections.emptyList());
        return empty;
    }
}
