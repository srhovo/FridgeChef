import type { Recipe, RecipeMatch } from '@/types';

export function matchRecipes(
  recipes: Recipe[],
  selectedIngredients: string[]
): RecipeMatch[] {
  const selectedSet = new Set(selectedIngredients);

  const matches = recipes.map((recipe): RecipeMatch => {
    const matchedIngredients = recipe.ingredients.filter((ing) =>
      selectedSet.has(ing)
    );
    const missingIngredients = recipe.ingredients.filter(
      (ing) => !selectedSet.has(ing)
    );
    const matchRate =
      recipe.ingredients.length === 0
        ? 0
        : Math.round(
            (matchedIngredients.length / recipe.ingredients.length) * 100
          );

    return {
      recipe,
      matchRate,
      matchedIngredients,
      missingIngredients,
    };
  });

  return matches
    .filter((m) => m.matchRate > 0)
    .sort((a, b) => b.matchRate - a.matchRate || a.recipe.time - b.recipe.time);
}
