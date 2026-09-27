package com.travelwithus.notification.dto;

public class NotificationStatsDto {

    private long totalNotifications;
    private long deliveredCount;
    private long sentCount;
    private long failedCount;
    private long totalUnreadInApp;

    public NotificationStatsDto() {
    }

    public NotificationStatsDto(long totalNotifications, long deliveredCount, long sentCount,
                                long failedCount, long totalUnreadInApp) {
        this.totalNotifications = totalNotifications;
        this.deliveredCount = deliveredCount;
        this.sentCount = sentCount;
        this.failedCount = failedCount;
        this.totalUnreadInApp = totalUnreadInApp;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public long getDeliveredCount() {
        return deliveredCount;
    }

    public void setDeliveredCount(long deliveredCount) {
        this.deliveredCount = deliveredCount;
    }

    public long getSentCount() {
        return sentCount;
    }

    public void setSentCount(long sentCount) {
        this.sentCount = sentCount;
    }

    public long getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(long failedCount) {
        this.failedCount = failedCount;
    }

    public long getTotalUnreadInApp() {
        return totalUnreadInApp;
    }

    public void setTotalUnreadInApp(long totalUnreadInApp) {
        this.totalUnreadInApp = totalUnreadInApp;
    }
}
