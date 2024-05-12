package com.SFAE.SFAE.INTERFACE;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.SFAE.SFAE.ENTITY.Customer;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    @Query("SELECT c FROM Customer c ORDER BY CAST(SUBSTRING(c.id, 2) AS int)")
    List<Customer> findAllOrderedById();
}