import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import data from '../data/data.json';
import { Recipe } from '../types';
import { slugify } from '../hooks/useRecipes';
import { api } from '../api/api';
import NotFound from './NotFound';

const localRecipes = data.content as Recipe[];

export default function RecipeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Check if slug is a numeric ID (from API)
    const numericId = parseInt(slug, 10);
    if (!isNaN(numericId)) {
      api.getRecipe(numericId)
        .then((res) => {
          setRecipe(res.data);
          setLoading(false);
        })
        .catch(() => {
          setNotFound(true);
          setLoading(false);
        });
    } else {
      // Slug-based lookup for data.json recipes
      const decodedSlug = decodeURIComponent(slug);
      const found = localRecipes.find((r) => slugify(r.titre) === slug || slugify(r.titre) === decodedSlug);
      if (found) {
        setRecipe(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-inner">
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Chargement de la recette...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !recipe) return <NotFound />;

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
  };

  return (
    <div className="detail-page">
      <div className="detail-inner">

        {/* BOUTON RETOUR */}
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Retour à l'accueil
        </button>

        {/* IMAGE GRANDE */}
        <div className="detail-img-wrap">
          <img
            src={recipe.imgLink}
            alt={recipe.titre}
            className="detail-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&q=80';
            }}
          />
          {recipe.categorie && (
            <span className="detail-categorie">{recipe.categorie}</span>
          )}
        </div>

        {/* TITRE ET MÉTADONNÉES */}
        <div className="detail-header">
          <h1 className="detail-titre">{recipe.titre}</h1>
          <div className="detail-meta">
            <span className="meta-item">
              <span className="meta-icon">⏱</span>
              <span>{formatTime(recipe.tempsMinute)}</span>
            </span>
            {recipe.categorie && (
              <span className="meta-item">
                <span className="meta-icon">🍽️</span>
                <span>{recipe.categorie}</span>
              </span>
            )}
          </div>
        </div>

        {/* DESCRIPTION COMPLÈTE */}
        <div className="detail-description">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>

        {/* INGRÉDIENTS DÉTAILLÉS */}
        <div className="detail-ingredients">
          <h2>Ingrédients</h2>
          <ul className="detail-ingredients-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="detail-ingredient-item">
                <span className="detail-ing-nom">{ing.nom}</span>
                <span className="detail-ing-sep" />
                <span className="detail-ing-quantite">{ing.quantite}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
