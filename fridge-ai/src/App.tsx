import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { HomeView } from '@/pages/HomeView';
import { FridgeView } from '@/pages/FridgeView';
import { RecommendationsView } from '@/pages/RecommendationsView';
import { CookingView } from '@/pages/CookingView';
import { useFridge } from '@/hooks/useFridge';
import type { Recipe, View } from '@/types';

function App() {
  const [view, setView] = useState<View>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const {
    items,
    toggleCheck,
    updateQuantity,
    addIngredient,
    removeIngredient,
    selectedIngredients,
    checkedItems,
  } = useFridge();

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleNavigate = (nextView: View) => {
    setView(nextView);
    if (nextView !== 'cooking') {
      setSelectedRecipe(null);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header currentView={view} onNavigate={handleNavigate} />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <HomeView
              key="home"
              checkedItems={checkedItems}
              onNavigate={handleNavigate}
            />
          )}

          {view === 'fridge' && (
            <FridgeView
              key="fridge"
              items={items}
              toggleCheck={toggleCheck}
              updateQuantity={updateQuantity}
              addIngredient={addIngredient}
              removeIngredient={removeIngredient}
              onNavigate={handleNavigate}
            />
          )}

          {view === 'recommendations' && (
            <RecommendationsView
              key="recommendations"
              selectedIngredients={selectedIngredients}
              onSelectRecipe={handleSelectRecipe}
              onNavigate={handleNavigate}
            />
          )}

          {view === 'cooking' && (
            <CookingView
              key="cooking"
              recipe={selectedRecipe}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
