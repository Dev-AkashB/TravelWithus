package com.travelwithus.payment.service;

import com.travelwithus.payment.client.BookingClient;
import com.travelwithus.payment.client.UpdatePaymentStatusRequest;
import com.travelwithus.payment.dto.*;
import com.travelwithus.payment.entity.Payment;
import com.travelwithus.payment.entity.PaymentStatus;
import com.travelwithus.payment.exception.PaymentProcessingException;
import com.travelwithus.payment.exception.ResourceNotFoundException;
import com.travelwithus.payment.gateway.PaymentGateway;
import com.travelwithus.payment.gateway.PaymentGatewayRequest;
import com.travelwithus.payment.gateway.PaymentGatewayResult;
import com.travelwithus.payment.gateway.RefundGatewayResult;
import com.travelwithus.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final PaymentRepository paymentRepository;
    private final PaymentGateway paymentGateway;
    private final BookingClient bookingClient;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              PaymentGateway paymentGateway,
                              BookingClient bookingClient) {
        this.paymentRepository = paymentRepository;
        this.paymentGateway = paymentGateway;
        this.bookingClient = bookingClient;
    }

    @Override
    public PaymentResponseDto processPayment(ProcessPaymentRequest request) {
        log.info("Initiating payment for bookingNumber={}, amount={}, method={}",
                request.getBookingNumber(), request.getAmount(), request.getPaymentMethod());

        String paymentReference = generateUniquePaymentReference();

        Payment payment = new Payment();
        payment.setPaymentReference(paymentReference);
        payment.setBookingId(request.getBookingId());
        payment.setBookingNumber(request.getBookingNumber());
        payment.setUserId(request.getUserId());
        payment.setCustomerEmail(request.getCustomerEmail());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PENDING);

        PaymentGatewayRequest gatewayRequest = new PaymentGatewayRequest(
                paymentReference,
                request.getAmount(),
                payment.getCurrency(),
                request.getPaymentMethod(),
                request.getCardNumber(),
                request.getExpiryMonth(),
                request.getExpiryYear(),
                request.getCvv(),
                request.getUpiId()
        );

        PaymentGatewayResult result = paymentGateway.processPayment(gatewayRequest);

        if (result.isSuccessful()) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(result.getTransactionId());
            payment.setCardLastFour(result.getCardLastFour());
            payment.setPaidAt(LocalDateTime.now());
            Payment saved = paymentRepository.save(payment);

            // Notify booking service to confirm reservation
            try {
                bookingClient.updateBookingPaymentStatus(
                        request.getBookingNumber(),
                        new UpdatePaymentStatusRequest("PAID", saved.getPaymentReference())
                );
            } catch (Exception e) {
                log.warn("Failed to notify booking-service of successful payment: {}", e.getMessage());
            }

            log.info("Payment processed successfully with reference: {}", saved.getPaymentReference());
            return mapToDto(saved);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(result.getErrorMessage());
            Payment saved = paymentRepository.save(payment);

            log.warn("Payment failed for reference: {}. Reason: {}", saved.getPaymentReference(), result.getErrorMessage());
            return mapToDto(saved);
        }
    }

    @Override
    public RefundResponseDto refundPayment(String paymentReference, RefundRequestDto request) {
        log.info("Processing refund for paymentReference={}, amount={}", paymentReference, request.getAmount());

        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with reference: " + paymentReference));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new PaymentProcessingException("Only successful payments can be refunded. Current status: " + payment.getStatus());
        }

        if (request.getAmount().compareTo(payment.getAmount()) > 0) {
            throw new PaymentProcessingException("Refund amount cannot exceed original payment amount of " + payment.getAmount());
        }

        RefundGatewayResult result = paymentGateway.processRefund(payment.getTransactionId(), request.getAmount());

        if (!result.isSuccessful()) {
            throw new PaymentProcessingException("Gateway refund failed: " + result.getErrorMessage());
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundAmount(request.getAmount());
        payment.setRefundedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Notify booking service of refund
        try {
            bookingClient.updateBookingPaymentStatus(
                    payment.getBookingNumber(),
                    new UpdatePaymentStatusRequest("REFUNDED", payment.getPaymentReference())
            );
        } catch (Exception e) {
            log.warn("Failed to notify booking-service of refund: {}", e.getMessage());
        }

        return new RefundResponseDto(
                payment.getPaymentReference(),
                payment.getBookingNumber(),
                request.getAmount(),
                PaymentStatus.REFUNDED,
                result.getRefundTransactionId(),
                payment.getRefundedAt(),
                "Refund processed successfully"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByReference(String paymentReference) {
        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with reference: " + paymentReference));
        return mapToDto(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getPaymentsByBookingNumber(String bookingNumber) {
        return paymentRepository.findByBookingNumberOrderByCreatedAtDesc(bookingNumber)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDto> getUserPayments(Long userId, Pageable pageable) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDto> getAllPayments(PaymentStatus status, Pageable pageable) {
        return paymentRepository.findAllWithFilter(status, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentStatsDto getPaymentStats() {
        long total = paymentRepository.count();
        long success = paymentRepository.countByStatus(PaymentStatus.SUCCESS);
        long failed = paymentRepository.countByStatus(PaymentStatus.FAILED);
        long refunded = paymentRepository.countByStatus(PaymentStatus.REFUNDED);
        BigDecimal gross = paymentRepository.calculateTotalSuccessfulRevenue();
        BigDecimal refunds = paymentRepository.calculateTotalRefundedAmount();
        BigDecimal net = gross.subtract(refunds);

        return new PaymentStatsDto(total, success, failed, refunded, gross, refunds, net);
    }

    private String generateUniquePaymentReference() {
        String ref;
        do {
            StringBuilder sb = new StringBuilder("TWU-PAY-");
            for (int i = 0; i < 8; i++) {
                sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
            }
            ref = sb.toString();
        } while (paymentRepository.findByPaymentReference(ref).isPresent());
        return ref;
    }

    private PaymentResponseDto mapToDto(Payment payment) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setId(payment.getId());
        dto.setPaymentReference(payment.getPaymentReference());
        dto.setBookingId(payment.getBookingId());
        dto.setBookingNumber(payment.getBookingNumber());
        dto.setUserId(payment.getUserId());
        dto.setCustomerEmail(payment.getCustomerEmail());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setStatus(payment.getStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setCardLastFour(payment.getCardLastFour());
        dto.setFailureReason(payment.getFailureReason());
        dto.setRefundAmount(payment.getRefundAmount());
        dto.setRefundedAt(payment.getRefundedAt());
        dto.setPaidAt(payment.getPaidAt());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }
}
