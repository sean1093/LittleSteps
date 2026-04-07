import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { User } from 'firebase/auth';
import { VaccineProgress } from '../types';
import {
  vaccineSchedules,
  vaccineSideEffects,
  vaccineEmergencies,
  vaccineContraindications,
  vaccineTypes,
  vaccineGuidelines
} from '../data/vaccines';

type FundingFilter = 'all' | 'public' | 'private';
type MonthFilter = 'all' | number;

interface VaccineTrackingPageProps {
  vaccineProgress: VaccineProgress;
  onToggleVaccineDose: (vaccineId: string, doseNumber: number, customDate?: string) => void;
  user?: User | null;
  onSignIn?: () => Promise<void>;
}

export default function VaccineTrackingPage({
  vaccineProgress,
  onToggleVaccineDose,
  user,
  onSignIn = async () => {}
}: VaccineTrackingPageProps) {
  const [fundingFilter, setFundingFilter] = useState<FundingFilter>('all');
  const [monthFilter, setMonthFilter] = useState<MonthFilter>('all');
  const [showEmergencies, setShowEmergencies] = useState(false);
  const [showContraindications, setShowContraindications] = useState(false);
  const [showVaccineTypes, setShowVaccineTypes] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [editingDose, setEditingDose] = useState<{ vaccineId: string; doseNumber: number; currentDate?: string } | null>(null);

  // Get unique months for filter
  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(vaccineSchedules.map(v => v.ageInMonths || 0))).sort((a, b) => a - b);
    return months;
  }, []);

  const filteredVaccines = useMemo(() => {
    let filtered = vaccineSchedules;

    if (fundingFilter !== 'all') {
      filtered = filtered.filter(v => v.fundingType === fundingFilter);
    }

    if (monthFilter !== 'all') {
      filtered = filtered.filter(v => v.ageInMonths === monthFilter);
    }

    return filtered;
  }, [fundingFilter, monthFilter]);

  // Group vaccines by month
  const vaccinesByMonth = useMemo(() => {
    const grouped: { [key: number]: typeof vaccineSchedules } = {};

    filteredVaccines.forEach(vaccine => {
      const month = vaccine.ageInMonths || 0;
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(vaccine);
    });

    return grouped;
  }, [filteredVaccines]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-700';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700';
      case 'severe':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Helper: Check if a specific dose is administered
  const isDoseAdministered = (vaccineId: string, doseNumber: number): boolean => {
    return vaccineProgress[vaccineId]?.doses[doseNumber]?.administered || false;
  };

  // Helper: Get administered date for a dose
  const getDoseDate = (vaccineId: string, doseNumber: number): string | undefined => {
    return vaccineProgress[vaccineId]?.doses[doseNumber]?.administeredDate;
  };

  // Helper: Get completion status for a vaccine
  const getVaccineCompletionStatus = (vaccineId: string, totalDoses: number): { completed: number; total: number } => {
    let completed = 0;
    for (let i = 1; i <= totalDoses; i++) {
      if (isDoseAdministered(vaccineId, i)) {
        completed++;
      }
    }
    return { completed, total: totalDoses };
  };


  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6 relative overflow-hidden">
      {/* Header Info */}
      <div className="relative z-10 bg-[#E8F5E9]/30 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <Icons.Syringe className="w-5 h-5 text-[#81C784]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">疫苗接種時程表</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          依照衛福部建議時程，記錄寶寶的疫苗接種狀況
        </p>

        {/* Login Prompt - show when not logged in */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="bg-[#E8F5E9]/50 border-2 border-[#81C784]/30 rounded-3xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#81C784] flex items-center justify-center flex-shrink-0">
                  <Icons.Syringe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">登入以記錄疫苗接種</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    登入後即可追蹤並記錄寶寶的疫苗接種進度，資料會自動同步到所有裝置
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        await onSignIn();
                      } catch (error: any) {
                        if (error?.code === 'auth/popup-closed-by-user') {
                          return;
                        }
                        console.error('登入失敗:', error);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#81C784] text-white text-sm font-medium hover:bg-[#6BB870] transition-colors"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-4 h-4 bg-white rounded-full p-0.5"
                    />
                    <span>使用 Google 登入</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowEmergencies(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <Icons.AlertTriangle className="w-4 h-4" />
            <span>緊急狀況處理</span>
          </button>
          <button
            onClick={() => setShowContraindications(true)}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <Icons.ShieldAlert className="w-4 h-4" />
            <span>接種注意事項</span>
          </button>
          <button
            onClick={() => setShowVaccineTypes(true)}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <Icons.Pill className="w-4 h-4" />
            <span>疫苗種類說明</span>
          </button>
          <button
            onClick={() => setShowGuidelines(true)}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <Icons.BookOpen className="w-4 h-4" />
            <span>接種指南</span>
          </button>
        </div>
      </div>

      {/* Funding Filter */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">篩選疫苗類型</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFundingFilter('all')}
            className={`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${fundingFilter === 'all'
                ? 'bg-secondary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            全部疫苗
          </button>
          <button
            onClick={() => setFundingFilter('public')}
            className={`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${fundingFilter === 'public'
                ? 'bg-green-500 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            公費疫苗
          </button>
          <button
            onClick={() => setFundingFilter('private')}
            className={`
              flex-1 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${fundingFilter === 'private'
                ? 'bg-orange-500 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            自費疫苗
          </button>
        </div>
      </div>

      {/* Month Filter */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">月齡篩選</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 pl-4 pr-8">
          <button
            onClick={() => setMonthFilter('all')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
              ${monthFilter === 'all'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            全部
          </button>
          {availableMonths.map(month => (
            <button
              key={month}
              onClick={() => setMonthFilter(month)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-2xl font-medium transition-all text-sm
                ${monthFilter === month
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {month}個月
            </button>
          ))}
        </div>
      </div>

      {/* Vaccine Timeline - Grouped by Month */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Syringe className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">接種時程</h3>
          <span className="text-sm text-gray-500">（共 {filteredVaccines.length} 項）</span>
        </div>

        <div className="space-y-6">
          {Object.keys(vaccinesByMonth)
            .sort((a, b) => Number(a) - Number(b))
            .map(monthKey => {
              const month = Number(monthKey);
              const vaccines = vaccinesByMonth[month];

              return (
                <div key={monthKey}>
                  {/* Month Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 bg-[#E8F5E9]/30 px-4 py-2 rounded-full">
                      <Icons.Calendar className="w-4 h-4 text-[#81C784]" />
                      <span className="font-bold text-[#81C784]">{month} 個月</span>
                      <span className="text-sm text-gray-500">({vaccines.length} 項)</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Vaccines in this month */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {vaccines.map((vaccine, index) => {
                        return (
                          <motion.div
                            key={vaccine.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="card"
                          >
                            {/* Age Badge & Vaccine Header */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className={`
                                w-16 h-16 rounded-full flex-shrink-0 flex flex-col items-center justify-center text-white font-bold text-xs
                                ${vaccine.fundingType === 'public'
                                  ? 'bg-[#81C784]'
                                  : 'bg-[#FF9B9B]'
                                }
                              `}>
                                <div className="text-lg">{vaccine.ageInMonths || 0}</div>
                                <div className="text-[10px] opacity-90">個月</div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 leading-tight mb-1">
                                  {vaccine.name}
                                </h4>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Icons.Clock className="w-3 h-3" />
                                    {vaccine.timing}
                                  </span>
                                  <span className={`
                                    px-2 py-0.5 rounded-full font-medium
                                    ${vaccine.fundingType === 'public'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-orange-100 text-orange-700'
                                    }
                                  `}>
                                    {vaccine.fundingType === 'public' ? '公費' : '自費'}
                                  </span>
                                  {vaccine.doses > 1 && (
                                    <span className="text-gray-500">
                                      {getVaccineCompletionStatus(vaccine.id, vaccine.doses).completed}/{vaccine.doses} 劑已完成
                                    </span>
                                  )}
                                </div>

                                {vaccine.notes && (
                                  <p className="text-xs text-gray-500 italic mt-1">
                                    {vaccine.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Dose List - Always shown */}
                            <div className="space-y-2">
                              {Array.from({ length: vaccine.doses }, (_, i) => i + 1).map((doseNum) => {
                                const isAdministered = isDoseAdministered(vaccine.id, doseNum);
                                const doseDate = getDoseDate(vaccine.id, doseNum);

                                return (
                                  <div
                                    key={doseNum}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                  >
                                    {/* Checkbox - only show when logged in */}
                                    {user && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (isAdministered) {
                                            // If already administered, show edit date modal
                                            setEditingDose({ vaccineId: vaccine.id, doseNumber: doseNum, currentDate: doseDate });
                                          } else {
                                            // If not administered, show date picker to set date
                                            setEditingDose({ vaccineId: vaccine.id, doseNumber: doseNum });
                                          }
                                        }}
                                        className={`
                                          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                                          ${isAdministered
                                            ? 'bg-primary border-primary'
                                            : 'border-gray-300 hover:border-primary'
                                          }
                                        `}
                                        aria-label={`標記第${doseNum}劑為${isAdministered ? '未接種' : '已接種'}`}
                                      >
                                        {isAdministered && <Icons.Check className="w-4 h-4 text-white" />}
                                      </button>
                                    )}
                                    <div className="flex-1">
                                      <span className={`text-sm font-medium ${isAdministered ? 'text-gray-800' : 'text-gray-600'}`}>
                                        {vaccine.doses > 1 ? `第 ${doseNum} 劑` : ''}
                                      </span>
                                      {isAdministered && doseDate && (
                                        <button
                                          onClick={() => setEditingDose({ vaccineId: vaccine.id, doseNumber: doseNum, currentDate: doseDate })}
                                          className="text-xs text-green-600 ml-2 hover:text-green-700 hover:underline"
                                        >
                                          ✓ {doseDate}
                                        </button>
                                      )}
                                      {!user && !isAdministered && (
                                        <span className="text-xs text-gray-400 ml-2">
                                          登入後可記錄
                                        </span>
                                      )}
                                      {user && !isAdministered && (
                                        <span className="text-xs text-gray-400 ml-2">
                                          點擊記錄接種
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Description and Protection - Always shown */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <Icons.AlertCircle className="w-4 h-4 text-primary" />
                                  <span>可能的副作用</span>
                                </div>
                                <ul className="space-y-1 ml-6">
                                  {vaccine.sideEffects.map((effect, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                      <span className="text-primary">•</span>
                                      <span>{effect}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Side Effects Reference */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Stethoscope className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">副作用處理指南</h3>
        </div>

        <div className="space-y-3">
          {vaccineSideEffects.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

            return (
              <div key={category.category} className="card">
                <div className="flex items-center gap-2 mb-3">
                  {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
                  <h4 className="font-semibold text-gray-800">{category.category}</h4>
                </div>

                <div className="space-y-2">
                  {category.reactions.map((reaction, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap h-fit
                        ${getSeverityColor(reaction.severity)}
                      `}>
                        {reaction.symptom}
                      </span>
                      <p className="text-gray-600 flex-1">{reaction.response}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencies && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmergencies(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-800">緊急狀況處理</h3>
                </div>
                <button
                  onClick={() => setShowEmergencies(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {vaccineEmergencies.map((emergency) => {
                  const IconComponent = Icons[emergency.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

                  return (
                    <div key={emergency.id} className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        {IconComponent && (
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-red-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-900 mb-1">{emergency.symptom}</h4>
                          <p className="text-sm text-red-700">{emergency.action}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contraindications Modal */}
      <AnimatePresence>
        {showContraindications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContraindications(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.ShieldAlert className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">接種禁忌與注意事項</h3>
                </div>
                <button
                  onClick={() => setShowContraindications(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {vaccineContraindications.map((section, idx) => (
                  <div key={idx} className="card">
                    <h4 className="font-semibold text-gray-800 mb-3">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex gap-2 text-sm text-gray-700">
                          <Icons.CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Vaccine Types Modal */}
      <AnimatePresence>
        {showVaccineTypes && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVaccineTypes(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.Pill className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-800">疫苗種類說明</h3>
                </div>
                <button
                  onClick={() => setShowVaccineTypes(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {vaccineTypes.map((type, idx) => (
                  <div key={idx} className="card">
                    <h4 className="font-semibold text-gray-800 mb-2">{type.type}</h4>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-2 font-medium">包含疫苗：</p>
                      <div className="flex flex-wrap gap-1.5">
                        {type.examples.map((example, exIdx) => (
                          <span
                            key={exIdx}
                            className="px-2 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    {type.notes && (
                      <p className="text-xs text-orange-600 mt-2 font-medium">
                        ⚠️ {type.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Guidelines Modal */}
      <AnimatePresence>
        {showGuidelines && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuidelines(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.BookOpen className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-800">疫苗接種指南</h3>
                </div>
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {vaccineGuidelines.map((section, idx) => (
                  <div key={idx} className="card">
                    <h4 className="font-semibold text-gray-800 mb-3">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex gap-2 text-sm text-gray-700">
                          <Icons.CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Date Editing Modal */}
      <AnimatePresence>
        {editingDose && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDose(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingDose.currentDate ? '修改接種日期' : '記錄接種日期'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingDose(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icons.X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const date = formData.get('date') as string;

                  if (date) {
                    // Update the vaccine dose with the selected date
                    onToggleVaccineDose(editingDose.vaccineId, editingDose.doseNumber, date);
                    setEditingDose(null);
                  }
                }}
                className="p-6 space-y-6"
              >
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Icons.Calendar className="w-4 h-4 text-primary" />
                    接種日期
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingDose.currentDate || new Date().toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingDose(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-[#81C784] hover:bg-[#6BB870] text-white font-semibold rounded-full shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Check className="w-5 h-5" />
                    <span>確認</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
