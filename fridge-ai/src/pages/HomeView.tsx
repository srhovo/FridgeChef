import { motion } from 'framer-motion';
import { ChefHat, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FridgeItem, View } from '@/types';

interface HomeViewProps {
  checkedItems: FridgeItem[];
  onNavigate: (view: View) => void;
}

export function HomeView({ checkedItems, onNavigate }: HomeViewProps) {
  const displayItems = checkedItems.slice(0, 6);
  const hasItems = checkedItems.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/25"
        >
          <ChefHat className="w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          冰箱管家 AI
        </h1>
        <p className="text-gray-500 text-lg">
          打开冰箱，选择食材，马上知道今天吃什么。
        </p>
      </div>

      <Card className="w-full mb-8 border-none shadow-xl shadow-gray-100/50 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              我的冰箱
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('fridge')}
              className="text-primary"
            >
              管理食材
            </Button>
          </div>

          {hasItems ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl"
                >
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-400">
                    ×{item.quantity}
                    {item.unit}
                  </span>
                </div>
              ))}
              {checkedItems.length > 6 && (
                <div className="flex items-center justify-center px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-400">
                  +{checkedItems.length - 6} 种食材
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
              冰箱还是空的，先去添加一些食材吧
            </div>
          )}
        </CardContent>
      </Card>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          size="lg"
          onClick={() => onNavigate('recommendations')}
          className="bg-primary hover:bg-primary-dark text-white px-10 py-6 text-lg rounded-2xl shadow-lg shadow-primary/25"
        >
          今天吃什么？
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
