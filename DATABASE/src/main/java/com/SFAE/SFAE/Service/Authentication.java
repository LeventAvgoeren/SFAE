package com.SFAE.SFAE.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;

@Component
public class Authentication {
    @Autowired
    private WorkerInterface dao;
    
    @Autowired
    private PasswordHasher pw;


    public boolean loginCustomer(String EMail, String Password){

        return false;
    }


    
    public boolean loginWorker(String email, String password){
        if(email==null || password==null){
            throw new IllegalArgumentException("Enter email or password")
        }
         Iterable <Worker> workers=dao.findAllWorker();

         for (Worker worker : workers) {
            if(worker.getEmail().equals(email) && comparePassword())
         }
        

        return false;
    }
    
}
