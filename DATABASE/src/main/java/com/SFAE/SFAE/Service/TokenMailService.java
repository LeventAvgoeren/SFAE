package com.SFAE.SFAE.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.INTERFACE.TokenRepository;
import java.util.UUID;



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
    public String createToken(long id, String workerId) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(60); // Setzt die Gültigkeit auf 5 Minuten

        Token newToken = new Token();
        newToken.setToken(token);
        newToken.setId(id);
        newToken.setWorkerId(workerId);
        newToken.setExpiryDate(expiryDate);
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
        if (foundToken != null && foundToken.getExpiryDate().isAfter(LocalDateTime.now())) {
            System.out.println(foundToken);
            return foundToken;
        }
        return null;
    }
}
