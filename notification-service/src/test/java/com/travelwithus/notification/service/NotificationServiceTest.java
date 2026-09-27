package com.travelwithus.notification.service;

import com.travelwithus.notification.dto.BroadcastNotificationRequest;
import com.travelwithus.notification.dto.SendNotificationRequest;
import com.travelwithus.notification.dto.TravelEvent;
import com.travelwithus.notification.email.EmailService;
import com.travelwithus.notification.entity.Notification;
import com.travelwithus.notification.entity.NotificationChannel;
import com.travelwithus.notification.entity.NotificationEventType;
import com.travelwithus.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private NotificationServiceImpl notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationServiceImpl(notificationRepository, emailService, messagingTemplate);
    }

    @Test
    void testSendNotification_Success() {
        SendNotificationRequest request = new SendNotificationRequest();
        request.setUserId(1L);
        request.setRecipientEmail("user@travelwithus.com");
        request.setTitle("Booking Update");
        request.setMessage("Your booking has been received.");
        request.setEventType(NotificationEventType.BOOKING_CREATED);
        request.setChannel(NotificationChannel.ALL);

        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification n = invocation.getArgument(0);
            n.setId(10L);
            return n;
        });

        var result = notificationService.sendNotification(request);

        assertNotNull(result);
        assertEquals("Booking Update", result.getTitle());
        verify(emailService, times(1)).sendEmail(eq("user@travelwithus.com"), eq("Booking Update"), any());
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/notifications"), any(Object.class));
    }

    @Test
    void testProcessEvent_BookingConfirmed() {
        TravelEvent event = new TravelEvent();
        event.setEventId("EVT-1001");
        event.setEventType(NotificationEventType.BOOKING_CONFIRMED);
        event.setUserId(1L);
        event.setRecipientEmail("traveler@travelwithus.com");
        event.setRecipientName("Alex");
        event.setReferenceNumber("TWU-BKG-12345");
        event.setTitle("Booking Confirmed");
        event.setMessage("Pack your bags!");
        event.setMetadata(Map.of("itemTitle", "Paris Escape", "totalAmount", "1450.00"));

        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification n = invocation.getArgument(0);
            n.setId(20L);
            return n;
        });

        notificationService.processEvent(event);

        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(emailService, times(1)).sendBookingConfirmation(
                eq("traveler@travelwithus.com"), eq("Alex"), eq("TWU-BKG-12345"), eq("Paris Escape"), eq("1450.00")
        );
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/notifications"), any(Object.class));
    }

    @Test
    void testBroadcastMessage() {
        BroadcastNotificationRequest request = new BroadcastNotificationRequest("Sale", "50% off flights", "/topic/deals");
        notificationService.broadcastMessage(request);
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/deals"), eq(request));
    }

    @Test
    void testMarkAsRead() {
        Notification notification = new Notification();
        notification.setId(5L);
        notification.setReadStatus(false);

        when(notificationRepository.findById(5L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = notificationService.markAsRead(5L);
        assertTrue(result.isReadStatus());
    }
}
