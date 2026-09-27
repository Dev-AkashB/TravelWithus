package com.travelwithus.review.dto;

import com.travelwithus.review.entity.ReviewStatus;
import jakarta.validation.constraints.NotNull;

public class ReviewModerationRequest {

    @NotNull(message = "Review status is required")
    private ReviewStatus status;

    private String reason;

    public ReviewModerationRequest() {
    }

    public ReviewModerationRequest(ReviewStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public ReviewStatus getStatus() {
        return status;
    }

    public void setStatus(ReviewStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
