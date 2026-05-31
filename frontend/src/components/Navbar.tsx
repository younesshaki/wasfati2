import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍲</span>
          <span className="logo-text">Wasfati</span>
          <span className="logo-sub">.ma</span>
        </Link>
        <nav className="navbar-links">
          <Link to="/">Accueil</Link>
          <a href="#recettes">Recettes</a>
          {isAuthenticated ? (
            <>
              <Link to="/ajouter" className="navbar-btn navbar-btn-add">
                + Ajouter
              </Link>
              <span className="navbar-username">
                {username}
              </span>
              <button className="navbar-btn navbar-btn-logout" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/connexion" className="navbar-btn navbar-btn-login">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
