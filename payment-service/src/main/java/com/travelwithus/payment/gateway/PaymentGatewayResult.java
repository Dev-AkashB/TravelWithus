package com.travelwithus.payment.gateway;

public class PaymentGatewayResult {

    private final boolean successful;
    private final String transactionId;
    private final String cardLastFour;
    private final String errorMessage;

    public PaymentGatewayResult(boolean successful, String transactionId, String cardLastFour, String errorMessage) {
        this.successful = successful;
        this.transactionId = transactionId;
        this.cardLastFour = cardLastFour;
        this.errorMessage = errorMessage;
    }

    public static PaymentGatewayResult success(String transactionId, String cardLastFour) {
        return new PaymentGatewayResult(true, transactionId, cardLastFour, null);
    }

    public static PaymentGatewayResult failure(String errorMessage) {
        return new PaymentGatewayResult(false, null, null, errorMessage);
    }

    public boolean isSuccessful() {
        return successful;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getCardLastFour() {
        return cardLastFour;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
