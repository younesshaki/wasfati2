# WASFATI — Full Stack Project Build

## Context

You are building a **Spring Boot backend** and **updating a React frontend** for a Moroccan recipe management app called **Wasfati** (Wasfati.ma). This is a school end-of-module project.

## What Already Exists

### 1. Frontend (React + TypeScript + Vite)
**Path:** The current directory (`wasfati-backend/`)
- TypeScript, Vite, React Router v6
- Pages: Home.tsx, RecipeDetail.tsx, NotFound.tsx
- Components: Navbar.tsx, RecipeCard.tsx, SearchBar.tsx
- Hook: useRecipes.ts (currently reads from mock data.json)
- Types: types.ts (Recipe, Ingredient interfaces)
- App.tsx has routes: / and /recette/:slug

### 2. Second Frontend (for reference — pages to port)
**Path:** `/Users/younesshaki/Downloads/_Projet Fin module/front-wasfati/`
- JSX version with AddRecipe and Login pages
- Has Header component, FilterSection, Pagination
- These pages need to be ported to TypeScript and added to the main frontend

### 3. Schema (needs fixing)
**Path:** `/Users/younesshaki/Downloads/_Projet Fin module/schema.sql`
- recette table (missing dateCreation, dateModification)
- ingredients table (has wrong UNIQUE constraint on id_recette that prevents multiple ingredients per recipe)

### 4. Project Requirements
**Path:** `/Users/younesshaki/Downloads/_Projet Fin module/Projet fin de module - wasfati.docx`

---

## What You Must Build

### PART 1: Spring Boot Backend

Create a complete Spring Boot project in a new directory at `../wasfati-api/` (parallel to this frontend).

**Stack:** Spring Boot 3.x, Java 17+, Maven, MySQL (or H2 for simplicity)

**schema.sql** (enriched — fix the issues):
- Add `dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP` to recette
- Add `dateModification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` to recette
- Fix ingredients table: remove the UNIQUE KEY on `id_recette` (should allow multiple ingredients)
- Rename `id_recette` FK column to `recette_id` for JPA convention

