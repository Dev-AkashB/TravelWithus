package com.travelwithus.notification.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.travelwithus.notification.dto.TravelEvent;
import com.travelwithus.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(KafkaEventConsumer.class);

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public KafkaEventConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @KafkaListener(topics = {"booking-events", "payment-events", "notification-events"}, groupId = "notification-service-group")
    public void consumeTravelEvent(String message) {
        log.info("Kafka consumer received event message: {}", message);
        try {
            TravelEvent event = objectMapper.readValue(message, TravelEvent.class);
            notificationService.processEvent(event);
        } catch (Exception e) {
            log.error("Failed to parse and process Kafka travel event message: {}", e.getMessage(), e);
        }
    }
}
