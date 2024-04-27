
package com.SFAE.SFAE.INTERFACE;


import java.util.Map;
import java.util.Optional;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Customer;

/**
 * @author erayzor
 */

public interface CustomerInterface {

    long countCustomer();

    Iterable<Customer> findAllCustomer();

    Optional<Customer> findCustomerbyID(long id);

    Customer findCustomerbyName(String Name);

    Customer createCustomer(CustomerDTO jsonData);

    Boolean deleteCustomerById(long id);

    Customer updateCustomer(Map<String, Object> jsonData);
}