package com.travelwithus.destination.service;

import com.travelwithus.destination.dto.*;
import com.travelwithus.destination.entity.Destination;
import com.travelwithus.destination.exception.ResourceNotFoundException;
import com.travelwithus.destination.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;

    @Autowired
    public DestinationServiceImpl(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    @Cacheable(value = "popularDestinations", key = "'all'")
    public List<DestinationDto> getPopularDestinations() {
        return destinationRepository.findByPopularTrueAndActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DestinationDto> getDestinationsByCategory(String category) {
        return destinationRepository.findByCategoryIgnoreCaseAndActiveTrue(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DestinationDto getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
        return mapToDto(destination);
    }

    @Override
    public PagedResponse<DestinationDto> searchDestinations(String keyword, String category, String country, String city,
                                                           BigDecimal maxPrice, int page, int size, String sort) {
        Sort sortOrder = Sort.by("popular").descending().and(Sort.by("name").ascending());
        if ("priceAsc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("minPrice").ascending();
        } else if ("priceDesc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("minPrice").descending();
        } else if ("name".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("name").ascending();
        }

        PageRequest pageRequest = PageRequest.of(page, size, sortOrder);
        Page<Destination> pageResult = destinationRepository.searchDestinations(
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                category != null && !category.isBlank() ? category.trim() : null,
                country != null && !country.isBlank() ? country.trim() : null,
                city != null && !city.isBlank() ? city.trim() : null,
                maxPrice,
                pageRequest
        );

        List<DestinationDto> dtos = pageResult.getContent().stream()
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
    public PagedResponse<DestinationDto> adminSearchDestinations(String keyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Destination> pageResult = destinationRepository.adminSearchDestinations(
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                pageRequest
        );

        List<DestinationDto> dtos = pageResult.getContent().stream()
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
    @CacheEvict(value = "popularDestinations", allEntries = true)
    public DestinationDto createDestination(CreateDestinationRequest request) {
        Destination destination = new Destination();
        destination.setName(request.getName().trim());
        destination.setCountry(request.getCountry().trim());
        destination.setCity(request.getCity().trim());
        destination.setDescription(request.getDescription().trim());
        destination.setCategory(request.getCategory().trim());
        destination.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);
        destination.setGalleryUrls(listToCsv(request.getGalleryUrls()));
        destination.setAttractions(listToCsv(request.getAttractions()));
        destination.setActivities(listToCsv(request.getActivities()));
        destination.setBestTimeToVisit(request.getBestTimeToVisit() != null ? request.getBestTimeToVisit().trim() : null);
        destination.setMinPrice(request.getMinPrice());
        destination.setMaxPrice(request.getMaxPrice());
        destination.setPopular(request.isPopular());
        destination.setActive(true);

        Destination saved = destinationRepository.save(destination);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "popularDestinations", allEntries = true)
    public DestinationDto updateDestination(Long id, UpdateDestinationRequest request) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        if (request.getName() != null) destination.setName(request.getName().trim());
        if (request.getCountry() != null) destination.setCountry(request.getCountry().trim());
        if (request.getCity() != null) destination.setCity(request.getCity().trim());
        if (request.getDescription() != null) destination.setDescription(request.getDescription().trim());
        if (request.getCategory() != null) destination.setCategory(request.getCategory().trim());
        if (request.getImageUrl() != null) destination.setImageUrl(request.getImageUrl().trim());
        if (request.getGalleryUrls() != null) destination.setGalleryUrls(listToCsv(request.getGalleryUrls()));
        if (request.getAttractions() != null) destination.setAttractions(listToCsv(request.getAttractions()));
        if (request.getActivities() != null) destination.setActivities(listToCsv(request.getActivities()));
        if (request.getBestTimeToVisit() != null) destination.setBestTimeToVisit(request.getBestTimeToVisit().trim());
        if (request.getMinPrice() != null) destination.setMinPrice(request.getMinPrice());
        if (request.getMaxPrice() != null) destination.setMaxPrice(request.getMaxPrice());
        if (request.getPopular() != null) destination.setPopular(request.getPopular());
        if (request.getActive() != null) destination.setActive(request.getActive());

        Destination saved = destinationRepository.save(destination);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "popularDestinations", allEntries = true)
    public void deleteDestination(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
        destination.setActive(false); // Soft delete
        destinationRepository.save(destination);
    }

    private DestinationDto mapToDto(Destination d) {
        return new DestinationDto(
                d.getId(),
                d.getName(),
                d.getCountry(),
                d.getCity(),
                d.getDescription(),
                d.getCategory(),
                d.getImageUrl(),
                csvToList(d.getGalleryUrls()),
                csvToList(d.getAttractions()),
                csvToList(d.getActivities()),
                d.getBestTimeToVisit(),
                d.getMinPrice(),
                d.getMaxPrice(),
                d.isPopular(),
                d.isActive(),
                d.getCreatedAt(),
                d.getUpdatedAt()
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
