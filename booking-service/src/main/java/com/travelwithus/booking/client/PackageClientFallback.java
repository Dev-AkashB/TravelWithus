package com.travelwithus.booking.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PackageClientFallback implements PackageClient {

    private static final Logger log = LoggerFactory.getLogger(PackageClientFallback.class);

    @Override
    public void reserveSlots(Long id, int count) {
        log.warn("PackageClient fallback: could not contact package-service for reserveSlots id={}, count={}", id, count);
    }

    @Override
    public void releaseSlots(Long id, int count) {
        log.warn("PackageClient fallback: could not contact package-service for releaseSlots id={}, count={}", id, count);
    }
}
