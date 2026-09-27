package com.travelwithus.notification.service;

import com.travelwithus.notification.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    NotificationDto sendNotification(SendNotificationRequest request);

    void broadcastMessage(BroadcastNotificationRequest request);

    void processEvent(TravelEvent event);

    Page<NotificationDto> getUserNotifications(Long userId, Pageable pageable);

    long getUnreadCount(Long userId);

    NotificationDto markAsRead(Long id);

    int markAllAsRead(Long userId);

    NotificationStatsDto getStats();
}
