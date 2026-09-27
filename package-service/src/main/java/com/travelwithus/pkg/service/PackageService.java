package com.travelwithus.pkg.service;

import com.travelwithus.pkg.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface PackageService {
    List<TravelPackageDto> getFeaturedPackages();
    List<TravelPackageDto> getPackagesByDestination(Long destinationId);
    TravelPackageDto getPackageById(Long id);
    PagedResponse<TravelPackageDto> searchPackages(String destination, BigDecimal minPrice, BigDecimal maxPrice, Integer durationDays, int page, int size, String sort);
    PagedResponse<TravelPackageDto> adminSearchPackages(String keyword, int page, int size);
    TravelPackageDto createPackage(CreatePackageRequest request);
    TravelPackageDto updatePackage(Long id, UpdatePackageRequest request);
    void deletePackage(Long id);
    boolean reserveSlots(Long id, int count);
    void releaseSlots(Long id, int count);
}
