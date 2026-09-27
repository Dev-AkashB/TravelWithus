package com.travelwithus.user.repository;

import com.travelwithus.user.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUserId(Long userId);
    Optional<UserFavorite> findByUserIdAndDestinationId(Long userId, Long destinationId);
    boolean existsByUserIdAndDestinationId(Long userId, Long destinationId);
    void deleteByUserIdAndDestinationId(Long userId, Long destinationId);
}
