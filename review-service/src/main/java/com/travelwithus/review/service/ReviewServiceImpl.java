package com.travelwithus.review.service;

import com.travelwithus.review.client.BookingClient;
import com.travelwithus.review.client.BookingResponse;
import com.travelwithus.review.client.PageResponse;
import com.travelwithus.review.dto.*;
import com.travelwithus.review.entity.Review;
import com.travelwithus.review.entity.ReviewStatus;
import com.travelwithus.review.entity.ReviewTargetType;
import com.travelwithus.review.exception.ResourceNotFoundException;
import com.travelwithus.review.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewServiceImpl.class);

    private final ReviewRepository reviewRepository;
    private final BookingClient bookingClient;

    public ReviewServiceImpl(ReviewRepository reviewRepository, BookingClient bookingClient) {
        this.reviewRepository = reviewRepository;
        this.bookingClient = bookingClient;
    }

    @Override
    public ReviewResponseDto createReview(CreateReviewRequest request) {
        log.info("Creating review from user={}, targetType={}, targetId={}",
                request.getUserId(), request.getTargetType(), request.getTargetId());

        boolean isVerified = false;

        // Check verified booking status via Booking Service
        try {
            PageResponse<BookingResponse> bookings = bookingClient.getUserBookings(request.getUserId(), 0, 50);
            if (bookings != null && bookings.getContent() != null) {
                isVerified = bookings.getContent().stream().anyMatch(b ->
                        b.getItemReferenceId() != null &&
                        b.getItemReferenceId().equals(request.getTargetId()) &&
                        (request.getTargetType() == ReviewTargetType.DESTINATION ||
                         request.getTargetType().name().equalsIgnoreCase(b.getBookingType())) &&
                        ("CONFIRMED".equalsIgnoreCase(b.getStatus()) || "COMPLETED".equalsIgnoreCase(b.getStatus()))
                );
            }
        } catch (Exception e) {
            log.warn("Booking eligibility verification failed or unavailable: {}", e.getMessage());
        }

        Review review = new Review();
        review.setUserId(request.getUserId());
        review.setUserFullName(request.getUserFullName() != null ? request.getUserFullName() : "Verified Traveler");
        review.setBookingId(request.getBookingId());
        review.setTargetType(request.getTargetType());
        review.setTargetId(request.getTargetId());
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setVerifiedBooking(isVerified);
        review.setStatus(ReviewStatus.APPROVED); // Default to approved; admins can moderate or flag
        review.setHelpfulVotes(0);

        Review saved = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}, verified: {}", saved.getId(), saved.isVerifiedBooking());
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDto> getReviewsForTarget(ReviewTargetType targetType, Long targetId, Pageable pageable) {
        return reviewRepository.findByTargetTypeAndTargetIdAndStatusOrderByCreatedAtDesc(
                targetType, targetId, ReviewStatus.APPROVED, pageable
        ).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public RatingSummaryDto getRatingSummary(ReviewTargetType targetType, Long targetId) {
        Double rawAvg = reviewRepository.calculateAverageRating(targetType, targetId);
        double averageRating = BigDecimal.valueOf(rawAvg != null ? rawAvg : 0.0)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();

        long totalReviews = reviewRepository.countByTargetTypeAndTargetIdAndStatus(targetType, targetId, ReviewStatus.APPROVED);

        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }

        List<Object[]> rawDist = reviewRepository.getRatingDistribution(targetType, targetId);
        if (rawDist != null) {
            for (Object[] row : rawDist) {
                if (row.length >= 2 && row[0] instanceof Integer star && row[1] instanceof Long count) {
                    distribution.put(star, count);
                }
            }
        }

        return new RatingSummaryDto(targetType, targetId, averageRating, totalReviews, distribution);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDto> getUserReviews(Long userId, Pageable pageable) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToDto);
    }

    @Override
    public ReviewResponseDto voteHelpful(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));
        review.setHelpfulVotes(review.getHelpfulVotes() + 1);
        Review updated = reviewRepository.save(review);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponseDto> getReviewsForModeration(ReviewStatus status, Pageable pageable) {
        return reviewRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::mapToDto);
    }

    @Override
    public ReviewResponseDto moderateReview(Long id, ReviewModerationRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));
        review.setStatus(request.getStatus());
        Review updated = reviewRepository.save(review);
        log.info("Review id={} moderated to status={}", id, request.getStatus());
        return mapToDto(updated);
    }

    @Override
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found with ID: " + id);
        }
        reviewRepository.deleteById(id);
        log.info("Review id={} deleted", id);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewStatsDto getReviewStats() {
        long total = reviewRepository.count();
        long approved = reviewRepository.countByStatus(ReviewStatus.APPROVED);
        long pending = reviewRepository.countByStatus(ReviewStatus.PENDING);
        long rejected = reviewRepository.countByStatus(ReviewStatus.REJECTED);
        return new ReviewStatsDto(total, approved, pending, rejected);
    }

    private ReviewResponseDto mapToDto(Review entity) {
        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setUserFullName(entity.getUserFullName());
        dto.setBookingId(entity.getBookingId());
        dto.setTargetType(entity.getTargetType());
        dto.setTargetId(entity.getTargetId());
        dto.setRating(entity.getRating());
        dto.setTitle(entity.getTitle());
        dto.setComment(entity.getComment());
        dto.setStatus(entity.getStatus());
        dto.setVerifiedBooking(entity.isVerifiedBooking());
        dto.setHelpfulVotes(entity.getHelpfulVotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
