package ee.ut.monto.repository;

import ee.ut.monto.model.Transaction;
import ee.ut.monto.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByUserOrderByDateDesc(User user);
    Transaction getById(Long id);
}
