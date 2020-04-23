package ee.ut.monto.controller;

import ee.ut.monto.model.User;
import ee.ut.monto.service.FileTransactions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;

@CrossOrigin("*")
@Controller
@RequestMapping("/api")
public class FileController {
    @Autowired
    private FileTransactions fileTransactions;

    @Bean
    public FileTransactions fileTransactions() {
        return new FileTransactions();
    }

    @PostMapping("/bankStatements")
    ResponseEntity saveBankStatements(@RequestBody String[][] body, Authentication authentication) throws URISyntaxException {
        fileTransactions.saveCSVFileBankStatements(body, (User) authentication.getPrincipal());
        return ResponseEntity.ok().build();
    }
}