import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flower2, Sparkles, Book, Bell, Calendar, Plus } from 'lucide-react';
import { pregnancyGuides } from '../../data/pregnancyGuides';
import { PrenatalCheckup } from '../../types';

function LittleBloomPage() {
  const [lastPeriodDate] = useState('2026-03-27');
  const [checkups] = useState<PrenatalCheckup[]>([
    { id: '1', childId: 'c1', date: '2026-04-15', clinicName: '幸福婦產科', notes: '初步檢查', completed: false }
  ]);

  const currentWeek = useMemo(() => {
    const start = new Date(lastPeriodDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  }, [lastPeriodDate]);

  const currentGuide = useMemo(() => {
    return pregnancyGuides.find(g => g.week === currentWeek) || pregnancyGuides[0];
  }, [currentWeek]);

  const nextCheckup = useMemo(() => {
    return checkups.find(c => !c.completed && new Date(c.date) > new Date());
  }, [checkups]);

  return (
    <div className="min-h-screen bg-bloom-cream pb-20">
      <header className="bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve shadow-soft">
        <div className="px-4 py-6 text-center text-white">
          <Flower2 className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">LittleBloom</h1>
          <p className="text-white/80">目前孕期：第 {currentWeek} 週</p>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Weekly Guide Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-xl font-bold text-bloom-stone mb-2">{currentGuide.title}</h2>
          <p className="text-bloom-stone/70 mb-4">{currentGuide.summary}</p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-bloom-dusty-rose flex items-center">
              <Sparkles className="w-4 h-4 mr-2" /> 本週提醒
            </h4>
            <ul className="list-disc list-inside text-sm text-bloom-stone/80">
              {currentGuide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </motion.div>

        {/* Prenatal Checkup Section */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-bold text-bloom-stone mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-bloom-sage" /> 下次產檢
          </h3>
          {nextCheckup ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{nextCheckup.clinicName}</p>
                <p className="text-sm text-bloom-stone/70">{nextCheckup.date}</p>
              </div>
              <span className="bg-bloom-sage/10 text-bloom-sage px-3 py-1 rounded-full text-sm font-medium">
                進行中
              </span>
            </div>
          ) : (
            <button className="flex items-center text-bloom-dusty-rose font-medium">
              <Plus className="w-4 h-4 mr-1" /> 新增產檢預約
            </button>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-soft flex flex-col items-center justify-center text-center">
            <Bell className="w-8 h-8 text-bloom-sage mb-2" />
            <span className="font-semibold">產檢時程</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-soft flex flex-col items-center justify-center text-center">
            <Book className="w-8 h-8 text-bloom-terracotta mb-2" />
            <span className="font-semibold">完整知識庫</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LittleBloomPage;
