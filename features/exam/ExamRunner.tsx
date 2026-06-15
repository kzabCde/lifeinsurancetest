'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, CheckCircle2, Flag, RotateCcw, XCircle } from 'lucide-react';
import { applyAnswers, generateExam, scoreSession } from '@/services/exam-engine';
import { getQuestionsForSet, examSetsMeta } from '@/data/real-exam-sets';
import { questionBank } from '@/data/question-bank';
import type { AnswerRecord, ExamSession, Question, UserProgress } from '@/types';

const CHOICE_LABELS = ['ก', 'ข', 'ค', 'ง'];

export function ExamRunner({
  mode,
  setId,
  progress,
  setProgress,
  onExit,
}: {
  mode: ExamSession['mode'];
  setId?: string;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  onExit: () => void;
}) {
  const questions = useMemo(() => {
    if (mode === 'set' && setId) {
      const setQuestions = getQuestionsForSet(setId);
      if (setQuestions.length > 0) return setQuestions;
      return generateExam('practice', progress);
    }
    return generateExam(mode, progress);
  }, [mode, setId]);

  const setMeta = setId ? examSetsMeta.find((s) => s.id === setId) : null;
  const isMock = mode === 'mock';

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [bookmarks, setBookmarks] = useState(progress.bookmarks);
  const [startedAt] = useState(new Date().toISOString());

  const q = questions[idx];
  const currentAnswer = answers.find((a) => a.questionId === q?.id);
  const answered = !!currentAnswer;
  const progress_pct = ((idx + 1) / questions.length) * 100;

  function toggleBookmark() {
    if (!q) return;
    const next = bookmarks.includes(q.id)
      ? bookmarks.filter((id) => id !== q.id)
      : [...bookmarks, q.id];
    setBookmarks(next);
    setProgress({ ...progress, bookmarks: next });
  }

  function submit() {
    if (selected === null || !q) return;
    const record: AnswerRecord = {
      questionId: q.id,
      selected,
      correct: selected === q.answer,
      timeSpent: 60,
      answeredAt: new Date().toISOString(),
    };
    setAnswers((prev) => [...prev.filter((a) => a.questionId !== q.id), record]);
    if (isMock && idx < questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
    }
  }

  function finish() {
    const session: ExamSession = {
      id: crypto.randomUUID(),
      mode,
      setId,
      questionIds: questions.map((x) => x.id),
      answers,
      startedAt,
      completedAt: new Date().toISOString(),
      durationSeconds: answers.length * 60,
    };
    const next = applyAnswers({ ...progress, bookmarks }, session, answers);
    setProgress(next);
    setDone(true);
  }

  function goNext() {
    setIdx(idx + 1);
    setSelected(null);
  }

  function goPrev() {
    setIdx(idx - 1);
    setSelected(null);
  }

  if (!q) {
    return (
      <EmptyState
        message="ยังไม่มีข้อสำหรับโหมดนี้"
        hint="กรุณาทำแบบฝึกหัดหรือบุ๊กมาร์กข้อก่อน"
        onExit={onExit}
      />
    );
  }

  if (done) {
    const full = questions.filter((x) =>
      questions.some((q) => q.id === x.id)
    );
    const result = scoreSession(
      { id: '', mode, questionIds: [], answers, startedAt, durationSeconds: 0 },
      full
    );
    const correctCount = answers.filter((a) => a.correct).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= 70;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-center">
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
              passed ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-rose-100 dark:bg-rose-900/40'
            }`}>
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {passed ? 'ยอดเยี่ยม!' : 'ยังไม่ผ่านเกณฑ์'}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {setMeta ? setMeta.title : mode === 'mock' ? 'จำลองสอบจริง' : 'ฝึกทำ'}
            </p>

            {/* Big score */}
            <div className="my-6">
              <span className={`text-7xl font-black ${passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                {correctCount}
              </span>
              <span className="text-3xl font-bold text-slate-400">/{questions.length}</span>
              <p className="mt-1 text-lg font-semibold text-slate-600 dark:text-slate-300">{pct}%</p>
            </div>

            {mode === 'mock' && (
              <div className="mb-6 flex gap-3 justify-center text-sm">
                <div className="rounded-xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
                  <p className="text-slate-500 dark:text-slate-400">จรรยาบรรณ</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{result.ethics}/20</p>
                </div>
                <div className="rounded-xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
                  <p className="text-slate-500 dark:text-slate-400">ความรู้</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{result.knowledge}/40</p>
                </div>
                <div className={`rounded-xl px-4 py-2 ${result.passed ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-rose-100 dark:bg-rose-900/40'}`}>
                  <p className={result.passed ? 'text-emerald-600' : 'text-rose-500'}>ผล</p>
                  <p className={`font-bold ${result.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'}`}>
                    {result.passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onExit}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                กลับหน้าหลัก
              </button>
              <button
                onClick={() => {
                  setIdx(0);
                  setAnswers([]);
                  setSelected(null);
                  setDone(false);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" /> ทำอีกครั้ง
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button
            onClick={onExit}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>
                {setMeta ? setMeta.title : isMock ? 'จำลองสอบจริง' : 'ฝึกทำข้อสอบ'}
              </span>
              <span>{idx + 1} / {questions.length}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div
                className="h-1.5 rounded-full bg-blue-500"
                animate={{ width: `${progress_pct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <button
            onClick={toggleBookmark}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              bookmarks.includes(q.id)
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${bookmarks.includes(q.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* Topic badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {q.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {q.topic}
              </span>
            </div>

            {/* Question text */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                คำถามข้อที่ {idx + 1}
              </p>
              <p className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100">
                {q.question}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {q.choices.map((choice, i) => {
                const isSelected = selected === i || currentAnswer?.selected === i;
                const isCorrect = answered && i === q.answer;
                const isWrong = answered && currentAnswer?.selected === i && !currentAnswer?.correct;

                let styleClass =
                  'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-900/20';
                if (!answered && isSelected) {
                  styleClass = 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30';
                } else if (answered && isCorrect) {
                  styleClass = 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30';
                } else if (answered && isWrong) {
                  styleClass = 'border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/30';
                } else if (answered) {
                  styleClass = 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800';
                }

                return (
                  <button
                    key={i}
                    disabled={answered || (isMock && !!currentAnswer)}
                    onClick={() => setSelected(i)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${styleClass}`}
                  >
                    <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                      !answered && isSelected
                        ? 'bg-blue-600 text-white'
                        : answered && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : answered && isWrong
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {answered && isCorrect ? <CheckCircle2 className="h-4 w-4" /> :
                       answered && isWrong ? <XCircle className="h-4 w-4" /> :
                       CHOICE_LABELS[i]}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {choice}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {answered && !isMock && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-5 rounded-2xl p-4 ${
                    currentAnswer.correct
                      ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800'
                      : 'bg-rose-50 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {currentAnswer.correct
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      : <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                    <span className={`font-bold ${currentAnswer.correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                      {currentAnswer.correct ? 'ตอบถูกต้อง!' : 'ตอบผิด'}
                    </span>
                  </div>
                  {q.explanation && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
                  )}
                  {q.references.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      อ้างอิง: {q.references.join(', ')}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-3">
              <button
                disabled={idx === 0}
                onClick={goPrev}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <div className="flex-1" />
              {!answered ? (
                <button
                  disabled={selected === null}
                  onClick={submit}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
                >
                  ส่งคำตอบ
                </button>
              ) : idx < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  ต่อไป <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Flag className="h-4 w-4" /> สรุปผล
                </button>
              )}
              {isMock && idx === questions.length - 1 && (
                <button
                  disabled={answers.length < questions.length}
                  onClick={finish}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  <Flag className="h-4 w-4" /> ส่งข้อสอบ
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyState({
  message,
  hint,
  onExit,
}: {
  message: string;
  hint: string;
  onExit: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <BookOpen className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">{message}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{hint}</p>
        <button
          onClick={onExit}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

