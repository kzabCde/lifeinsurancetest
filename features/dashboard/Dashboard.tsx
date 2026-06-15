'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BarChart3, BookOpen, ChevronDown, Moon, Sun, Target, Trophy, Zap, BookMarked, FileText, CheckCircle
} from 'lucide-react';
import { analytics } from '@/services/exam-engine';
import { studyGuide, jsonExamQuestions } from '@/data/exam-questions';
import type { UserProgress } from '@/types';

type Mode = 'practice' | 'mock' | 'weak' | 'wrong' | 'bookmarked';

const MODES: { key: Mode; title: string; desc: string; icon: React.ElementType; color: string; bg: string }[] = [
  { key: 'practice', title: 'ฝึกทำข้อสอบ', desc: 'เฉลยทันทีพร้อมคำอธิบาย', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { key: 'mock', title: 'จำลองสอบจริง', desc: '50 ข้อ จับเวลา ตัดสินผ่าน/ตก', icon: Target, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
  { key: 'weak', title: 'ทบทวนจุดอ่อน', desc: 'ข้อสอบจากหัวข้อที่คะแนนต่ำ', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  { key: 'wrong', title: 'ข้อที่เคยผิด', desc: 'ฝึกซ้ำแบบ spaced repetition', icon: Trophy, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40' },
  { key: 'bookmarked', title: 'บุ๊กมาร์ก', desc: 'ทบทวนข้อที่บันทึกไว้', icon: BookMarked, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
];

const GUIDE_SECTIONS = [
  { key: 'ethics' as const, title: studyGuide.ethics.title, items: studyGuide.ethics.items, color: 'border-violet-400', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200' },
  { key: 'life_insurance_principles' as const, title: studyGuide.life_insurance_principles.title, items: studyGuide.life_insurance_principles.key_points, color: 'border-blue-400', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { key: 'civil_code' as const, title: studyGuide.civil_code.title, items: studyGuide.civil_code.key_points, color: 'border-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  { key: 'insurance_act' as const, title: studyGuide.insurance_act.title, items: studyGuide.insurance_act.key_points, color: 'border-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
];

export function Dashboard({ progress, onMode }: { progress: UserProgress; onMode: (m: Mode) => void }) {
  const a = analytics(progress);
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 pb-12 sm:p-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-2xl sm:p-10">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-200">ระบบเตรียมสอบ</p>
            <h1 className="mt-1 text-2xl font-black leading-tight sm:text-4xl">
              ใบอนุญาตตัวแทนประกันชีวิต
            </h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100 sm:text-base">
              ข้อสอบจากแหล่งข้อมูลจริง · {jsonExamQuestions.length} ข้อจากชุดข้อสอบจริง · วิเคราะห์จุดอ่อน · Spaced Repetition
            </p>
          </div>
          <ThemeToggle />
        </div>
        {/* Stats */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="ความพร้อม" value={`${a.readiness}%`} sub="Overall readiness" />
          <StatCard label="โอกาสผ่าน" value={`${a.passProbability}%`} sub="Pass probability" />
          <StatCard label="คะแนนเฉลี่ย" value={`${a.averageScore}%`} sub="Average score" />
          <StatCard label="ทำข้อสอบแล้ว" value={`${progress.sessions.length}`} sub="Sessions" />
        </div>
      </section>

      {/* Exam Modes */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-700 dark:text-slate-300">เลือกโหมดฝึกสอบ</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MODES.map((m, i) => (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onMode(m.key)}
              className={`glass flex flex-col rounded-3xl p-5 text-left transition hover:-translate-y-1 hover:shadow-2xl active:scale-95 ${m.bg}`}
            >
              <m.icon className={`mb-3 h-6 w-6 ${m.color}`} />
              <h3 className="font-bold">{m.title}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
              <span className={`mt-3 self-start rounded-xl px-3 py-1 text-xs font-semibold ${m.color} bg-white/60 dark:bg-black/20`}>
                เริ่ม →
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Weak Topics + Achievements */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold">หัวข้อที่ต้องปรับปรุง</h3>
          </div>
          <div className="mt-3 space-y-2">
            {(a.weakestTopics.length ? a.weakestTopics : ['ยังไม่มีข้อมูล']).map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <span className="text-amber-500">⚠</span> {t}
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold">ตราความสำเร็จ</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(progress.achievements.length ? progress.achievements : ['ยังไม่มีตรา — เริ่มทำข้อสอบเพื่อรับตรา']).map((x) => (
              <span key={x} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                🏅 {x}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Study Guide */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">สรุปเนื้อหาที่ออกข้อสอบ</h2>
        </div>
        <div className="space-y-3">
          {GUIDE_SECTIONS.map((section) => (
            <GuideAccordion
              key={section.key}
              section={section}
              open={openGuide === section.key}
              onToggle={() => setOpenGuide(openGuide === section.key ? null : section.key)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
      <p className="text-xs text-blue-200">{sub}</p>
      <p className="mt-0.5 text-2xl font-black">{value}</p>
      <p className="text-xs text-blue-100">{label}</p>
    </div>
  );
}

function GuideAccordion({
  section,
  open,
  onToggle,
}: {
  section: (typeof GUIDE_SECTIONS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border-l-4 bg-white shadow-sm dark:bg-slate-900 ${section.color}`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-sm sm:text-base">{section.title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="space-y-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${section.badge}`}>
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeToggle() {
  return (
    <button
      aria-label="สลับโหมดสี"
      className="flex-shrink-0 rounded-2xl bg-white/15 p-3 transition hover:bg-white/25"
      onClick={() => document.documentElement.classList.toggle('dark')}
    >
      <Sun className="hidden h-5 w-5 dark:block" />
      <Moon className="h-5 w-5 dark:hidden" />
    </button>
  );
}
