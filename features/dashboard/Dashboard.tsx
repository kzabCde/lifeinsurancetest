'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BarChart2, BookOpen, Bookmark,
  ChevronRight, FileText, Layers, Moon,
  RotateCcw, Sun, Target, Trophy, TrendingUp, Zap,
} from 'lucide-react';
import { analytics } from '@/services/exam-engine';
import { examSetsMeta } from '@/data/real-exam-sets';
import type { UserProgress } from '@/types';

type Tab = 'practice' | 'sets' | 'stats';

const PRACTICE_MODES = [
  {
    key: 'practice' as const,
    title: 'ฝึกทำข้อสอบ',
    desc: 'เฉลยทันทีพร้อมคำอธิบายละเอียด',
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-600',
    badge: '20 ข้อ',
  },
  {
    key: 'mock' as const,
    title: 'จำลองสอบจริง',
    desc: '60 ข้อ จับเวลา วัดผลตามเกณฑ์จริง',
    icon: Target,
    gradient: 'from-violet-500 to-purple-600',
    badge: '60 ข้อ',
  },
  {
    key: 'weak' as const,
    title: 'ทบทวนจุดอ่อน',
    desc: 'สร้างชุดคำถามจากหัวข้อที่คะแนนต่ำ',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-600',
    badge: 'AI เลือกให้',
  },
  {
    key: 'wrong' as const,
    title: 'ข้อที่เคยผิด',
    desc: 'Spaced repetition ดึงข้อผิดกลับมาฝึก',
    icon: RotateCcw,
    gradient: 'from-rose-500 to-pink-600',
    badge: 'Spaced Rep',
  },
  {
    key: 'bookmarked' as const,
    title: 'บุ๊กมาร์ก',
    desc: 'กลับมาทบทวนข้อที่บันทึกไว้',
    icon: Bookmark,
    gradient: 'from-teal-500 to-cyan-600',
    badge: 'บุ๊กมาร์ก',
  },
] as const;

export function Dashboard({
  progress,
  onMode,
  onExamSet,
}: {
  progress: UserProgress;
  onMode: (m: 'practice' | 'mock' | 'weak' | 'wrong' | 'bookmarked') => void;
  onExamSet: (setId: string) => void;
}) {
  const [tab, setTab] = useState<Tab>('practice');
  const a = analytics(progress);
  const totalSessions = progress.sessions.length;
  const setSessionCounts = examSetsMeta.reduce<Record<string, number>>((acc, s) => {
    acc[s.id] = progress.sessions.filter((sess) => sess.setId === s.id).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">ติวสอบตัวแทนประกันชีวิต</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Hero Stats */}
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-2xl sm:p-8"
        >
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-200">ระบบเตรียมสอบใบอนุญาตตัวแทนประกันชีวิต</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">แพลตฟอร์มติวสอบ</h1>
            <p className="mt-1 text-sm text-blue-100">
              คลังข้อสอบกว่า 700 ข้อ • {examSetsMeta.length} ชุดข้อสอบ • วิเคราะห์จุดอ่อนอัตโนมัติ
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="ความพร้อม" value={`${a.readiness}%`} sub="โดยรวม" />
            <StatCard label="โอกาสผ่าน" value={`${a.passProbability}%`} sub="ประมาณการ" />
            <StatCard label="คะแนนเฉลี่ย" value={`${a.averageScore}%`} sub="ทุกรอบ" />
            <StatCard label="รอบที่ทำแล้ว" value={`${totalSessions}`} sub="ครั้ง" />
          </div>
        </motion.section>

        {/* Tab Nav */}
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
          {([
            ['practice', BookOpen, 'ฝึกทำ'],
            ['sets', Layers, 'ชุดข้อสอบ'],
            ['stats', BarChart2, 'สถิติ'],
          ] as const).map(([t, Icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-white text-blue-700 shadow dark:bg-slate-800 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">โหมดการฝึกทำ</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PRACTICE_MODES.map((mode, i) => {
                  const Icon = mode.icon;
                  return (
                    <motion.button
                      key={mode.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => onMode(mode.key)}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${mode.gradient} text-white shadow`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{mode.title}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {mode.badge}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{mode.desc}</p>
                      <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Weak Topics */}
              {a.weakestTopics.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                    <Zap className="h-4 w-4" /> หัวข้อที่ควรทบทวน
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {a.weakestTopics.map((t) => (
                      <span key={t} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                        ⚠ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'sets' && (
            <motion.div
              key="sets"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">ชุดข้อสอบทั้งหมด</h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {examSetsMeta.length} ชุด
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {examSetsMeta.map((set, i) => {
                  const sessions = setSessionCounts[set.id] ?? 0;
                  return (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`group flex flex-col rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${set.bgClass}`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <span className="text-2xl">{set.icon}</span>
                        {set.hasFullQuestions ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                            มีข้อสอบ
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            เฉลยเท่านั้น
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold ${set.colorClass}`}>{set.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{set.description}</p>
                      <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        {set.hasFullQuestions
                          ? `${set.availableQuestions}/${set.totalQuestions} ข้อ`
                          : `${set.totalQuestions} ข้อ (เฉลย)`}
                        {sessions > 0 && (
                          <span className="ml-2 font-medium text-blue-500">• ทำแล้ว {sessions} รอบ</span>
                        )}
                      </div>
                      <button
                        onClick={() => onExamSet(set.id)}
                        className={`mt-4 w-full rounded-xl py-2 text-sm font-semibold transition-all ${
                          set.hasFullQuestions
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {set.hasFullQuestions ? 'เริ่มทำ →' : 'ทำข้อสอบจำลอง →'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">สถิติของคุณ</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-4 font-semibold text-slate-700 dark:text-slate-300">ความแม่นยำตามหมวด</h3>
                  <div className="space-y-3">
                    <ProgressRow
                      label="จรรยาบรรณและศีลธรรม"
                      value={a.ethicsAccuracy}
                      color="bg-blue-500"
                    />
                    <ProgressRow
                      label="ความรู้ประกันชีวิต"
                      value={a.knowledgeAccuracy}
                      color="bg-violet-500"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                    <Trophy className="h-4 w-4 text-amber-500" /> ตราความสำเร็จ
                  </h3>
                  {progress.achievements.length === 0 ? (
                    <p className="text-sm text-slate-400">ยังไม่มีตรา เริ่มทำข้อสอบเพื่อรับตราแรก</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {progress.achievements.map((x) => (
                        <span
                          key={x}
                          className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                        >
                          🏅 {x}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                    <Award className="h-4 w-4 text-blue-500" /> คำแนะนำส่วนตัว
                  </h3>
                  {a.recommendations.length === 0 ? (
                    <p className="text-sm text-slate-400">เริ่ม Mock Exam เพื่อประเมินระดับปัจจุบัน</p>
                  ) : (
                    <ul className="space-y-2">
                      {a.recommendations.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <span className="mt-0.5 text-blue-500">→</span> {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
      <p className="text-xs font-medium text-blue-200">{label}</p>
      <p className="mt-0.5 text-2xl font-black">{value}</p>
      <p className="text-xs text-blue-300">{sub}</p>
    </div>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function ThemeToggle() {
  return (
    <button
      aria-label="สลับโหมดสี"
      onClick={() => document.documentElement.classList.toggle('dark')}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  );
}
