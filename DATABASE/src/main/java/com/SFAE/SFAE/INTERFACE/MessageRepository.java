package com.SFAE.SFAE.INTERFACE;
import org.springframework.data.jpa.repository.JpaRepository;
import com.SFAE.SFAE.ENTITY.Message;

import java.util.List;

/**
 * Repository interface for managing Message entities.
 * Provides methods for retrieving and deleting messages based on sender and receiver.
 */
public interface MessageRepository extends JpaRepository<Message, Long>{

    /**
     * Finds messages by sender and receiver.
     * 
     * @param sender The sender of the messages.
     * @param receiver The receiver of the messages.
     * @return A list of messages matching the sender and receiver.
     */
    List<Message> findBySenderAndReceiver(String sender, String receiver);

    /**
     * Finds messages by receiver and sender.
     * 
     * @param receiver The receiver of the messages.
     * @param sender The sender of the messages.
     * @return A list of messages matching the receiver and sender.
     */
    List<Message> findByReceiverAndSender(String receiver, String sender);

    /**
     * Deletes messages by sender and receiver.
     * 
     * @param sender The sender of the messages to be deleted.
     * @param receiver The receiver of the messages to be deleted.
     */
    void deleteBySenderAndReceiver(String sender, String receiver);

    /**
     * Deletes messages by receiver and sender.
     * 
     * @param receiver The receiver of the messages to be deleted.
     * @param sender The sender of the messages to be deleted.
     */
    void deleteByReceiverAndSender(String receiver, String sender);
}
