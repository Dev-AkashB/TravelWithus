package com.travelwithus.booking.repository;

import com.travelwithus.booking.entity.Booking;
import com.travelwithus.booking.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status, Pageable pageable);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED' OR b.paymentStatus = 'PAID'")
    BigDecimal calculateTotalConfirmedRevenue();

    @Query("SELECT b FROM Booking b WHERE (:status IS NULL OR b.status = :status) ORDER BY b.createdAt DESC")
    Page<Booking> findAllWithFilter(@Param("status") BookingStatus status, Pageable pageable);
}
