import { useMemo } from 'react';
import { GrowthRecord, MeasurementType, Gender } from '../types';
import { getWHOStandard, getPercentileValue } from '../data/growthChartData';
import { TrendingUp, AlertTriangle } from 'lucide-react';

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

    // Generate WHO percentile curves (3rd, 15th, 50th, 85th, 97th)
    const maxAge = Math.min(24, Math.max(...recordsWithAge.map((r) => r.ageMonths)) + 2);
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
      <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">無法顯示圖表</p>
        <p className="text-sm text-gray-500">
          {!gender || !birthday
            ? '需要設定寶寶的性別和生日'
            : '尚無此項目的測量記錄'}
        </p>
      </div>
    );
  }

  const { recordsWithAge, percentileCurves, maxAge, minValue, maxValue } = chartData;

  // Calculate chart dimensions
  const width = 800;
  const height = 500;
  const padding = { top: 40, right: 80, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

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
    <div className="bg-white rounded-2xl p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-gray-800">
          {label.name}成長曲線圖 (WHO 標準)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
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

          {/* WHO Percentile curves */}
          {percentileCurves.map((curve) => (
            <g key={`curve-${curve.percentile}`}>
              <path
                d={generatePath(curve.points)}
                fill="none"
                stroke={
                  curve.percentile === 50
                    ? '#3b82f6'
                    : curve.percentile === 3 || curve.percentile === 97
                    ? '#ef4444'
                    : '#94a3b8'
                }
                strokeWidth={curve.percentile === 50 ? 2 : 1}
                strokeDasharray={curve.percentile === 50 ? '0' : '4,4'}
              />
              <text
                x={width - padding.right + 5}
                y={yScale(curve.points[curve.points.length - 1].value)}
                fontSize="12"
                fill="#6b7280"
                dominantBaseline="middle"
              >
                P{curve.percentile}
              </text>
            </g>
          ))}

          {/* Baby's data points */}
          {recordsWithAge.map((record, index) => (
            <g key={`point-${index}`}>
              <circle
                cx={xScale(record.ageMonths)}
                cy={yScale(record.value)}
                r="6"
                fill="#f472b6"
                stroke="white"
                strokeWidth="2"
              />
              {index === recordsWithAge.length - 1 && (
                <text
                  x={xScale(record.ageMonths)}
                  y={yScale(record.value) - 15}
                  fontSize="12"
                  fill="#be185d"
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
              stroke="#ec4899"
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
            strokeWidth="2"
          />
          {[...Array(Math.ceil(maxAge / 3) + 1)].map((_, i) => {
            const ageMonths = i * 3;
            if (ageMonths > maxAge) return null;
            const x = xScale(ageMonths);
            return (
              <g key={`x-label-${i}`}>
                <line
                  x1={x}
                  y1={height - padding.bottom}
                  x2={x}
                  y2={height - padding.bottom + 6}
                  stroke="#374151"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  fontSize="12"
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
            strokeWidth="2"
          />
          <text
            x={padding.left - 40}
            y={padding.top - 10}
            fontSize="14"
            fill="#374151"
            fontWeight="bold"
          >
            {label.name} ({label.unit})
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-500"></div>
          <span className="text-gray-600">WHO 第50百分位</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gray-400 border-dashed border-t-2"></div>
          <span className="text-gray-600">WHO 其他百分位</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span className="text-gray-600">寶寶數據</span>
        </div>
      </div>
    </div>
  );
}
