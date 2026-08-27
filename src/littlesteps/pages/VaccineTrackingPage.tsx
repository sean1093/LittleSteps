import { useState, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, BookOpen, Check, Pill, ShieldAlert, X } from 'lucide-react';
import { getLucideIcon } from '../../common/lucideIcons';

import { VaccineProgress } from '../../types';
import {
  vaccineSchedules,
  vaccineSideEffects,
  vaccineEmergencies,
  vaccineContraindications,
  vaccineTypes,
  vaccineGuidelines
} from '../data/vaccines';
import { toLocalDateKey } from '../../common/utils/dateHelpers';
import { stagger, listItem, sheet, backdrop, tap } from '../../common/ui/motion';

type FundingFilter = 'all' | 'public' | 'private';
type MonthFilter = 'all' | number;

interface VaccineTrackingPageProps {
  vaccineProgress: VaccineProgress;
  onToggleVaccineDose: (vaccineId: string, doseNumber: number, customDate?: string) => void;
}

const FUNDING_FILTERS: { value: FundingFilter; label: string }[] = [
  { value: 'all', label: '全部疫苗' },
  { value: 'public', label: '公費疫苗' },
  { value: 'private', label: '自費疫苗' },
];

/**
 * The four reference sheets were four verbatim copies of the same bottom-sheet
 * markup, each with its own header icon and its own 32px close button.
 */
function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <motion.div {...backdrop} onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />
      <motion.div
        {...sheet}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-ink/10 px-4 py-3 flex items-center justify-between gap-3">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="關閉" className="btn-icon bg-ink/5 hover:bg-ink/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3">{children}</div>
      </motion.div>
    </>
  );
}

