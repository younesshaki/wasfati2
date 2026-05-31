package ma.wasfati.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IngredientRequest {

    @NotBlank(message = "Le nom de l'ingrédient est obligatoire")
    private String nom;

    @NotBlank(message = "La quantité est obligatoire")
    private String quantite;
}
