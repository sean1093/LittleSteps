import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { getLucideIcon } from '../../common/lucideIcons';
import {
  sleepRequirements,
  sleepKnowledge,
  sleepSafetyRules,
  sleepRitualSteps,
  sleepTrainingMethods,
  trainingTips
} from '../data/sleep';
import { stagger, listItem, collapse } from '../../common/ui/motion';

export default function SleepTrainingPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [ritualChecklist, setRitualChecklist] = useState<Record<string, boolean>>({});

  const toggleRitualStep = (stepId: string) => {
    setRitualChecklist(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const tipCards = [
    { tip: trainingTips.timing, tint: 'bg-secondary-soft', ink: 'text-secondary-dark' },
    { tip: trainingTips.consistency, tint: 'bg-mint-soft', ink: 'text-mint-dark' },
    { tip: trainingTips.patience, tint: 'bg-butter-soft', ink: 'text-butter-dark' },
  ];

  return (
    <div className="screen">
      <div className="screen-body">
        <p className="text-sm text-ink-muted mb-5">
          0-3 歲階段需求、安全守則與訓練技巧
        </p>

        {/* 睡眠時間參考表 */}
        <h2 className="mb-3">睡眠時間參考表</h2>
        <div className="card overflow-hidden p-0 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary-light/60">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-ink whitespace-nowrap">年齡階段</th>
                  <th className="px-3 py-3 text-left font-semibold text-ink whitespace-nowrap">總睡眠時數</th>
                  <th className="px-3 py-3 text-left font-semibold text-ink whitespace-nowrap">白天睡眠</th>
                  <th className="px-3 py-3 text-left font-semibold text-ink whitespace-nowrap">晚上睡眠</th>
                  <th className="px-3 py-3 text-left font-semibold text-ink">睡眠特性</th>
                </tr>
              </thead>
              <tbody>
                {sleepRequirements.map((req, index) => (
                  <tr
                    key={req.id}
                    className={`border-t border-ink/10 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-warm-white'
                    }`}
                  >
                    <td className="px-3 py-3 font-medium text-ink whitespace-nowrap">{req.ageRange}</td>
                    <td className="px-3 py-3 text-ink whitespace-nowrap">{req.totalHours}</td>
                    <td className="px-3 py-3 text-ink whitespace-nowrap">{req.daytimeHours}</td>
                    <td className="px-3 py-3 text-ink whitespace-nowrap">{req.nighttimeHours}</td>
                    <td className="px-3 py-3 text-ink-muted leading-relaxed">{req.characteristics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 睡眠知識 */}
        <h2 className="mb-3">睡眠狀況與相關知識</h2>
        <motion.div
          className="space-y-3 mb-8"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {sleepKnowledge.map((knowledge) => {
            const IconComponent = getLucideIcon(knowledge.icon);
            return (
              <motion.div
                key={knowledge.id}
                variants={listItem}
                className="card bg-secondary-soft"
              >
                <div className="flex items-center gap-2 mb-3">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-secondary-dark shrink-0" />
                  )}
                  <h3 className="flex-1">{knowledge.title}</h3>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 marker:text-secondary">
                  {knowledge.content.map((item, idx) => (
                    <li key={idx} className="text-sm text-ink">{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 睡眠安全 - 重點強調 */}
        <div className="flex items-baseline gap-2 mb-3">
          <h2>睡眠安全守則</h2>
          <span className="text-sm text-primary-dark font-medium">(降低嬰兒猝死症風險)</span>
        </div>

        <div className="card bg-primary-light mb-4">
          <h3 className="text-primary-dark mb-1">重要提醒</h3>
          <p className="text-sm text-ink leading-relaxed">
            為降低嬰兒猝死症 (SIDS) 風險，應嚴格遵守以下睡眠安全準則。
            這些守則經過醫學研究證實，能有效保護寶寶的睡眠安全。
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-3 mb-8"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {sleepSafetyRules.map((rule) => (
            <motion.div
              key={rule.id}
              variants={listItem}
              className={`card ${rule.type === 'do' ? 'bg-mint-soft' : 'bg-primary-soft'}`}
            >
              <div className="flex items-start gap-3">
                {/* 該做／不該做只靠這個符號區分，所以圖示留著 */}
                {rule.type === 'do' ? (
                  <Check className="w-5 h-5 text-mint-dark shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-primary-dark shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`mb-1 ${rule.type === 'do' ? 'text-mint-dark' : 'text-primary-dark'}`}>
                    {rule.title}
                  </h3>
                  <p className="text-sm text-ink leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 睡眠儀式 */}
        <h2 className="mb-3">睡眠儀式清單</h2>
        <div className="panel bg-secondary-soft mb-8">
          <p className="text-sm text-ink mb-4 leading-relaxed">
            在睡前 1 小時固定執行 3-4 個動作，形成生理連結，幫助寶寶知道「該睡覺了」。
          </p>
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {sleepRitualSteps.map((step) => {
              const isChecked = ritualChecklist[step.id] || false;

              return (
                <motion.div
                  key={step.id}
                  variants={listItem}
                  onClick={() => toggleRitualStep(step.id)}
                  className={`card-tap flex items-center gap-4 ${isChecked ? 'bg-secondary-light' : ''}`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRitualStep(step.id);
                    }}
                    aria-pressed={isChecked}
                    aria-label={`${step.title}${isChecked ? '：已完成' : '：標記為完成'}`}
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${isChecked
                        ? 'bg-secondary-dark border-secondary-dark'
                        : 'border-ink/25'
                      }
                    `}
                  >
                    {isChecked && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Step Number */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0
                    ${isChecked ? 'bg-secondary-dark text-white' : 'bg-ink/5 text-ink-muted'}
                  `}>
                    {step.order}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`mb-0.5 ${isChecked ? 'text-secondary-dark' : 'text-ink'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${isChecked ? 'text-secondary-dark' : 'text-ink-muted'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* 睡眠訓練技巧 */}
        <h2 className="mb-3">睡眠訓練技巧</h2>
        <motion.div
          className="space-y-3 mb-8"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {sleepTrainingMethods.map((method) => {
            const isExpanded = selectedMethod === method.id;

            return (
              <motion.div
                key={method.id}
                layout
                variants={listItem}
                className="card-tap"
                onClick={() => setSelectedMethod(isExpanded ? null : method.id)}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3>{method.title}</h3>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-ink-faint flex-shrink-0" />
                  </motion.div>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {method.description}
                </p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div {...collapse} className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-ink/10">
                        <h4 className="mb-3">實施步驟：</h4>
                        <ol className="space-y-2">
                          {method.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-ink">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary-light text-secondary-dark flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </span>
                              <span className="flex-1">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 訓練建議 */}
        <h2 className="mb-3">訓練建議與提醒</h2>
        <motion.div
          className="space-y-3"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {tipCards.map(({ tip, tint, ink }) => (
            <motion.div key={tip.title} variants={listItem} className={`card ${tint}`}>
              <h3 className={`mb-1 ${ink}`}>{tip.title}</h3>
              <p className="text-sm text-ink">{tip.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