export default function VaccineTrackingPage({
  vaccineProgress,
  onToggleVaccineDose
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
        return 'bg-mint-light text-mint-dark';
      case 'moderate':
        return 'bg-butter-light text-butter-dark';
      case 'severe':
        return 'bg-primary-light text-primary-dark';
      default:
        return 'bg-ink/5 text-ink-muted';
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

  return (
    <div className="screen">
      <div className="screen-body">
        <p className="text-sm text-ink-muted mb-4">
          依照衛福部建議時程，記錄寶寶的疫苗接種狀況
        </p>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={() => setShowEmergencies(true)} className="btn-secondary w-full text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>緊急狀況處理</span>
          </button>
          <button onClick={() => setShowContraindications(true)} className="btn-secondary w-full text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>接種注意事項</span>
          </button>
          <button onClick={() => setShowVaccineTypes(true)} className="btn-secondary w-full text-sm">
            <Pill className="w-4 h-4" />
            <span>疫苗種類說明</span>
          </button>
          <button onClick={() => setShowGuidelines(true)} className="btn-secondary w-full text-sm">
            <BookOpen className="w-4 h-4" />
            <span>接種指南</span>
          </button>
        </div>

        {/* Funding Filter */}
        <h3 className="mb-2">篩選疫苗類型</h3>
        <div className="flex gap-2 mb-4">
          {FUNDING_FILTERS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFundingFilter(option.value)}
              className={`chip flex-1 justify-center ${fundingFilter === option.value ? 'chip-on' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Month Filter */}
        <h3 className="mb-2">月齡篩選</h3>
        <div className="row-bleed flex gap-2 pb-2 mb-6">
          <button
            onClick={() => setMonthFilter('all')}
            className={`chip flex-shrink-0 ${monthFilter === 'all' ? 'chip-on' : ''}`}
          >
            全部
          </button>
          {availableMonths.map(month => (
            <button
              key={month}
              onClick={() => setMonthFilter(month)}
              className={`chip flex-shrink-0 ${monthFilter === month ? 'chip-on' : ''}`}
            >
              {month}個月
            </button>
          ))}
        </div>

        {/* Vaccine Timeline - Grouped by Month */}
        <div className="flex items-baseline gap-2 mb-4">
          <h2>接種時程</h2>
          <span className="text-sm text-ink-muted">（共 {filteredVaccines.length} 項）</span>
        </div>

        <AnimatePresence mode="popLayout">
          {/* Re-keying on the filters replays the stagger so a chip tap reads as
              a new list arriving. */}
          <motion.div
            key={`${fundingFilter}-${monthFilter}`}
            className="space-y-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {Object.keys(vaccinesByMonth)
              .sort((a, b) => Number(a) - Number(b))
              .map(monthKey => {
                const month = Number(monthKey);
                const vaccines = vaccinesByMonth[month];

                return (
                  <div key={monthKey}>
                    {/* Month Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="bg-mint-light text-mint-dark px-4 py-1.5 rounded-full whitespace-nowrap">
                        {month} 個月
                      </h3>
                      <span className="text-sm text-ink-muted whitespace-nowrap">({vaccines.length} 項)</span>
                      <div className="flex-1 h-px bg-ink/10" />
                    </div>

                    {/* Vaccines in this month */}
                    <div className="space-y-3">
                      {vaccines.map((vaccine) => {
                        const doseNum = vaccine.currentDose || 1;
                        const isAdministered = isDoseAdministered(vaccine.id, doseNum);
                        const doseDate = getDoseDate(vaccine.id, doseNum);

                        return (
                          <motion.div key={vaccine.id} layout variants={listItem} className="card">
                            {/* Age Badge & Vaccine Header */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className={`
                                w-16 h-16 rounded-full flex-shrink-0 flex flex-col items-center justify-center text-white font-bold
                                ${vaccine.fundingType === 'public'
                                  ? 'bg-mint-dark'
                                  : 'bg-primary-dark'
                                }
                              `}>
                                <div className="text-lg leading-none">{vaccine.ageInMonths || 0}</div>
                                <div className="text-xs font-normal opacity-90 mt-0.5">個月</div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="leading-tight mb-1">{vaccine.name}</h3>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                                  <span>{vaccine.timing}</span>
                                  <span className={`tag ${
                                    vaccine.fundingType === 'public'
                                      ? 'bg-mint-light text-mint-dark'
                                      : 'bg-butter-light text-butter-dark'
                                  }`}>
                                    {vaccine.fundingType === 'public' ? '公費' : '自費'}
                                  </span>
                                </div>

                                {vaccine.notes && (
                                  <p className="text-sm text-ink-muted mt-1">{vaccine.notes}</p>
                                )}
                              </div>
                            </div>

                            {/* Single Dose Checkbox - Only show the current dose for this vaccine entry */}
                            <div className="flex items-center gap-3 p-3 bg-warm-white rounded-xl">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // 已接種的按了是改日期，未接種的按了是登記日期，兩者都開同一個 modal
                                  setEditingDose({
                                    vaccineId: vaccine.id,
                                    doseNumber: doseNum,
                                    currentDate: isAdministered ? doseDate : undefined,
                                  });
                                }}
                                className={`
                                  flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                                  ${isAdministered
                                    ? 'bg-primary-dark border-primary-dark'
                                    : 'border-ink/25 hover:border-primary-dark'
                                  }
                                `}
                                aria-label={`標記為${isAdministered ? '未接種' : '已接種'}`}
                              >
                                {isAdministered && <Check className="w-4 h-4 text-white" />}
                              </button>
                              <div className="flex-1">
                                {isAdministered && doseDate && (
                                  <button
                                    onClick={() => setEditingDose({ vaccineId: vaccine.id, doseNumber: doseNum, currentDate: doseDate })}
                                    className="inline-flex items-center gap-1 text-sm text-mint-dark font-medium hover:underline"
                                  >
                                    <Check className="w-4 h-4" />
                                    {doseDate}
                                  </button>
                                )}
                                {!isAdministered && (
                                  <span className="text-sm text-ink-muted">點擊記錄接種日期</span>
                                )}
                              </div>
                            </div>

                            {/* Description and Protection - Always shown */}
                            <div className="mt-3 pt-3 border-t border-ink/10">
                              <h4 className="mb-2">可能的副作用</h4>
                              <ul className="space-y-1 list-disc pl-5 marker:text-primary">
                                {vaccine.sideEffects.map((effect, idx) => (
                                  <li key={idx} className="text-sm text-ink-muted">{effect}</li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </motion.div>
        </AnimatePresence>

        {/* Side Effects Reference */}
        <h2 className="mt-8 mb-4">副作用處理指南</h2>

        <div className="space-y-3">
          {vaccineSideEffects.map((category) => {
            const IconComponent = getLucideIcon(category.icon);

            return (
              <div key={category.category} className="card">
                <div className="flex items-center gap-2 mb-3">
                  {IconComponent && <IconComponent className="w-5 h-5 text-primary-dark shrink-0" />}
                  <h3>{category.category}</h3>
                </div>

                <div className="space-y-2">
                  {category.reactions.map((reaction, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className={`tag whitespace-nowrap h-fit ${getSeverityColor(reaction.severity)}`}>
                        {reaction.symptom}
                      </span>
                      <p className="text-ink-muted flex-1">{reaction.response}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Sheet */}
      <AnimatePresence>
        {showEmergencies && (
          <Sheet title="緊急狀況處理" onClose={() => setShowEmergencies(false)}>
            {vaccineEmergencies.map((emergency) => {
              const IconComponent = getLucideIcon(emergency.icon);

              return (
                <div key={emergency.id} className="card bg-primary-soft">
                  <div className="flex items-start gap-3">
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 text-primary-dark shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-primary-dark mb-1">{emergency.symptom}</h3>
                      <p className="text-sm text-ink">{emergency.action}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Sheet>
        )}
      </AnimatePresence>

      {/* Contraindications Sheet */}
      <AnimatePresence>
        {showContraindications && (
          <Sheet title="接種禁忌與注意事項" onClose={() => setShowContraindications(false)}>
            {vaccineContraindications.map((section, idx) => (
              <div key={idx} className="card">
                <h3 className="mb-3">{section.title}</h3>
                <ul className="space-y-1.5 list-disc pl-5 marker:text-primary">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm text-ink">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Sheet>
        )}
      </AnimatePresence>

      {/* Vaccine Types Sheet */}
      <AnimatePresence>
        {showVaccineTypes && (
          <Sheet title="疫苗種類說明" onClose={() => setShowVaccineTypes(false)}>
            {vaccineTypes.map((type, idx) => (
              <div key={idx} className="card">
                <h3 className="mb-2">{type.type}</h3>
                <p className="text-sm text-ink-muted mb-3">{type.description}</p>
                <div className="bg-warm-white rounded-xl p-3">
                  <p className="text-sm text-ink-muted mb-2 font-medium">包含疫苗：</p>
                  <div className="flex flex-wrap gap-1.5">
                    {type.examples.map((example, exIdx) => (
                      <span
                        key={exIdx}
                        className="px-2 py-1 bg-white rounded-lg text-sm text-ink border border-ink/10"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                {type.notes && (
                  <p className="text-sm text-butter-dark mt-2 font-medium">{type.notes}</p>
                )}
              </div>
            ))}
          </Sheet>
        )}
      </AnimatePresence>

      {/* Guidelines Sheet */}
      <AnimatePresence>
        {showGuidelines && (
          <Sheet title="疫苗接種指南" onClose={() => setShowGuidelines(false)}>
            {vaccineGuidelines.map((section, idx) => (
              <div key={idx} className="card">
                <h3 className="mb-3">{section.title}</h3>
                <ul className="space-y-1.5 list-disc pl-5 marker:text-mint">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm text-ink">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Sheet>
        )}
      </AnimatePresence>

      {/* Date Editing Sheet */}
      <AnimatePresence>
        {editingDose && (
          <Sheet
            title={editingDose.currentDate ? '修改接種日期' : '記錄接種日期'}
            onClose={() => setEditingDose(null)}
          >
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
              className="space-y-5"
            >
              <div>
                <label htmlFor="vaccine-dose-date" className="block text-sm font-semibold text-ink mb-2">
                  接種日期
                </label>
                <input
                  id="vaccine-dose-date"
                  type="date"
                  name="date"
                  defaultValue={editingDose.currentDate || toLocalDateKey()}
                  max={toLocalDateKey()}
                  required
                  className="w-full px-4 py-3 border border-ink/15 rounded-xl text-ink"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileTap={tap}
                  onClick={() => setEditingDose(null)}
                  className="btn-secondary flex-1"
                >
                  取消
                </motion.button>
                <motion.button type="submit" whileTap={tap} className="btn-primary flex-1">
                  <Check className="w-5 h-5" />
                  <span>確認</span>
                </motion.button>
              </div>
            </form>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}
