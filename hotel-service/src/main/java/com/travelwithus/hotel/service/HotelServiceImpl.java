package com.travelwithus.hotel.service;

import com.travelwithus.hotel.dto.*;
import com.travelwithus.hotel.entity.Hotel;
import com.travelwithus.hotel.entity.RoomType;
import com.travelwithus.hotel.exception.BadRequestException;
import com.travelwithus.hotel.exception.ResourceNotFoundException;
import com.travelwithus.hotel.repository.HotelRepository;
import com.travelwithus.hotel.repository.RoomTypeRepository;
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
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    public HotelServiceImpl(HotelRepository hotelRepository, RoomTypeRepository roomTypeRepository) {
        this.hotelRepository = hotelRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    @Override
    public PagedResponse<HotelDto> searchHotels(String city, Long destinationId, BigDecimal minRating,
                                               BigDecimal maxPrice, int page, int size, String sort) {
        Sort sortOrder = Sort.by("rating").descending().and(Sort.by("starRating").descending());
        if ("priceAsc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("startingPrice").ascending();
        } else if ("priceDesc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("startingPrice").descending();
        } else if ("rating".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by("rating").descending();
        }

        PageRequest pageRequest = PageRequest.of(page, size, sortOrder);
        Page<Hotel> pageResult = hotelRepository.searchHotels(
                city != null && !city.isBlank() ? city.trim() : null,
                destinationId,
                minRating,
                maxPrice,
                pageRequest
        );

        List<HotelDto> dtos = pageResult.getContent().stream()
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
    public PagedResponse<HotelDto> adminSearchHotels(String keyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Hotel> pageResult = hotelRepository.adminSearchHotels(
                keyword != null && !keyword.isBlank() ? keyword.trim() : null,
                pageRequest
        );

        List<HotelDto> dtos = pageResult.getContent().stream()
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
    @Cacheable(value = "hotelsByDestination", key = "#destinationId")
    public List<HotelDto> getHotelsByDestination(Long destinationId) {
        return hotelRepository.findByDestinationIdAndActiveTrue(destinationId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public HotelDto getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToDto(hotel);
    }

    @Override
    @Transactional
    @CacheEvict(value = "hotelsByDestination", allEntries = true)
    public HotelDto createHotel(CreateHotelRequest request) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName().trim());
        hotel.setDestinationId(request.getDestinationId());
        hotel.setDestinationName(request.getDestinationName().trim());
        hotel.setCity(request.getCity().trim());
        hotel.setCountry(request.getCountry().trim());
        hotel.setAddress(request.getAddress());
        hotel.setStarRating(request.getStarRating());
        hotel.setDescription(request.getDescription().trim());
        hotel.setAmenities(listToCsv(request.getAmenities()));
        hotel.setImageUrl(request.getImageUrl());
        hotel.setGalleryUrls(listToCsv(request.getGalleryUrls()));
        hotel.setStartingPrice(request.getStartingPrice());
        hotel.setActive(true);

        Hotel saved = hotelRepository.save(hotel);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "hotelsByDestination", allEntries = true)
    public HotelDto updateHotel(Long id, UpdateHotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        if (request.getName() != null) hotel.setName(request.getName().trim());
        if (request.getAddress() != null) hotel.setAddress(request.getAddress().trim());
        if (request.getStarRating() != null) hotel.setStarRating(request.getStarRating());
        if (request.getDescription() != null) hotel.setDescription(request.getDescription().trim());
        if (request.getAmenities() != null) hotel.setAmenities(listToCsv(request.getAmenities()));
        if (request.getImageUrl() != null) hotel.setImageUrl(request.getImageUrl().trim());
        if (request.getGalleryUrls() != null) hotel.setGalleryUrls(listToCsv(request.getGalleryUrls()));
        if (request.getStartingPrice() != null) hotel.setStartingPrice(request.getStartingPrice());
        if (request.getActive() != null) hotel.setActive(request.getActive());

        Hotel saved = hotelRepository.save(hotel);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "hotelsByDestination", allEntries = true)
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        hotel.setActive(false);
        hotelRepository.save(hotel);
    }

    @Override
    @Transactional
    public RoomTypeDto addRoomType(Long hotelId, CreateRoomTypeRequest request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        RoomType roomType = new RoomType();
        roomType.setHotel(hotel);
        roomType.setName(request.getName().trim());
        roomType.setDescription(request.getDescription());
        roomType.setCapacity(request.getCapacity());
        roomType.setPricePerNight(request.getPricePerNight());
        roomType.setTotalRooms(request.getTotalRooms());
        roomType.setAvailableRooms(request.getTotalRooms());
        roomType.setBedType(request.getBedType());
        roomType.setSizeSqMeters(request.getSizeSqMeters());
        roomType.setImageUrl(request.getImageUrl());
        roomType.setAmenities(listToCsv(request.getAmenities()));

        RoomType saved = roomTypeRepository.save(roomType);
        return mapRoomTypeToDto(saved);
    }

    @Override
    public List<RoomTypeDto> getRoomTypes(Long hotelId) {
        return roomTypeRepository.findByHotelId(hotelId).stream()
                .map(this::mapRoomTypeToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean reserveRooms(Long roomTypeId, int count) {
        RoomType room = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + roomTypeId));

        if (room.getAvailableRooms() < count) {
            throw new BadRequestException("Insufficient rooms available. Requested: " + count + ", Available: " + room.getAvailableRooms());
        }

        room.setAvailableRooms(room.getAvailableRooms() - count);
        roomTypeRepository.save(room);
        return true;
    }

    @Override
    @Transactional
    public void releaseRooms(Long roomTypeId, int count) {
        RoomType room = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found with id: " + roomTypeId));

        room.setAvailableRooms(Math.min(room.getTotalRooms(), room.getAvailableRooms() + count));
        roomTypeRepository.save(room);
    }

    private HotelDto mapToDto(Hotel h) {
        List<RoomTypeDto> rooms = h.getRoomTypes() != null
                ? h.getRoomTypes().stream().map(this::mapRoomTypeToDto).collect(Collectors.toList())
                : Collections.emptyList();

        return new HotelDto(
                h.getId(),
                h.getName(),
                h.getDestinationId(),
                h.getDestinationName(),
                h.getCity(),
                h.getCountry(),
                h.getAddress(),
                h.getStarRating(),
                h.getRating(),
                h.getTotalReviews(),
                h.getDescription(),
                csvToList(h.getAmenities()),
                h.getImageUrl(),
                csvToList(h.getGalleryUrls()),
                h.getStartingPrice(),
                h.isActive(),
                rooms,
                h.getCreatedAt(),
                h.getUpdatedAt()
        );
    }

    private RoomTypeDto mapRoomTypeToDto(RoomType r) {
        return new RoomTypeDto(
                r.getId(),
                r.getHotel() != null ? r.getHotel().getId() : null,
                r.getName(),
                r.getDescription(),
                r.getCapacity(),
                r.getPricePerNight(),
                r.getTotalRooms(),
                r.getAvailableRooms(),
                r.getBedType(),
                r.getSizeSqMeters(),
                r.getImageUrl(),
                csvToList(r.getAmenities())
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
