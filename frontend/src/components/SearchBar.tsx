interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-wrap">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher une recette, un ingrédient..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        {value && (
          <button className="search-clear" onClick={() => onChange('')}>
            ✕
          </button>
        )}
      </div>
      <p className="search-hint">
        Tapez au moins 3 caractères pour lancer la recherche
      </p>
    </div>
  );
}
