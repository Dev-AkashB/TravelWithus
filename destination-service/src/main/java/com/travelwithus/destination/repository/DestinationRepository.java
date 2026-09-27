package com.travelwithus.destination.repository;

import com.travelwithus.destination.entity.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    List<Destination> findByPopularTrueAndActiveTrue();

    List<Destination> findByCategoryIgnoreCaseAndActiveTrue(String category);

    @Query("SELECT d FROM Destination d WHERE d.active = true AND " +
           "(:keyword IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.country) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR LOWER(d.category) = LOWER(:category)) AND " +
           "(:country IS NULL OR LOWER(d.country) = LOWER(:country)) AND " +
           "(:city IS NULL OR LOWER(d.city) = LOWER(:city)) AND " +
           "(:maxPrice IS NULL OR d.minPrice <= :maxPrice)")
    Page<Destination> searchDestinations(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("country") String country,
            @Param("city") String city,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("SELECT d FROM Destination d WHERE " +
           "(:keyword IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.country) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.city) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Destination> adminSearchDestinations(@Param("keyword") String keyword, Pageable pageable);
}
