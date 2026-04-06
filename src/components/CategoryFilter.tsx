import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryFilterProps {
  categories: { value: Category; label: string; icon: string }[];
  selected: Category;
  onChange: (value: Category) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pr-4">
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

        return (
          <button
            key={category.value}
            onClick={() => onChange(category.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all
              ${selected === category.value
                ? 'bg-secondary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
