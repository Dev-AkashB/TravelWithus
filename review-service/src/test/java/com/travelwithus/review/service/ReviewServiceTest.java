package com.travelwithus.review.service;

import com.travelwithus.review.client.BookingClient;
import com.travelwithus.review.client.BookingResponse;
import com.travelwithus.review.client.PageResponse;
import com.travelwithus.review.dto.CreateReviewRequest;
import com.travelwithus.review.dto.RatingSummaryDto;
import com.travelwithus.review.dto.ReviewModerationRequest;
import com.travelwithus.review.entity.Review;
import com.travelwithus.review.entity.ReviewStatus;
import com.travelwithus.review.entity.ReviewTargetType;
import com.travelwithus.review.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private BookingClient bookingClient;

    private ReviewServiceImpl reviewService;

    @BeforeEach
    void setUp() {
        reviewService = new ReviewServiceImpl(reviewRepository, bookingClient);
    }

    @Test
    void testCreateReview_VerifiedBooking() {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setUserId(1L);
        request.setUserFullName("Alex Mercer");
        request.setTargetType(ReviewTargetType.PACKAGE);
        request.setTargetId(10L);
        request.setRating(5);
        request.setTitle("Unforgettable Bali Experience");
        request.setComment("The private villa and cultural tours were spectacular!");

        // Simulate booking client returning confirmed booking for package 10
        BookingResponse booking = new BookingResponse();
        booking.setId(101L);
        booking.setBookingType("PACKAGE");
        booking.setItemReferenceId(10L);
        booking.setStatus("CONFIRMED");

        PageResponse<BookingResponse> bookingPage = new PageResponse<>();
        bookingPage.setContent(List.of(booking));

        when(bookingClient.getUserBookings(eq(1L), anyInt(), anyInt())).thenReturn(bookingPage);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> {
            Review r = invocation.getArgument(0);
            r.setId(1L);
            return r;
        });

        var result = reviewService.createReview(request);

        assertNotNull(result);
        assertEquals(5, result.getRating());
        assertTrue(result.isVerifiedBooking());
        assertEquals(ReviewStatus.APPROVED, result.getStatus());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void testGetRatingSummary() {
        when(reviewRepository.calculateAverageRating(ReviewTargetType.PACKAGE, 10L)).thenReturn(4.8);
        when(reviewRepository.countByTargetTypeAndTargetIdAndStatus(ReviewTargetType.PACKAGE, 10L, ReviewStatus.APPROVED)).thenReturn(25L);
        when(reviewRepository.getRatingDistribution(ReviewTargetType.PACKAGE, 10L)).thenReturn(List.of(
                new Object[]{5, 20L},
                new Object[]{4, 5L}
        ));

        RatingSummaryDto summary = reviewService.getRatingSummary(ReviewTargetType.PACKAGE, 10L);

        assertNotNull(summary);
        assertEquals(4.8, summary.getAverageRating());
        assertEquals(25L, summary.getTotalReviews());
        assertEquals(20L, summary.getStarDistribution().get(5));
        assertEquals(5L, summary.getStarDistribution().get(4));
    }

    @Test
    void testVoteHelpful() {
        Review review = new Review();
        review.setId(1L);
        review.setHelpfulVotes(3);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = reviewService.voteHelpful(1L);
        assertEquals(4, result.getHelpfulVotes());
    }

    @Test
    void testModerateReview() {
        Review review = new Review();
        review.setId(1L);
        review.setStatus(ReviewStatus.PENDING);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = reviewService.moderateReview(1L, new ReviewModerationRequest(ReviewStatus.REJECTED, "Spam content"));
        assertEquals(ReviewStatus.REJECTED, result.getStatus());
    }
}
