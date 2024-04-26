package com.SFAE.SFAE.ENDPOINTS;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.SFAE.SFAE.ENTITY.Customer;

@RequestMapping("/customers")
public interface CustomerEP extends CustomerEPDoc{

    @PostMapping("")
    @Override
    ResponseEntity<Customer> createCustomer(Map<String, Object> jsonData);

    @DeleteMapping("/{id}")
    @Override
    ResponseEntity<?> deleteCustomerById(long id);

    @GetMapping("")
    @Override
    Iterable<Customer> findAllCustomers();

    @GetMapping("/{id}")
    @Override
    Customer findCustomerById(long id);

    @GetMapping("/{name}")
    @Override
    Customer findCustomerByName(String Name);

    @PutMapping("")
    @Override
    ResponseEntity<?> updateCustomer(Map<String, Object> jsonData);
    
}
