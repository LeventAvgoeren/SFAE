package com.SFAE.SFAE.INTERFACE;
import org.springframework.data.jpa.repository.JpaRepository;

import com.SFAE.SFAE.ENTITY.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long>{
    List<Message> findBySenderAndReceiver(String sender, String receiver);
    List<Message> findByReceiverAndSender(String receiver, String sender);
}
