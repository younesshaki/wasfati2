import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import { Ingredient } from '../types';
import './AddRecipe.css';

interface FormState {
  titre: string;
  description: string;
  imgLink: string;
  tempsMinute: string;
}

export default function AddRecipe() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    titre: '',
    description: '',
    imgLink: '',
    tempsMinute: '',
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { nom: '', quantite: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { nom: '', quantite: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.titre.trim() || !form.description.trim() || !form.imgLink.trim() || !form.tempsMinute) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.nom.trim() && ing.quantite.trim()
    );

    if (validIngredients.length === 0) {
      setError('Ajoutez au moins un ingrédient complet (nom et quantité)');
      return;
    }

    if (!token) {
      setError('Vous devez être connecté pour ajouter une recette');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        titre: form.titre.trim(),
        description: form.description.trim(),
        imgLink: form.imgLink.trim(),
        tempsMinute: parseInt(form.tempsMinute, 10),
        ingredients: validIngredients,
      };

      const res = await api.createRecipe(payload, token);
      setSuccess(`Recette "${res.data.titre}" ajoutée avec succès !`);
      setTimeout(() => navigate('/'), 1500);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (axiosErr.response?.data?.message) {
        setError(axiosErr.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout de la recette. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-inner">
        <div className="add-recipe-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Retour
          </button>
          <h1 className="add-recipe-title">Ajouter une recette</h1>
          <p className="add-recipe-subtitle">
            Partagez votre recette marocaine avec la communauté
          </p>
        </div>

        <form className="add-recipe-form" onSubmit={handleSubmit}>

          {error && (
            <div className="ar-alert ar-alert-error">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="ar-alert ar-alert-success">
              <span>✅</span> {success}
            </div>
          )}

          {/* INFORMATIONS GÉNÉRALES */}
          <section className="ar-section">
            <h2 className="ar-section-title">Informations générales</h2>

            <div className="ar-field">
              <label className="ar-label" htmlFor="titre">
                Titre de la recette *
              </label>
              <input
                id="titre"
                name="titre"
                type="text"
                className="ar-input"
                placeholder="ex: Tajine de Poulet aux Olives"
                value={form.titre}
                onChange={handleFormChange}
                maxLength={150}
              />
            </div>

            <div className="ar-field">
              <label className="ar-label" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                className="ar-textarea"
                placeholder="Décrivez votre recette en quelques phrases..."
                value={form.description}
                onChange={handleFormChange}
                rows={4}
                maxLength={1000}
              />
              <span className="ar-char-count">
                {form.description.length}/1000
              </span>
            </div>

            <div className="ar-row">
              <div className="ar-field">
                <label className="ar-label" htmlFor="tempsMinute">
                  Temps de préparation (minutes) *
                </label>
                <input
                  id="tempsMinute"
                  name="tempsMinute"
                  type="number"
                  className="ar-input"
                  placeholder="ex: 90"
                  value={form.tempsMinute}
                  onChange={handleFormChange}
                  min={1}
                  max={9999}
                />
              </div>

              <div className="ar-field">
                <label className="ar-label" htmlFor="imgLink">
                  URL de l'image *
                </label>
                <input
                  id="imgLink"
                  name="imgLink"
                  type="url"
                  className="ar-input"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imgLink}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            {form.imgLink && (
              <div className="ar-img-preview">
                <img
                  src={form.imgLink}
                  alt="Aperçu"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </section>

          {/* INGRÉDIENTS */}
          <section className="ar-section">
            <div className="ar-section-header">
              <h2 className="ar-section-title">Ingrédients</h2>
              <button
                type="button"
                className="ar-btn-add-ing"
                onClick={addIngredient}
              >
                + Ajouter
              </button>
            </div>

            <div className="ar-ingredients-list">
              {ingredients.map((ing, index) => (
                <div key={index} className="ar-ingredient-row">
                  <span className="ar-ing-num">{index + 1}</span>
                  <input
                    type="text"
                    className="ar-input ar-ing-nom"
                    placeholder="Nom (ex: Poulet)"
                    value={ing.nom}
                    onChange={(e) =>
                      handleIngredientChange(index, 'nom', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="ar-input ar-ing-qte"
                    placeholder="Quantité (ex: 500g)"
                    value={ing.quantite}
                    onChange={(e) =>
                      handleIngredientChange(index, 'quantite', e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="ar-btn-remove"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length <= 1}
                    title="Supprimer cet ingrédient"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS */}
          <div className="ar-actions">
            <button
              type="button"
              className="ar-btn-cancel"
              onClick={() => navigate('/')}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="ar-btn-submit"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : '🍲 Publier la recette'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
