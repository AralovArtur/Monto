package ee.ut.monto.filter;

import ee.ut.monto.repository.UserRepository;
import ee.ut.monto.security.UserAuthentication;
import ee.ut.monto.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        Authentication authentication = getAuthentication(request);

        if (authentication != null) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private Authentication getAuthentication(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");

        if (authorization == null) {
            return null;
        }

        String[] parts = authorization.split(" ");

        if (parts.length == 0) {
            return null;
        }

        String type = parts[0];
        String credentials = parts[1];

        if (!type.equals("Bearer")) {
            return null;
        }

        String id = jwtService.parseToken(credentials);

        if (id == null) {
            return null;
        }

        return userRepository
            .findById(Long.parseLong(id))
            .map(UserAuthentication::new)
            .orElse(null);
    }
}
