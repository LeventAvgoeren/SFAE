package com.SFAE.SFAE.INTERFACE;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SFAE.SFAE.DTO.Token;



/**
 * Repository interface for accessing {@link Token} entities.
 *
 * This interface manages the data access layer for the {@link Token} entity, providing automatic
 * CRUD operations by extending the {@link JpaRepository}. It simplifies interactions with the database
 * for token management, allowing easy and efficient retrieval, storage, and deletion of token data.
 *
 * @author Repository
 */
@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findByToken(String token);
}