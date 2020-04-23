package ee.ut.monto.controller;

import ee.ut.monto.dto.TokenDto;
import ee.ut.monto.model.User;
import ee.ut.monto.repository.UserRepository;
import ee.ut.monto.service.JwtService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.UnexpectedTypeException;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Data
    @NoArgsConstructor
    private static class LoginDto {
        private String email;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@Valid @RequestBody LoginDto loginDto) {
        Optional<User> foundUser = userRepository.findByEmail(loginDto.email);

        if (!foundUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = foundUser.get();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        if (!encoder.matches(loginDto.password, user.getHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TokenDto tokenDto = new TokenDto();
        tokenDto.setToken(jwtService.generateToken(user));

        return ResponseEntity.ok(tokenDto);
    }

    @Data
    @NoArgsConstructor
    private static class RegisterDto {
        @Email
        private String email;

        @Length(min = 8)
        private String password;
    }

    @PostMapping("/register")
    ResponseEntity<TokenDto> register(@Valid @RequestBody RegisterDto registerDto) throws UnexpectedTypeException {

        if (userRepository.findByEmail(registerDto.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        User template = new User();
        template.setEmail(registerDto.email);
        template.setHash(encoder.encode(registerDto.password));

        User user = userRepository.save(template);

        TokenDto tokenDto = new TokenDto();
        tokenDto.setToken(jwtService.generateToken(user));

        return ResponseEntity.ok(tokenDto);
    }
}

