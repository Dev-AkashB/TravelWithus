package com.travelwithus.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "hotel-service", fallback = HotelClientFallback.class)
public interface HotelClient {

    @PostMapping("/api/v1/hotels/rooms/{id}/reserve")
    void reserveRoom(@PathVariable("id") Long id, @RequestParam("count") int count);

    @PostMapping("/api/v1/hotels/rooms/{id}/release")
    void releaseRoom(@PathVariable("id") Long id, @RequestParam("count") int count);
}
