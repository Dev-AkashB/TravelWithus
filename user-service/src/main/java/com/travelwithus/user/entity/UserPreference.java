package com.travelwithus.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences", indexes = {
        @Index(name = "idx_pref_user_id", columnList = "userId", unique = true)
})
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(length = 10)
    private String currency = "USD";

    @Column(length = 10)
    private String language = "en";

    @Column(length = 200)
    private String dietaryRequirements;

    @Column(length = 500)
    private String travelInterests; // Comma separated: Adventure, Beach, Cultural, Luxury

    public UserPreference() {
    }

    public UserPreference(Long userId) {
        this.userId = userId;
        this.currency = "USD";
        this.language = "en";
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
