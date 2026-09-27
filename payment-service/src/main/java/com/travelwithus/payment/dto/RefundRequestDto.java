package com.travelwithus.payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class RefundRequestDto {

    @NotNull(message = "Refund amount is required")
    @DecimalMin(value = "0.50", message = "Refund amount must be at least 0.50")
    private BigDecimal amount;

    private String reason;

    public RefundRequestDto() {
    }

    public RefundRequestDto(BigDecimal amount, String reason) {
        this.amount = amount;
        this.reason = reason;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
