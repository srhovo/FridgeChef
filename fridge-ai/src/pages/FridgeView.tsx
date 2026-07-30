import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Check,
  Utensils,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { FridgeItem, Ingredient, IngredientCategory, View } from '@/types';
import ingredientsData from '@/data/ingredients.json';

interface FridgeViewProps {
  items: FridgeItem[];
  toggleCheck: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  onNavigate: (view: View) => void;
}

const categories: IngredientCategory[] = ['肉类', '蛋奶', '蔬菜', '主食'];

export function FridgeView({
  items,
  toggleCheck,
  updateQuantity,
  addIngredient,
  removeIngredient,
  onNavigate,
}: FridgeViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'全部' | IngredientCategory>('全部');
  const [addOpen, setAddOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === '全部' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  const availableToAdd = useMemo(() => {
    const existingIds = new Set(items.map((i) => i.id));
    return ingredientsData.filter((ing) => !existingIds.has(ing.id));
  }, [items]);

  const groupedAdd = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      ingredients: availableToAdd.filter((ing) => ing.category === cat),
    }));
  }, [availableToAdd]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">我的冰箱</h2>
          <p className="text-gray-500 text-sm mt-1">
            勾选今天想用的食材，系统会自动推荐菜谱
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button className="bg-primary hover:bg-primary-dark text-white rounded-xl">
                <Plus className="w-4 h-4 mr-1.5" />
                添加
              </Button>
            }
          />
          <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>添加食材</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-2 -mr-2">
              {groupedAdd.every((g) => g.ingredients.length === 0) ? (
                <p className="text-center text-gray-400 py-8">
                  所有预设食材都已添加
                </p>
              ) : (
                groupedAdd.map(({ category: cat, ingredients }) =>
                  ingredients.length === 0 ? null : (
                    <div key={cat} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        {cat}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {ingredients.map((ing) => (
                          <Button
                            key={ing.id}
                            variant="outline"
                            onClick={() => {
                              addIngredient(ing as Ingredient);
                              setAddOpen(false);
                            }}
                            className="justify-start"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5 text-primary" />
                            {ing.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                )
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索食材..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Tabs
          value={category}
          onValueChange={(v: string) => setCategory(v as typeof category)}
        >
          <TabsList className="rounded-xl">
            <TabsTrigger value="全部">全部</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed">
            <Utensils className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            {search || category !== '全部'
              ? '没有匹配的食材'
              : '冰箱是空的，点击右上角添加食材'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card
                    className={`border-none shadow-sm transition-all cursor-pointer ${
                      item.checked
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'bg-white hover:shadow-md'
                    }`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              item.checked
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {item.checked && (
                              <Check className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.category}
                            </Badge>
                          </div>
                        </div>

                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-16 text-center text-sm font-medium">
                            {item.quantity}
                            {item.unit}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeIngredient(item.id)}
                            className="ml-1 w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          已选择 <span className="font-semibold text-primary">{items.filter((i) => i.checked).length}</span> 种食材
        </p>
        <Button
          onClick={() => onNavigate('recommendations')}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl"
        >
          生成菜单
          <ArrowRightIcon className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </motion.div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
