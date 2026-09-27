package com.travelwithus.booking.dto;

import com.travelwithus.booking.entity.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdatePaymentStatusRequest {

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;

    @NotBlank(message = "Payment transaction ID is required")
    private String paymentTransactionId;

    public UpdatePaymentStatusRequest() {
    }

    public UpdatePaymentStatusRequest(PaymentStatus paymentStatus, String paymentTransactionId) {
        this.paymentStatus = paymentStatus;
        this.paymentTransactionId = paymentTransactionId;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public void setPaymentTransactionId(String paymentTransactionId) {
        this.paymentTransactionId = paymentTransactionId;
    }
}
