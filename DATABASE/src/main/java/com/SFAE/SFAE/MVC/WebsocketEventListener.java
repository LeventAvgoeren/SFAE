package com.SFAE.SFAE.MVC;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.SFAE.SFAE.ENTITY.Message;
import com.SFAE.SFAE.ENUM.MessageType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketEventListener{

    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if(username != null){
            log.info("User disconnected: {}", username);
            var chatMessage = Message.builder()
                              .type(MessageType.LEAVE)
                              .name(username)
                              .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
  
}