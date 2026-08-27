import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { User } from 'firebase/auth';
import { ChildProfile } from '../../types';
import { useGrowthTracking } from '../hooks/useGrowthTracking';
import GrowthRecordList from '../components/growth/GrowthRecordList';
import AddGrowthRecordModal from '../components/growth/AddGrowthRecordModal';
import GrowthChartDisplay from '../components/growth/GrowthChartDisplay';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger, listItem } from '../../common/ui/motion';

interface GrowthChartsPageProps {
  currentChild?: ChildProfile;
  user: User | null;
}

const CHART_TABS: { value: 'weight' | 'height' | 'headCircumference'; label: string }[] = [
  { value: 'weight', label: '體重' },
  { value: 'height', label: '身高' },
  { value: 'headCircumference', label: '頭圍' },
];

export default function GrowthChartsPage({
  currentChild,
  user,
}: GrowthChartsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'weight' | 'height' | 'headCircumference'>('weight');

  const { records, loading, addRecord, updateRecord, deleteRecord } = useGrowthTracking(
    currentChild?.id || null,
    user,
    currentChild?.gender,
    currentChild?.birthday
  );

  if (!currentChild) {
    return (
      <div className="screen">
        <div className="screen-body-wide">
          <EmptyState
            theme={SERVICE_THEME.littlesteps}
            title="尚未建立寶寶檔案"
            description="請從左上角選單新增寶寶資料"
          />
        </div>
      </div>
    );
  }

  const latestRecord = records[0]; // Already sorted newest first

  return (
    <div className="screen">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="screen-body-wide"
      >
        <motion.div variants={listItem} className="flex justify-end mb-5">
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            <span>新增記錄</span>
          </button>
        </motion.div>

        {/* Latest Record Summary */}
        {latestRecord && (
          <motion.div variants={listItem} className="panel mb-6">
            <p className="text-sm text-ink-muted mb-4">最新記錄: {latestRecord.date}</p>
            <div className="grid grid-cols-3 gap-3">
              {latestRecord.weight !== undefined && (
                <div className="flex flex-col items-center p-4 bg-primary-soft rounded-2xl">
                  <span className="text-2xl font-bold text-ink">
                    {latestRecord.weight} kg
                  </span>
                  <span className="text-sm text-ink-muted mt-1">體重</span>
                  {latestRecord.percentile?.weight && (
                    <span className="text-sm text-primary-dark mt-1">
                      第 {latestRecord.percentile.weight.toFixed(0)} 百分位
                    </span>
                  )}
                </div>
              )}
              {latestRecord.height !== undefined && (
                <div className="flex flex-col items-center p-4 bg-primary-soft rounded-2xl">
                  <span className="text-2xl font-bold text-ink">
                    {latestRecord.height} cm
                  </span>
                  <span className="text-sm text-ink-muted mt-1">身高</span>
                  {latestRecord.percentile?.height && (
                    <span className="text-sm text-primary-dark mt-1">
                      第 {latestRecord.percentile.height.toFixed(0)} 百分位
                    </span>
                  )}
                </div>
              )}
              {latestRecord.headCircumference !== undefined && (
                <div className="flex flex-col items-center p-4 bg-primary-soft rounded-2xl">
                  <span className="text-2xl font-bold text-ink">
                    {latestRecord.headCircumference} cm
                  </span>
                  <span className="text-sm text-ink-muted mt-1">頭圍</span>
                  {latestRecord.percentile?.headCircumference && (
                    <span className="text-sm text-primary-dark mt-1">
                      第 {latestRecord.percentile.headCircumference.toFixed(0)} 百分位
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Chart Tabs */}
        <motion.div variants={listItem} className="row-bleed flex gap-2 pb-2 mb-4">
          {CHART_TABS.map((chartTab) => (
            <button
              key={chartTab.value}
              onClick={() => setSelectedChart(chartTab.value)}
              className={`chip ${selectedChart === chartTab.value ? 'chip-on' : ''}`}
            >
              {chartTab.label}
            </button>
          ))}
        </motion.div>

        {/* Growth Chart */}
        <motion.div variants={listItem} className="mb-6">
          <GrowthChartDisplay
            records={records}
            measurementType={selectedChart}
            gender={currentChild.gender}
            birthday={currentChild.birthday}
          />
        </motion.div>

        {/* Records List */}
        <motion.div variants={listItem}>
          <GrowthRecordList
            records={records}
            loading={loading}
            onUpdate={updateRecord}
            onDelete={deleteRecord}
            childId={currentChild.id}
          />
        </motion.div>
      </motion.div>

      <AddGrowthRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRecord}
        childId={currentChild.id}
      />
    </div>
  );
}
