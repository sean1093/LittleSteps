import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Calendar, Ruler, Weight, CircleDot } from 'lucide-react';
import { User } from 'firebase/auth';
import { ChildProfile } from '../types';
import { useGrowthTracking } from '../hooks/useGrowthTracking';
import GrowthRecordList from '../components/GrowthRecordList';
import AddGrowthRecordModal from '../components/AddGrowthRecordModal';
import GrowthChartDisplay from '../components/GrowthChartDisplay';

interface GrowthChartsPageProps {
  currentChild?: ChildProfile;
  user: User | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-600 mb-6">尚未建立寶寶檔案</p>
        <p className="text-gray-500">請從左上角選單新增寶寶資料</p>
      </div>
    );
  }

  const latestRecord = records[0]; // Already sorted newest first

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#E8F4F8] rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FFE5E5] rounded-full opacity-30 blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                成長曲線圖
              </h1>
              <p className="text-gray-600">
                追蹤 {currentChild.name} 的身高體重發展
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#7EC8E3] text-white rounded-full shadow-soft hover:shadow-soft-lg transition-all hover:bg-[#6BB8D3]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">新增記錄</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Latest Record Summary */}
        {latestRecord && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-soft mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-600">
                最新記錄: {latestRecord.date}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {latestRecord.weight !== undefined && (
                <div className="flex flex-col items-center p-4 bg-[#E8F4F8]/50 rounded-3xl">
                  <Weight className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-800">
                    {latestRecord.weight} kg
                  </span>
                  <span className="text-xs text-gray-600 mt-1">體重</span>
                  {latestRecord.percentile?.weight && (
                    <span className="text-xs text-blue-600 mt-1">
                      第 {latestRecord.percentile.weight.toFixed(0)} 百分位
                    </span>
                  )}
                </div>
              )}
              {latestRecord.height !== undefined && (
                <div className="flex flex-col items-center p-4 bg-[#E8F5E9]/50 rounded-3xl">
                  <Ruler className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-800">
                    {latestRecord.height} cm
                  </span>
                  <span className="text-xs text-gray-600 mt-1">身高</span>
                  {latestRecord.percentile?.height && (
                    <span className="text-xs text-green-600 mt-1">
                      第 {latestRecord.percentile.height.toFixed(0)} 百分位
                    </span>
                  )}
                </div>
              )}
              {latestRecord.headCircumference !== undefined && (
                <div className="flex flex-col items-center p-4 bg-purple-50/50 rounded-3xl">
                  <CircleDot className="w-6 h-6 text-purple-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-800">
                    {latestRecord.headCircumference} cm
                  </span>
                  <span className="text-xs text-gray-600 mt-1">頭圍</span>
                  {latestRecord.percentile?.headCircumference && (
                    <span className="text-xs text-purple-600 mt-1">
                      第 {latestRecord.percentile.headCircumference.toFixed(0)} 百分位
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Chart Tabs */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-white rounded-3xl p-2 shadow-soft inline-flex gap-2">
            <button
              onClick={() => setSelectedChart('weight')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedChart === 'weight'
                  ? 'bg-[#7EC8E3] text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              體重
            </button>
            <button
              onClick={() => setSelectedChart('height')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedChart === 'height'
                  ? 'bg-[#81C784] text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              身高
            </button>
            <button
              onClick={() => setSelectedChart('headCircumference')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedChart === 'headCircumference'
                  ? 'bg-[#FF9B9B] text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              頭圍
            </button>
          </div>
        </motion.div>

        {/* Growth Chart */}
        <motion.div variants={itemVariants} className="mb-6">
          <GrowthChartDisplay
            records={records}
            measurementType={selectedChart}
            gender={currentChild.gender}
            birthday={currentChild.birthday}
          />
        </motion.div>

        {/* Records List */}
        <motion.div variants={itemVariants}>
          <GrowthRecordList
            records={records}
            loading={loading}
            onUpdate={updateRecord}
            onDelete={deleteRecord}
            childId={currentChild.id}
          />
        </motion.div>
      </motion.div>

      {/* Add Record Modal */}
      <AddGrowthRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRecord}
        childId={currentChild.id}
      />
    </div>
  );
}
