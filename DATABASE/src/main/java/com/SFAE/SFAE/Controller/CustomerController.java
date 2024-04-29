package com.SFAE.SFAE.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENDPOINTS.CustomerEP;
import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;

import io.swagger.v3.oas.annotations.parameters.RequestBody;


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

        try{

                Customer found = dao.findCustomerbyID(id);

        return ResponseEntity.status(HttpStatus.OK).body(found);
        } catch(DataAccessException dax) {
           
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    
    }

 

    @Override
    public ResponseEntity<Customer> createCustomer(@RequestBody CustomerDTO customerData) {
        try {
            Customer customer = dao.createCustomer(customerData);
            return ResponseEntity.status(HttpStatus.CREATED).body(customer);
        } catch(DataAccessException dax) {
           
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
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
    public ResponseEntity<Customer> findCustomerByName(String name) {
       try{
            Customer customer = dao.findCustomerbyName(name);
            return ResponseEntity.status(HttpStatus.OK).body(customer);
       } catch(DataAccessException dax){

       }

       return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @Override
    public ResponseEntity<Customer> updateCustomer(@RequestBody CustomerDTO jsonData) {
        try{
            Customer customer = dao.updateCustomer(jsonData);
            return ResponseEntity.status(HttpStatus.OK).body(customer); //Accepted unsure, could be something else
       } catch(DataAccessException dax){
                    System.out.println(dax);
       }

       return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
 
    
}
