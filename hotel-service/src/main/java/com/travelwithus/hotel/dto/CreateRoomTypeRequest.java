package com.travelwithus.hotel.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CreateRoomTypeRequest {

    @NotBlank(message = "Room type name is required")
    private String name;

    private String description;

    @Min(value = 1)
    private int capacity = 2;

    @NotNull(message = "Price per night is required")
    private BigDecimal pricePerNight;

    @Min(value = 1)
    private int totalRooms = 10;

    private String bedType = "King";
    private Integer sizeSqMeters = 35;
    private String imageUrl;
    private List<String> amenities;

    public CreateRoomTypeRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public String getBedType() {
        return bedType;
    }

    public void setBedType(String bedType) {
        this.bedType = bedType;
    }

    public Integer getSizeSqMeters() {
        return sizeSqMeters;
    }

    public void setSizeSqMeters(Integer sizeSqMeters) {
        this.sizeSqMeters = sizeSqMeters;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }
}
