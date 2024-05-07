package com.SFAE.SFAE.ENDPOINTS;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.SFAE.SFAE.ENTITY.Contract;

@RequestMapping("/contract")
public interface ContractEP {

    @PostMapping("")
    ResponseEntity<?> createContract(@RequestBody Contract contract );

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteContactById(@PathVariable("id") long id);

    @GetMapping("/{id}")
    ResponseEntity<?> findCustomerById(@PathVariable("id") long id);

    @PutMapping("")
    ResponseEntity<?> updateContract(@RequestBody Contract contract );

  
}
