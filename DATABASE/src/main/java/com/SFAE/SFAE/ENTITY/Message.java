package com.SFAE.SFAE.ENTITY;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a message entity in the system.
 * This entity stores details about a message, including sender, receiver, content, timestamp, and type.
 * @author erayzor
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String sender;
    
    private String receiver;
    
    private String content;

    private Long timestamp;

    private String type;
}
