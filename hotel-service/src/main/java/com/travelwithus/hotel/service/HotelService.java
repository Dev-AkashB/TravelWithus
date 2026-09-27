package com.travelwithus.hotel.service;

import com.travelwithus.hotel.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface HotelService {
    PagedResponse<HotelDto> searchHotels(String city, Long destinationId, BigDecimal minRating, BigDecimal maxPrice, int page, int size, String sort);
    PagedResponse<HotelDto> adminSearchHotels(String keyword, int page, int size);
    List<HotelDto> getHotelsByDestination(Long destinationId);
    HotelDto getHotelById(Long id);
    HotelDto createHotel(CreateHotelRequest request);
    HotelDto updateHotel(Long id, UpdateHotelRequest request);
    void deleteHotel(Long id);

    RoomTypeDto addRoomType(Long hotelId, CreateRoomTypeRequest request);
    List<RoomTypeDto> getRoomTypes(Long hotelId);
    boolean reserveRooms(Long roomTypeId, int count);
    void releaseRooms(Long roomTypeId, int count);
}
