import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  sleepRequirements,
  sleepKnowledge,
  sleepSafetyRules,
  sleepRitualSteps,
  sleepTrainingMethods,
  trainingTips
} from '../data/sleep';

export default function SleepTrainingPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [ritualChecklist, setRitualChecklist] = useState<Record<string, boolean>>({});

  const toggleRitualStep = (stepId: string) => {
    setRitualChecklist(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-10 right-5 w-48 h-48 bg-[#E8F4F8] rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-40 left-5 w-64 h-64 bg-[#FFE5E5] rounded-full opacity-30 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 bg-[#E8F4F8]/30 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center">
            <Icons.Moon className="w-5 h-5 text-[#7EC8E3]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">寶寶睡眠全攻略</h2>
        </div>
        <p className="text-sm text-gray-600">
          0-2 歲階段需求、安全守則與訓練技巧
        </p>
      </div>

      {/* 睡眠時間參考表 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">睡眠時間參考表</h3>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">年齡階段</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">總睡眠時數</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">白天睡眠</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">晚上睡眠</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-800">睡眠特性</th>
                </tr>
              </thead>
              <tbody>
                {sleepRequirements.map((req, index) => (
                  <tr
                    key={req.id}
                    className={`border-t border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-3 py-3 font-medium text-gray-800 whitespace-nowrap">{req.ageRange}</td>
                    <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{req.totalHours}</td>
                    <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{req.daytimeHours}</td>
                    <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{req.nighttimeHours}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs leading-relaxed">{req.characteristics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 睡眠知識 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-800">睡眠狀況與相關知識</h3>
        </div>
        <div className="space-y-3">
          {sleepKnowledge.map((knowledge) => {
            const IconComponent = Icons[knowledge.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <motion.div
                key={knowledge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gradient-to-br from-blue-50/50 to-purple-50/50"
              >
                <div className="flex items-start gap-3 mb-3">
                  {IconComponent && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-800 flex-1">{knowledge.title}</h4>
                </div>
                <ul className="space-y-2">
                  {knowledge.content.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700">
                      <Icons.Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 睡眠安全 - 重點強調 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Icons.ShieldAlert className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-800">睡眠安全守則</h3>
          <span className="text-xs text-red-600 font-medium">(降低嬰兒猝死症風險)</span>
        </div>

        {/* 警告提示 */}
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <Icons.AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900 mb-1">重要提醒</h4>
              <p className="text-sm text-red-800 leading-relaxed">
                為降低嬰兒猝死症 (SIDS) 風險，應嚴格遵守以下睡眠安全準則。
                這些守則經過醫學研究證實，能有效保護寶寶的睡眠安全。
              </p>
            </div>
          </div>
        </div>

        {/* 安全守則列表 */}
        <div className="grid md:grid-cols-2 gap-3">
          {sleepSafetyRules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                card border-2 transition-all
                ${rule.type === 'do'
                  ? 'bg-green-50/50 border-green-200 hover:border-green-300'
                  : 'bg-red-50/50 border-red-200 hover:border-red-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${rule.type === 'do' ? 'bg-green-500' : 'bg-red-500'}
                `}>
                  {rule.type === 'do' ? (
                    <Icons.Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icons.X className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h5 className={`font-semibold mb-1 ${
                    rule.type === 'do' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {rule.title}
                  </h5>
                  <p className={`text-xs leading-relaxed ${
                    rule.type === 'do' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {rule.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 睡眠儀式 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Icons.ListChecks className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">睡眠儀式清單</h3>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            在睡前 1 小時固定執行 3-4 個動作，形成生理連結，幫助寶寶知道「該睡覺了」。
          </p>
          <div className="space-y-3">
            {sleepRitualSteps.map((step) => {
              const IconComponent = Icons[step.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
              const isChecked = ritualChecklist[step.id] || false;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.order * 0.1 }}
                  onClick={() => toggleRitualStep(step.id)}
                  className={`
                    flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all
                    ${isChecked
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-200'
                    }
                  `}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRitualStep(step.id);
                    }}
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${isChecked
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-300 hover:border-purple-400'
                      }
                    `}
                  >
                    {isChecked && <Icons.Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Step Number */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0
                    ${isChecked ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {step.order}
                  </div>

                  {/* Icon */}
                  {IconComponent && (
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${isChecked
                        ? 'bg-purple-200'
                        : 'bg-gray-100'
                      }
                    `}>
                      <IconComponent className={`w-5 h-5 ${isChecked ? 'text-purple-700' : 'text-gray-600'}`} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h5 className={`font-semibold mb-0.5 ${isChecked ? 'text-purple-900' : 'text-gray-800'}`}>
                      {step.title}
                    </h5>
                    <p className={`text-xs ${isChecked ? 'text-purple-700' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 睡眠訓練技巧 */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Icons.GraduationCap className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">睡眠訓練技巧</h3>
        </div>
        <div className="space-y-3">
          {sleepTrainingMethods.map((method) => {
            const IconComponent = Icons[method.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            const isExpanded = selectedMethod === method.id;

            return (
              <motion.div
                key={method.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card cursor-pointer"
                onClick={() => setSelectedMethod(isExpanded ? null : method.id)}
              >
                <div className="flex items-start gap-3">
                  {IconComponent && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{method.title}</h4>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icons.ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {method.description}
                    </p>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-gray-100"
                        >
                          <h5 className="font-semibold text-gray-800 mb-3 text-sm">實施步驟：</h5>
                          <ol className="space-y-2">
                            {method.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                                  {idx + 1}
                                </span>
                                <span className="flex-1">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 訓練建議 */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <Icons.MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">訓練建議與提醒</h3>
        </div>
        <div className="space-y-3">
          <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Icons.Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-blue-900 mb-1">{trainingTips.timing.title}</h5>
                <p className="text-sm text-blue-800">{trainingTips.timing.content}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <Icons.Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-green-900 mb-1">{trainingTips.consistency.title}</h5>
                <p className="text-sm text-green-800">{trainingTips.consistency.content}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Icons.Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-amber-900 mb-1">{trainingTips.patience.title}</h5>
                <p className="text-sm text-amber-800">{trainingTips.patience.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
