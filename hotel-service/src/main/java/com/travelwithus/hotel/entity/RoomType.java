package com.travelwithus.hotel.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "room_types", indexes = {
        @Index(name = "idx_room_hotel_id", columnList = "hotel_id")
})
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(nullable = false, length = 100)
    private String name; // Standard, Deluxe Ocean View, Presidential Suite

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int capacity = 2;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(nullable = false)
    private int totalRooms = 10;

    @Column(nullable = false)
    private int availableRooms = 10;

    @Column(length = 50)
    private String bedType = "King";

    @Column
    private Integer sizeSqMeters = 35;

    @Column(length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    public RoomType() {
    }

    public RoomType(Hotel hotel, String name, String description, int capacity, BigDecimal pricePerNight,
                    int totalRooms, int availableRooms, String bedType, Integer sizeSqMeters, String imageUrl, String amenities) {
        this.hotel = hotel;
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

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
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

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }
}
