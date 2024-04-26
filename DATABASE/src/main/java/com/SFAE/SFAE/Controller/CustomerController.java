package com.SFAE.SFAE.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @author erayzor
 */

@RestController
public class CustomerController {

    @Autowired
    CustomerInterface CInt;
    
    @PostMapping("/addCustomer")
    public void addCustomer(@RequestBody Customer entity) {
    }
    
}
