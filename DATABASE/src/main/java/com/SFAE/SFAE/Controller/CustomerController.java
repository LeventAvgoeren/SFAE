package com.SFAE.SFAE.Controller;

import org.springframework.web.bind.annotation.RequestParam;
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

    @Autowired
    private Authentication auth;

    @Autowired
    private CustomerImp cus;
    
    @Autowired
    private MailService mail;

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

            if(customer != null){
                mail.sendSimpleMessage(customerData.getEmail(), "SIE HABEN GEWONNEN", "Customer erstellt");
                return ResponseEntity.status(HttpStatus.CREATED).body(customer);
            }
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



    @Override
    public ResponseEntity<?> LoginCustomer(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("IST DA " + loginRequest.toString());
            String token = auth.loginCustomer(loginRequest.getEmail(), loginRequest.getPassword());
            if (!token.isBlank()) {

                Customer customer = cus.findEmail(loginRequest.getEmail());

                return ResponseEntity.ok().body(new LoginResponseCustomer(String.valueOf(customer.getId()), customer.getRole().toString(), token));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
            }
        } catch (DataAccessException dax) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database access error");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
 
    
}
