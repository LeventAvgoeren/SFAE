package com.SFAE.SFAE.INTERFACE;

import java.util.Optional;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;

/**
 *  Public interface of a factory that creates objects for datamodel classes
 * 
 *  @author erayzor
 */
public interface DataFactoryInterface {


    /**
     * Create new Customer object from parameters.
     * 
     * @param id unique identifier, PRIMARY KEY in database.
     * @param name Customer name (as single String).
     * @param password Customer password.
     * @param email Email of the Customer
     * @param role Customer role.
     * @return Optional with object or empty when no object could be created from parameters.
     */
    Optional<Customer> createCustomer(String id, String name, String password, String email, String role);


     /**
     * Create new Vehicle object from parameters.
     * 
     * @param id unique identifier, PRIMARY KEY in database.
     * @param name Name of the Worker
     * @param location the current Location of the Worker, e.g. "latitude:52. longitude:13"
     * @param password hashed password.
     * @param enail E-Mail of the Worker.
     * @param status Status of the Worker (Status Enum).
     * @param statusOrder statusOrder of the current Job (StatusOrder enum).
     * @param range the specified perimeter that the Worker is willing to go.
     * @param jobType What kind of Job the Worker wants to do.
     * @param minPayment What is the minimun amount of Money that the Worker demands
     * @param rating the Rating from the Customer
     * @param verification is the Worker a verficiated Worker
     */
    
     Optional<Worker> createWorker(String id, String name, String location, String password,
     String email, String status, Double range, String jobType, 
     String StatusOrder, Double minPayment, Double rating, Boolean verification,Double latitude,Double longitude,String slogan);

    
}
