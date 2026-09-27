package com.travelwithus.payment.gateway;

public interface PaymentGateway {

    PaymentGatewayResult processPayment(PaymentGatewayRequest request);

    RefundGatewayResult processRefund(String transactionId, java.math.BigDecimal amount);
}
