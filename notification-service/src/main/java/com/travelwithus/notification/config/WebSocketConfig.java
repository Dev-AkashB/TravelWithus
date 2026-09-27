package com.travelwithus.notification.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SockJS fallback for browsers without native websocket support
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Direct pure STOMP endpoint
        registry.addEndpoint("/ws-direct")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Destination prefixes for outgoing messages to subscribers
        registry.enableSimpleBroker("/topic", "/queue");
        // Prefix for incoming messages sent from clients to server @MessageMapping handlers
        registry.setApplicationDestinationPrefixes("/app");
        // Prefix for user-targeted messages
        registry.setUserDestinationPrefix("/user");
    }
}
