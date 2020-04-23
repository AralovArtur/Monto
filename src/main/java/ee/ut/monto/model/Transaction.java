package ee.ut.monto.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.time.Instant;

@Entity
@NoArgsConstructor
@Data
@Table(name = "transaction")
public final class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double sum;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Account account;

    @JsonIgnore
    @ManyToOne(optional = false)
    private User user;
}
