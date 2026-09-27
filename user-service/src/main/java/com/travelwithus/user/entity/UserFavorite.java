package com.travelwithus.user.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "destinationId"})
}, indexes = {
        @Index(name = "idx_fav_user_id", columnList = "userId")
})
public class UserFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long destinationId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public UserFavorite() {
    }

    public UserFavorite(Long userId, Long destinationId) {
        this.userId = userId;
        this.destinationId = destinationId;
        this.createdAt = Instant.now();
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
