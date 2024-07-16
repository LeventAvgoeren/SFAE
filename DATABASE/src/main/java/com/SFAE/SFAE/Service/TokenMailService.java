package com.SFAE.SFAE.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.ENUM.TokenType;
import com.SFAE.SFAE.INTERFACE.TokenRepository;
import java.util.UUID;


/**
 * Service class for managing token creation and validation, primarily for email verification and password reset functionality.
 * @author erayzor
 */
@Service
public class TokenMailService {

    @Autowired
    private TokenRepository tokenRepository;
    
    /**
     * Creates a unique token and associates it with an expiry time, which is set 5 minutes from the creation time.
     * This token is used for verifying actions within a limited timeframe.
     *
     * @return A uniquely generated token as a String, which remains valid for only 5 minutes after its creation.
     */
    public String createToken(long id, String receiver, TokenType type) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(60); // Setzt die Gültigkeit auf 60 Minuten

        Token newToken = new Token(); 
        newToken.setToken(token);
        newToken.setExpiryDate(expiryDate);
     
        if(TokenType.CONTRACT == type){
            newToken.setId(id);                 //Contract ID
            newToken.setReceiver(receiver);     //ID of the Worker
        } else if(TokenType.PASSWORDRESET == type){
            newToken.setId(id);                 // ID for the validation checking if the User requesting is a Customer = 0, Admin = 1 and Worker = 2.
            newToken.setReceiver(receiver);     //ID of the Person, who is requesting a password reset
        }
        else if(TokenType.VERIFYCUSTOMER== type){
            newToken.setId(id);
            newToken.setReceiver(receiver); 
        }
        else if(TokenType.VERIFYWORKER== type){
            newToken.setId(id);
            newToken.setReceiver(receiver); 
        }

        tokenRepository.save(newToken);
        return token;
    }

    /**
     * Checks if the provided token is still valid based on its expiry time.
     * A token is considered valid if the current time is before its expiry time.
     *
     * @param token The token to be validated.
     * @return true if the token is still valid, false otherwise.
     */
    public Token validateToken(String token) {
        Token foundToken = tokenRepository.findByToken(token);
        if (foundToken != null && LocalDateTime.now().isBefore(foundToken.getExpiryDate())) {
            return foundToken;
        }
        return null;
    }
}
