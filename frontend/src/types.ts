export interface Ingredient {
  id?: number;
  nom: string;
  quantite: string;
}

export interface Recipe {
  id?: number;
  titre: string;
  description: string;
  tempsMinute: number;
  imgLink: string;
  categorie?: string;
  ingredients: Ingredient[];
  dateCreation?: string;
  dateModification?: string;
}

export interface User {
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
