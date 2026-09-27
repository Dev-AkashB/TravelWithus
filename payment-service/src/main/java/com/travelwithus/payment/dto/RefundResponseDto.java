package com.travelwithus.payment.dto;

import com.travelwithus.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RefundResponseDto {

    private String paymentReference;
    private String bookingNumber;
    private BigDecimal refundedAmount;
    private PaymentStatus status;
    private String refundTransactionId;
    private LocalDateTime refundedAt;
    private String message;

    public RefundResponseDto() {
    }

    public RefundResponseDto(String paymentReference, String bookingNumber, BigDecimal refundedAmount,
                             PaymentStatus status, String refundTransactionId, LocalDateTime refundedAt, String message) {
        this.paymentReference = paymentReference;
        this.bookingNumber = bookingNumber;
        this.refundedAmount = refundedAmount;
        this.status = status;
        this.refundTransactionId = refundTransactionId;
        this.refundedAt = refundedAt;
        this.message = message;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public String getBookingNumber() {
        return bookingNumber;
    }

    public void setBookingNumber(String bookingNumber) {
        this.bookingNumber = bookingNumber;
    }

    public BigDecimal getRefundedAmount() {
        return refundedAmount;
    }

    public void setRefundedAmount(BigDecimal refundedAmount) {
        this.refundedAmount = refundedAmount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getRefundTransactionId() {
        return refundTransactionId;
    }

    public void setRefundTransactionId(String refundTransactionId) {
        this.refundTransactionId = refundTransactionId;
    }

    public LocalDateTime getRefundedAt() {
        return refundedAt;
    }

    public void setRefundedAt(LocalDateTime refundedAt) {
        this.refundedAt = refundedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
