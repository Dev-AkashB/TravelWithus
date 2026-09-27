package com.travelwithus.notification.controller;

import com.travelwithus.notification.dto.*;
import com.travelwithus.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notification Management", description = "Endpoints for managing user alerts, in-app notifications, and WebSocket broadcasts")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user notifications with pagination")
    public ResponseEntity<Page<NotificationDto>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, pageable));
    }

    @GetMapping("/user/{userId}/unread-count")
    @Operation(summary = "Get badge count of unread notifications for a user")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a single notification as read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/user/{userId}/read-all")
    @Operation(summary = "Mark all notifications as read for a user")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable Long userId) {
        int updated = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("markedRead", updated, "message", "All notifications marked as read"));
    }

    @PostMapping("/send")
    @Operation(summary = "Send a notification via email, in-app, or WebSocket")
    public ResponseEntity<NotificationDto> sendNotification(@Valid @RequestBody SendNotificationRequest request) {
        NotificationDto response = notificationService.sendNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/broadcast")
    @Operation(summary = "Broadcast a real-time announcement to all WebSocket subscribers")
    public ResponseEntity<Map<String, String>> broadcastMessage(@Valid @RequestBody BroadcastNotificationRequest request) {
        notificationService.broadcastMessage(request);
        return ResponseEntity.ok(Map.of("status", "broadcast_sent", "topic", request.getTopic()));
    }

    @GetMapping("/admin/stats")
    @Operation(summary = "Get notification volume metrics and delivery counts")
    public ResponseEntity<NotificationStatsDto> getStats() {
        return ResponseEntity.ok(notificationService.getStats());
    }
}
