package com.SFAE.SFAE.INTERFACE;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SFAE.SFAE.DTO.Token;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;




@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findByToken(String token);
}