package com.travelwithus.destination.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class DestinationDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String country;
    private String city;
    private String description;
    private String category;
    private String imageUrl;
    private List<String> galleryUrls;
    private List<String> attractions;
    private List<String> activities;
    private String bestTimeToVisit;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private boolean popular;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;

    public DestinationDto() {
    }

    public DestinationDto(Long id, String name, String country, String city, String description,
                          String category, String imageUrl, List<String> galleryUrls,
                          List<String> attractions, List<String> activities, String bestTimeToVisit,
                          BigDecimal minPrice, BigDecimal maxPrice, boolean popular, boolean active,
                          Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.city = city;
        this.description = description;
        this.category = category;
        this.imageUrl = imageUrl;
        this.galleryUrls = galleryUrls;
        this.attractions = attractions;
        this.activities = activities;
        this.bestTimeToVisit = bestTimeToVisit;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.popular = popular;
        this.active = active;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public List<String> getAttractions() {
        return attractions;
    }

    public void setAttractions(List<String> attractions) {
        this.attractions = attractions;
    }

    public List<String> getActivities() {
        return activities;
    }

    public void setActivities(List<String> activities) {
        this.activities = activities;
    }

    public String getBestTimeToVisit() {
        return bestTimeToVisit;
    }

    public void setBestTimeToVisit(String bestTimeToVisit) {
        this.bestTimeToVisit = bestTimeToVisit;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public boolean isPopular() {
        return popular;
    }

    public void setPopular(boolean popular) {
        this.popular = popular;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
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
