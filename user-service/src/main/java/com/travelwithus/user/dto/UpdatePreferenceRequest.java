package com.travelwithus.user.dto;

public class UpdatePreferenceRequest {
    private String currency;
    private String language;
    private String dietaryRequirements;
    private String travelInterests;

    public UpdatePreferenceRequest() {
    }

    public UpdatePreferenceRequest(String currency, String language, String dietaryRequirements, String travelInterests) {
        this.currency = currency;
        this.language = language;
        this.dietaryRequirements = dietaryRequirements;
        this.travelInterests = travelInterests;
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
