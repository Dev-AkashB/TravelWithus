package com.travelwithus.notification.dto;

import com.travelwithus.notification.entity.NotificationEventType;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class TravelEvent {

    private String eventId;
    private NotificationEventType eventType;
    private Long userId;
    private String recipientEmail;
    private String recipientName;
    private String referenceNumber;
    private String title;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> metadata = new HashMap<>();

    public TravelEvent() {
        this.timestamp = LocalDateTime.now();
    }

    public TravelEvent(String eventId, NotificationEventType eventType, Long userId,
                       String recipientEmail, String recipientName, String referenceNumber,
                       String title, String message) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.userId = userId;
        this.recipientEmail = recipientEmail;
        this.recipientName = recipientName;
        this.referenceNumber = referenceNumber;
        this.title = title;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public NotificationEventType getEventType() {
        return eventType;
    }

    public void setEventType(NotificationEventType eventType) {
        this.eventType = eventType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }
}
