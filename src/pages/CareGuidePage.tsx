import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { generalSafetyItems, monthlyCareGuides, careCategories } from '../data/careGuides';

export default function CareGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredGuides = useMemo(() => {
    if (selectedCategory === "all") {
      return monthlyCareGuides;
    }
    return monthlyCareGuides.filter(guide => guide.category === selectedCategory);
  }, [selectedCategory]);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'physiological':
        return 'bg-blue-100 text-blue-700';
      case 'feeding':
        return 'bg-green-100 text-green-700';
      case 'safety':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = careCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6 relative overflow-hidden">
      {/* Soft decorative circles */}
      <div className="absolute top-10 right-5 w-48 h-48 bg-[#FFE5E5] rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-40 left-5 w-64 h-64 bg-[#E8F5E9] rounded-full opacity-30 blur-3xl" />

      {/* General Safety Section */}
      <div className="relative z-10 bg-[#FFF3E0]/30 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#FFE5E5] flex items-center justify-center">
            <Icons.AlertTriangle className="w-5 h-5 text-[#FF9B9B]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">重點注意事項</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">適用於所有階段的核心照顧原則</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {generalSafetyItems.map((item) => {
            const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-soft"
              >
                <div className="flex items-start gap-3">
                  {IconComponent && (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">篩選照顧類別</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 pl-4 pr-8">
          {careCategories.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category.value
                    ? 'bg-secondary text-white shadow-soft'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monthly Care Guides */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">按月齡照顧重點</h3>
          <span className="text-sm text-gray-500">（共 {filteredGuides.length} 項）</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide.month}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#7EC8E3] flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {guide.month}月
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{guide.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(guide.category)}`}>
                        {getCategoryLabel(guide.category)}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {guide.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700">
                      <Icons.CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
