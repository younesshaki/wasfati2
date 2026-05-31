# Wasfati API — Documentation

## Description
API REST pour l'application de recettes marocaines **Wasfati**. Construite avec Spring Boot 3.x, H2 (base de données en mémoire), Spring Security + JWT.

## Architecture
- **Backend**: Spring Boot 3.2, JPA/Hibernate, H2, Spring Security, JWT (JJWT 0.11.5)
- **Frontend**: React 18 + TypeScript + Vite
- **Auth**: JWT Bearer token (expiration 24h)

## Prérequis
- Java 17+
- Maven 3.8+
- Node.js 18+

## Lancer le backend

```bash
cd wasfati-api
mvn spring-boot:run
```

- API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:wasfatidb`
  - Username: `sa`
  - Password: (vide)

## Lancer le frontend

```bash
cd wasfati-backend
npm install
npm run dev
```

- Application: http://localhost:5173

## Identifiants par défaut

| Utilisateur | Mot de passe | Rôle  |
|-------------|--------------|-------|
| admin       | admin123     | ADMIN |
| user        | user123      | USER  |

## Endpoints

| Méthode | URL                         | Auth      | Description                   |
|---------|-----------------------------|-----------|-------------------------------|
| POST    | /api/auth/register          | Non       | Créer un compte                |
| POST    | /api/auth/login             | Non       | Se connecter (retourne JWT)    |
| GET     | /api/recettes               | Non       | Liste paginée des recettes     |
| GET     | /api/recettes/{id}          | Non       | Détail d'une recette           |
| GET     | /api/recettes/search?query= | Non       | Recherche plein texte          |
| POST    | /api/recettes               | Oui       | Créer une recette              |
| PUT     | /api/recettes/{id}          | Oui       | Modifier une recette           |
| DELETE  | /api/recettes/{id}          | Oui       | Supprimer une recette          |

## Notes
- Les mots de passe sont encodés avec BCrypt
- Les tokens JWT expirent après 24h
- Les utilisateurs avec le rôle USER ne peuvent modifier/supprimer que leurs propres recettes
- Les administrateurs peuvent modifier/supprimer toutes les recettes
