
package com.SFAE.SFAE.INTERFACE;


import java.util.Optional;


import com.SFAE.SFAE.ENTITY.Customer;

/**
 * @author erayzor
 */

public interface CustomerInterface {

    long countCustomer();

    Iterable<Customer> findAllCustomer();

    Optional<Customer> findCustomerbyID(long id);

    Customer findCustomerbyName(String Name);
}