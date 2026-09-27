package com.travelwithus.hotel.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class HotelDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private Long destinationId;
    private String destinationName;
    private String city;
    private String country;
    private String address;
    private int starRating;
    private BigDecimal rating;
    private int totalReviews;
    private String description;
    private List<String> amenities;
    private String imageUrl;
    private List<String> galleryUrls;
    private BigDecimal startingPrice;
    private boolean active;
    private List<RoomTypeDto> roomTypes;
    private Instant createdAt;
    private Instant updatedAt;

    public HotelDto() {
    }

    public HotelDto(Long id, String name, Long destinationId, String destinationName, String city,
                    String country, String address, int starRating, BigDecimal rating, int totalReviews,
                    String description, List<String> amenities, String imageUrl, List<String> galleryUrls,
                    BigDecimal startingPrice, boolean active, List<RoomTypeDto> roomTypes,
                    Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.destinationId = destinationId;
        this.destinationName = destinationName;
        this.city = city;
        this.country = country;
        this.address = address;
        this.starRating = starRating;
        this.rating = rating;
        this.totalReviews = totalReviews;
        this.description = description;
        this.amenities = amenities;
        this.imageUrl = imageUrl;
        this.galleryUrls = galleryUrls;
        this.startingPrice = startingPrice;
        this.active = active;
        this.roomTypes = roomTypes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getStarRating() {
        return starRating;
    }

    public void setStarRating(int starRating) {
        this.starRating = starRating;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public int getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(int totalReviews) {
        this.totalReviews = totalReviews;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getGalleryUrls() {
        return galleryUrls;
    }

    public void setGalleryUrls(List<String> galleryUrls) {
        this.galleryUrls = galleryUrls;
    }

    public BigDecimal getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<RoomTypeDto> getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(List<RoomTypeDto> roomTypes) {
        this.roomTypes = roomTypes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
