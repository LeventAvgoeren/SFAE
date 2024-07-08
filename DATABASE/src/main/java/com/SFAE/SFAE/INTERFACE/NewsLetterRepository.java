package com.SFAE.SFAE.INTERFACE;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.SFAE.SFAE.ENTITY.NewsLetter;

@Repository
public interface NewsLetterRepository extends JpaRepository<NewsLetter, String> {
  
}