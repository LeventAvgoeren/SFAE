package com.SFAE.SFAE.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Security.JWT;


/**
 * @author erayzor
 * @author leventavgören
 */
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

    /**
     * Attempts to log in a customer using their email and password.
     * 
     * @param EMail the email of the customer attempting to log in
     * @param Password the password provided by the customer
     * @return a JWT as a String if authentication is successful, null otherwise
     */
    public String loginCustomer(String EMail, String Password){
        try{
            Customer foundCustomer = cus.findEmail(EMail);
            if(foundCustomer instanceof Customer){
                return jwt.verifyPasswordAndCreateJWT(EMail, Password);
            }
        } catch(Exception e){
            System.out.println(e);
        }

        return null;
    }



     /**
     * Attempts to log in a worker using their email and password.
     * 
     * @param email the email of the worker attempting to log in
     * @param password the password provided by the worker
     * @return true if authentication is successful, false otherwise
     */
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
