package com.travelwithus.review.controller;

import com.travelwithus.review.dto.*;
import com.travelwithus.review.entity.ReviewStatus;
import com.travelwithus.review.entity.ReviewTargetType;
import com.travelwithus.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Review & Rating Management", description = "Endpoints for traveler ratings, verified booking reviews, and content moderation")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @Operation(summary = "Submit a travel review with automatic booking eligibility verification")
    public ResponseEntity<ReviewResponseDto> createReview(@Valid @RequestBody CreateReviewRequest request) {
        ReviewResponseDto response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/target/{targetType}/{targetId}")
    @Operation(summary = "Get approved reviews for a specific tour package, hotel, or destination")
    public ResponseEntity<Page<ReviewResponseDto>> getReviewsForTarget(
            @PathVariable ReviewTargetType targetType,
            @PathVariable Long targetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewService.getReviewsForTarget(targetType, targetId, pageable));
    }

    @GetMapping("/target/{targetType}/{targetId}/summary")
    @Operation(summary = "Get aggregated star rating and review distribution summary")
    public ResponseEntity<RatingSummaryDto> getRatingSummary(
            @PathVariable ReviewTargetType targetType,
            @PathVariable Long targetId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(targetType, targetId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all reviews submitted by a specific user")
    public ResponseEntity<Page<ReviewResponseDto>> getUserReviews(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewService.getUserReviews(userId, pageable));
    }

    @PostMapping("/{id}/helpful")
    @Operation(summary = "Upvote the helpfulness of a traveler review")
    public ResponseEntity<ReviewResponseDto> voteHelpful(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.voteHelpful(id));
    }

    @GetMapping("/admin/moderation")
    @Operation(summary = "Admin endpoint: list reviews by moderation status")
    public ResponseEntity<Page<ReviewResponseDto>> getReviewsForModeration(
            @RequestParam(defaultValue = "PENDING") ReviewStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewService.getReviewsForModeration(status, pageable));
    }

    @PutMapping("/admin/{id}/moderate")
    @Operation(summary = "Admin endpoint: approve or reject a traveler review")
    public ResponseEntity<ReviewResponseDto> moderateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewModerationRequest request) {
        return ResponseEntity.ok(reviewService.moderateReview(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review by ID")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully", "id", id.toString()));
    }

    @GetMapping("/admin/stats")
    @Operation(summary = "Admin endpoint: get review volume and moderation stats")
    public ResponseEntity<ReviewStatsDto> getReviewStats() {
        return ResponseEntity.ok(reviewService.getReviewStats());
    }
}
