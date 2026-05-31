import axios from 'axios';

const BASE = 'http://localhost:8080/api';

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export const api = {
  login: (username: string, password: string) =>
    axios.post(`${BASE}/auth/login`, { username, password }),

  register: (username: string, email: string, password: string) =>
    axios.post(`${BASE}/auth/register`, { username, email, password }),

  getRecipes: (page = 0, size = 6) =>
    axios.get(`${BASE}/recettes`, { params: { page, size } }),

  getRecipe: (id: number) =>
    axios.get(`${BASE}/recettes/${id}`),

  searchRecipes: (query: string, page = 0, size = 6) =>
    axios.get(`${BASE}/recettes/search`, { params: { query, page, size } }),

  createRecipe: (recipe: unknown, token: string) =>
    axios.post(`${BASE}/recettes`, recipe, { headers: authHeader(token) }),

  updateRecipe: (id: number, recipe: unknown, token: string) =>
    axios.put(`${BASE}/recettes/${id}`, recipe, { headers: authHeader(token) }),

  deleteRecipe: (id: number, token: string) =>
    axios.delete(`${BASE}/recettes/${id}`, { headers: authHeader(token) }),
};
