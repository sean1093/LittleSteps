import { useMemo } from 'react';

interface ReportChartProps {
  data: number[];
  labels: string[];
  type: 'line' | 'bar';
  color?: string;
  height?: number;
  unit?: string;
  recommendedValue?: number;
}

const PADDING = { top: 20, right: 16, bottom: 36, left: 40 };
const VIEW_WIDTH = 360;

export default function ReportChart({
  data,
  labels,
  type,
  color = '#7EC8E3',
  height = 200,
  unit = '',
  recommendedValue,
}: ReportChartProps) {
  const chartWidth = VIEW_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  const { maxVal, minVal, yTicks } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxVal: 1, minVal: 0, yTicks: [0, 1] };
    }

    let rawMax = Math.max(...data);
    let rawMin = Math.min(...data);

    // Include recommended value in range if present
    if (recommendedValue !== undefined) {
      rawMax = Math.max(rawMax, recommendedValue);
      rawMin = Math.min(rawMin, recommendedValue);
    }

    // Add 10% headroom
    const range = rawMax - rawMin || 1;
    const paddedMax = rawMax + range * 0.1;
    const paddedMin = Math.max(0, rawMin - range * 0.1);

    // Generate 4 ticks
    const tickCount = 4;
    const ticks: number[] = [];
    for (let i = 0; i < tickCount; i++) {
      const val = paddedMin + ((paddedMax - paddedMin) * i) / (tickCount - 1);
      ticks.push(Math.round(val * 10) / 10);
    }

    return { maxVal: paddedMax, minVal: paddedMin, yTicks: ticks };
  }, [data, recommendedValue]);

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-xl"
        style={{ height }}
      >
        <p className="text-sm text-gray-400">尚無資料</p>
      </div>
    );
  }

  const getY = (value: number) => {
    const range = maxVal - minVal || 1;
    return PADDING.top + chartHeight - ((value - minVal) / range) * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length === 1) return PADDING.left + chartWidth / 2;
    return PADDING.left + (index / (data.length - 1)) * chartWidth;
  };

  // For bar charts, compute bar positions differently
  const barWidth = data.length > 0 ? Math.min(24, (chartWidth / data.length) * 0.6) : 16;
  const getBarX = (index: number) => {
    const totalGroupWidth = chartWidth / data.length;
    return PADDING.left + totalGroupWidth * index + (totalGroupWidth - barWidth) / 2;
  };

  // Generate line points
  const linePoints = data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');

  // Fill polygon for line chart
  const fillPoints = [
    `${getX(0)},${PADDING.top + chartHeight}`,
    ...data.map((val, i) => `${getX(i)},${getY(val)}`),
    `${getX(data.length - 1)},${PADDING.top + chartHeight}`,
  ].join(' ');

  // Determine which labels to show (skip some if too many)
  const maxLabels = 10;
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Y-axis gridlines and labels */}
      {yTicks.map((tick) => {
        const y = getY(tick);
        return (
          <g key={`ytick-${tick}`}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={VIEW_WIDTH - PADDING.right}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-gray-400"
              fontSize={10}
            >
              {tick % 1 === 0 ? tick : tick.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Recommended value dashed line */}
      {recommendedValue !== undefined && (
        <g>
          <line
            x1={PADDING.left}
            y1={getY(recommendedValue)}
            x2={VIEW_WIDTH - PADDING.right}
            y2={getY(recommendedValue)}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text
            x={VIEW_WIDTH - PADDING.right + 2}
            y={getY(recommendedValue) + 3}
            fontSize={9}
            className="fill-amber-500"
          >
            {recommendedValue}
            {unit}
          </text>
        </g>
      )}

      {/* Chart body */}
      {type === 'line' ? (
        <>
          {/* Fill area */}
          <polygon points={fillPoints} fill={color} opacity={0.1} />
          {/* Line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots */}
          {data.map((val, i) => (
            <circle
              key={`dot-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r={3}
              fill="white"
              stroke={color}
              strokeWidth={2}
            />
          ))}
        </>
      ) : (
        <>
          {/* Bars */}
          {data.map((val, i) => {
            const barHeight = Math.max(
              1,
              ((val - minVal) / (maxVal - minVal || 1)) * chartHeight
            );
            const barY = PADDING.top + chartHeight - barHeight;
            return (
              <rect
                key={`bar-${i}`}
                x={getBarX(i)}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx={Math.min(4, barWidth / 2)}
                fill={color}
                opacity={0.85}
              />
            );
          })}
        </>
      )}

      {/* X-axis labels */}
      {labels.map((label, i) => {
        if (i % labelStep !== 0 && i !== labels.length - 1) return null;
        const x = type === 'bar' ? getBarX(i) + barWidth / 2 : getX(i);
        return (
          <text
            key={`xlabel-${i}`}
            x={x}
            y={height - 6}
            textAnchor="middle"
            fontSize={9}
            className="fill-gray-400"
          >
            {label}
          </text>
        );
      })}

      {/* Unit label */}
      {unit && (
        <text
          x={PADDING.left}
          y={PADDING.top - 6}
          fontSize={9}
          className="fill-gray-400"
        >
          ({unit})
        </text>
      )}
    </svg>
  );
}
