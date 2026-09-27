package com.travelwithus.destination.service;

import com.travelwithus.destination.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface DestinationService {
    List<DestinationDto> getPopularDestinations();
    List<DestinationDto> getDestinationsByCategory(String category);
    DestinationDto getDestinationById(Long id);
    PagedResponse<DestinationDto> searchDestinations(String keyword, String category, String country, String city, BigDecimal maxPrice, int page, int size, String sort);
    PagedResponse<DestinationDto> adminSearchDestinations(String keyword, int page, int size);
    DestinationDto createDestination(CreateDestinationRequest request);
    DestinationDto updateDestination(Long id, UpdateDestinationRequest request);
    void deleteDestination(Long id);
}
