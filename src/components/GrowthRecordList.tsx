import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Weight, Ruler, CircleDot, Trash2 } from 'lucide-react';
import { GrowthRecord } from '../types';
import { getPercentileCategory } from '../utils/growthCalculator';

interface GrowthRecordListProps {
  records: GrowthRecord[];
  loading: boolean;
  onUpdate: (recordId: string, updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>) => Promise<void>;
  onDelete: (recordId: string) => Promise<void>;
  childId: string;
}

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

export default function GrowthRecordList({
  records,
  loading,
  onDelete,
}: GrowthRecordListProps) {
  const handleDelete = async (recordId: string) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      try {
        await onDelete(recordId);
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const getPercentileColor = (percentile?: number): string => {
    if (!percentile) return 'text-gray-500';
    const category = getPercentileCategory(percentile);
    if (category === 'low') return 'text-orange-600';
    if (category === 'high') return 'text-blue-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">載入中...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">尚無記錄</p>
        <p className="text-sm text-gray-500">點擊「新增記錄」開始追蹤成長數據</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft">
      <h2 className="text-xl font-bold text-gray-800 mb-4">歷史記錄</h2>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {records.map((record) => (
            <motion.div
              key={record.id}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="border border-gray-200 rounded-xl p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-gray-800">
                    {record.date}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {record.weight !== undefined && (
                  <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Weight className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">體重</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                      {record.weight} kg
                    </span>
                    {record.percentile?.weight && (
                      <span className={`text-xs mt-1 font-medium ${getPercentileColor(record.percentile.weight)}`}>
                        P{record.percentile.weight.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}

                {record.height !== undefined && (
                  <div className="flex flex-col p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Ruler className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-600">身高</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                      {record.height} cm
                    </span>
                    {record.percentile?.height && (
                      <span className={`text-xs mt-1 font-medium ${getPercentileColor(record.percentile.height)}`}>
                        P{record.percentile.height.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}

                {record.headCircumference !== undefined && (
                  <div className="flex flex-col p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CircleDot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-gray-600">頭圍</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                      {record.headCircumference} cm
                    </span>
                    {record.percentile?.headCircumference && (
                      <span className={`text-xs mt-1 font-medium ${getPercentileColor(record.percentile.headCircumference)}`}>
                        P{record.percentile.headCircumference.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {record.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{record.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
