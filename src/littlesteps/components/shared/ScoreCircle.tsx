import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number;
  label: string;
  title: string;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e'; // green-500
  if (score >= 40) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

function getScoreTrackColor(score: number): string {
  if (score >= 70) return '#dcfce7'; // green-100
  if (score >= 40) return '#fef3c7'; // amber-100
  return '#fee2e2'; // red-100
}

export default function ScoreCircle({
  score,
  label,
  title,
  size = 120,
}: ScoreCircleProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;
  const color = getScoreColor(score);
  const trackColor = getScoreTrackColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold leading-none"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-gray-500 mt-0.5">{label}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {title}
      </span>
    </div>
  );
}
