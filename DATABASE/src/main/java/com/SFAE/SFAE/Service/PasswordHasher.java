package com.SFAE.SFAE.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {



    /**
     * Hashes the provided password.
     * @param password The plain text password to hash
     * @return The hashed password
     */
    public String hashPassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(password);
        return encodedPassword;
    }


  /**
     * Compares the user's account hashed password with the password typed by the user.
     * @param hashedPassword The hashed password stored for the account
     * @param nonHashedPassword The password input from the user in the frontend
     * @return true if the non-hashed password is correct
     */
    public boolean comparePassword(String hashedPassword, String nonHashedPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(nonHashedPassword, hashedPassword);  
    }

     
}
