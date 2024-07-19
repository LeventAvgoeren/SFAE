package com.SFAE.SFAE.INTERFACE;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.SFAE.SFAE.ENTITY.Customer;


/**
 * Spring Data JPA repository for {@link Customer} entities.
 * 
 * This repository interface provides CRUD operations and additional query methods for interacting with the database
 * table corresponding to the {@link Customer} entity. It leverages Spring Data JPA to abstract away much of the
 * boilerplate database interaction code, simplifying data access and manipulation.
 *
 * Extending {@link JpaRepository} provides methods for saving, deleting, and finding {@link Customer} entities,
 * along with pagination and sorting capabilities, enhancing the repository's functionality for managing customer data.
 */
public interface CustomerRepository extends JpaRepository<Customer, String> {
    @Query("SELECT c FROM Customer c ORDER BY CAST(SUBSTRING(c.id, 2) AS int)")
    List<Customer> findAllOrderedById();
}