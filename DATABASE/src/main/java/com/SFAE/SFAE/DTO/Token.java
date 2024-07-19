package com.SFAE.SFAE.DTO;

import java.time.LocalDateTime;

import com.SFAE.SFAE.ENUM.TokenType;

import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity 
public class Token {

    @Id
    private Long id;
    private String token;
    private String receiver;
    private LocalDateTime expiryDate;
    private TokenType type;
}
