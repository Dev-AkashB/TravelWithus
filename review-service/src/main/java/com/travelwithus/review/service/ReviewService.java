package com.travelwithus.review.service;

import com.travelwithus.review.dto.*;
import com.travelwithus.review.entity.ReviewStatus;
import com.travelwithus.review.entity.ReviewTargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {

    ReviewResponseDto createReview(CreateReviewRequest request);

    Page<ReviewResponseDto> getReviewsForTarget(ReviewTargetType targetType, Long targetId, Pageable pageable);

    RatingSummaryDto getRatingSummary(ReviewTargetType targetType, Long targetId);

    Page<ReviewResponseDto> getUserReviews(Long userId, Pageable pageable);

    ReviewResponseDto voteHelpful(Long id);

    Page<ReviewResponseDto> getReviewsForModeration(ReviewStatus status, Pageable pageable);

    ReviewResponseDto moderateReview(Long id, ReviewModerationRequest request);

    void deleteReview(Long id);

    ReviewStatsDto getReviewStats();
}
