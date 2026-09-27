package com.travelwithus.payment.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class MockStripeRazorpayGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(MockStripeRazorpayGateway.class);

    @Override
    public PaymentGatewayResult processPayment(PaymentGatewayRequest request) {
        log.info("MockGateway: processing payment for reference={}, method={}, amount={}",
                request.getPaymentReference(), request.getPaymentMethod(), request.getAmount());

        String cardLastFour = null;
        if (request.getCardNumber() != null && request.getCardNumber().length() >= 4) {
            String digits = request.getCardNumber().replaceAll("\\s+", "");
            if (digits.length() >= 4) {
                cardLastFour = digits.substring(digits.length() - 4);
            }
        }

        // Simulate decline card scenario for testing
        if (request.getCardNumber() != null && (request.getCardNumber().endsWith("0002") || request.getCardNumber().endsWith("0000"))) {
            log.warn("MockGateway: Card declined for reference: {}", request.getPaymentReference());
            return PaymentGatewayResult.failure("Your card was declined. Insufficient funds or invalid card details.");
        }

        // Generate provider-specific transaction ID
        String transactionId;
        switch (request.getPaymentMethod()) {
            case CREDIT_CARD:
            case DEBIT_CARD:
                transactionId = "ch_stripe_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
                break;
            case UPI:
                transactionId = "pay_razor_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
                break;
            case PAYPAL:
                transactionId = "PAYID-" + UUID.randomUUID().toString().replace("-", "").toUpperCase().substring(0, 14);
                break;
            default:
                transactionId = "txn_net_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        }

        log.info("MockGateway: Payment approved. Gateway transactionId: {}", transactionId);
        return PaymentGatewayResult.success(transactionId, cardLastFour);
    }

    @Override
    public RefundGatewayResult processRefund(String transactionId, BigDecimal amount) {
        log.info("MockGateway: processing refund for original txn={}, amount={}", transactionId, amount);
        String refundTxnId = "re_stripe_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        return RefundGatewayResult.success(refundTxnId);
    }
}
