import { motion } from 'framer-motion';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { UseTimerReturn } from '../hooks/useTimer';

interface TimerDisplayProps {
  timer: UseTimerReturn;
  label?: string;
  showControls?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * TimerDisplay - Visual timer component with controls
 *
 * Features:
 * - Displays elapsed time in mm:ss or HH:mm:ss format
 * - Start/Pause/Resume/Stop/Reset controls
 * - Three size variants (small, medium, large)
 * - Animated transitions
 *
 * @param timer - useTimer hook return value
 * @param label - Optional label to display above timer
 * @param showControls - Whether to show control buttons (default: true)
 * @param size - Timer display size (default: 'medium')
 */
export default function TimerDisplay({
  timer,
  label,
  showControls = true,
  size = 'medium',
}: TimerDisplayProps) {
  const { isRunning, elapsedTime, start, stop, pause, resume, reset } = timer;

  // Size configurations
  const sizeClasses = {
    small: {
      container: 'p-3',
      time: 'text-2xl',
      label: 'text-xs',
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
    },
    medium: {
      container: 'p-4',
      time: 'text-4xl',
      label: 'text-sm',
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
    },
    large: {
      container: 'p-6',
      time: 'text-6xl',
      label: 'text-base',
      button: 'w-12 h-12',
      icon: 'w-6 h-6',
    },
  };

  const classes = sizeClasses[size];

  const handleStartPause = () => {
    if (!isRunning) {
      if (timer.elapsedSeconds === 0) {
        start();
      } else {
        resume();
      }
    } else {
      pause();
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl ${classes.container}`}>
      {/* Label */}
      {label && (
        <div className={`text-center text-gray-600 mb-2 font-medium ${classes.label}`}>
          {label}
        </div>
      )}

      {/* Timer Display */}
      <motion.div
        className={`text-center font-mono font-bold text-primary mb-4 ${classes.time}`}
        key={elapsedTime}
        initial={{ scale: 1 }}
        animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {elapsedTime}
      </motion.div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}
        />
        <span className="text-xs text-gray-600">
          {isRunning ? '計時中' : '已暫停'}
        </span>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-3">
          {/* Start/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartPause}
            className={`${classes.button} flex items-center justify-center rounded-full bg-primary text-white shadow-soft hover:bg-primary-dark transition-colors`}
            title={isRunning ? '暫停' : timer.elapsedSeconds === 0 ? '開始' : '繼續'}
          >
            {isRunning ? (
              <Pause className={classes.icon} />
            ) : (
              <Play className={`${classes.icon} ml-0.5`} />
            )}
          </motion.button>

          {/* Stop Button */}
          {timer.elapsedSeconds > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={stop}
              className={`${classes.button} flex items-center justify-center rounded-full bg-red-500 text-white shadow-soft hover:bg-red-600 transition-colors`}
              title="停止並重置"
            >
              <Square className={classes.icon} />
            </motion.button>
          )}

          {/* Reset Button */}
          {timer.elapsedSeconds > 0 && !isRunning && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className={`${classes.button} flex items-center justify-center rounded-full bg-gray-500 text-white shadow-soft hover:bg-gray-600 transition-colors`}
              title="重置為 00:00"
            >
              <RotateCcw className={classes.icon} />
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
