package com.SFAE.SFAE.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.SFAE.SFAE.ENTITY.Customer;
import com.SFAE.SFAE.IMPLEMENTATIONS.CustomerImp;
import com.SFAE.SFAE.Service.PasswordHasher;


/**
 * @author erayzor
 */

@Component
public class JWT {

    @Autowired
    CustomerImp cus;

    @Autowired
    PasswordHasher encoder;
    
    /**
     * The Token is being generated here
     * @params id ID of the User
     * @params userType Role of the User (Worker|Customer)
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
                .claim("role",userType)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public Claims decodeToken(String token) {
        // Parsen und Validieren des Tokens
        Jws<Claims> parsedToken = Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .parseClaimsJws(token);

        return parsedToken.getBody();
    }


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

}
