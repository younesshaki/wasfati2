import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
        setError('Identifiants incorrects. Vérifiez votre nom d\'utilisateur et mot de passe.');
      } else if (axiosErr.response?.data?.message) {
        setError(axiosErr.response.data.message);
      } else {
        setError('Erreur de connexion. Vérifiez que le serveur est démarré.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <span>🍲</span>
            <span className="login-logo-text">Wasfati</span>
            <span className="login-logo-sub">.ma</span>
          </Link>
          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Accédez à votre espace pour gérer vos recettes</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="login-field">
            <label htmlFor="username" className="login-label">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              className="login-input"
              placeholder="ex: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="login-hint">
          <p>Identifiants par défaut :</p>
          <p><strong>Admin</strong> : admin / admin123</p>
          <p><strong>User</strong> : user / user123</p>
        </div>

        <div className="login-footer">
          <Link to="/" className="login-back">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
