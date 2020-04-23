package ee.ut.monto.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import ee.ut.monto.model.Regrule;
import ee.ut.monto.model.User;
import ee.ut.monto.repository.RegruleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class RegruleController {
    @Autowired
    private RegruleRepository regruleRepository;

    @GetMapping("/regrules")
    Collection<Regrule> getRegrules(Authentication authentication) {
        return regruleRepository.findAllByUser((User) authentication.getPrincipal());
    }

    @PostMapping("/regrules")
    ResponseEntity<Regrule> createRegrule(@Valid @RequestBody Regrule regrule,
                                                              Authentication authentication) throws URISyntaxException {
        regrule.setUser((User) authentication.getPrincipal());
        Regrule savedRegrule = regruleRepository.save(regrule);
        return ResponseEntity.created(new URI("/api/regrules" + savedRegrule.getId())).body(savedRegrule);
    }

    @PutMapping("/regrules/{id}")
    ResponseEntity<Regrule> updateRegrule(@Valid @RequestBody Regrule regrule,
                                                              Authentication authentication) {
        regrule.setUser((User) authentication.getPrincipal());
        Regrule updatedRegrule = regruleRepository.save(regrule);
        return ResponseEntity.ok().body(updatedRegrule);
    }

    @DeleteMapping("/regrules/{id}")
    ResponseEntity<?> deleteRegrule(@PathVariable Long id) {
        regruleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}