export type IngredientCategory = '肉类' | '蛋奶' | '蔬菜' | '主食';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;
  defaultQuantity: number;
}

export interface FridgeItem extends Ingredient {
  quantity: number;
  checked: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  steps: string[];
  time: number;
  difficulty: '简单' | '中等' | '困难';
  sourceUrl: string;
}

export interface RecipeMatch {
  recipe: Recipe;
  matchRate: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export type View = 'home' | 'fridge' | 'recommendations' | 'cooking';
