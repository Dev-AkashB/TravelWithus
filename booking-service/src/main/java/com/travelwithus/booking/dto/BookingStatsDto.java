package com.travelwithus.booking.dto;

import java.math.BigDecimal;

public class BookingStatsDto {

    private long totalBookings;
    private long confirmedBookings;
    private long pendingBookings;
    private long cancelledBookings;
    private long completedBookings;
    private BigDecimal totalRevenue;

    public BookingStatsDto() {
    }

    public BookingStatsDto(long totalBookings, long confirmedBookings, long pendingBookings,
                           long cancelledBookings, long completedBookings, BigDecimal totalRevenue) {
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.pendingBookings = pendingBookings;
        this.cancelledBookings = cancelledBookings;
        this.completedBookings = completedBookings;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getPendingBookings() {
        return pendingBookings;
    }

    public void setPendingBookings(long pendingBookings) {
        this.pendingBookings = pendingBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public long getCompletedBookings() {
        return completedBookings;
    }

    public void setCompletedBookings(long completedBookings) {
        this.completedBookings = completedBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
