package com.travelwithus.payment.dto;

import java.math.BigDecimal;

public class PaymentStatsDto {

    private long totalTransactions;
    private long successfulTransactions;
    private long failedTransactions;
    private long refundedTransactions;
    private BigDecimal totalGrossRevenue;
    private BigDecimal totalRefundedRevenue;
    private BigDecimal netRevenue;

    public PaymentStatsDto() {
    }

    public PaymentStatsDto(long totalTransactions, long successfulTransactions, long failedTransactions,
                           long refundedTransactions, BigDecimal totalGrossRevenue, BigDecimal totalRefundedRevenue,
                           BigDecimal netRevenue) {
        this.totalTransactions = totalTransactions;
        this.successfulTransactions = successfulTransactions;
        this.failedTransactions = failedTransactions;
        this.refundedTransactions = refundedTransactions;
        this.totalGrossRevenue = totalGrossRevenue;
        this.totalRefundedRevenue = totalRefundedRevenue;
        this.netRevenue = netRevenue;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getSuccessfulTransactions() {
        return successfulTransactions;
    }

    public void setSuccessfulTransactions(long successfulTransactions) {
        this.successfulTransactions = successfulTransactions;
    }

    public long getFailedTransactions() {
        return failedTransactions;
    }

    public void setFailedTransactions(long failedTransactions) {
        this.failedTransactions = failedTransactions;
    }

    public long getRefundedTransactions() {
        return refundedTransactions;
    }

    public void setRefundedTransactions(long refundedTransactions) {
        this.refundedTransactions = refundedTransactions;
    }

    public BigDecimal getTotalGrossRevenue() {
        return totalGrossRevenue;
    }

    public void setTotalGrossRevenue(BigDecimal totalGrossRevenue) {
        this.totalGrossRevenue = totalGrossRevenue;
    }

    public BigDecimal getTotalRefundedRevenue() {
        return totalRefundedRevenue;
    }

    public void setTotalRefundedRevenue(BigDecimal totalRefundedRevenue) {
        this.totalRefundedRevenue = totalRefundedRevenue;
    }

    public BigDecimal getNetRevenue() {
        return netRevenue;
    }

    public void setNetRevenue(BigDecimal netRevenue) {
        this.netRevenue = netRevenue;
    }
}
