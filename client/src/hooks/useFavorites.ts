import { useState, useEffect } from "react";

const FAVORITES_KEY = "milano-rentals-favorites";

/**
 * Hook per gestire gli annunci preferiti usando localStorage
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carica i preferiti dal localStorage al mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Errore nel caricamento dei preferiti:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salva i preferiti nel localStorage quando cambiano
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const isFavorite = (index: number) => favorites.includes(index);

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}
