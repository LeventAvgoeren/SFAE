package com.SFAE.SFAE.ENDPOINTS;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * REST API endpoints for managing token operations.
 */
@RequestMapping("/token")
public interface TokenEP {
    
    /**
     * Retrieves the content of the token based on the provided token string.
     * 
     * @param token The token string whose content is to be retrieved.
     * @return ResponseEntity<?> containing the content of the token.
     *         Returns HttpStatus.OK if the token content is successfully retrieved, HttpStatus.NOT_FOUND if the token does not exist or is invalid.
     */
    @GetMapping("/{token}")
    ResponseEntity<?> getTokenContent(@PathVariable String token);
}
