package com.travelwithus.review.dto;

import com.travelwithus.review.entity.ReviewTargetType;

import java.util.HashMap;
import java.util.Map;

public class RatingSummaryDto {

    private ReviewTargetType targetType;
    private Long targetId;
    private double averageRating;
    private long totalReviews;
    private Map<Integer, Long> starDistribution = new HashMap<>();

    public RatingSummaryDto() {
        for (int i = 1; i <= 5; i++) {
            starDistribution.put(i, 0L);
        }
    }

    public RatingSummaryDto(ReviewTargetType targetType, Long targetId, double averageRating, long totalReviews, Map<Integer, Long> starDistribution) {
        this.targetType = targetType;
        this.targetId = targetId;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.starDistribution = starDistribution;
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

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Map<Integer, Long> getStarDistribution() {
        return starDistribution;
    }

    public void setStarDistribution(Map<Integer, Long> starDistribution) {
        this.starDistribution = starDistribution;
    }
}
