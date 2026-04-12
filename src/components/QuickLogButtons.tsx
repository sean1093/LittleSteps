import { motion } from 'framer-motion';
import { Milk, Moon, Baby } from 'lucide-react';

interface QuickLogButtonsProps {
  onLogClick: (type: 'feeding' | 'sleep' | 'diaper') => void;
}

export default function QuickLogButtons({ onLogClick }: QuickLogButtonsProps) {
  const buttons = [
    {
      type: 'feeding' as const,
      icon: Milk,
      label: '餵奶',
      gradient: 'from-blue-400 to-blue-500',
      hoverGradient: 'from-blue-500 to-blue-600',
    },
    {
      type: 'sleep' as const,
      icon: Moon,
      label: '睡眠',
      gradient: 'from-purple-400 to-purple-500',
      hoverGradient: 'from-purple-500 to-purple-600',
    },
    {
      type: 'diaper' as const,
      icon: Baby,
      label: '尿布',
      gradient: 'from-pink-400 to-pink-500',
      hoverGradient: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="flex justify-center gap-4">
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <motion.button
            key={button.type}
            onClick={() => onLogClick(button.type)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-20 h-20 rounded-2xl shadow-soft
              bg-gradient-to-br ${button.gradient}
              hover:shadow-soft-lg
              flex flex-col items-center justify-center gap-1
              text-white transition-all duration-200
            `}
          >
            <Icon className="w-8 h-8" />
            <span className="text-sm font-medium">{button.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
