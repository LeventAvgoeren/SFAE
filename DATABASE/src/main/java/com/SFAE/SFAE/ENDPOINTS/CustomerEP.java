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

import com.SFAE.SFAE.DTO.ContractStatusDTO;
import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.DTO.LoginRequest;
import com.SFAE.SFAE.DTO.PasswordResetRequest;
import com.SFAE.SFAE.DTO.RoleDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


/**
 * Endpoint interface for managing Customer entities.
 * 
 * This interface defines the endpoints for managing customer-related operations
 * in the system.
 * It includes methods for creating, retrieving, updating, and deleting
 * customers, as well as a method for customer login.
 * 
 * @author erayzor
 */
@RequestMapping("/customer")
public interface CustomerEP {

    /**
     * Creates a new customer.
     * 
     * @param customerData  The data of the customer to create.
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
    ResponseEntity<?> deleteCustomerById(@PathVariable("id") String id);

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
    ResponseEntity<?> findCustomerById(@PathVariable("id") String id);

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
     * @param jsonData      The data of the customer to update.
     * @param bindingResult The binding result for validation.
     * @return ResponseEntity containing the result of the operation.
     */
    @PutMapping("")
    ResponseEntity<?> updateCustomer(@Valid @RequestBody CustomerDTO jsonData, BindingResult bindingResult);

    /**
     * Logs in a customer.
     * 
     * @param loginRequest  The login request data.
     * @param bindingResult The binding result for validation.
     * @return ResponseEntity containing the result of the operation.
     */
    @PostMapping("/login")
    ResponseEntity<?> LoginCustomer(@RequestBody LoginRequest loginRequest, BindingResult bindingResult,
            HttpServletResponse response);

    /**
     * Checks the login status of the customer.
     * 
     * @param request  The HTTP servlet request.
     * @param response The HTTP servlet response.
     * @return A ResponseEntity containing the login status of the customer.
     */
    @GetMapping("/login")
    ResponseEntity<?> checkLoginStatus(HttpServletRequest request, HttpServletResponse response);

    /**
     * Logs out the currently logged-in customer.
     * 
     * @param response The HTTP servlet response.
     * @return A ResponseEntity indicating the result of the logout operation.
     */
    @DeleteMapping("/logout")
    ResponseEntity<?> logout(HttpServletResponse response);

    /**
     * Counts all customers currently registered in the system.
     * 
     * This endpoint retrieves the total number of customers from the database and
     * returns that count.
     * It is useful for administrative purposes where a quick total count of
     * registered customers is needed.
     *
     * @return ResponseEntity containing the count of all customers or an error
     *         response if the operation fails.
     *         The response typically contains the count as a long integer within
     *         the body on successful retrieval,
     *         or an HttpStatus.INTERNAL_SERVER_ERROR if there is an issue accessing
     *         the data.
     */
    @GetMapping("/all")
    ResponseEntity<?> countAllCustomers();


/**
 * Requests a password reset for the user associated with the provided email.
 * 
 * @param email The email address of the user requesting a password reset.
 * @return ResponseEntity<?> indicating the result of the password reset request.
 *         Returns HttpStatus.OK if the request is successful, HttpStatus.NOT_FOUND if no user is associated with the provided email.
 */
    @PutMapping("/passwordreset")
    ResponseEntity<?> requestResetPassword(@RequestBody String email);


/**
 * Resets the password for the user based on the provided password reset request data.
 * 
 * @param data The PasswordResetRequest object containing the necessary data to reset the password.
 * @return ResponseEntity<?> indicating the result of the password reset operation.
 *         Returns HttpStatus.OK if the password is successfully reset, HttpStatus.BAD_REQUEST if the provided data is invalid.
 */   
    @PutMapping("/updatepassword")
    ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest data);



/**
 * Retrieves the customer's image as a Base64 encoded string based on the provided customer ID.
 * 
 * @param id The ID of the customer whose image is to be retrieved.
 * @return ResponseEntity<?> containing the customer's image in Base64 format.
 *         Returns HttpStatus.OK if the image is successfully retrieved, HttpStatus.NOT_FOUND if the customer does not exist or has no image.
 */
    @GetMapping("/{id}/image")
    ResponseEntity<?> getCustomerImageAsBase64(@PathVariable("id") String id);


/**
 * Verifies the customer's email based on the provided token.
 * 
 * @param token The token used to verify the customer's email.
 * @return ResponseEntity<?> indicating the result of the email verification.
 *         Returns HttpStatus.OK if the email is successfully verified, HttpStatus.FORBIDDEN if the token is invalid or expired.
 */
    @PutMapping("/verifyEmail/{token}")
    ResponseEntity<?> verifyEmail(@PathVariable("token") String token);

/**
 * Updates the role of the customer based on the provided role data.
 * 
 * @param data The RoleDTO object containing the necessary data to update the customer's role.
 * @return ResponseEntity<?> indicating the result of the role update operation.
 *         Returns HttpStatus.OK if the role is successfully updated, HttpStatus.BAD_REQUEST if the provided data is invalid.
 */   
    @PutMapping("/updateRole")
    ResponseEntity<?> updateCustomerRole(@RequestBody RoleDTO data);

/**
 * Updates the status of the customer's order based on the provided contract status data.
 * 
 * @param data The ContractStatusDTO object containing the necessary data to update the customer's order status.
 * @return ResponseEntity<?> indicating the result of the status update operation.
 *         Returns HttpStatus.OK if the status is successfully updated, HttpStatus.BAD_REQUEST if the provided data is invalid.
 */ 
    @PutMapping("/updateStatusOrder")
    ResponseEntity<?> updateCustomerStatusOrder(@RequestBody ContractStatusDTO data);


}
