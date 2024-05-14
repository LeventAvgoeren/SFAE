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
    @PostMapping("/")
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


    @GetMapping("/all")
    ResponseEntity<?> countAllCContracts();


    @GetMapping("/customer/{id}")
    ResponseEntity<?> findContractByWorkerId(@PathVariable("id") String id);

}
