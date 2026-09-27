package com.travelwithus.pkg.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "travel_packages", indexes = {
        @Index(name = "idx_pkg_dest_id", columnList = "destinationId"),
        @Index(name = "idx_pkg_dest_name", columnList = "destinationName"),
        @Index(name = "idx_pkg_price", columnList = "price"),
        @Index(name = "idx_pkg_featured", columnList = "featured"),
        @Index(name = "idx_pkg_status", columnList = "status")
})
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false)
    private Long destinationId;

    @Column(nullable = false, length = 100)
    private String destinationName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private int durationDays;

    @Column(nullable = false)
    private int durationNights;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private int discountPercent = 0;

    @Column(nullable = false)
    private int maxTravelers;

    @Column(nullable = false)
    private int availableSlots;

    @Column(length = 200)
    private String hotelInfo;

    @Column(columnDefinition = "TEXT")
    private String itinerary; // JSON or formatted text of day-by-day plan

    @Column(columnDefinition = "TEXT")
    private String activities;

    @Column(length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String galleryUrls;

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, SOLD_OUT, DRAFT, CANCELLED

    @Column(nullable = false)
    private boolean featured = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public TravelPackage() {
    }

    public TravelPackage(String title, Long destinationId, String destinationName, String description,
                         int durationDays, int durationNights, BigDecimal price, int discountPercent,
                         int maxTravelers, int availableSlots, String hotelInfo, String itinerary,
                         String activities, String imageUrl, LocalDate startDate, LocalDate endDate, boolean featured) {
        this.title = title;
        this.destinationId = destinationId;
        this.destinationName = destinationName;
        this.description = description;
        this.durationDays = durationDays;
        this.durationNights = durationNights;
        this.price = price;
        this.discountPercent = discountPercent;
        this.maxTravelers = maxTravelers;
        this.availableSlots = availableSlots;
        this.hotelInfo = hotelInfo;
        this.itinerary = itinerary;
        this.activities = activities;
        this.imageUrl = imageUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.featured = featured;
        this.status = "ACTIVE";
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public int getDurationNights() {
        return durationNights;
    }

    public void setDurationNights(int durationNights) {
        this.durationNights = durationNights;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(int discountPercent) {
        this.discountPercent = discountPercent;
    }

    public int getMaxTravelers() {
        return maxTravelers;
    }

    public void setMaxTravelers(int maxTravelers) {
        this.maxTravelers = maxTravelers;
    }

    public int getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(int availableSlots) {
        this.availableSlots = availableSlots;
    }

    public String getHotelInfo() {
        return hotelInfo;
    }

    public void setHotelInfo(String hotelInfo) {
        this.hotelInfo = hotelInfo;
    }

    public String getItinerary() {
        return itinerary;
    }

    public void setItinerary(String itinerary) {
        this.itinerary = itinerary;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
        this.activities = activities;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
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
