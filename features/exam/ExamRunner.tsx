'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, CheckCircle2, XCircle, ArrowLeft, ChevronRight, Send, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applyAnswers, generateExam, scoreSession } from '@/services/exam-engine';
import { questionBank } from '@/data/all-questions';
import type { AnswerRecord, ExamSession, UserProgress } from '@/types';

const THAI_LETTERS = ['ก', 'ข', 'ค', 'ง'] as const;

const TOPIC_COLORS: Record<string, { bg: string; text: string }> = {
  จรรยาบรรณ: { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300' },
  หลักการประกันชีวิต: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300' },
  ประมวลกฎหมายแพ่งและพาณิชย์: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
  พระราชบัญญัติประกันชีวิต: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
};

function getTopicColor(topic: string) {
  return TOPIC_COLORS[topic] ?? { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' };
}

export function ExamRunner({
  mode,
  progress,
  setProgress,
  onExit,
}: {
  mode: ExamSession['mode'];
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  onExit: () => void;
}) {
  const questions = useMemo(() => generateExam(mode, progress), [mode]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [bookmarks, setBookmarks] = useState(progress.bookmarks);

  const q = questions[idx];
  const isMock = mode === 'mock';

  if (!q) return <Empty onExit={onExit} />;

  const current = answers.find((a) => a.questionId === q.id);
  const answered = !!current;
  const progressPct = ((idx + 1) / questions.length) * 100;
  const isBookmarked = bookmarks.includes(q.id);
  const topicColor = getTopicColor(q.topic);

  function submit() {
    if (selected === null) return;
    const record: AnswerRecord = {
      questionId: q.id,
      selected,
      correct: selected === q.answer,
      timeSpent: 30,
      answeredAt: new Date().toISOString(),
    };
    setAnswers((a) => [...a.filter((x) => x.questionId !== q.id), record]);
    if (isMock && idx < questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
    }
  }

  function finish() {
    const session: ExamSession = {
      id: crypto.randomUUID(),
      mode,
      questionIds: questions.map((x) => x.id),
      answers,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: answers.length * 30,
    };
    const next = applyAnswers({ ...progress, bookmarks }, session, answers);
    setProgress(next);
    setDone(true);
  }

  function toggleBookmark() {
    const next = isBookmarked ? bookmarks.filter((id) => id !== q.id) : [...bookmarks, q.id];
    setBookmarks(next);
    setProgress({ ...progress, bookmarks: next });
  }

  if (done) {
    const full = questionBank.filter((x) => questions.some((q) => q.id === x.id));
    const result = scoreSession({ id: '', mode, questionIds: [], answers, startedAt: '', durationSeconds: 0 }, full);
    const correct = answers.filter((a) => a.correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    return <Results correct={correct} total={questions.length} pct={pct} result={result} mode={mode} onExit={onExit} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> ออก
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>ข้อ {idx + 1} / {questions.length}</span>
              {isMock && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700 dark:bg-violet-900 dark:text-violet-300">โหมดจำลองสอบ</span>}
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div
                className="h-2 rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <button
            onClick={toggleBookmark}
            className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={isBookmarked ? 'ยกเลิกบุ๊กมาร์ก' : 'บุ๊กมาร์ก'}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* Question card */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Topic badge */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${topicColor.bg} ${topicColor.text}`}>
                {q.topic}
              </span>
              {q.id.startsWith('json_') && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  📄 {q.sourceDocumentId === 'real_exam' ? 'ข้อสอบจริง' : q.sourceDocumentId === 'set_1' ? 'ชุดที่ 1' : q.sourceDocumentId}
                </span>
              )}
            </div>

            {/* Question */}
            <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <p className="text-lg font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{q.question}</p>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {q.choices.map((choice, i) => {
                const isSelected = selected === i || current?.selected === i;
                const showResult = answered && !isMock;
                const isCorrect = i === q.answer;
                const isWrong = isSelected && !isCorrect;

                let style = 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:bg-blue-950/30';
                if (showResult && isCorrect) style = 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40';
                else if (showResult && isWrong) style = 'border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-950/40';
                else if (isSelected && !showResult) style = 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/50';

                return (
                  <button
                    key={i}
                    disabled={answered || (isMock && current !== undefined)}
                    onClick={() => setSelected(i)}
                    className={`group flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all ${style} disabled:cursor-default`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors
                      ${isSelected && !showResult ? 'bg-blue-500 text-white' : ''}
                      ${showResult && isCorrect ? 'bg-emerald-500 text-white' : ''}
                      ${showResult && isWrong ? 'bg-rose-500 text-white' : ''}
                      ${!isSelected && !showResult ? 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400' : ''}
                    `}>
                      {THAI_LETTERS[i]}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{choice}</span>
                    {showResult && isCorrect && <CheckCircle2 className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />}
                    {showResult && isWrong && <XCircle className="ml-auto mt-0.5 h-5 w-5 shrink-0 text-rose-500" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback panel */}
            <AnimatePresence>
              {answered && !isMock && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`mt-4 rounded-2xl p-4 ${current.correct ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-rose-50 dark:bg-rose-950/40'}`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {current.correct ? (
                      <><CheckCircle2 className="h-5 w-5 text-emerald-600" /><span className="text-emerald-800 dark:text-emerald-300">ตอบถูก!</span></>
                    ) : (
                      <><XCircle className="h-5 w-5 text-rose-600" /><span className="text-rose-800 dark:text-rose-300">ตอบผิด</span></>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
                  {q.references?.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">📚 {q.references.join(' · ')}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                disabled={idx === 0}
                onClick={() => { setIdx(idx - 1); setSelected(null); }}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
              </button>

              {!answered ? (
                <Button
                  disabled={selected === null}
                  onClick={submit}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> ส่งคำตอบ
                </Button>
              ) : idx < questions.length - 1 ? (
                <Button onClick={() => { setIdx(idx + 1); setSelected(null); }} className="flex items-center gap-2">
                  ข้อถัดไป <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finish} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Flag className="h-4 w-4" /> สรุปผล
                </Button>
              )}

              {isMock && idx === questions.length - 1 && (
                <Button
                  disabled={answers.length < questions.length}
                  onClick={finish}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Flag className="h-4 w-4" /> ส่งข้อสอบ
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Results({
  correct, total, pct, result, mode, onExit,
}: {
  correct: number;
  total: number;
  pct: number;
  result: { ethics: number; knowledge: number; passed: boolean; total: number };
  mode: ExamSession['mode'];
  onExit: () => void;
}) {
  const passed = pct >= 60;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 text-center">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl
            ${pct >= 60 ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-rose-100 dark:bg-rose-900/40'}`}>
            {pct >= 60 ? '🎉' : '📚'}
          </div>
          <h1 className="text-2xl font-black">ผลการสอบ</h1>
          <p className={`mt-2 text-5xl font-black ${pct >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {correct}<span className="text-2xl text-slate-400">/{total}</span>
          </p>
          <p className={`mt-1 text-lg font-semibold ${pct >= 60 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {pct}% {pct >= 60 ? '— ยอดเยี่ยม!' : '— ยังต้องพัฒนา'}
          </p>

          {mode === 'mock' && (
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">จรรยาบรรณและศีลธรรม</span>
                <span className={`font-bold ${result.ethics >= 14 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {result.ethics}/20 {result.ethics >= 14 ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">ความรู้ประกันชีวิต</span>
                <span className={`font-bold ${result.knowledge >= 24 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {result.knowledge}/40 {result.knowledge >= 24 ? '✓' : '✗'}
                </span>
              </div>
              <div className={`flex justify-between border-t pt-2 font-bold dark:border-slate-700 ${result.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                <span>สรุปผล</span>
                <span>{result.passed ? 'ผ่านเกณฑ์ ✓' : 'ยังไม่ผ่านเกณฑ์ ✗'}</span>
              </div>
            </div>
          )}

          <Button className="mt-6 w-full" onClick={onExit}>
            กลับแดชบอร์ด
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

function Empty({ onExit }: { onExit: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="glass rounded-3xl p-8 text-center">
        <p className="text-4xl">📭</p>
        <h1 className="mt-3 text-xl font-bold">ยังไม่มีข้อสำหรับโหมดนี้</h1>
        <p className="mt-2 text-slate-500">กรุณาทำแบบฝึกหัดหรือบุ๊กมาร์กข้อก่อน</p>
        <Button className="mt-5" onClick={onExit}>กลับ</Button>
      </div>
    </main>
  );
}
