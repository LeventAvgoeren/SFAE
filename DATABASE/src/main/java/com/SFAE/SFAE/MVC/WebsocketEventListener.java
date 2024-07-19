package com.SFAE.SFAE.MVC;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import com.SFAE.SFAE.ENTITY.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * Event listener for WebSocket events.
 * Handles disconnect and subscribe events for WebSocket connections.
 * 
 * @author erayzor
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketEventListener{

    private final SimpMessageSendingOperations messageTemplate;

    /**
     * Handles WebSocket disconnect events.
     * 
     * @param event The {@link SessionDisconnectEvent} representing the disconnect event.
     */
    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        @SuppressWarnings("null")
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if(username != null){
            log.info("User disconnected: {}", username);
            var chatMessage = Message.builder()
                .sender(username)
                .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }

    /**
     * Handles WebSocket subscribe events.
     * 
     * @param event The {@link SessionSubscribeEvent} representing the subscribe event.
     */
    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        log.info("New subscription: sessionId = {}, destination = {}", sessionId, destination);
    }
}
