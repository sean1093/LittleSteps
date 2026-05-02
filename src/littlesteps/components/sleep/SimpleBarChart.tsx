import { motion } from 'framer-motion';

interface BarData {
  label: string;
  value: number;
  max: number;
  color: string;
}

interface SimpleBarChartProps {
  data: BarData[];
  height?: number;
}

export default function SimpleBarChart({ data, height = 40 }: SimpleBarChartProps) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = item.max > 0 ? Math.min((item.value / item.max) * 100, 100) : 0;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Label and Value */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-800">
                {item.value.toFixed(1)}h
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full bg-gray-100 rounded-full overflow-hidden"
              style={{ height: `${height}px` }}
            >
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
              />
            </div>

            {/* Max Value Label */}
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">目標: {item.max}h</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
