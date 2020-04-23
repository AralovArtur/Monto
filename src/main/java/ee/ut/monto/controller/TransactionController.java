package ee.ut.monto.controller;

import ee.ut.monto.model.Transaction;
import ee.ut.monto.model.User;
import ee.ut.monto.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public final class TransactionController {
    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/transactions")
    List<Transaction> getTransactions(Authentication authentication) {
        return transactionRepository.findAllByUserOrderByDateDesc((User) authentication.getPrincipal());
    }

    @GetMapping("/transactions/{id}")
    Optional<Transaction> getTransactionsById(@PathVariable Long id) {
        return transactionRepository.findById(id);
    }

    @DeleteMapping("/transactions/{id}")
    ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        transactionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/transactions/{id}")
    ResponseEntity<Transaction> updateTransaction(@Valid @RequestBody Transaction transaction, Authentication authentication) {
        transaction.setUser((User) authentication.getPrincipal());
        Transaction updatedTransaction = transactionRepository.save(transaction);
        System.out.println(transaction);
        return ResponseEntity.ok().body(updatedTransaction);
    }

    @PostMapping("/transactions")
    ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction, Authentication authentication) throws URISyntaxException {
        transaction.setUser((User) authentication.getPrincipal());
        Transaction savedTransaction = transactionRepository.save(transaction);

        return ResponseEntity.created(new URI("/api/transactions/" + savedTransaction.getId())).body(savedTransaction);
    }
}
