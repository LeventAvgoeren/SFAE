package com.SFAE.SFAE.Controller;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.SFAE.SFAE.ENTITY.Message;


@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(Message chatMessage) {
        String destination = "/topic/" + chatMessage.getReceiverId();
        messagingTemplate.convertAndSend(destination, chatMessage);
    }
}
