package com.SFAE.SFAE;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.INTERFACE.TokenRepository;
import com.SFAE.SFAE.Service.TokenMailService;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@SpringBootTest
public class TokenMailServiceTests {

    @Autowired
    private TokenMailService tokenService;

    @MockBean
    private TokenRepository tokenRepository;

    @Test
    public void testTokenExpiration() {
        // Set up
        String tokenString = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        Token token = new Token();
        token.setToken(tokenString);
        token.setExpiryDate(now.plusMinutes(5));

        when(tokenRepository.findByToken(anyString())).thenReturn(token);

        // Test token is valid
        assertTrue(tokenService.validateToken(tokenString));

        // Advance time by 6 minutes
        Clock clock = Clock.fixed(Instant.now().plusSeconds(360), ZoneId.systemDefault());
        LocalDateTime later = LocalDateTime.now(clock);

        // Simulate token expiry
        token.setExpiryDate(later.minusMinutes(1));
        assertFalse(tokenService.validateToken(tokenString));
    }
}
