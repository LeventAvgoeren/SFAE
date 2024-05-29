package com.SFAE.SFAE.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SFAE.SFAE.ENTITY.Message;
import com.SFAE.SFAE.INTERFACE.MessageRepository;

@Service
public class ChatService {
    
    @Autowired
    private MessageRepository chatMessageRepository;

    public void saveMessage(Message chatMessage) {
        chatMessage.setTimestamp(System.currentTimeMillis());
        chatMessageRepository.save(chatMessage);
    }

    public List<Message> getChatMessages(String user1, String user2) {
        List<Message> messagesSent = chatMessageRepository.findBySenderAndReceiver(user1, user2);
        List<Message> messagesReceived = chatMessageRepository.findByReceiverAndSender(user1, user2);
        messagesSent.addAll(messagesReceived);
        messagesSent.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));
        return messagesSent;
    }

    public void deleteChatMessages(String user1, String user2) {
        chatMessageRepository.deleteBySenderAndReceiver(user1, user2);
        chatMessageRepository.deleteByReceiverAndSender(user1, user2);
    }
}
