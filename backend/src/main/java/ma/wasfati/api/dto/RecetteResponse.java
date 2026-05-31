package ma.wasfati.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecetteResponse {
    private Long id;
    private String titre;
    private String description;
    private String imgLink;
    private Integer tempsMinute;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private Long createdBy;
    private List<IngredientResponse> ingredients;
}
