package ee.ut.monto.repository;

import ee.ut.monto.model.Regrule;
import ee.ut.monto.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegruleRepository extends JpaRepository<Regrule, Long> {
    List<Regrule> findAllByUser(User user);
}
