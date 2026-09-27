package com.travelwithus.destination.controller;

import com.travelwithus.destination.dto.*;
import com.travelwithus.destination.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    @Autowired
    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DestinationDto>>> searchDestinations(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "popular") String sort) {
        PagedResponse<DestinationDto> response = destinationService.searchDestinations(
                keyword, category, country, city, maxPrice, page, size, sort);
        return ResponseEntity.ok(ApiResponse.success("Destinations retrieved successfully", response));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<DestinationDto>>> getPopularDestinations() {
        List<DestinationDto> response = destinationService.getPopularDestinations();
        return ResponseEntity.ok(ApiResponse.success("Popular destinations retrieved successfully", response));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<DestinationDto>>> getDestinationsByCategory(@PathVariable String category) {
        List<DestinationDto> response = destinationService.getDestinationsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Destinations for category retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DestinationDto>> getDestinationById(@PathVariable Long id) {
        DestinationDto response = destinationService.getDestinationById(id);
        return ResponseEntity.ok(ApiResponse.success("Destination retrieved successfully", response));
    }

    // Admin Endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<PagedResponse<DestinationDto>>> adminGetAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<DestinationDto> response = destinationService.adminSearchDestinations(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success("Admin destination list retrieved", response));
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<DestinationDto>> createDestination(
            @Valid @RequestBody CreateDestinationRequest request) {
        DestinationDto created = destinationService.createDestination(request);
        return new ResponseEntity<>(ApiResponse.success("Destination created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<DestinationDto>> updateDestination(
            @PathVariable Long id,
            @RequestBody UpdateDestinationRequest request) {
        DestinationDto updated = destinationService.updateDestination(id, request);
        return ResponseEntity.ok(ApiResponse.success("Destination updated successfully", updated));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(ApiResponse.success("Destination deleted successfully", null));
    }
}
