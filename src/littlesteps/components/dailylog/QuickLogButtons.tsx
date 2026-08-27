import { motion } from 'framer-motion';
import { Milk, Moon, Baby } from 'lucide-react';
import { tap } from '../../../common/ui/motion';

interface QuickLogButtonsProps {
  onLogClick: (type: 'feeding' | 'sleep' | 'diaper') => void;
}

export default function QuickLogButtons({ onLogClick }: QuickLogButtonsProps) {
  /*
    Tint + readable ink rather than white on a saturated fill: the old
    `from-blue-400 to-blue-500` gradients put white text at 3.7:1, and three
    solid 80px blocks read heavier than the rest of the screen.
    `hoverGradient` was declared here and never used.
  */
  const buttons = [
    { type: 'feeding' as const, icon: Milk, label: '餵奶', skin: 'bg-butter-light text-butter-dark' },
    { type: 'sleep' as const, icon: Moon, label: '睡眠', skin: 'bg-secondary-light text-secondary-dark' },
    { type: 'diaper' as const, icon: Baby, label: '尿布', skin: 'bg-mint-light text-mint-dark' },
  ];

  return (
    <div className="flex justify-center gap-4">
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <motion.button
            key={button.type}
            onClick={() => onLogClick(button.type)}
            whileTap={tap}
            className={`
              w-20 h-20 rounded-2xl shadow-soft ${button.skin}
              flex flex-col items-center justify-center gap-1
              transition-shadow duration-200 hover:shadow-soft-lg
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
