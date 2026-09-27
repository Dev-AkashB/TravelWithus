package com.travelwithus.hotel.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public class RoomTypeDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long hotelId;
    private String name;
    private String description;
    private int capacity;
    private BigDecimal pricePerNight;
    private int totalRooms;
    private int availableRooms;
    private String bedType;
    private Integer sizeSqMeters;
    private String imageUrl;
    private List<String> amenities;

    public RoomTypeDto() {
    }

    public RoomTypeDto(Long id, Long hotelId, String name, String description, int capacity,
                       BigDecimal pricePerNight, int totalRooms, int availableRooms,
                       String bedType, Integer sizeSqMeters, String imageUrl, List<String> amenities) {
        this.id = id;
        this.hotelId = hotelId;
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.bedType = bedType;
        this.sizeSqMeters = sizeSqMeters;
        this.imageUrl = imageUrl;
        this.amenities = amenities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
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

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
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
