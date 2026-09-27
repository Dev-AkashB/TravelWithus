package com.travelwithus.hotel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RoomReservationRequest {

    @NotNull(message = "Room count is required")
    @Min(value = 1, message = "Room count must be at least 1")
    private Integer roomCount;

    public RoomReservationRequest() {
    }

    public RoomReservationRequest(Integer roomCount) {
        this.roomCount = roomCount;
    }

    public Integer getRoomCount() {
        return roomCount;
    }

    public void setRoomCount(Integer roomCount) {
        this.roomCount = roomCount;
    }
}
