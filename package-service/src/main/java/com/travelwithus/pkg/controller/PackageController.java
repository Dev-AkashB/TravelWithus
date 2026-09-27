package com.travelwithus.pkg.controller;

import com.travelwithus.pkg.dto.*;
import com.travelwithus.pkg.service.PackageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/packages")
public class PackageController {

    private final PackageService packageService;

    @Autowired
    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TravelPackageDto>>> searchPackages(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer durationDays,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "featured") String sort) {
        PagedResponse<TravelPackageDto> result = packageService.searchPackages(
                destination, minPrice, maxPrice, durationDays, page, size, sort);
        return ResponseEntity.ok(ApiResponse.success("Packages retrieved successfully", result));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<TravelPackageDto>>> getFeaturedPackages() {
        List<TravelPackageDto> result = packageService.getFeaturedPackages();
        return ResponseEntity.ok(ApiResponse.success("Featured packages retrieved successfully", result));
    }

    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<ApiResponse<List<TravelPackageDto>>> getPackagesByDestination(@PathVariable Long destinationId) {
        List<TravelPackageDto> result = packageService.getPackagesByDestination(destinationId);
        return ResponseEntity.ok(ApiResponse.success("Packages for destination retrieved successfully", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TravelPackageDto>> getPackageById(@PathVariable Long id) {
        TravelPackageDto result = packageService.getPackageById(id);
        return ResponseEntity.ok(ApiResponse.success("Package retrieved successfully", result));
    }

    @PostMapping("/{id}/reserve")
    public ResponseEntity<ApiResponse<Boolean>> reserveSlots(
            @PathVariable Long id,
            @Valid @RequestBody SlotUpdateRequest request) {
        boolean success = packageService.reserveSlots(id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Slots reserved successfully", success));
    }

    @PostMapping("/{id}/release")
    public ResponseEntity<ApiResponse<Void>> releaseSlots(
            @PathVariable Long id,
            @Valid @RequestBody SlotUpdateRequest request) {
        packageService.releaseSlots(id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Slots released successfully", null));
    }

    // Admin Endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<PagedResponse<TravelPackageDto>>> adminGetAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<TravelPackageDto> result = packageService.adminSearchPackages(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success("Admin packages retrieved", result));
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<TravelPackageDto>> createPackage(
            @Valid @RequestBody CreatePackageRequest request) {
        TravelPackageDto created = packageService.createPackage(request);
        return new ResponseEntity<>(ApiResponse.success("Package created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<TravelPackageDto>> updatePackage(
            @PathVariable Long id,
            @RequestBody UpdatePackageRequest request) {
        TravelPackageDto updated = packageService.updatePackage(id, request);
        return ResponseEntity.ok(ApiResponse.success("Package updated successfully", updated));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.ok(ApiResponse.success("Package cancelled successfully", null));
    }
}
