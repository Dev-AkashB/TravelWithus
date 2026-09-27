package com.travelwithus.hotel.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels", indexes = {
        @Index(name = "idx_hotel_dest_id", columnList = "destinationId"),
        @Index(name = "idx_hotel_city", columnList = "city"),
        @Index(name = "idx_hotel_country", columnList = "country"),
        @Index(name = "idx_hotel_rating", columnList = "rating"),
        @Index(name = "idx_hotel_price", columnList = "startingPrice")
})
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false)
    private Long destinationId;

    @Column(nullable = false, length = 100)
    private String destinationName;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(length = 200)
    private String address;

    @Column(nullable = false)
    private int starRating = 4; // 1 to 5 stars

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(4.5); // User rating out of 5.0

    @Column(nullable = false)
    private int totalReviews = 0;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String amenities; // WiFi, Pool, Spa, Gym, Restaurant, Airport Shuttle

    @Column(length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String galleryUrls;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal startingPrice;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RoomType> roomTypes = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public Hotel() {
    }

    public Hotel(String name, Long destinationId, String destinationName, String city, String country,
                 String address, int starRating, BigDecimal rating, int totalReviews, String description,
                 String amenities, String imageUrl, BigDecimal startingPrice) {
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
        this.startingPrice = startingPrice;
        this.active = true;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
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

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getGalleryUrls() {
        return galleryUrls;
    }

    public void setGalleryUrls(String galleryUrls) {
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

    public List<RoomType> getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(List<RoomType> roomTypes) {
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
