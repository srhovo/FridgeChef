import { Refrigerator, ChefHat, Home, ListOrdered } from 'lucide-react';
import type { View } from '@/types';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: '首页', icon: Home },
  { view: 'fridge', label: '冰箱', icon: Refrigerator },
  { view: 'recommendations', label: '推荐', icon: ListOrdered },
];

export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-primary font-bold text-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <ChefHat className="w-5 h-5" />
          </div>
          冰箱管家 AI
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map(({ view, label, icon: Icon }) => {
            const active = currentView === view;
            return (
              <Button
                key={view}
                variant={active ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(view)}
                className={
                  active
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'text-gray-500 hover:text-gray-900'
                }
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
