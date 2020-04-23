package ee.ut.monto.controller;

import ee.ut.monto.model.Category;
import ee.ut.monto.model.User;
import ee.ut.monto.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/categories")
    Collection<Category> categories(Authentication authentication) {
        return categoryRepository.findAllByUser((User) authentication.getPrincipal());
    }

    @GetMapping("/categories/{id}")
    ResponseEntity<?> getCategory(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(response -> ResponseEntity.ok().body(response))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/categories")
    ResponseEntity<Category> createCategory(@Valid @RequestBody Category category, Authentication authentication) throws URISyntaxException {
        Category savedCategory = categoryRepository.findByName(category.getName());
        if (savedCategory == null) {
            category.setUser((User) authentication.getPrincipal());
            savedCategory = categoryRepository.save(category);
        }
        return ResponseEntity.created(new URI("/api/categories" + savedCategory.getId())).body(savedCategory);
    }

    @PutMapping("/categories/{id}")
    ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category, Authentication authentication) {
        category.setUser((User) authentication.getPrincipal());
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok().body(updatedCategory);
    }

    @DeleteMapping("/categories/{id}")
    ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}