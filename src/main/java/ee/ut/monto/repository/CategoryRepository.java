package ee.ut.monto.repository;

import ee.ut.monto.model.Category;
import ee.ut.monto.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByUser(User user);
    Category findByName(String categoryName);
}
