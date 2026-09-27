package com.travelwithus.booking.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class HotelClientFallback implements HotelClient {

    private static final Logger log = LoggerFactory.getLogger(HotelClientFallback.class);

    @Override
    public void reserveRoom(Long id, int count) {
        log.warn("HotelClient fallback: could not contact hotel-service for reserveRoom id={}, count={}", id, count);
    }

    @Override
    public void releaseRoom(Long id, int count) {
        log.warn("HotelClient fallback: could not contact hotel-service for releaseRoom id={}, count={}", id, count);
    }
}
