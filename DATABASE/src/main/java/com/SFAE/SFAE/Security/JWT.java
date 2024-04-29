package com.SFAE.SFAE.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JWT {

    private static final String SECRET_KEY = "sehrGeheim"; 

    public String generateToken(String username, String userType) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        // Token Ablaufzeit
        long expMillis = nowMillis + 3600000; // 1 Stunde
        Date exp = new Date(expMillis);

        return Jwts.builder()
                .setSubject(username)
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

}
