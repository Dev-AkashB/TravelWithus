package com.travelwithus.notification.service;

import com.travelwithus.notification.dto.*;
import com.travelwithus.notification.email.EmailService;
import com.travelwithus.notification.entity.*;
import com.travelwithus.notification.exception.ResourceNotFoundException;
import com.travelwithus.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   EmailService emailService,
                                   SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public NotificationDto sendNotification(SendNotificationRequest request) {
        log.info("Sending notification to user={}, email={}, type={}",
                request.getUserId(), request.getRecipientEmail(), request.getEventType());

        Notification notification = new Notification(
                request.getUserId(),
                request.getRecipientEmail(),
                request.getTitle(),
                request.getMessage(),
                request.getEventType(),
                request.getChannel() != null ? request.getChannel() : NotificationChannel.ALL,
                request.getReferenceNumber()
        );

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);

        // 1. Email Channel
        if (request.getRecipientEmail() != null &&
                (request.getChannel() == NotificationChannel.ALL || request.getChannel() == NotificationChannel.EMAIL)) {
            try {
                emailService.sendEmail(request.getRecipientEmail(), request.getTitle(), "<p>" + request.getMessage() + "</p>");
            } catch (Exception e) {
                log.warn("Failed to dispatch email notification: {}", e.getMessage());
            }
        }

        // 2. Real-Time WebSocket Channel
        if (request.getChannel() == NotificationChannel.ALL || request.getChannel() == NotificationChannel.WEBSOCKET) {
            pushWebSocketNotification(dto);
        }

        return dto;
    }

    @Override
    public void broadcastMessage(BroadcastNotificationRequest request) {
        String topic = request.getTopic() != null ? request.getTopic() : "/topic/announcements";
        log.info("Broadcasting message to WebSocket topic: {}", topic);
        try {
            messagingTemplate.convertAndSend(topic, request);
        } catch (Exception e) {
            log.warn("Failed to broadcast WebSocket message: {}", e.getMessage());
        }
    }

    @Override
    public void processEvent(TravelEvent event) {
        log.info("Processing travel event from Kafka: id={}, type={}", event.getEventId(), event.getEventType());

        Notification notification = new Notification(
                event.getUserId(),
                event.getRecipientEmail(),
                event.getTitle(),
                event.getMessage(),
                event.getEventType(),
                NotificationChannel.ALL,
                event.getReferenceNumber()
        );

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);

        // Dispatch Email according to event type
        if (event.getRecipientEmail() != null) {
            try {
                switch (event.getEventType()) {
                    case BOOKING_CONFIRMED -> {
                        String title = event.getMetadata().getOrDefault("itemTitle", "Travel Package");
                        String amount = event.getMetadata().getOrDefault("totalAmount", "0.00");
                        emailService.sendBookingConfirmation(
                                event.getRecipientEmail(),
                                event.getRecipientName(),
                                event.getReferenceNumber(),
                                title,
                                amount
                        );
                    }
                    case PAYMENT_SUCCESS -> {
                        String paymentRef = event.getMetadata().getOrDefault("paymentReference", event.getReferenceNumber());
                        String amount = event.getMetadata().getOrDefault("amount", "0.00");
                        emailService.sendPaymentReceipt(
                                event.getRecipientEmail(),
                                event.getRecipientName(),
                                paymentRef,
                                event.getReferenceNumber(),
                                amount
                        );
                    }
                    case BOOKING_CANCELLED -> {
                        String reason = event.getMetadata().getOrDefault("reason", "Customer requested cancellation");
                        emailService.sendCancellationNotice(
                                event.getRecipientEmail(),
                                event.getRecipientName(),
                                event.getReferenceNumber(),
                                reason
                        );
                    }
                    default -> emailService.sendEmail(event.getRecipientEmail(), event.getTitle(), "<p>" + event.getMessage() + "</p>");
                }
            } catch (Exception e) {
                log.warn("Failed to dispatch event email: {}", e.getMessage());
            }
        }

        // Dispatch real-time WebSocket alert
        pushWebSocketNotification(dto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDto> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadStatusFalse(userId);
    }

    @Override
    public NotificationDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        notification.setReadStatus(true);
        Notification updated = notificationRepository.save(notification);
        return mapToDto(updated);
    }

    @Override
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationStatsDto getStats() {
        long total = notificationRepository.count();
        long delivered = total;
        long sent = total;
        long failed = 0;
        long unread = notificationRepository.countByUserIdAndReadStatusFalse(1L);

        return new NotificationStatsDto(total, delivered, sent, failed, unread);
    }

    private void pushWebSocketNotification(NotificationDto dto) {
        try {
            // Broadcast to public notifications channel
            messagingTemplate.convertAndSend("/topic/notifications", dto);

            // User-targeted channel
            if (dto.getUserId() != null) {
                messagingTemplate.convertAndSend("/topic/user-" + dto.getUserId(), dto);
                messagingTemplate.convertAndSendToUser(dto.getUserId().toString(), "/queue/notifications", dto);
            }
        } catch (Exception e) {
            log.warn("Failed to push real-time WebSocket notification: {}", e.getMessage());
        }
    }

    private NotificationDto mapToDto(Notification entity) {
        NotificationDto dto = new NotificationDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setRecipientEmail(entity.getRecipientEmail());
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setEventType(entity.getEventType());
        dto.setChannel(entity.getChannel());
        dto.setStatus(entity.getStatus());
        dto.setReadStatus(entity.isReadStatus());
        dto.setReferenceNumber(entity.getReferenceNumber());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
