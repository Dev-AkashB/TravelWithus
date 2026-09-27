package com.travelwithus.payment.gateway;

public class RefundGatewayResult {

    private final boolean successful;
    private final String refundTransactionId;
    private final String errorMessage;

    public RefundGatewayResult(boolean successful, String refundTransactionId, String errorMessage) {
        this.successful = successful;
        this.refundTransactionId = refundTransactionId;
        this.errorMessage = errorMessage;
    }

    public static RefundGatewayResult success(String refundTransactionId) {
        return new RefundGatewayResult(true, refundTransactionId, null);
    }

    public static RefundGatewayResult failure(String errorMessage) {
        return new RefundGatewayResult(false, null, errorMessage);
    }

    public boolean isSuccessful() {
        return successful;
    }

    public String getRefundTransactionId() {
        return refundTransactionId;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
