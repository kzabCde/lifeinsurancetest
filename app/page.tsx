'use client';
import { useState } from 'react'; import { Dashboard } from '@/features/dashboard/Dashboard'; import { ExamRunner } from '@/features/exam/ExamRunner'; import { useProgress } from '@/hooks/use-progress'; import type { ExamSession } from '@/types';
export default function Home(){ const {progress,setProgress}=useProgress(); const [mode,setMode]=useState<ExamSession['mode']|null>(null); return mode ? <ExamRunner mode={mode} progress={progress} setProgress={setProgress} onExit={()=>setMode(null)}/> : <Dashboard progress={progress} onMode={setMode}/>; }
