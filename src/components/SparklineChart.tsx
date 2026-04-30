interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
}

export default function SparklineChart({
  data,
  width = 120,
  height = 32,
  color = '#7EC8E3',
  fillColor,
}: SparklineChartProps) {
  // Handle edge cases
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height}>
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.4}
        />
      </svg>
    );
  }

  if (data.length === 1) {
    return (
      <svg width={width} height={height}>
        <circle cx={width / 2} cy={height / 2} r={2.5} fill={color} />
      </svg>
    );
  }

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1; // avoid division by zero when all values are the same

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Generate points
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minVal) / range) * chartHeight;
    return { x, y };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Build fill polygon path (area under the line)
  const fillPoints = [
    `${points[0].x},${height - padding}`,
    ...points.map(p => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${height - padding}`,
  ].join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Fill area */}
      {fillColor && (
        <polygon
          points={fillPoints}
          fill={fillColor}
          opacity={0.2}
        />
      )}
      {/* Line */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End point dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2}
        fill={color}
      />
    </svg>
  );
}
