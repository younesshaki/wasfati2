import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types';
import { slugify } from '../hooks/useRecipes';

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (recipe.id) {
      navigate(`/recette/${recipe.id}`);
    } else {
      navigate(`/recette/${slugify(recipe.titre)}`);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
  };

  return (
    <article
      className="recipe-card"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-img-wrap">
        <img
          src={recipe.imgLink}
          alt={recipe.titre}
          className="card-img"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80';
          }}
        />
        {recipe.categorie && (
          <span className="card-categorie">{recipe.categorie}</span>
        )}
      </div>

      <div className="card-body">
        <h2 className="card-titre">{recipe.titre}</h2>

        <div className="card-temps">
          <span className="temps-icon">⏱</span>
          <span>{formatTime(recipe.tempsMinute)}</span>
        </div>

        <p className="card-description">{recipe.description}</p>

        <div className="card-ingredients">
          <p className="ingredients-label">Ingrédients :</p>
          <ul className="ingredients-list">
            {recipe.ingredients.slice(0, 5).map((ing, i) => (
              <li key={i}>
                <span className="ing-nom">{ing.nom}</span>
                <span className="ing-quantite">{ing.quantite}</span>
              </li>
            ))}
            {recipe.ingredients.length > 5 && (
              <li className="ingredients-more">
                +{recipe.ingredients.length - 5} autres ingrédients
              </li>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
