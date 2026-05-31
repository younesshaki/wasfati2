package ma.wasfati.api.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import ma.wasfati.api.dto.*;
import ma.wasfati.api.entity.Ingredient;
import ma.wasfati.api.entity.Recette;
import ma.wasfati.api.entity.User;
import ma.wasfati.api.repository.RecetteRepository;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecetteService {

    private final RecetteRepository recetteRepository;

    public Page<RecetteResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateCreation").descending());
        return recetteRepository.findAll(pageable).map(this::toResponse);
    }

    public RecetteResponse getById(Long id) {
        Recette recette = recetteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recette non trouvée avec l'id: " + id));
        return toResponse(recette);
    }

    public Page<RecetteResponse> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateCreation").descending());
        return recetteRepository.search(query, pageable).map(this::toResponse);
    }

    @Transactional
    public RecetteResponse create(RecetteRequest request, Long userId) {
        Recette recette = Recette.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .imgLink(request.getImgLink())
                .tempsMinute(request.getTempsMinute())
                .createdBy(userId)
                .build();

        if (request.getIngredients() != null) {
            List<Ingredient> ingredients = request.getIngredients().stream()
                    .map(ir -> Ingredient.builder()
                            .nom(ir.getNom())
                            .quantite(ir.getQuantite())
                            .recette(recette)
                            .build())
                    .collect(Collectors.toList());
            recette.setIngredients(ingredients);
        }

        return toResponse(recetteRepository.save(recette));
    }

    @Transactional
    public RecetteResponse update(Long id, RecetteRequest request, Long userId, boolean isAdmin) {
        Recette recette = recetteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recette non trouvée avec l'id: " + id));

        if (!isAdmin && recette.getCreatedBy() != null && !recette.getCreatedBy().equals(userId)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à modifier cette recette");
        }

        recette.setTitre(request.getTitre());
        recette.setDescription(request.getDescription());
        recette.setImgLink(request.getImgLink());
        recette.setTempsMinute(request.getTempsMinute());

        recette.getIngredients().clear();
        if (request.getIngredients() != null) {
            request.getIngredients().forEach(ir -> {
                recette.getIngredients().add(Ingredient.builder()
                        .nom(ir.getNom())
                        .quantite(ir.getQuantite())
                        .recette(recette)
                        .build());
            });
        }

        return toResponse(recetteRepository.save(recette));
    }

    @Transactional
    public void delete(Long id, Long userId, boolean isAdmin) {
        Recette recette = recetteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recette non trouvée avec l'id: " + id));

        if (!isAdmin && recette.getCreatedBy() != null && !recette.getCreatedBy().equals(userId)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à supprimer cette recette");
        }

        recetteRepository.delete(recette);
    }

    private RecetteResponse toResponse(Recette r) {
        List<IngredientResponse> ingredients = r.getIngredients().stream()
                .map(i -> IngredientResponse.builder()
                        .id(i.getId())
                        .nom(i.getNom())
                        .quantite(i.getQuantite())
                        .build())
                .collect(Collectors.toList());

        return RecetteResponse.builder()
                .id(r.getId())
                .titre(r.getTitre())
                .description(r.getDescription())
                .imgLink(r.getImgLink())
                .tempsMinute(r.getTempsMinute())
                .dateCreation(r.getDateCreation())
                .dateModification(r.getDateModification())
                .createdBy(r.getCreatedBy())
                .ingredients(ingredients)
                .build();
    }
}
