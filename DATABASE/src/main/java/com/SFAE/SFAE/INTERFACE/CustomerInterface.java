
package com.SFAE.SFAE.INTERFACE;


import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Customer;

/**
 * Interface for managing Customer entities.
 * 
 * This interface provides methods to manage Customer entities in the system.
 * 
 * @author erayzor
 */
public interface CustomerInterface{

    /**
     * Counts the total number of Customer entities in the database.
     *
     * @return The total count of Customers.
     */
    long countCustomer();

    /**
     * Retrieves all Customers from the database.
     *
     * @return An Iterable collection of Customer entities.
     */
    Iterable<Customer> findAllCustomer();

    /**
     * Retrieves a Customer by their unique identifier.
     *
     * @param id The unique ID of the Customer.
     * @return A Customer entity if found, otherwise null.
     */
    Customer findCustomerbyID(String id);

    /**
     * Finds a Customer by their name.
     *
     * @param name The name of the Customer to find.
     * @return A Customer entity if found, otherwise null.
     */
    Customer findCustomerbyName(String Name);

    /**
     * Creates a new Customer in the database based on the provided data.
     *
     * @param jsonData The CustomerDTO object containing the details of the new Customer.
     * @return The newly created Customer entity.
     */
    Customer createCustomer(CustomerDTO jsonData);

    /**
     * Deletes a Customer from the database by their ID.
     *
     * @param id The ID of the Customer to delete.
     * @return True if the deletion was successful, otherwise false.
     */
    Boolean deleteCustomerById(String id);

    /**
     * Updates the details of an existing Customer in the database.
     *
     * @param jsonData The CustomerDTO object containing updated fields for the Customer.
     * @return The updated Customer entity, or null if the update fails.
     */
    Customer updateCustomer(CustomerDTO jsonData);
}
