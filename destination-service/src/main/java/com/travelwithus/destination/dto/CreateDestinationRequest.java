package com.travelwithus.destination.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class CreateDestinationRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Country is required")
    @Size(min = 2, max = 100)
    private String country;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 100)
    private String city;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private String imageUrl;
    private List<String> galleryUrls;
    private List<String> attractions;
    private List<String> activities;
    private String bestTimeToVisit;

    @NotNull(message = "Min price is required")
    private BigDecimal minPrice;

    @NotNull(message = "Max price is required")
    private BigDecimal maxPrice;

    private boolean popular = false;

    public CreateDestinationRequest() {
    }

    public CreateDestinationRequest(String name, String country, String city, String description,
                                  String category, String imageUrl, List<String> galleryUrls,
                                  List<String> attractions, List<String> activities, String bestTimeToVisit,
                                  BigDecimal minPrice, BigDecimal maxPrice, boolean popular) {
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
}
