package ee.ut.monto.repository;

import ee.ut.monto.model.Account;
import ee.ut.monto.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByName(String name);
    List<Account> findAllByUser(User user);
}
