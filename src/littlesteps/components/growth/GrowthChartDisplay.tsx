import { useMemo } from 'react';
import { GrowthRecord, MeasurementType, Gender } from '../../../types';
import {
  getWHOStandard,
  getPercentileValue,
  WHO_MAX_AGE_MONTHS,
} from '../../data/growthChartData';
import EmptyState from '../../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../../common/ui/serviceTheme';

interface GrowthChartDisplayProps {
  records: GrowthRecord[];
  measurementType: MeasurementType;
  gender?: Gender;
  birthday?: string;
}

export default function GrowthChartDisplay({
  records,
  measurementType,
  gender,
  birthday,
}: GrowthChartDisplayProps) {
  const chartData = useMemo(() => {
    if (!gender || !birthday || records.length === 0) {
      return null;
    }

    // Filter records that have the selected measurement
    const validRecords = records.filter((r) => {
      if (measurementType === 'weight') return r.weight !== undefined;
      if (measurementType === 'height') return r.height !== undefined;
      if (measurementType === 'headCircumference') return r.headCircumference !== undefined;
      return false;
    });

    if (validRecords.length === 0) return null;

    // Calculate age in months for each record
    const birthDate = new Date(birthday);
    const recordsWithAge = validRecords.map((record) => {
      const recordDate = new Date(record.date);
      const ageMonths =
        (recordDate.getFullYear() - birthDate.getFullYear()) * 12 +
        (recordDate.getMonth() - birthDate.getMonth()) +
        (recordDate.getDate() - birthDate.getDate()) / 30;

      let value: number;
      if (measurementType === 'weight') value = record.weight!;
      else if (measurementType === 'height') value = record.height!;
      else value = record.headCircumference!;

      return {
        ageMonths,
        value,
        date: record.date,
        percentile:
          measurementType === 'weight'
            ? record.percentile?.weight
            : measurementType === 'height'
            ? record.percentile?.height
            : record.percentile?.headCircumference,
      };
    });

    // Generate WHO percentile curves (3rd, 15th, 50th, 85th, 97th).
    // Clamping to the tables' ceiling is what keeps getWHOStandard() in range.
    const maxAge = Math.min(
      WHO_MAX_AGE_MONTHS,
      Math.max(...recordsWithAge.map((r) => r.ageMonths)) + 2
    );
    const percentileCurves = [3, 15, 50, 85, 97].map((percentile) => {
      const points: { ageMonths: number; value: number }[] = [];
      for (let age = 0; age <= maxAge; age += 1) {
        const standard = getWHOStandard(age, measurementType, gender);
        const value = getPercentileValue(standard, percentile);
        points.push({ ageMonths: age, value });
      }
      return { percentile, points };
    });

    return {
      recordsWithAge,
      percentileCurves,
      maxAge,
      minValue: Math.min(
        ...percentileCurves[0].points.map((p) => p.value),
        ...recordsWithAge.map((r) => r.value)
      ),
      maxValue: Math.max(
        ...percentileCurves[percentileCurves.length - 1].points.map((p) => p.value),
        ...recordsWithAge.map((r) => r.value)
      ),
    };
  }, [records, measurementType, gender, birthday]);

  if (!chartData) {
    return (
      <EmptyState
        theme={SERVICE_THEME.littlesteps}
        title="無法顯示圖表"
        description={
          !gender || !birthday
            ? '需要設定寶寶的性別和生日'
            : '尚無此項目的測量記錄'
        }
      />
    );
  }

  const { recordsWithAge, percentileCurves, maxAge, minValue, maxValue } = chartData;

  /*
    A phone-sized coordinate space, like `ReportChart`. This used to be 800x500
    with no viewBox, so reading the curve meant scrolling sideways; scaling that
    box down instead would have shrunk every label to ~5px.
  */
  const width = 360;
  const height = 280;
  const padding = { top: 24, right: 32, bottom: 40, left: 36 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Cap the x axis at ~8 labels so month ticks don't collide at 360px.
  const monthStep = Math.max(3, Math.ceil(maxAge / 8 / 3) * 3);
  const monthTicks: number[] = [];
  for (let m = 0; m <= maxAge; m += monthStep) monthTicks.push(m);

  // Scales
  const xScale = (ageMonths: number) => {
    return padding.left + (ageMonths / maxAge) * chartWidth;
  };

  const yScale = (value: number) => {
    const range = maxValue - minValue;
    const padding_y = range * 0.1; // 10% padding
    return (
      height -
      padding.bottom -
      ((value - minValue + padding_y) / (range + padding_y * 2)) * chartHeight
    );
  };

  // Generate path for percentile curves
  const generatePath = (points: { ageMonths: number; value: number }[]) => {
    return points
      .map((point, index) => {
        const x = xScale(point.ageMonths);
        const y = yScale(point.value);
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');
  };

  const getLabel = () => {
    if (measurementType === 'weight') return { name: '體重', unit: 'kg' };
    if (measurementType === 'height') return { name: '身高', unit: 'cm' };
    return { name: '頭圍', unit: 'cm' };
  };

  const label = getLabel();

  return (
    <div className="panel">
      <h2 className="mb-4">{label.name}成長曲線圖 (WHO 標準)</h2>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
      >
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => {
          const y = padding.top + (chartHeight / 4) * i;
          return (
            <line
              key={`grid-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* WHO Percentile curves. `#2F7F9C` is `secondary-dark`. */}
        {percentileCurves.map((curve) => (
          <g key={`curve-${curve.percentile}`}>
            <path
              d={generatePath(curve.points)}
              fill="none"
              stroke={
                curve.percentile === 50
                  ? '#2F7F9C'
                  : curve.percentile === 3 || curve.percentile === 97
                  ? '#ef4444'
                  : '#94a3b8'
              }
              strokeWidth={curve.percentile === 50 ? 2 : 1}
              strokeDasharray={curve.percentile === 50 ? '0' : '4,4'}
            />
            <text
              x={width - padding.right + 4}
              y={yScale(curve.points[curve.points.length - 1].value)}
              fontSize="10"
              fill="#6b7280"
              dominantBaseline="middle"
            >
              P{curve.percentile}
            </text>
          </g>
        ))}

        {/* Baby's data points. `#B84A50` is `primary-dark`. */}
        {recordsWithAge.map((record, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={xScale(record.ageMonths)}
              cy={yScale(record.value)}
              r="4"
              fill="#B84A50"
              stroke="white"
              strokeWidth="2"
            />
            {index === recordsWithAge.length - 1 && (
              <text
                x={xScale(record.ageMonths)}
                y={yScale(record.value) - 12}
                fontSize="10"
                fill="#B84A50"
                textAnchor="middle"
                fontWeight="bold"
              >
                {record.value} {label.unit}
              </text>
            )}
          </g>
        ))}

        {/* Connect baby's data points */}
        {recordsWithAge.length > 1 && (
          <path
            d={generatePath(recordsWithAge)}
            fill="none"
            stroke="#B84A50"
            strokeWidth="2"
          />
        )}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="1.5"
        />
        {monthTicks.map((ageMonths) => {
          const x = xScale(ageMonths);
          return (
            <g key={`x-label-${ageMonths}`}>
              <line
                x1={x}
                y1={height - padding.bottom}
                x2={x}
                y2={height - padding.bottom + 5}
                stroke="#374151"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={height - padding.bottom + 17}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {ageMonths}月
              </text>
            </g>
          );
        })}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="1.5"
        />
        <text x={2} y={padding.top - 10} fontSize="11" fill="#374151" fontWeight="bold">
          {label.name} ({label.unit})
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-secondary-dark" />
          <span className="text-ink-muted">WHO 第50百分位</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-ink-faint" />
          <span className="text-ink-muted">WHO 其他百分位</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-dark rounded-full" />
          <span className="text-ink-muted">寶寶數據</span>
        </div>
      </div>
    </div>
  );
}
