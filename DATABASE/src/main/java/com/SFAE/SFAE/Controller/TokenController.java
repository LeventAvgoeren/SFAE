package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.SFAE.SFAE.DTO.Token;
import com.SFAE.SFAE.ENDPOINTS.TokenEP;
import com.SFAE.SFAE.Service.TokenMailService;

@Controller
public class TokenController implements TokenEP {
    @Autowired
    private TokenMailService mailService;

    @Override
    public ResponseEntity<?> getTokenContent(String token) {

        Token TestToken = mailService.validateToken(token);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.GONE).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(TestToken.getReceiver());
    }

}
