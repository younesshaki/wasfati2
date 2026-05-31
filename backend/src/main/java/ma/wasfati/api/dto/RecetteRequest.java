package ma.wasfati.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class RecetteRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    @Size(max = 1000, message = "La description ne doit pas dépasser 1000 caractères")
    private String description;

    @NotBlank(message = "Le lien de l'image est obligatoire")
    private String imgLink;

    @NotNull(message = "Le temps de préparation est obligatoire")
    @Min(value = 1, message = "Le temps doit être supérieur à 0 minute")
    private Integer tempsMinute;

    @Valid
    private List<IngredientRequest> ingredients;
}
