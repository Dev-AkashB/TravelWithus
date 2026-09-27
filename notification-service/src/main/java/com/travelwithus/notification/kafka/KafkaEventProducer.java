package com.travelwithus.notification.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.travelwithus.notification.dto.TravelEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventProducer {

    private static final Logger log = LoggerFactory.getLogger(KafkaEventProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public KafkaEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public void publishEvent(String topic, TravelEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            log.info("Publishing event to topic '{}': eventId={}, type={}", topic, event.getEventId(), event.getEventType());
            kafkaTemplate.send(topic, event.getReferenceNumber() != null ? event.getReferenceNumber() : event.getEventId(), json);
        } catch (Exception e) {
            log.error("Failed to publish event to Kafka topic '{}': {}", topic, e.getMessage());
        }
    }
}
