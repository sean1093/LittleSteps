import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertOctagon, Clock, Moon } from 'lucide-react';
import type { Alert } from '../../utils/alertEngine';

interface AlertBannerProps {
  alerts: Alert[];
}

// Map icon name strings to actual lucide-react components
const iconMap: Record<string, React.ElementType> = {
  AlertTriangle,
  AlertOctagon,
  Clock,
  Moon,
};

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter(alert => !dismissedIds.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {visibleAlerts.map(alert => {
          const isDanger = alert.severity === 'danger';
          const bgColor = isDanger ? 'bg-[#FFE5E5]' : 'bg-[#FFF3CD]';
          const borderColor = isDanger ? 'border-red-400' : 'border-amber-400';
          const textColor = isDanger ? 'text-red-700' : 'text-amber-700';
          const iconColor = isDanger ? 'text-red-500' : 'text-amber-500';
          const IconComponent = iconMap[alert.icon] || AlertTriangle;

          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`${bgColor} border-l-4 ${borderColor} rounded-2xl p-4 shadow-soft`}
            >
              <div className="flex items-start gap-3">
                <div className={`${iconColor} mt-0.5 flex-shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${textColor}`}>
                    {alert.title}
                  </h4>
                  <p className={`text-xs ${textColor} opacity-80 mt-1 leading-relaxed`}>
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0 p-1`}
                  aria-label="關閉提醒"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
