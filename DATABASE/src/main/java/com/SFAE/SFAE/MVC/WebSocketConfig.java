package com.SFAE.SFAE.MVC;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;



/**
 * Configuration class for setting up WebSocket messaging with STOMP (Simple Text Oriented Messaging Protocol).
 * This class implements the {@link WebSocketMessageBrokerConfigurer} interface to configure message broker options and STOMP endpoints.
 * @author erayzor
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configures the message broker.
     * 
     * @param config The {@link MessageBrokerRegistry} to configure the message broker.
     */
    @Override
    public void configureMessageBroker(@SuppressWarnings("null") MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Registers STOMP endpoints.
     * 
     * @param registry The {@link StompEndpointRegistry} to register STOMP endpoints.
     */
    @Override
    public void registerStompEndpoints(@SuppressWarnings("null") StompEndpointRegistry registry) {
        registry.addEndpoint("/chat").setAllowedOrigins("https://localhost:3000").withSockJS();
    }
}