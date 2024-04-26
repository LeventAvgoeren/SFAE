
package com.SFAE.SFAE.INTERFACE;


import java.util.Optional;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.SFAE.SFAE.ENTITY.Customer;

/**
 * @author erayzor
 */
@RepositoryRestResource
public interface CustomerInterface {

    long countCustomer();

    Iterable<Customer> findAllCustomer();

    Optional<Customer> findCustomerbyID(long id);

    Customer findCustomerbyName(String Name);
}