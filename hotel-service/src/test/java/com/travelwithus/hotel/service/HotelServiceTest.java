package com.travelwithus.hotel.service;

import com.travelwithus.hotel.dto.HotelDto;
import com.travelwithus.hotel.entity.Hotel;
import com.travelwithus.hotel.entity.RoomType;
import com.travelwithus.hotel.exception.BadRequestException;
import com.travelwithus.hotel.exception.ResourceNotFoundException;
import com.travelwithus.hotel.repository.HotelRepository;
import com.travelwithus.hotel.repository.RoomTypeRepository;
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
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomTypeRepository roomTypeRepository;

    @InjectMocks
    private HotelServiceImpl hotelService;

    private Hotel sampleHotel;
    private RoomType sampleRoom;

    @BeforeEach
    void setUp() {
        sampleHotel = new Hotel("The Ritz Paris", 2L, "Paris", "Paris", "France",
                "15 Place Vendôme", 5, new BigDecimal("4.9"), 100, "Luxury hotel",
                "WiFi;Pool", "http://ritz.jpg", new BigDecimal("800.00"));
        sampleHotel.setId(1L);

        sampleRoom = new RoomType(sampleHotel, "Deluxe King", "Nice room", 2,
                new BigDecimal("800.00"), 10, 5, "King", 40, "http://room.jpg", "WiFi;AC");
        sampleRoom.setId(101L);
    }

    @Test
    void testGetHotelsByDestination() {
        when(hotelRepository.findByDestinationIdAndActiveTrue(2L)).thenReturn(List.of(sampleHotel));

        List<HotelDto> result = hotelService.getHotelsByDestination(2L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("The Ritz Paris", result.get(0).getName());
    }

    @Test
    void testGetHotelByIdSuccess() {
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(sampleHotel));

        HotelDto result = hotelService.getHotelById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetHotelByIdNotFound() {
        when(hotelRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> hotelService.getHotelById(99L));
    }

    @Test
    void testReserveRoomsSuccess() {
        when(roomTypeRepository.findById(101L)).thenReturn(Optional.of(sampleRoom));
        when(roomTypeRepository.save(any(RoomType.class))).thenReturn(sampleRoom);

        boolean reserved = hotelService.reserveRooms(101L, 2);

        assertTrue(reserved);
        assertEquals(3, sampleRoom.getAvailableRooms());
    }

    @Test
    void testReserveRoomsInsufficientThrowsException() {
        when(roomTypeRepository.findById(101L)).thenReturn(Optional.of(sampleRoom));

        assertThrows(BadRequestException.class, () -> hotelService.reserveRooms(101L, 10));
    }

    @Test
    void testReleaseRooms() {
        when(roomTypeRepository.findById(101L)).thenReturn(Optional.of(sampleRoom));
        when(roomTypeRepository.save(any(RoomType.class))).thenReturn(sampleRoom);

        hotelService.releaseRooms(101L, 2);

        assertEquals(7, sampleRoom.getAvailableRooms());
    }
}
