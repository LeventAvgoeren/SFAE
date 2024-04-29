package com.SFAE.SFAE.Service;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
=======

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.Security.JWT;
>>>>>>> 42c63257d35fec35b57427439a738e7f11b4600e

@Component
public class Authentication {
    @Autowired
    private WorkerInterface dao;
    
    @Autowired
    private PasswordHasher pw;

    @Autowired
    CustomerImp cus;

    @Autowired
    PasswordHasher encoder;

    @Autowired
    JWT jwt;

    public String loginCustomer(String EMail, String Password){
        try{
            Customer foundCustomer = cus.findEmail(EMail);
            if(foundCustomer instanceof Customer){
                        if(encoder.comparePassword(foundCustomer.getPassword(), Password)){
                                return jwt.verifyPasswordAndCreateJWT(EMail, Password);
                        };
                        }

        } catch(Exception e){
                System.out.println(e);
        }
        
        return null;
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
