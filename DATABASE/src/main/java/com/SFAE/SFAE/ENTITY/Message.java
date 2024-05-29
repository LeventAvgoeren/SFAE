package com.SFAE.SFAE.ENTITY;

import java.util.Date;

import com.SFAE.SFAE.ENUM.MessageType;

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

    @Column(name = "NAME")
    private String name;
    @Column(name = "CONTENT")
    private String content;
    @Column(name = "TIME")
    private Date time;

    private MessageType type;

    public Message(String htmlEscape, String htmlEscape2, Date date) {
    }
}