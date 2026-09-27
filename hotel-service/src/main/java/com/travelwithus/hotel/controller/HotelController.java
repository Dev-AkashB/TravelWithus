package com.travelwithus.hotel.controller;

import com.travelwithus.hotel.dto.*;
import com.travelwithus.hotel.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<HotelDto>>> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long destinationId,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rating") String sort) {
        PagedResponse<HotelDto> result = hotelService.searchHotels(city, destinationId, minRating, maxPrice, page, size, sort);
        return ResponseEntity.ok(ApiResponse.success("Hotels retrieved successfully", result));
    }

    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<ApiResponse<List<HotelDto>>> getHotelsByDestination(@PathVariable Long destinationId) {
        List<HotelDto> result = hotelService.getHotelsByDestination(destinationId);
        return ResponseEntity.ok(ApiResponse.success("Hotels for destination retrieved successfully", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelDto>> getHotelById(@PathVariable Long id) {
        HotelDto result = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel retrieved successfully", result));
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<ApiResponse<List<RoomTypeDto>>> getRoomTypes(@PathVariable Long id) {
        List<RoomTypeDto> result = hotelService.getRoomTypes(id);
        return ResponseEntity.ok(ApiResponse.success("Room types retrieved successfully", result));
    }

    @PostMapping("/rooms/{roomTypeId}/reserve")
    public ResponseEntity<ApiResponse<Boolean>> reserveRooms(
            @PathVariable Long roomTypeId,
            @Valid @RequestBody RoomReservationRequest request) {
        boolean success = hotelService.reserveRooms(roomTypeId, request.getRoomCount());
        return ResponseEntity.ok(ApiResponse.success("Rooms reserved successfully", success));
    }

    @PostMapping("/rooms/{roomTypeId}/release")
    public ResponseEntity<ApiResponse<Void>> releaseRooms(
            @PathVariable Long roomTypeId,
            @Valid @RequestBody RoomReservationRequest request) {
        hotelService.releaseRooms(roomTypeId, request.getRoomCount());
        return ResponseEntity.ok(ApiResponse.success("Rooms released successfully", null));
    }

    // Admin Endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<PagedResponse<HotelDto>>> adminGetAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<HotelDto> result = hotelService.adminSearchHotels(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success("Admin hotels retrieved", result));
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<HotelDto>> createHotel(
            @Valid @RequestBody CreateHotelRequest request) {
        HotelDto created = hotelService.createHotel(request);
        return new ResponseEntity<>(ApiResponse.success("Hotel created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<HotelDto>> updateHotel(
            @PathVariable Long id,
            @RequestBody UpdateHotelRequest request) {
        HotelDto updated = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(ApiResponse.success("Hotel updated successfully", updated));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted successfully", null));
    }

    @PostMapping("/admin/{id}/rooms")
    public ResponseEntity<ApiResponse<RoomTypeDto>> addRoomType(
            @PathVariable Long id,
            @Valid @RequestBody CreateRoomTypeRequest request) {
        RoomTypeDto created = hotelService.addRoomType(id, request);
        return new ResponseEntity<>(ApiResponse.success("Room type added successfully", created), HttpStatus.CREATED);
    }
}
