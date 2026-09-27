package com.travelwithus.payment.gateway;

import com.travelwithus.payment.entity.PaymentMethod;

import java.math.BigDecimal;

public class PaymentGatewayRequest {

    private String paymentReference;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod paymentMethod;
    private String cardNumber;
    private String expiryMonth;
    private String expiryYear;
    private String cvv;
    private String upiId;

    public PaymentGatewayRequest() {
    }

    public PaymentGatewayRequest(String paymentReference, BigDecimal amount, String currency,
                                 PaymentMethod paymentMethod, String cardNumber,
                                 String expiryMonth, String expiryYear, String cvv, String upiId) {
        this.paymentReference = paymentReference;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.cardNumber = cardNumber;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.cvv = cvv;
        this.upiId = upiId;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpiryMonth() {
        return expiryMonth;
    }

    public void setExpiryMonth(String expiryMonth) {
        this.expiryMonth = expiryMonth;
    }

    public String getExpiryYear() {
        return expiryYear;
    }

    public void setExpiryYear(String expiryYear) {
        this.expiryYear = expiryYear;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }
}
