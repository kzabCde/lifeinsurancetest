'use client';
import { motion } from 'framer-motion';
import { examSetsMeta } from '@/data/real-exam-sets';

interface Props {
  onSelect: (setId: string) => void;
  onClose: () => void;
}

export function ExamSetSelector({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">เลือกชุดข้อสอบ</h2>
          <button
            onClick={onClose}
            aria-label="ปิด"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Grid of exam sets */}
        <div className="grid gap-3 sm:grid-cols-2">
          {examSetsMeta.map((set, i) => (
            <motion.button
              key={set.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelect(set.id)}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700"
            >
              <span className="text-2xl flex-shrink-0">{set.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{set.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      set.hasFullQuestions
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {set.hasFullQuestions ? 'มีข้อสอบเต็ม' : 'เฉลยเท่านั้น'}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{set.description}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {set.hasFullQuestions
                    ? `${set.availableQuestions} ข้อ`
                    : `${set.totalQuestions} ข้อ (เฉลยเท่านั้น)`}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </motion.div>
    </div>
  );
}
