package com.travelwithus.pkg.service;

import com.travelwithus.pkg.dto.CreatePackageRequest;
import com.travelwithus.pkg.dto.TravelPackageDto;
import com.travelwithus.pkg.entity.TravelPackage;
import com.travelwithus.pkg.exception.BadRequestException;
import com.travelwithus.pkg.exception.ResourceNotFoundException;
import com.travelwithus.pkg.repository.TravelPackageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageServiceTest {

    @Mock
    private TravelPackageRepository packageRepository;

    @InjectMocks
    private PackageServiceImpl packageService;

    private TravelPackage samplePackage;

    @BeforeEach
    void setUp() {
        samplePackage = new TravelPackage("Bali Dream", 1L, "Bali", "Great tour",
                7, 6, new BigDecimal("1000.00"), 10, 10, 5,
                "Hotel Bali", "Itinerary", "Surfing", "http://image.jpg",
                LocalDate.now(), LocalDate.now().plusDays(7), true);
        samplePackage.setId(10L);
    }

    @Test
    void testGetFeaturedPackages() {
        when(packageRepository.findByFeaturedTrueAndStatus("ACTIVE")).thenReturn(List.of(samplePackage));

        List<TravelPackageDto> result = packageService.getFeaturedPackages();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Bali Dream", result.get(0).getTitle());
        // Verify discount calculation (1000 - 10% = 900)
        assertEquals(new BigDecimal("900.00"), result.get(0).getDiscountedPrice());
    }

    @Test
    void testGetPackageByIdSuccess() {
        when(packageRepository.findById(10L)).thenReturn(Optional.of(samplePackage));

        TravelPackageDto dto = packageService.getPackageById(10L);

        assertNotNull(dto);
        assertEquals(10L, dto.getId());
    }

    @Test
    void testGetPackageByIdNotFound() {
        when(packageRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> packageService.getPackageById(99L));
    }

    @Test
    void testReserveSlotsSuccess() {
        when(packageRepository.findById(10L)).thenReturn(Optional.of(samplePackage));
        when(packageRepository.save(any(TravelPackage.class))).thenReturn(samplePackage);

        boolean reserved = packageService.reserveSlots(10L, 2);

        assertTrue(reserved);
        assertEquals(3, samplePackage.getAvailableSlots());
    }

    @Test
    void testReserveSlotsInsufficientThrowsException() {
        when(packageRepository.findById(10L)).thenReturn(Optional.of(samplePackage));

        assertThrows(BadRequestException.class, () -> packageService.reserveSlots(10L, 10));
    }

    @Test
    void testReleaseSlots() {
        when(packageRepository.findById(10L)).thenReturn(Optional.of(samplePackage));
        when(packageRepository.save(any(TravelPackage.class))).thenReturn(samplePackage);

        packageService.releaseSlots(10L, 2);

        assertEquals(7, samplePackage.getAvailableSlots());
    }
}
