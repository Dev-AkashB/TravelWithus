package com.travelwithus.review.repository;

import com.travelwithus.review.entity.Review;
import com.travelwithus.review.entity.ReviewStatus;
import com.travelwithus.review.entity.ReviewTargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByTargetTypeAndTargetIdAndStatusOrderByCreatedAtDesc(
            ReviewTargetType targetType, Long targetId, ReviewStatus status, Pageable pageable);

    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Review> findByStatusOrderByCreatedAtDesc(ReviewStatus status, Pageable pageable);

    long countByTargetTypeAndTargetIdAndStatus(ReviewTargetType targetType, Long targetId, ReviewStatus status);

    long countByStatus(ReviewStatus status);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.targetType = :targetType AND r.targetId = :targetId AND r.status = 'APPROVED'")
    Double calculateAverageRating(@Param("targetType") ReviewTargetType targetType, @Param("targetId") Long targetId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.targetType = :targetType AND r.targetId = :targetId AND r.status = 'APPROVED' GROUP BY r.rating")
    List<Object[]> getRatingDistribution(@Param("targetType") ReviewTargetType targetType, @Param("targetId") Long targetId);
}
