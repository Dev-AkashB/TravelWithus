package com.travelwithus.payment.controller;

import com.travelwithus.payment.dto.*;
import com.travelwithus.payment.entity.PaymentStatus;
import com.travelwithus.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payment Management", description = "Endpoints for processing payments, executing refunds, and checking transaction histories")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/process")
    @Operation(summary = "Process a travel reservation payment via payment gateway")
    public ResponseEntity<PaymentResponseDto> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        PaymentResponseDto response = paymentService.processPayment(request);
        HttpStatus status = response.getStatus() == PaymentStatus.SUCCESS ? HttpStatus.CREATED : HttpStatus.PAYMENT_REQUIRED;
        return ResponseEntity.status(status).body(response);
    }

    @PostMapping("/{paymentReference}/refund")
    @Operation(summary = "Execute a full or partial refund for a processed payment")
    public ResponseEntity<RefundResponseDto> refundPayment(
            @PathVariable String paymentReference,
            @Valid @RequestBody RefundRequestDto request) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentReference, request));
    }

    @GetMapping("/{paymentReference}")
    @Operation(summary = "Get payment details by payment reference")
    public ResponseEntity<PaymentResponseDto> getPaymentByReference(@PathVariable String paymentReference) {
        return ResponseEntity.ok(paymentService.getPaymentByReference(paymentReference));
    }

    @GetMapping("/booking/{bookingNumber}")
    @Operation(summary = "Get all payments associated with a specific booking")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByBookingNumber(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(paymentService.getPaymentsByBookingNumber(bookingNumber));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user payment transaction history with pagination")
    public ResponseEntity<Page<PaymentResponseDto>> getUserPayments(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(paymentService.getUserPayments(userId, pageable));
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Admin endpoint: list all payments with optional status filter")
    public ResponseEntity<Page<PaymentResponseDto>> getAllPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(paymentService.getAllPayments(status, pageable));
    }

    @GetMapping("/admin/stats")
    @Operation(summary = "Admin endpoint: payment financial analytics and totals")
    public ResponseEntity<PaymentStatsDto> getPaymentStats() {
        return ResponseEntity.ok(paymentService.getPaymentStats());
    }
}
