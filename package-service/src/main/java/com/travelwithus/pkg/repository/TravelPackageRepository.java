package com.travelwithus.pkg.repository;

import com.travelwithus.pkg.entity.TravelPackage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {

    List<TravelPackage> findByFeaturedTrueAndStatus(String status);

    List<TravelPackage> findByDestinationIdAndStatus(Long destinationId, String status);

    @Query("SELECT p FROM TravelPackage p WHERE p.status = 'ACTIVE' AND " +
           "(:destination IS NULL OR LOWER(p.destinationName) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:durationDays IS NULL OR p.durationDays = :durationDays)")
    Page<TravelPackage> searchPackages(
            @Param("destination") String destination,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("durationDays") Integer durationDays,
            Pageable pageable
    );

    @Query("SELECT p FROM TravelPackage p WHERE " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.destinationName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<TravelPackage> adminSearchPackages(@Param("keyword") String keyword, Pageable pageable);
}
