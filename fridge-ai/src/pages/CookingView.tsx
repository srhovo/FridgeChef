import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  ChefHat,
  ExternalLink,
  Check,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe, View } from '@/types';

interface CookingViewProps {
  recipe: Recipe | null;
  onNavigate: (view: View) => void;
}

export function CookingView({ recipe, onNavigate }: CookingViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!recipe) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center px-4"
      >
        <p className="text-gray-500 mb-4">还没有选择菜谱</p>
        <Button
          onClick={() => onNavigate('recommendations')}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl"
        >
          去推荐菜单
        </Button>
      </motion.div>
    );
  }

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const progress = Math.round(
    (completedSteps.size / recipe.steps.length) * 100
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
          onClick={() => onNavigate('recommendations')}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{recipe.name}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.time}分钟
            </span>
            <Badge variant="outline">{recipe.difficulty}</Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(recipe.sourceUrl, '_blank', 'noopener,noreferrer')}
          className="rounded-xl"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">制作进度</span>
          <span className="font-semibold text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.ingredients.map((ing) => (
          <Badge
            key={ing}
            variant="secondary"
            className="px-3 py-1 text-sm rounded-lg"
          >
            <ChefHat className="w-3.5 h-3.5 mr-1.5 text-primary" />
            {ing}
          </Badge>
        ))}
      </div>

      <div className="space-y-4 flex-1">
        <AnimatePresence>
          {recipe.steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  className={`border-none shadow-sm cursor-pointer transition-all ${
                    isCompleted
                      ? 'bg-green-50/60 ring-1 ring-green-200'
                      : 'bg-white hover:shadow-md'
                  }`}
                  onClick={() => toggleStep(index)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Step {index + 1}
                        </div>
                        <p
                          className={`text-lg leading-relaxed ${
                            isCompleted
                              ? 'text-gray-400 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                      <div className="pt-2">
                        {isCompleted ? (
                          <Circle className="w-5 h-5 text-green-500 fill-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 bg-primary text-white rounded-2xl text-center"
        >
          <h3 className="text-xl font-bold mb-1">恭喜完成！</h3>
          <p className="text-white/80">一道美味已经准备就绪，开始享用吧</p>
        </motion.div>
      )}
    </motion.div>
  );
}
