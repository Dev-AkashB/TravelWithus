package com.travelwithus.payment.service;

import com.travelwithus.payment.dto.*;
import com.travelwithus.payment.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PaymentService {

    PaymentResponseDto processPayment(ProcessPaymentRequest request);

    RefundResponseDto refundPayment(String paymentReference, RefundRequestDto request);

    PaymentResponseDto getPaymentByReference(String paymentReference);

    List<PaymentResponseDto> getPaymentsByBookingNumber(String bookingNumber);

    Page<PaymentResponseDto> getUserPayments(Long userId, Pageable pageable);

    Page<PaymentResponseDto> getAllPayments(PaymentStatus status, Pageable pageable);

    PaymentStatsDto getPaymentStats();
}
