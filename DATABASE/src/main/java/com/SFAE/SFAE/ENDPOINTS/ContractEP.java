package com.SFAE.SFAE.ENDPOINTS;

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

    @PostMapping("")
    ResponseEntity<?> createContract(@RequestBody ContractDTO contract, BindingResult bindingResult );

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteContactById(@PathVariable("id") long id);

    @GetMapping("/{id}")
    ResponseEntity<?> findContractById(@PathVariable("id") long id);

    @PutMapping("")
    ResponseEntity<?> updateContract(@RequestBody ContractDTO contract, BindingResult bindingResult );

  
}
