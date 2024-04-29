package com.SFAE.SFAE.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Security.JWT;

@Component
public class Authentication {
    
   @Autowired
    private WorkerInterface dao;

    @Autowired
    private CustomerImp cus;

    @Autowired
    private PasswordHasher encoder;

    @Autowired
    private JWT jwt;


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
            throw new IllegalArgumentException("Enter emails or passwords");
        }
         Iterable <Worker> workers=dao.findAllWorker();

         for (Worker worker : workers) {
            if(worker.getEmail().equals(email) && encoder.comparePassword(worker.getPassword(), password)){
                return true;
            }
         }
        

        return false;
    }
    
}
