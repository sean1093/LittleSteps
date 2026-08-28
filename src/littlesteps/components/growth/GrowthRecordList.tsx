import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { GrowthRecord } from '../../../types';
import { getPercentileCategory } from '../../utils/growthCalculator';
import EmptyState from '../../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../../common/ui/serviceTheme';
import { listItem, stagger, tap } from '../../../common/ui/motion';
import { formatDate } from '../../../common/utils/dateHelpers';

interface GrowthRecordListProps {
  records: GrowthRecord[];
  loading: boolean;
  onUpdate: (recordId: string, updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>) => Promise<void>;
  onDelete: (recordId: string) => Promise<void>;
  childId: string;
}

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
    if (!percentile) return 'text-ink-faint';
    const category = getPercentileCategory(percentile);
    if (category === 'low') return 'text-butter-dark';
    if (category === 'high') return 'text-secondary-dark';
    return 'text-mint-dark';
  };

  if (loading) {
    return (
      <div className="panel text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-muted mt-4">載入中...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <EmptyState
        theme={SERVICE_THEME.littlesteps}
        title="尚無記錄"
        description="點擊「新增記錄」開始追蹤成長數據"
      />
    );
  }

  return (
    <div className="panel">
      <h2 className="mb-4">歷史記錄</h2>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {records.map((record) => (
            <motion.div
              key={record.id}
              variants={listItem}
              exit="hidden"
              layout
              className="border border-ink/10 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-semibold">{formatDate(record.date)}</span>
                <motion.button
                  whileTap={tap}
                  onClick={() => handleDelete(record.id)}
                  className="btn-icon -my-2.5 text-red-600 hover:bg-red-50"
                  aria-label="刪除記錄"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              {/*
                One wash for all three tiles: the label names the field, so a
                different pastel per measurement was distinguishing nothing.
                Values are `whitespace-nowrap` — `8.6 kg` wrapped at 360px.
              */}
              <div className="grid grid-cols-3 gap-2">
                {record.weight !== undefined && (
                  <div className="flex flex-col p-2.5 bg-secondary-soft rounded-lg">
                    <span className="text-xs text-ink-muted mb-1">體重</span>
                    <span className="font-bold whitespace-nowrap">{record.weight} kg</span>
                    {record.percentile?.weight && (
                      <span className={`text-xs mt-1 font-medium ${getPercentileColor(record.percentile.weight)}`}>
                        P{record.percentile.weight.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}

                {record.height !== undefined && (
                  <div className="flex flex-col p-2.5 bg-secondary-soft rounded-lg">
                    <span className="text-xs text-ink-muted mb-1">身高</span>
                    <span className="font-bold whitespace-nowrap">{record.height} cm</span>
                    {record.percentile?.height && (
                      <span className={`text-xs mt-1 font-medium ${getPercentileColor(record.percentile.height)}`}>
                        P{record.percentile.height.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}

                {record.headCircumference !== undefined && (
                  <div className="flex flex-col p-2.5 bg-secondary-soft rounded-lg">
                    <span className="text-xs text-ink-muted mb-1">頭圍</span>
                    <span className="font-bold whitespace-nowrap">{record.headCircumference} cm</span>
                    {record.percentile?.headCircumference && (
                      <span className={`text-xs mt-1 font-medium ${getPercentileColor(record.percentile.headCircumference)}`}>
                        P{record.percentile.headCircumference.toFixed(0)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {record.notes && (
                <p className="mt-3 p-3 bg-warm-white rounded-lg text-sm text-ink-muted">
                  {record.notes}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
