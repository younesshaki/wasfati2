import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Recipe, Page } from '../types';

export function slugify(titre: string): string {
  return encodeURIComponent(
    titre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
  );
}

export function useRecipes(query: string, page = 0) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(0);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (query && query.length >= 3) {
          res = await api.searchRecipes(query, currentPage, 6);
        } else {
          res = await api.getRecipes(currentPage, 6);
        }
        if (!cancelled) {
          const data: Page<Recipe> = res.data;
          setRecipes(data.content);
          setTotal(data.totalElements);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Erreur lors du chargement des recettes');
          setRecipes([]);
          setTotal(0);
          setTotalPages(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [query, currentPage]);

  return {
    recipes,
    total,
    totalPages,
    currentPage,
    setPage: setCurrentPage,
    loading,
    error,
  };
}
