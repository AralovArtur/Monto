package ee.ut.monto.service;

import ee.ut.monto.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(User user) {
        return Jwts
            .builder()
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS512)
            .setSubject(user.getId().toString())
            .compact();
    }

    public String parseToken(String token) {
        return Jwts
            .parser()
            .setSigningKey(secret.getBytes())
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
}
