package com.SFAE.SFAE.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.SFAE.SFAE.ENTITY.Message;
import com.SFAE.SFAE.INTERFACE.MessageRepository;



/**
 * Service class for managing chat messages.
 * @author erayzor
 */
@Service
public class ChatService {
    
    @Autowired
    private MessageRepository chatMessageRepository;

    /**
     * Saves a chat message to the repository.
     * 
     * @param chatMessage The chat message to be saved.
     */
    public void saveMessage(Message chatMessage) {
        chatMessage.setTimestamp(System.currentTimeMillis());
        chatMessageRepository.save(chatMessage);
    }

    /**
     * Retrieves chat messages between two users.
     * 
     * @param user1 The first user.
     * @param user2 The second user.
     * @return A list of chat messages between the two users, sorted by timestamp.
     */
    public List<Message> getChatMessages(String user1, String user2) {
        List<Message> messagesSent = chatMessageRepository.findBySenderAndReceiver(user1, user2);
        List<Message> messagesReceived = chatMessageRepository.findByReceiverAndSender(user1, user2);
        messagesSent.addAll(messagesReceived);
        messagesSent.sort((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()));
        return messagesSent;
    }

    /**
     * Deletes chat messages between two users.
     * 
     * @param user1 The first user.
     * @param user2 The second user.
     */
    @Transactional
    public void deleteChatMessages(String user1, String user2) {
        chatMessageRepository.deleteBySenderAndReceiver(user1, user2);
        chatMessageRepository.deleteByReceiverAndSender(user1, user2);
    }
}
