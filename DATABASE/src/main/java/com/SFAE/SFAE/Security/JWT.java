package com.SFAE.SFAE.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Service.PasswordHasher;

/**
 * JWT (JSON Web Token) Utility Class.
 * 
 * This class provides methods for generating, decoding, and verifying JSON Web
 * Tokens (JWTs).
 * It also includes methods for creating JWTs for user authentication.
 * 
 * @author erayzor
 * @author leventavgören
 */
@Component
public class JWT {

    @Autowired
    CustomerImp cus;

    @Autowired
    PasswordHasher encoder;

    @Autowired
    private WorkerInterface dao;

    /**
     * Generates a JWT for a given user ID and role.
     * 
     * @param id       the user ID to be included in the JWT as the subject
     * @param userType the user's role (Worker|Customer) to be included as a claim
     * @return a String representing the signed JWT
     */
    private static final String SECRET_KEY = "sehrGeheim";

    private String generateToken(String id, String userType) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        // Token Ablaufzeit
        long expMillis = nowMillis + 3600000; // 1 Stunde
        Date exp = new Date(expMillis);

        return Jwts.builder()
                .setSubject(id)
                .claim("role", userType)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    /**
     * Decodes a JWT and retrieves its claims.
     * 
     * @param token the JWT to decode
     * @return Claims object containing the token's claims
     */
    public Claims decodeToken(String token) {
        try {
            // Verwenden Sie eine explizite Zeichenkodierung, um Konsistenz sicherzustellen
            byte[] signingKeyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
    
            Jws<Claims> parsedToken = Jwts.parser()
                .setSigningKey(signingKeyBytes)
                .parseClaimsJws(token);
            
            Claims claims =  parsedToken.getBody();
            return claims;
        } catch (SignatureException ex) {
            System.out.println("SignatureException: " + ex.getMessage());
            System.out.println("Failed token: " + token);
            throw ex; // Weiterleitung der Ausnahme
        } catch (Exception e) {
            System.out.println("Exception in decodeToken: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Verifies a user's password and creates a JWT if the password is correct.
     * 
     * @param email    the email of the user attempting to authenticate
     * @param password the password provided by the user for authentication
     * @return a JWT as a String if authentication is successful, null otherwise
     * @throws Exception if an error occurs during authentication or JWT creation
     */
    public String verifyPasswordAndCreateJWT(String email, String password) throws Exception {
        if (SECRET_KEY == null || SECRET_KEY.isBlank()) {
            throw new IllegalArgumentException("Secret is Undefined");
        }

        Customer userOptional = cus.findEmail(email);
        if (encoder.comparePassword(userOptional.getPassword(), password)) {
            return generateToken(String.valueOf(userOptional.getId()), userOptional.getRole().toString());
        }

        return null;
    }

    /**
     * Generates a JWT for a worker based on the worker's ID.
     * 
     * @param id the ID of the worker to be included in the JWT as the subject
     * @return a String representing the signed JWT
     */
    private String generateTokenForWorker(String id) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        // Token Ablaufzeit
        long expMillis = nowMillis + 3600000; // 1 Stunde
        Date exp = new Date(expMillis);

        return Jwts.builder()
                .setSubject(id)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    /**
     * Authenticates a worker using email and password and generates a JWT upon
     * successful authentication.
     * 
     * @param email    the email of the worker attempting to authenticate
     * @param password the password provided by the worker for authentication
     * @return a JWT as a String if authentication is successful, null otherwise
     * @throws IllegalArgumentException if the secret key, email, or password is
     *                                  null or blank
     */
    public String loginWorkerJWT(String email, String password) {
        if (SECRET_KEY == null || SECRET_KEY.isBlank()) {
            throw new IllegalArgumentException("Secret is null");
        }
        if (email == null || password == null) {
            throw new IllegalArgumentException("Enter emails or passwords");
        }
        // Alle Worker geben lassen
        Worker worker = dao.findWorkerbyEmail(email);
        if (worker != null) {
            if (encoder.comparePassword(worker.getPassword(), password)) {
                return generateTokenForWorker(String.valueOf(worker.getId()));

            }
        }
        return null;
    }

}
