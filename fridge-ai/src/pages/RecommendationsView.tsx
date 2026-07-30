import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Clock,
  Flame,
  Check,
  X,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Recipe, View } from '@/types';
import recipesData from '@/data/recipes.json';
import { matchRecipes } from '@/lib/matcher';

interface RecommendationsViewProps {
  selectedIngredients: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (view: View) => void;
}

export function RecommendationsView({
  selectedIngredients,
  onSelectRecipe,
  onNavigate,
}: RecommendationsViewProps) {
  const recipes: Recipe[] = recipesData as Recipe[];
  const matches = useMemo(
    () => matchRecipes(recipes, selectedIngredients),
    [recipes, selectedIngredients]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('fridge')}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">推荐菜单</h2>
          <p className="text-gray-500 text-sm mt-1">
            根据你选择的 {selectedIngredients.length} 种食材匹配
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ChefHat className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            暂无可制作菜品
          </h3>
          <p className="text-gray-500 mb-6 max-w-xs">
            当前食材组合还无法匹配到菜谱，去冰箱多选几种食材试试吧
          </p>
          <Button
            onClick={() => onNavigate('fridge')}
            className="bg-primary hover:bg-primary-dark text-white rounded-xl"
          >
            去选择食材
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {matches.map((match, index) => (
              <motion.div
                key={match.recipe.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-none shadow-md bg-white overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {match.recipe.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {match.recipe.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {match.recipe.time}分钟
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {match.recipe.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {match.matchRate}%
                        </div>
                        <div className="text-xs text-gray-400">匹配度</div>
                      </div>
                    </div>

                    <Progress value={match.matchRate} className="h-2 mb-4" />

                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.recipe.ingredients.map((ing) => {
                        const has = match.matchedIngredients.includes(ing);
                        return (
                          <span
                            key={ing}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              has
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {has ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            {ing}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          onSelectRecipe(match.recipe);
                          onNavigate('cooking');
                        }}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-xl"
                      >
                        开始制作
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          window.open(match.recipe.sourceUrl, '_blank', 'noopener,noreferrer')
                        }
                        className="rounded-xl"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
