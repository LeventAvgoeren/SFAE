package com.SFAE.SFAE.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.LoginResponseCustomer;
import com.SFAE.SFAE.ENDPOINTS.CustomerEP;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.Service.Authentication;
import com.SFAE.SFAE.Service.MailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;

/**
 * Controller for handling customer-related operations.
 * This class provides endpoints for managing customers including creation,
 * deletion, updating,
 * and retrieving customer details by various identifiers.
 *
 * @author erayzor
 */

@RestController
class CustomerController implements CustomerEP {

    @Autowired
    private CustomerInterface dao;

    @Autowired
    private Authentication auth;

    @Autowired
    private CustomerImp cus;

    @Autowired
    private MailService mail;

    private Logger logger;

    /**
     * Finds a customer by their ID.
     * If the customer is found, returns a ResponseEntity containing the customer
     * data.
     * If the customer ID is negative, or the customer is not found, appropriate
     * HTTP status is returned.
     *
     * @param id the ID of the customer to find
     * @return ResponseEntity containing the customer or an error message
     */
    @Override
    public ResponseEntity<Customer> findCustomerById(long id) {

        if (id < 0L) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Customer id: %d negative", id, HttpStatus.BAD_REQUEST.value()));
        }

        try {
            Customer found = dao.findCustomerbyID(id);
            if (found != null) {
                return ResponseEntity.status(HttpStatus.OK).body(found);
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Creates a new customer from the provided CustomerDTO object.
     * Validates the customer data before saving. If the validation fails, or the
     * customer data is incomplete,
     * a BAD_REQUEST is returned. On successful creation, sends a welcome email and
     * returns the created customer data.
     *
     * @param customerData  the customer data to create
     * @param bindingResult contains errors if validation fails
     * @return ResponseEntity indicating success or failure of creation
     */
    @Override
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CustomerDTO customerData, BindingResult bindingResult) {
        System.out.println(customerData.getPassword());
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .collect(Collectors.toList()));
        }


        try {
            Customer customer = dao.createCustomer(customerData);

            if (customer != null) {
                mail.sendSimpleMessage(customerData.getEmail(), "Wilkommen bei SFAE", "Customer erstellt");
                return ResponseEntity.status(HttpStatus.CREATED).body(customer);
            }

        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    /**
     * Deletes a customer by their ID.
     * If the deletion is successful, returns an OK status.
     * If the customer ID is negative or the customer cannot be found, returns the
     * appropriate error status.
     *
     * @param id the ID of the customer to delete
     * @return ResponseEntity indicating success or failure of deletion
     */
    @Override
    public ResponseEntity<?> deleteCustomerById(long id) {

        if (id < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Customer id: %d negative", id, HttpStatus.BAD_REQUEST.value()));
        }

        try {
            boolean Answer = dao.deleteCustomerById(id);

            if (Answer) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Retrieves all customers from the database.
     * This method returns an Iterable of all Customer entities. If the database
     * access is successful,
     * it returns the customers with an HTTP status of OK. In case of any data
     * access issues,
     * logs the error and returns an INTERNAL_SERVER_ERROR status.
     *
     * @return ResponseEntity containing either an Iterable of Customer objects or
     *         an error status.
     * @throws DataAccessException if there is a problem accessing the database
     */
    @Override
    public ResponseEntity<Iterable<?>> findAllCustomers() {

        try {
            Iterable<Customer> customer = dao.findAllCustomer();

            return ResponseEntity.status(HttpStatus.OK).body(customer);
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    /**
     * Finds a customer by their name.
     * Returns a ResponseEntity with customer details if found.
     * If the name is blank or the customer is not found, returns appropriate error
     * status.
     *
     * @param name the name of the customer to find
     * @return ResponseEntity containing the customer or an error message
     */
    @Override
    public ResponseEntity<Customer> findCustomerByName(String name) {
        if (name.isBlank() || name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Customer name is empty. ", HttpStatus.BAD_REQUEST.value()));
        }

        try {
            Customer customer = dao.findCustomerbyName(name);
            if (customer != null) {
                return ResponseEntity.status(HttpStatus.OK).body(customer);
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Updates a customer's data.
     * Validates the provided data before updating. If the validation fails or
     * required fields are missing,
     * returns a BAD_REQUEST. On successful update, returns the updated customer
     * data.
     *
     * @param jsonData      the customer data to update
     * @param bindingResult contains errors if validation fails
     * @return ResponseEntity indicating success or failure of the update
     */
    @Override
    public ResponseEntity<?> updateCustomer(@Valid @RequestBody CustomerDTO jsonData, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .collect(Collectors.toList()));
        }

        if (jsonData.getId() == null || jsonData.getRole().equals(null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            Customer customer = dao.updateCustomer(jsonData);
            if (customer != null) {
                return ResponseEntity.status(HttpStatus.OK).body(customer);
            }
        } catch (DataAccessException dax) {
            logger.error("Database access error: " + dax.getMessage(), dax);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Handles customer login requests.
     * Validates the login request data. If the validation fails, returns a
     * BAD_REQUEST with details of the errors.
     * On successful login, returns a token and customer details. If authentication
     * fails, returns NOT_FOUND.
     *
     * @param loginRequest  the login request details
     * @param bindingResult contains errors if validation fails
     * @return ResponseEntity containing the login token and customer data or an
     *         error message
     */
    @Override
    public ResponseEntity<?> LoginCustomer(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage())
                    .collect(Collectors.toList()));
        }

        try {
            String token = auth.loginCustomer(loginRequest.getEmail(), loginRequest.getPassword());

            if (!token.isBlank()) {
                Customer customer = cus.findEmail(loginRequest.getEmail());

                return ResponseEntity.status(HttpStatus.OK)
                        .body(new LoginResponseCustomer(String.valueOf(customer.getId()),
                                customer.getRole().toString(), token));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Authentication failed");
            }
        } catch (DataAccessException dax) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database access error");
        }
    }

}
