import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';

export default function Home() {
  const [query, setQuery] = useState('');
  const { recipes, total, totalPages, currentPage, setPage, loading, error } = useRecipes(query);

  const isSearching = query.length >= 3;

  return (
    <>
      {/* BANNIÈRE */}
      <section className="banner">
        <div className="banner-inner">
          <p className="banner-eyebrow">Bienvenue sur Wasfati.ma</p>
          <h1 className="banner-title">
            La cuisine marocaine<br />à portée de main
          </h1>
          <p className="banner-sub">
            Découvrez nos recettes traditionnelles, de la harira aux cornes de gazelle
          </p>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* GRILLE DE RECETTES */}
      <section className="recettes-section" id="recettes">
        <div className="recettes-inner">

          {/* COMPTEUR */}
          <div className="recettes-header">
            <h2 className="recettes-title">
              {isSearching
                ? `Résultats pour "${query}"`
                : 'Toutes nos recettes'}
            </h2>
            <span className="recettes-count">
              {recipes.length} / {total} recette{total > 1 ? 's' : ''}
            </span>
          </div>

          {/* ÉTAT DE CHARGEMENT */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Chargement des recettes...</p>
            </div>
          )}

          {/* ERREUR */}
          {error && !loading && (
            <div className="no-results">
              <div className="no-results-icon">⚠️</div>
              <p className="no-results-msg">{error}</p>
            </div>
          )}

          {/* AUCUN RÉSULTAT */}
          {!loading && !error && isSearching && recipes.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p className="no-results-msg">
                Aucune recette ne contient &laquo;{query}&raquo;. Vous pouvez
                chercher &laquo;tajine&raquo;, &laquo;poulet&raquo;, etc.
              </p>
            </div>
          )}

          {/* GRILLE */}
          {!loading && !error && recipes.length > 0 && (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id ?? recipe.titre} recipe={recipe} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ← Précédent
              </button>
              <span className="pagination-info">
                Page {currentPage + 1} / {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Suivant →
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
