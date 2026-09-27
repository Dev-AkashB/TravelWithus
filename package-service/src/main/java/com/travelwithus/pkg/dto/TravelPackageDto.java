package com.travelwithus.pkg.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class TravelPackageDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private Long destinationId;
    private String destinationName;
    private String description;
    private int durationDays;
    private int durationNights;
    private BigDecimal price;
    private int discountPercent;
    private BigDecimal discountedPrice;
    private int maxTravelers;
    private int availableSlots;
    private String hotelInfo;
    private String itinerary;
    private List<String> activities;
    private String imageUrl;
    private List<String> galleryUrls;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private boolean featured;
    private Instant createdAt;
    private Instant updatedAt;

    public TravelPackageDto() {
    }

    public TravelPackageDto(Long id, String title, Long destinationId, String destinationName,
                            String description, int durationDays, int durationNights,
                            BigDecimal price, int discountPercent, BigDecimal discountedPrice,
                            int maxTravelers, int availableSlots, String hotelInfo,
                            String itinerary, List<String> activities, String imageUrl,
                            List<String> galleryUrls, LocalDate startDate, LocalDate endDate,
                            String status, boolean featured, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.destinationId = destinationId;
        this.destinationName = destinationName;
        this.description = description;
        this.durationDays = durationDays;
        this.durationNights = durationNights;
        this.price = price;
        this.discountPercent = discountPercent;
        this.discountedPrice = discountedPrice;
        this.maxTravelers = maxTravelers;
        this.availableSlots = availableSlots;
        this.hotelInfo = hotelInfo;
        this.itinerary = itinerary;
        this.activities = activities;
        this.imageUrl = imageUrl;
        this.galleryUrls = galleryUrls;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.featured = featured;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public BigDecimal getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
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

    public List<String> getActivities() {
        return activities;
    }

    public void setActivities(List<String> activities) {
        this.activities = activities;
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
