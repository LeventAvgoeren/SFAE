package com.SFAE.SFAE.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENDPOINTS.CustomerEP;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENUM.Role;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


/**
 * @author erayzor
 */

@RestController
class CustomerController implements CustomerEP{

    @Autowired
    private CustomerInterface dao;

    @Override
    public ResponseEntity<Customer> findCustomerById(long id) {

      if(id < 0L)
            // throw error 400 (bad request)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                String.format("Customer id: %d negative", id, HttpStatus.BAD_REQUEST.value())
            );

        Customer found = dao.findCustomerbyID(id)
            .map(c -> c)    // return customer{id}, if found
            //
            //              // else throw error 404 (not found)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                String.format("Customer id: %d not found, error %d", id, HttpStatus.NOT_FOUND.value())
            )); 

        return ResponseEntity.status(HttpStatus.FOUND).body(found);
    }

 

    @Override
    public ResponseEntity<Customer> createCustomer(@RequestBody CustomerDTO customerData) {
        try {
            Customer customer = dao.createCustomer(customerData);
            return ResponseEntity.status(HttpStatus.CREATED).body(customer);
        } catch(DataAccessException dax) {
           
        }
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    @Override
    public ResponseEntity<?> deleteCustomerById(long id) {
       try{

            boolean Answer = dao.deleteCustomerById(id);

            if(Answer){
                return ResponseEntity.status(HttpStatus.OK).build();
            }
       } catch(DataAccessException dax){


       }
       return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Override
    public Iterable<Customer> findAllCustomers() {
       return dao.findAllCustomer();
    }


    @Override
    public ResponseEntity<Customer> findCustomerByName(String Name) {
       try{
            Customer customer = dao.findCustomerbyName(Name);
            return ResponseEntity.status(HttpStatus.FOUND).body(customer);
       } catch(DataAccessException dax){

       }

       return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Override
    public ResponseEntity<Customer> updateCustomer(Map<String, Object> jsonData) {
        try{
            Customer customer = dao.updateCustomer(jsonData);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(customer); //Accepted unsure, could be something else
       } catch(DataAccessException dax){

       }

       return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
 
    
}
