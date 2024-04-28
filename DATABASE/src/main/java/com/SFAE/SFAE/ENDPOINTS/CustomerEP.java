package com.SFAE.SFAE.ENDPOINTS;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.SFAE.SFAE.DTO.CustomerDTO;
import com.SFAE.SFAE.ENTITY.Customer;



@RequestMapping("/customer")
public interface CustomerEP{

    @PostMapping("")
    ResponseEntity<Customer> createCustomer(@RequestBody CustomerDTO customerData);

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteCustomerById(@PathVariable("id") long id);

    @GetMapping("")
    Iterable<Customer> findAllCustomers();

    @GetMapping("/{id}")
    ResponseEntity<?> findCustomerById(@PathVariable("id") long id);

    @GetMapping("/{name}")
    ResponseEntity<?> findCustomerByName(String Name);

    @PutMapping("")
    ResponseEntity<?> updateCustomer(Map<String, Object> jsonData);
    
}