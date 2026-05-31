package ma.wasfati.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.wasfati.api.dto.RecetteRequest;
import ma.wasfati.api.dto.RecetteResponse;
import ma.wasfati.api.security.JwtUtil;
import ma.wasfati.api.service.RecetteService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recettes")
@RequiredArgsConstructor
public class RecetteController {

    private final RecetteService recetteService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<Page<RecetteResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(recetteService.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecetteResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(recetteService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecetteResponse>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(recetteService.search(query, page, size));
    }

    @PostMapping
    public ResponseEntity<RecetteResponse> create(
            @Valid @RequestBody RecetteRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(recetteService.create(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecetteResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RecetteRequest request,
            Authentication authentication,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return ResponseEntity.ok(recetteService.update(id, request, userId, isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        recetteService.delete(id, userId, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
