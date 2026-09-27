package com.travelwithus.destination.service;

import com.travelwithus.destination.dto.CreateDestinationRequest;
import com.travelwithus.destination.dto.DestinationDto;
import com.travelwithus.destination.dto.UpdateDestinationRequest;
import com.travelwithus.destination.entity.Destination;
import com.travelwithus.destination.exception.ResourceNotFoundException;
import com.travelwithus.destination.repository.DestinationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DestinationServiceTest {

    @Mock
    private DestinationRepository destinationRepository;

    @InjectMocks
    private DestinationServiceImpl destinationService;

    private Destination sampleDestination;

    @BeforeEach
    void setUp() {
        sampleDestination = new Destination("Bali", "Indonesia", "Denpasar", "Tropical island",
                "Island", "http://image.jpg", "April-Oct", new BigDecimal("500.00"), new BigDecimal("1500.00"), true);
        sampleDestination.setId(1L);
    }

    @Test
    void testGetPopularDestinations() {
        when(destinationRepository.findByPopularTrueAndActiveTrue()).thenReturn(List.of(sampleDestination));

        List<DestinationDto> list = destinationService.getPopularDestinations();

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Bali", list.get(0).getName());
    }

    @Test
    void testGetDestinationByIdSuccess() {
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(sampleDestination));

        DestinationDto dto = destinationService.getDestinationById(1L);

        assertNotNull(dto);
        assertEquals("Bali", dto.getName());
    }

    @Test
    void testGetDestinationByIdNotFoundThrowsException() {
        when(destinationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> destinationService.getDestinationById(99L));
    }

    @Test
    void testCreateDestinationSuccess() {
        CreateDestinationRequest request = new CreateDestinationRequest("Tokyo", "Japan", "Tokyo",
                "Metropolis", "City", "http://tokyo.jpg", List.of(), List.of("Tower"), List.of("Walk"),
                "Spring", new BigDecimal("600.00"), new BigDecimal("2000.00"), true);

        Destination saved = new Destination("Tokyo", "Japan", "Tokyo", "Metropolis", "City",
                "http://tokyo.jpg", "Spring", new BigDecimal("600.00"), new BigDecimal("2000.00"), true);
        saved.setId(2L);

        when(destinationRepository.save(any(Destination.class))).thenReturn(saved);

        DestinationDto result = destinationService.createDestination(request);

        assertNotNull(result);
        assertEquals("Tokyo", result.getName());
    }

    @Test
    void testDeleteDestinationSoftDeletes() {
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(sampleDestination));
        when(destinationRepository.save(any(Destination.class))).thenReturn(sampleDestination);

        destinationService.deleteDestination(1L);

        assertFalse(sampleDestination.isActive());
        verify(destinationRepository).save(sampleDestination);
    }
}
