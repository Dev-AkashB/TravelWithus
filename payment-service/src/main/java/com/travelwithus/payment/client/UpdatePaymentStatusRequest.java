package com.travelwithus.payment.client;

public class UpdatePaymentStatusRequest {

    private String paymentStatus;
    private String paymentTransactionId;

    public UpdatePaymentStatusRequest() {
    }

    public UpdatePaymentStatusRequest(String paymentStatus, String paymentTransactionId) {
        this.paymentStatus = paymentStatus;
        this.paymentTransactionId = paymentTransactionId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public void setPaymentTransactionId(String paymentTransactionId) {
        this.paymentTransactionId = paymentTransactionId;
    }
}
