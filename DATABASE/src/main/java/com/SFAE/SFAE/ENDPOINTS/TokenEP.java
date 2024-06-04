package com.SFAE.SFAE.ENDPOINTS;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/token")
public interface TokenEP {
    
    @GetMapping("/{token}")
    ResponseEntity<?> getTokenContent(@PathVariable String token);
}
