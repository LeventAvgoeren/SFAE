package com.SFAE.SFAE.ENTITY;

import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Table(name = "Chat")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Column(name = "SENDER_ID")
    private String senderId;
    
    @Column(name = "RECEIVER_ID")
    private String receiverId;
    
    @Column(name = "CONTENT")
    private String content;
}
