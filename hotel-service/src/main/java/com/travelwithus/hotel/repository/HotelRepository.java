package com.travelwithus.hotel.repository;

import com.travelwithus.hotel.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByDestinationIdAndActiveTrue(Long destinationId);

    @Query("SELECT h FROM Hotel h WHERE h.active = true AND " +
           "(:city IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:destinationId IS NULL OR h.destinationId = :destinationId) AND " +
           "(:minRating IS NULL OR h.rating >= :minRating) AND " +
           "(:maxPrice IS NULL OR h.startingPrice <= :maxPrice)")
    Page<Hotel> searchHotels(
            @Param("city") String city,
            @Param("destinationId") Long destinationId,
            @Param("minRating") BigDecimal minRating,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:keyword IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(h.country) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Hotel> adminSearchHotels(@Param("keyword") String keyword, Pageable pageable);
}
