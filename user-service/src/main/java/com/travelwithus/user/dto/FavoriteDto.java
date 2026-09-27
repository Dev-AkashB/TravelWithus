package com.travelwithus.user.dto;

import java.time.Instant;

public class FavoriteDto {
    private Long id;
    private Long userId;
    private Long destinationId;
    private Instant createdAt;

    public FavoriteDto() {
    }

    public FavoriteDto(Long id, Long userId, Long destinationId, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.destinationId = destinationId;
        this.createdAt = createdAt;
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

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
