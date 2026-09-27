package com.travelwithus.pkg.service;

import com.travelwithus.pkg.dto.*;
import com.travelwithus.pkg.entity.TravelPackage;
import com.travelwithus.pkg.exception.BadRequestException;
import com.travelwithus.pkg.exception.ResourceNotFoundException;
import com.travelwithus.pkg.repository.TravelPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackageServiceImpl implements PackageService {

    private final TravelPackageRepository packageRepository;

    @Autowired
    public PackageServiceImpl(TravelPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @Override
    @Cacheable(value = "featuredPackages", key = "'all'")
    public List<TravelPackageDto> getFeaturedPackages() {
        return packageRepository.findByFeaturedTrueAndStatus("ACTIVE").stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TravelPackageDto> getPackagesByDestination(Long destinationId) {
        return packageRepository.findByDestinationIdAndStatus(destinationId, "ACTIVE").stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TravelPackageDto getPackageById(Long id) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Travel package not found with id: " + id));
        return mapToDto(pkg);
    }

    @Override
    public PagedResponse<TravelPackageDto> searchPackages(String destination, BigDecimal minPrice, BigDecimal maxPrice,
                                                         Integer durationDays, int page, int size, String sort) {
        Sort sortOrder = Sort.by("featured").descending().and(Sort.by("id").descending());
        if ("priceAsc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("price").ascending();
        } else if ("priceDesc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("price").descending();
        } else if ("duration".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("durationDays").ascending();
        }

        PageRequest pageRequest = PageRequest.of(page, size, sortOrder);
        Page<TravelPackage> pageResult = packageRepository.searchPackages(
                destination != null && !destination.isBlank() ? destination.trim() : null,
                minPrice,
                maxPrice,
                durationDays,
                pageRequest
        );

        List<TravelPackageDto> dtos = pageResult.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Override
    public PagedResponse<TravelPackageDto> adminSearchPackages(String keyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        Page<TravelPackage> pageResult = packageRepository.adminSearchPackages(
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                pageRequest
        );

        List<TravelPackageDto> dtos = pageResult.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Override
    @Transactional
    @CacheEvict(value = "featuredPackages", allEntries = true)
    public TravelPackageDto createPackage(CreatePackageRequest request) {
        TravelPackage pkg = new TravelPackage();
        pkg.setTitle(request.getTitle().trim());
        pkg.setDestinationId(request.getDestinationId());
        pkg.setDestinationName(request.getDestinationName().trim());
        pkg.setDescription(request.getDescription().trim());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setDurationNights(request.getDurationNights() > 0 ? request.getDurationNights() : request.getDurationDays() - 1);
        pkg.setPrice(request.getPrice());
        pkg.setDiscountPercent(request.getDiscountPercent());
        pkg.setMaxTravelers(request.getMaxTravelers());
        pkg.setAvailableSlots(request.getMaxTravelers()); // initially all slots available
        pkg.setHotelInfo(request.getHotelInfo());
        pkg.setItinerary(request.getItinerary());
        pkg.setActivities(listToCsv(request.getActivities()));
        pkg.setImageUrl(request.getImageUrl());
        pkg.setGalleryUrls(listToCsv(request.getGalleryUrls()));
        pkg.setStartDate(request.getStartDate());
        pkg.setEndDate(request.getEndDate());
        pkg.setFeatured(request.isFeatured());
        pkg.setStatus("ACTIVE");

        TravelPackage saved = packageRepository.save(pkg);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "featuredPackages", allEntries = true)
    public TravelPackageDto updatePackage(Long id, UpdatePackageRequest request) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Travel package not found with id: " + id));

        if (request.getTitle() != null) pkg.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) pkg.setDescription(request.getDescription().trim());
        if (request.getDurationDays() != null) pkg.setDurationDays(request.getDurationDays());
        if (request.getDurationNights() != null) pkg.setDurationNights(request.getDurationNights());
        if (request.getPrice() != null) pkg.setPrice(request.getPrice());
        if (request.getDiscountPercent() != null) pkg.setDiscountPercent(request.getDiscountPercent());
        if (request.getMaxTravelers() != null) pkg.setMaxTravelers(request.getMaxTravelers());
        if (request.getAvailableSlots() != null) pkg.setAvailableSlots(request.getAvailableSlots());
        if (request.getHotelInfo() != null) pkg.setHotelInfo(request.getHotelInfo());
        if (request.getItinerary() != null) pkg.setItinerary(request.getItinerary());
        if (request.getActivities() != null) pkg.setActivities(listToCsv(request.getActivities()));
        if (request.getImageUrl() != null) pkg.setImageUrl(request.getImageUrl());
        if (request.getGalleryUrls() != null) pkg.setGalleryUrls(listToCsv(request.getGalleryUrls()));
        if (request.getStartDate() != null) pkg.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) pkg.setEndDate(request.getEndDate());
        if (request.getStatus() != null) pkg.setStatus(request.getStatus().toUpperCase());
        if (request.getFeatured() != null) pkg.setFeatured(request.getFeatured());

        TravelPackage saved = packageRepository.save(pkg);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "featuredPackages", allEntries = true)
    public void deletePackage(Long id) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Travel package not found with id: " + id));
        pkg.setStatus("CANCELLED");
        packageRepository.save(pkg);
    }

    @Override
    @Transactional
    public boolean reserveSlots(Long id, int count) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));

        if (pkg.getAvailableSlots() < count) {
            throw new BadRequestException("Insufficient package slots available. Requested: " + count + ", Available: " + pkg.getAvailableSlots());
        }

        pkg.setAvailableSlots(pkg.getAvailableSlots() - count);
        if (pkg.getAvailableSlots() == 0) {
            pkg.setStatus("SOLD_OUT");
        }
        packageRepository.save(pkg);
        return true;
    }

    @Override
    @Transactional
    public void releaseSlots(Long id, int count) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));

        pkg.setAvailableSlots(Math.min(pkg.getMaxTravelers(), pkg.getAvailableSlots() + count));
        if ("SOLD_OUT".equals(pkg.getStatus()) && pkg.getAvailableSlots() > 0) {
            pkg.setStatus("ACTIVE");
        }
        packageRepository.save(pkg);
    }

    private TravelPackageDto mapToDto(TravelPackage p) {
        BigDecimal discountedPrice = p.getPrice();
        if (p.getDiscountPercent() > 0) {
            BigDecimal factor = BigDecimal.valueOf(100 - p.getDiscountPercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            discountedPrice = p.getPrice().multiply(factor).setScale(2, RoundingMode.HALF_UP);
        }

        return new TravelPackageDto(
                p.getId(),
                p.getTitle(),
                p.getDestinationId(),
                p.getDestinationName(),
                p.getDescription(),
                p.getDurationDays(),
                p.getDurationNights(),
                p.getPrice(),
                p.getDiscountPercent(),
                discountedPrice,
                p.getMaxTravelers(),
                p.getAvailableSlots(),
                p.getHotelInfo(),
                p.getItinerary(),
                csvToList(p.getActivities()),
                p.getImageUrl(),
                csvToList(p.getGalleryUrls()),
                p.getStartDate(),
                p.getEndDate(),
                p.getStatus(),
                p.isFeatured(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }

    private String listToCsv(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        return String.join(";", list);
    }

    private List<String> csvToList(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptyList();
        return Arrays.stream(csv.split(";"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
