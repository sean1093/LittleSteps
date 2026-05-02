import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  children: ReactNode;
  onClick?: () => void;
  bgColor?: string;
}

export default function DashboardCard({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  children,
  onClick,
  bgColor = 'bg-white',
}: DashboardCardProps) {
  const cardClasses = onClick
    ? `${bgColor} rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#7EC8E3]/20`
    : `${bgColor} rounded-3xl p-6 shadow-soft`;

  const CardWrapper = onClick ? motion.div : 'div';
  const motionProps = onClick
    ? {
        whileHover: { y: -4 },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <CardWrapper
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shadow-soft`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </CardWrapper>
  );
}
