package com.travelwithus.destination.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "destinations", indexes = {
        @Index(name = "idx_dest_country", columnList = "country"),
        @Index(name = "idx_dest_city", columnList = "city"),
        @Index(name = "idx_dest_category", columnList = "category"),
        @Index(name = "idx_dest_popular", columnList = "popular")
})
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // Beach, Mountain, City, Cultural, Adventure, Island

    @Column(length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String galleryUrls; // Comma-separated URLs

    @Column(columnDefinition = "TEXT")
    private String attractions; // Key attractions comma-separated

    @Column(columnDefinition = "TEXT")
    private String activities; // Activities available

    @Column(length = 100)
    private String bestTimeToVisit;

    @Column(precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(nullable = false)
    private boolean popular = false;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public Destination() {
    }

    public Destination(String name, String country, String city, String description, String category,
                       String imageUrl, String bestTimeToVisit, BigDecimal minPrice, BigDecimal maxPrice, boolean popular) {
        this.name = name;
        this.country = country;
        this.city = city;
        this.description = description;
        this.category = category;
        this.imageUrl = imageUrl;
        this.bestTimeToVisit = bestTimeToVisit;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.popular = popular;
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

    public String getGalleryUrls() {
        return galleryUrls;
    }

    public void setGalleryUrls(String galleryUrls) {
        this.galleryUrls = galleryUrls;
    }

    public String getAttractions() {
        return attractions;
    }

    public void setAttractions(String attractions) {
        this.attractions = attractions;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
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
