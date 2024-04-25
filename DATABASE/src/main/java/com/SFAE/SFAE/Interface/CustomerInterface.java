
package com.SFAE.SFAE.Interface;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.SFAE.SFAE.Entity.Customer;
@RepositoryRestResource
public interface CustomerInterface extends JpaRepository<Customer, Long> {

    
}