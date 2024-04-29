package com.SFAE.SFAE.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.Security.JWT;

/**
 * @author erayzor
 */

@Component
public class Authentication {

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


    
    public boolean loginWorker(String EMail, String Password){

        return false;
    }
    
}
