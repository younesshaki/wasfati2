package ma.wasfati.api.repository;

import ma.wasfati.api.entity.Recette;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecetteRepository extends JpaRepository<Recette, Long> {

    @Query("SELECT DISTINCT r FROM Recette r LEFT JOIN r.ingredients i " +
           "WHERE LOWER(r.titre) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(i.nom) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Recette> search(@Param("query") String query, Pageable pageable);
}
