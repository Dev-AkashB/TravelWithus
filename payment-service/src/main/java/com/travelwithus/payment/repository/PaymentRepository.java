package com.travelwithus.payment.repository;

import com.travelwithus.payment.entity.Payment;
import com.travelwithus.payment.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentReference(String paymentReference);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByBookingNumberOrderByCreatedAtDesc(String bookingNumber);

    Page<Payment> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT p FROM Payment p WHERE (:status IS NULL OR p.status = :status) ORDER BY p.createdAt DESC")
    Page<Payment> findAllWithFilter(@Param("status") PaymentStatus status, Pageable pageable);

    long countByStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal calculateTotalSuccessfulRevenue();

    @Query("SELECT COALESCE(SUM(p.refundAmount), 0) FROM Payment p WHERE p.status = 'REFUNDED'")
    BigDecimal calculateTotalRefundedAmount();
}
