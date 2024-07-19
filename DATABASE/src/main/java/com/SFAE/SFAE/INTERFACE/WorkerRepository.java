package com.SFAE.SFAE.INTERFACE;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.SFAE.SFAE.ENTITY.Worker;


/**
 * Repository interface for managing Worker entities.
 * Provides methods for retrieving workers ordered by their ID.
 */
@Repository
public interface WorkerRepository extends JpaRepository<Worker, String> {
    
    /**
     * Finds all worker IDs ordered by the numeric part of the ID.
     * 
     * @return A list of worker IDs ordered by the numeric part of the ID.
     */
    @Query("SELECT w.id FROM Worker w ORDER BY CAST(SUBSTRING(w.id, 2) AS INTEGER)")
    List<String> findAllOrderedById();
}