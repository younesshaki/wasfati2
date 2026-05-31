package ma.wasfati.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recette {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String titre;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String imgLink;

    @Column(nullable = false)
    private Integer tempsMinute;

    @Column(updatable = false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateModification;

    private Long createdBy;

    @OneToMany(mappedBy = "recette", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<Ingredient> ingredients = new ArrayList<>();

    @PrePersist
    void prePersist() {
        dateCreation = dateModification = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        dateModification = LocalDateTime.now();
    }
}
