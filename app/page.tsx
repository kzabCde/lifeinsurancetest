'use client';
import { useState } from 'react';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { ExamRunner } from '@/features/exam/ExamRunner';
import { useProgress } from '@/hooks/use-progress';
import type { ExamSession } from '@/types';

type AppView =
  | { type: 'dashboard' }
  | { type: 'exam'; mode: ExamSession['mode']; setId?: string };

export default function Home() {
  const { progress, setProgress } = useProgress();
  const [view, setView] = useState<AppView>({ type: 'dashboard' });

  if (view.type === 'exam') {
    return (
      <ExamRunner
        mode={view.mode}
        setId={view.setId}
        progress={progress}
        setProgress={setProgress}
        onExit={() => setView({ type: 'dashboard' })}
      />
    );
  }

  return (
    <Dashboard
      progress={progress}
      onMode={(mode) => setView({ type: 'exam', mode })}
      onExamSet={(setId) => setView({ type: 'exam', mode: 'set', setId })}
    />
  );
}
