package com.SFAE.SFAE.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.Security.JWT;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @author erayzor
 * @author leventavgören
 */

@Component
public class Authentication {

    @Autowired
    private CustomerImp cus;

    @Autowired
    private JWT jwt;

    /**
     * Attempts to log in a customer using their email and password.
     * 
     * @param EMail    the email of the customer attempting to log in
     * @param Password the password provided by the customer
     * @return a JWT as a String if authentication is successful, null otherwise
     */
    public String loginCustomer(String EMail, String Password, HttpServletResponse response) {
        try {
            Customer foundCustomer = cus.findEmail(EMail);
            if (foundCustomer instanceof Customer) {
                String token = jwt.verifyPasswordAndCreateJWT(EMail, Password);
                return token;
            }
        } catch (Exception e) {
            System.out.println(e);
        }

        return null;
    }

}
