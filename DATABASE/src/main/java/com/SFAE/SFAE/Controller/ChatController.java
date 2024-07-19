package com.SFAE.SFAE.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.ENTITY.Message;
import com.SFAE.SFAE.INTERFACE.MessageRepository;
import com.SFAE.SFAE.Service.ChatService;


@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository chatMessageRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(Message chatMessage) {
        chatMessage.setTimestamp(System.currentTimeMillis());
        chatMessageRepository.save(chatMessage);

        String destination = "/topic/" + chatMessage.getReceiver();
        messagingTemplate.convertAndSend(destination, chatMessage);
    }

    @MessageMapping("/chat.typing")
    public void typing(Message typingMessage) {
        String destination = "/topic/" + typingMessage.getReceiver();
        typingMessage.setContent("");
        messagingTemplate.convertAndSend(destination, typingMessage);
    }

}


@RestController
class ChatHistoryController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/chat/history")
    public List<Message> getChatHistory(@RequestParam String user1, @RequestParam String user2) {
        return chatService.getChatMessages(user1, user2);
    }

    @DeleteMapping("/chat/history")
    public void deleteChatHistory(@RequestParam String user1, @RequestParam String user2) {
        chatService.deleteChatMessages(user1, user2);
    }
}