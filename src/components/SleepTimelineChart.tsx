import { motion } from 'framer-motion';
import { DailyLog, SleepData } from '../types';
import { isNightSleep } from '../utils/sleepAnalysis';

interface SleepTimelineChartProps {
  weekLogs: DailyLog[];
}

interface SleepPeriod {
  date: string;
  startHour: number;
  endHour: number;
  duration: number;
  isNight: boolean;
}

export default function SleepTimelineChart({ weekLogs }: SleepTimelineChartProps) {
  // Group sleep logs by date
  const sleepPeriodsByDate: { [date: string]: SleepPeriod[] } = {};

  // Filter completed sleep logs and group by date
  weekLogs
    .filter((log) => {
      const data = log.data as SleepData;
      return log.type === 'sleep' && data.endTime && data.duration;
    })
    .forEach((log) => {
      const data = log.data as SleepData;
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime!);

      // Use date string as key (YYYY-MM-DD)
      const dateKey = startDate.toISOString().split('T')[0];

      const startHour = startDate.getHours() + startDate.getMinutes() / 60;
      const endHour = endDate.getHours() + endDate.getMinutes() / 60;

      const period: SleepPeriod = {
        date: dateKey,
        startHour,
        endHour,
        duration: data.duration!,
        isNight: isNightSleep(data.startTime),
      };

      if (!sleepPeriodsByDate[dateKey]) {
        sleepPeriodsByDate[dateKey] = [];
      }
      sleepPeriodsByDate[dateKey].push(period);
    });

  // Get last 7 days
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Helper to format date label
  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  // Helper to calculate position and width
  const calculatePosition = (startHour: number, endHour: number) => {
    // Handle cross-midnight sleep (e.g., 23:00 to 07:00)
    let adjustedEndHour = endHour;
    if (endHour < startHour) {
      adjustedEndHour = endHour + 24;
    }

    const left = (startHour / 24) * 100;
    const width = ((adjustedEndHour - startHour) / 24) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="bg-white rounded-2xl p-4">
      {/* Time axis (0-24 hours) */}
      <div className="flex justify-between text-xs text-gray-500 mb-2 px-16">
        <span>0:00</span>
        <span>6:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>

      {/* Timeline grid */}
      <div className="space-y-3">
        {dates.map((date, index) => {
          const periods = sleepPeriodsByDate[date] || [];

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              {/* Date label */}
              <div className="w-20 text-xs text-gray-600 flex-shrink-0">
                {formatDateLabel(date)}
              </div>

              {/* Timeline bar */}
              <div className="flex-1 relative h-8 bg-gray-50 rounded-lg">
                {/* Hour markers */}
                <div className="absolute inset-0 flex">
                  {[0, 6, 12, 18, 24].map((hour) => (
                    <div
                      key={hour}
                      className="absolute h-full border-l border-gray-200"
                      style={{ left: `${(hour / 24) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Sleep periods */}
                {periods.map((period, periodIndex) => {
                  const { left, width } = calculatePosition(period.startHour, period.endHour);
                  const bgColor = period.isNight
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500'
                    : 'bg-gradient-to-r from-blue-300 to-blue-400';

                  return (
                    <motion.div
                      key={periodIndex}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 + periodIndex * 0.1 }}
                      className={`absolute top-1 bottom-1 ${bgColor} rounded-md shadow-sm`}
                      style={{ left, width, transformOrigin: 'left' }}
                      title={`${period.duration} 分鐘`}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-400 to-purple-500" />
          <span>夜間睡眠</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-300 to-blue-400" />
          <span>白天小睡</span>
        </div>
      </div>
    </div>
  );
}
