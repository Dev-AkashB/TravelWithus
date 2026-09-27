package com.travelwithus.user.dto;

public class UserPreferenceDto {
    private Long id;
    private Long userId;
    private String currency;
    private String language;
    private String dietaryRequirements;
    private String travelInterests;

    public UserPreferenceDto() {
    }

    public UserPreferenceDto(Long id, Long userId, String currency, String language, String dietaryRequirements, String travelInterests) {
        this.id = id;
        this.userId = userId;
        this.currency = currency;
        this.language = language;
        this.dietaryRequirements = dietaryRequirements;
        this.travelInterests = travelInterests;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getDietaryRequirements() {
        return dietaryRequirements;
    }

    public void setDietaryRequirements(String dietaryRequirements) {
        this.dietaryRequirements = dietaryRequirements;
    }

    public String getTravelInterests() {
        return travelInterests;
    }

    public void setTravelInterests(String travelInterests) {
        this.travelInterests = travelInterests;
    }
}
