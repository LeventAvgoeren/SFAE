package com.SFAE.SFAE.ENDPOINTS;


import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.DTO.LoginRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @author erayzor
 */

/**
 * Endpoint interface for managing Customer entities.
 * 
 * This interface defines the endpoints for managing customer-related operations in the system.
 * It includes methods for creating, retrieving, updating, and deleting customers, as well as a method for customer login.
 * 
 * @author erayzor
 */
@RequestMapping("/customer")
public interface CustomerEP{

    /**
     * Creates a new customer.
     * 
     * @param customerData The data of the customer to create.
     * @param bindingResult The binding result for validation.
     * @return ResponseEntity containing the result of the operation.
     */
    @PostMapping("")
    ResponseEntity<?> createCustomer(@RequestBody CustomerDTO customerData, BindingResult bindingResult);

    /**
     * Deletes a customer by ID.
     * 
     * @param id The ID of the customer to delete.
     * @return ResponseEntity containing the result of the operation.
     */
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteCustomerById(@PathVariable("id") long id);

    /**
     * Retrieves all customers.
     * 
     * @return ResponseEntity containing an iterable collection of customers.
     */
    @GetMapping("")
    ResponseEntity<Iterable<?>> findAllCustomers();

    /**
     * Retrieves a customer by ID.
     * 
     * @param id The ID of the customer to retrieve.
     * @return ResponseEntity containing the result of the operation.
     */
    @GetMapping("/{id}")
    ResponseEntity<?> findCustomerById(@PathVariable("id") long id);

    /**
     * Retrieves a customer by name.
     * 
     * @param name The name of the customer to retrieve.
     * @return ResponseEntity containing the result of the operation.
     */
    @GetMapping("/usr/{name}")
    ResponseEntity<?> findCustomerByName(@PathVariable String name);

    /**
     * Updates an existing customer.
     * 
     * @param jsonData The data of the customer to update.
     * @param bindingResult The binding result for validation.
     * @return ResponseEntity containing the result of the operation.
     */
    @PutMapping("")
    ResponseEntity<?> updateCustomer(@Valid @RequestBody CustomerDTO jsonData, BindingResult bindingResult);

    /**
     * Logs in a customer.
     * 
     * @param loginRequest The login request data.
     * @param bindingResult The binding result for validation.
     * @return ResponseEntity containing the result of the operation.
     */
    @PostMapping("/login")
    ResponseEntity<?> LoginCustomer(@RequestBody LoginRequest loginRequest, BindingResult bindingResult, HttpServletResponse response);

    @GetMapping("/login")
    ResponseEntity<?> checkLoginStatus(HttpServletRequest request, HttpServletResponse response);

    @DeleteMapping("/logout")
    ResponseEntity<?> logout(HttpServletResponse response);
}
