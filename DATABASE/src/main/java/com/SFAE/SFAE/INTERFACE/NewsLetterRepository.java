package com.SFAE.SFAE.INTERFACE;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.SFAE.SFAE.ENTITY.NewsLetter;

@Repository
public interface NewsLetterRepository extends JpaRepository<NewsLetter, String> {

    @Query("SELECT n FROM NewsLetter n WHERE n.customerEmail IS NOT NULL AND n.customerEmail <> ''")
    List<NewsLetter> findAllNonEmptyCustomerEmail();
}