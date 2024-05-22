package com.SFAE.SFAE.ENDPOINTS;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.SFAE.SFAE.DTO.ContractDTO;

@RequestMapping("/contract")
public interface ContractEP {

    /**
     * Creates a new contract.
     * 
     * @param contract The data of the contract to create.
     * @return ResponseEntity containing the result of the operation.
     */
    @PostMapping("")
    ResponseEntity<?> createContract(@RequestBody ContractDTO contract, BindingResult bindingResult );

    /**
     * Deletes a contract by ID.
     * 
     * @param id The ID of the contract to delete.
     * @return ResponseEntity containing the result of the operation.
     */
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteContactById(@PathVariable("id") long id);

    /**
     * Retrieves a contract by ID.
     * 
     * @param id The ID of the contract to retrieve.
     * @return ResponseEntity containing the result of the operation.
     */
    @GetMapping("/{id}")
    ResponseEntity<?> findContractById(@PathVariable("id") long id);

    /**
     * Updates an existing contract.
     * 
     * @param contract The data of the contract to update.
     * @return ResponseEntity containing the result of the operation.
     */
    @PutMapping("")
    ResponseEntity<?> updateContract(@Valid @RequestBody ContractDTO contract, BindingResult bindingResult );


    /**
 * Retrieves the total number of contracts in the system.
 * 
 * @return ResponseEntity containing the total count of contracts or an error message if unable to retrieve data.
 */
    @GetMapping("/all")
    ResponseEntity<?> countAllCContracts();

/**
 * Retrieves all contracts associated with a specific customer identified by their ID.
 * 
 * @param id The unique identifier of the customer whose contracts are to be retrieved.
 * @return ResponseEntity containing a list of contracts or an error message if no contracts are found.
 */
    @GetMapping("/customer/{id}")
    ResponseEntity<?> findContractByCustomerId(@PathVariable("id") String id);
/**
 * Retrieves all contracts associated with a specific worker identified by their ID.
 * 
 * @param id The unique identifier of the worker whose contracts are to be retrieved.
 * @return ResponseEntity containing a list of contracts or an error message if no contracts are found.
 */
    @GetMapping("/worker/{id}")
    ResponseEntity<?> findContractByWorkerId(@PathVariable("id") String id);

    /**
 * Sets or updates the status of a contract based on the acceptance flag provided.
 * 
 * @param Data The contract DTO containing details for the contract to be updated.
 * @param accepted The boolean flag indicating whether the contract is accepted or not.
 * @return ResponseEntity indicating the success or failure of the operation.
 */
    @PutMapping("/{boolean}")
    ResponseEntity<?> setContract(@RequestBody ContractDTO Data, @PathVariable("boolean") Boolean accpeted);

   
/**
 * Validates a given token to check its authenticity and expiry.
 * This method is typically used to validate tokens sent via email for contract confirmations.
 * 
 * @param token The token to be validated.
 * @return ResponseEntity<Boolean> indicating whether the token is valid (true) or not (false).
 *         Returns HttpStatus.OK if the token is valid, HttpStatus.FORBIDDEN if the token is invalid or expired.
 */
   @GetMapping("/token/{token}")
   ResponseEntity<?> validateToken(@PathVariable("token") String token);
    

   @PutMapping("/email")
   ResponseEntity<?> getUserFromEmail(@RequestBody String email);

   
   @GetMapping("/status/{id}")
   ResponseEntity<?> getContractStatus(@PathVariable ("id") Long contractId);
    
}
