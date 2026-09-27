package com.travelwithus.review.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.review.dto.CreateReviewRequest;
import com.travelwithus.review.dto.RatingSummaryDto;
import com.travelwithus.review.dto.ReviewResponseDto;
import com.travelwithus.review.entity.ReviewStatus;
import com.travelwithus.review.entity.ReviewTargetType;
import com.travelwithus.review.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testCreateReviewEndpoint() throws Exception {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setUserId(1L);
        request.setUserFullName("Alex Mercer");
        request.setTargetType(ReviewTargetType.PACKAGE);
        request.setTargetId(10L);
        request.setRating(5);
        request.setTitle("Bali Vacation");
        request.setComment("Amazing tour guide and hotels!");

        ReviewResponseDto response = new ReviewResponseDto();
        response.setId(1L);
        response.setUserId(1L);
        response.setTargetType(ReviewTargetType.PACKAGE);
        response.setTargetId(10L);
        response.setRating(5);
        response.setTitle("Bali Vacation");
        response.setStatus(ReviewStatus.APPROVED);
        response.setVerifiedBooking(true);

        when(reviewService.createReview(any(CreateReviewRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.verifiedBooking").value(true));
    }

    @Test
    void testGetReviewsForTargetEndpoint() throws Exception {
        ReviewResponseDto review = new ReviewResponseDto();
        review.setId(1L);
        review.setRating(5);
        review.setTitle("Great experience");

        when(reviewService.getReviewsForTarget(eq(ReviewTargetType.PACKAGE), eq(10L), any()))
                .thenReturn(new PageImpl<>(List.of(review)));

        mockMvc.perform(get("/api/v1/reviews/target/PACKAGE/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].rating").value(5));
    }

    @Test
    void testGetRatingSummaryEndpoint() throws Exception {
        RatingSummaryDto summary = new RatingSummaryDto();
        summary.setTargetType(ReviewTargetType.PACKAGE);
        summary.setTargetId(10L);
        summary.setAverageRating(4.8);
        summary.setTotalReviews(25);

        when(reviewService.getRatingSummary(eq(ReviewTargetType.PACKAGE), eq(10L))).thenReturn(summary);

        mockMvc.perform(get("/api/v1/reviews/target/PACKAGE/10/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(4.8))
                .andExpect(jsonPath("$.totalReviews").value(25));
    }
}
