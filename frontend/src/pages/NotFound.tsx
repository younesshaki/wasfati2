import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Page introuvable</h2>
      <p className="not-found-sub">
        La recette que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <button className="btn-primary" onClick={() => navigate('/')}>
        ← Retour à l'accueil
      </button>
    </div>
  );
}
