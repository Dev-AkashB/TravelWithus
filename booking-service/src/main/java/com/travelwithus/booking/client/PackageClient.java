package com.travelwithus.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "package-service", fallback = PackageClientFallback.class)
public interface PackageClient {

    @PostMapping("/api/v1/packages/{id}/reserve-slots")
    void reserveSlots(@PathVariable("id") Long id, @RequestParam("count") int count);

    @PostMapping("/api/v1/packages/{id}/release-slots")
    void releaseSlots(@PathVariable("id") Long id, @RequestParam("count") int count);
}
