package com.travelwithus.notification.dto;

import jakarta.validation.constraints.NotBlank;

public class BroadcastNotificationRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private String topic = "/topic/announcements";

    public BroadcastNotificationRequest() {
    }

    public BroadcastNotificationRequest(String title, String message, String topic) {
        this.title = title;
        this.message = message;
        this.topic = topic != null ? topic : "/topic/announcements";
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

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
