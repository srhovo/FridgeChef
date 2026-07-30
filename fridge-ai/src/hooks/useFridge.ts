import { useState, useEffect, useCallback } from 'react';
import type { FridgeItem, Ingredient } from '@/types';
import ingredientsData from '@/data/ingredients.json';

const STORAGE_KEY = 'fridge-ai-items';

const defaultIngredients: Ingredient[] = ingredientsData as Ingredient[];

function getInitialItems(): FridgeItem[] {
  if (typeof window === 'undefined') {
    return defaultIngredients.map((ing) => ({
      ...ing,
      quantity: ing.defaultQuantity,
      checked: false,
    }));
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed: FridgeItem[] = JSON.parse(stored);
      // Merge with default ingredients in case data updated
      const merged = defaultIngredients.map((ing) => {
        const existing = parsed.find((p) => p.id === ing.id);
        return existing
          ? { ...ing, quantity: existing.quantity, checked: existing.checked }
          : { ...ing, quantity: ing.defaultQuantity, checked: false };
      });
      return merged;
    } catch {
      // ignore parse error
    }
  }

  return defaultIngredients.map((ing) => ({
    ...ing,
    quantity: ing.defaultQuantity,
    checked: false,
  }));
}

export function useFridge() {
  const [items, setItems] = useState<FridgeItem[]>(() => getInitialItems());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(getInitialItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const toggleCheck = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  }, []);

  const addIngredient = useCallback((ingredient: Ingredient) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === ingredient.id)) return prev;
      return [
        ...prev,
        { ...ingredient, quantity: ingredient.defaultQuantity, checked: true },
      ];
    });
  }, []);

  const removeIngredient = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const selectedIngredients = items
    .filter((item) => item.checked && item.quantity > 0)
    .map((item) => item.name);

  const checkedItems = items.filter(
    (item) => item.checked && item.quantity > 0
  );

  return {
    items,
    hydrated,
    toggleCheck,
    updateQuantity,
    addIngredient,
    removeIngredient,
    selectedIngredients,
    checkedItems,
  };
}