**data.sql** — insert at least 8 Moroccan recipes with ingredients (use the data from frontend's data.json as source)

**Entities:**
- **Recette:** id (auto), titre (unique, not null), description (not null), imgLink (not null), tempsMinute (not null), dateCreation (auto), dateModification (auto), ingredients (OneToMany cascade ALL, orphanRemoval=true)
- **Ingredient:** id (auto), nom (not null), quantite (not null), recette (ManyToOne)
- **User:** id (auto), username (unique), email, password (BCrypt encoded), role (ADMIN or USER)

**DTOs:**
- RecetteRequest (titre, description, imgLink, tempsMinute, List<IngredientRequest>)
- RecetteResponse (all fields including id, dates, ingredients)
- LoginRequest (username, password)
- RegisterRequest (username, email, password)
- AuthResponse (token, username, role)

**Endpoints:**

```
POST   /api/auth/register       — Register (body: RegisterRequest)
POST   /api/auth/login          — Login, returns JWT (body: LoginRequest)
GET    /api/recettes            — Paginated list (params: page, size) — no auth
GET    /api/recettes/{id}       — Single recipe — no auth
GET    /api/recettes/search     — Search by query (params: query, page, size) — searches titre, description, ingredient names — no auth
POST   /api/recettes            — Create recipe — requires USER or ADMIN role
PUT    /api/recettes/{id}       — Update recipe — USER can update own, ADMIN can update any
DELETE /api/recettes/{id}       — Delete recipe — USER can delete own, ADMIN can delete any
```

**Security:**
- JWT based (use jjwt library or similar)
- Extract userId from token to check ownership
- Anonymous = GET only
- USER = CRUD on own recipes
- ADMIN = CRUD on all

**Validation:**
- Return 400 with message if required fields missing
- Return 409 with message if titre already exists
- Return 404 if recipe not found
- Return 403 if unauthorized

**Swagger (bonus):**
- Add springdoc-openapi-starter-webmvc-ui dependency
- Swagger UI at /swagger-ui.html
- Document each endpoint with description and response codes

### PART 2: Update the Frontend (in-place, this directory `wasfati-backend/`)

**Add dependencies to package.json:**
- axios (for API calls)
- @mui/material + @emotion/react + @emotion/styled (for Login/AddRecipe forms — or use plain CSS)
- Actually prefer plain CSS to keep it simple and avoid heavy dependencies

**Create `src/api/config.ts`:**
```typescript
const API_BASE = 'http://localhost:8080/api';

export const api = {
  login: (username: string, password: string) =>
    fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }),
  register: (username: string, email: string, password: string) =>
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) }),
  getRecipes: (page = 0, size = 6) => fetch(`${API_BASE}/recettes?page=${page}&size=${size}`),
  getRecipe: (id: number) => fetch(`${API_BASE}/recettes/${id}`),
  searchRecipes: (query: string, page = 0, size = 6) =>
    fetch(`${API_BASE}/recettes/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),
  createRecipe: (recipe: any, token: string) =>
    fetch(`${API_BASE}/recettes`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(recipe) }),
  updateRecipe: (id: number, recipe: any, token: string) =>
    fetch(`${API_BASE}/recettes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(recipe) }),
  deleteRecipe: (id: number, token: string) =>
    fetch(`${API_BASE}/recettes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }),
};
```
Actually, use axios instead — cleaner syntax.

**Create `src/context/AuthContext.tsx`:**
- Stores JWT token, username, role
- Persists to localStorage
- Provides login, logout, register functions
- Exposes isAuthenticated, isAdmin, currentUser

**Update `src/types.ts`:**
- Add id, dateCreation, dateModification to Recipe
- Add User interface
- Add AuthResponse interface

**Update `src/hooks/useRecipes.ts`:**
- Replace data.json import with API calls
- Add pagination support (page, size, totalPages, totalElements)
- Search should call the API endpoint

**Port pages from the download frontend:**
- **Login.tsx** and **Login.css** from `/Users/younesshaki/Downloads/_Projet Fin module/front-wasfati/src/pages/Login/`
- **AddRecipe.tsx** and **AddRecipe.css** from the download — convert to TypeScript

**Update `src/App.tsx`:**
- Add routes: /login, /ajouter, /modifier/:id
- Wrap in AuthProvider
- Add protected routes for add/edit

**Update `src/components/Navbar.tsx`:**
- Show login/logout button based on auth state
- Show "Ajouter une recette" link when logged in

**Update `src/pages/Home.tsx`:**
- Replace local filtering with API search
- Add pagination component

### PART 3: Deliverables

After building everything, create this structure in the project root:

```
deliverables/
├── 01_source_code/
│   └── (copy of the Spring Boot project)
├── 02_collection_postman/
│   └── wasfati_postman.json
├── 03_tests/
│   └── (instructions for testing + screenshots)
├── 04_front_mis_a_jour/
│   └── (copy of the updated React frontend)
├── 05_documentation_api/
│   └── (Swagger screenshots)
└── README.md (project overview, run instructions)
```

Actually, skip the screenshots — just create the Postman collection and tell the user what to screenshot.

---

## Constraints
- Keep the frontend in this repo (`wasfati-backend/`)
- Create the Spring Boot backend at `../wasfati-api/` (parallel directory)
- The frontend should work with `npm run dev` on port 5173
- The backend should work with `mvn spring-boot:run` on port 8080
- CORS must be configured to allow localhost:5173
- All UI text should be in French (this is a Moroccan school project)
- Recipe images should use Unsplash URLs for real food photos
- Keep the existing design of the repo frontend — it already looks good. Just add the missing pages.

## Run Instructions

Create a `SETUP.md` at the root with:
1. How to run the backend (cd wasfati-api → mvn spring-boot:run — uses H2 in-memory DB, no MySQL needed)
2. How to run the frontend (cd wasfati-frontend → npm install → npm run dev)
3. Default credentials for testing (admin/admin123, user/user123)
4. How to access Swagger (http://localhost:8080/swagger-ui.html)
