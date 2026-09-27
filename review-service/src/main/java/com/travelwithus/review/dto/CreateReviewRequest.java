package com.travelwithus.review.dto;

import com.travelwithus.review.entity.ReviewTargetType;
import jakarta.validation.constraints.*;

public class CreateReviewRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userFullName;

    private Long bookingId;

    @NotNull(message = "Review target type is required")
    private ReviewTargetType targetType;

    @NotNull(message = "Target ID is required")
    private Long targetId;

    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private int rating;

    @NotBlank(message = "Review title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Review comment is required")
    @Size(max = 2000, message = "Comment must not exceed 2000 characters")
    private String comment;

    public CreateReviewRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public ReviewTargetType getTargetType() {
        return targetType;
    }

    public void setTargetType(ReviewTargetType targetType) {
        this.targetType = targetType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
