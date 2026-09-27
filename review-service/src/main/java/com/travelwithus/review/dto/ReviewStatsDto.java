package com.travelwithus.review.dto;

public class ReviewStatsDto {

    private long totalReviews;
    private long approvedReviews;
    private long pendingReviews;
    private long rejectedReviews;

    public ReviewStatsDto() {
    }

    public ReviewStatsDto(long totalReviews, long approvedReviews, long pendingReviews, long rejectedReviews) {
        this.totalReviews = totalReviews;
        this.approvedReviews = approvedReviews;
        this.pendingReviews = pendingReviews;
        this.rejectedReviews = rejectedReviews;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public long getApprovedReviews() {
        return approvedReviews;
    }

    public void setApprovedReviews(long approvedReviews) {
        this.approvedReviews = approvedReviews;
    }

    public long getPendingReviews() {
        return pendingReviews;
    }

    public void setPendingReviews(long pendingReviews) {
        this.pendingReviews = pendingReviews;
    }

    public long getRejectedReviews() {
        return rejectedReviews;
    }

    public void setRejectedReviews(long rejectedReviews) {
        this.rejectedReviews = rejectedReviews;
    }
}
