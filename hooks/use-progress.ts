'use client';
import { useEffect, useState } from 'react';
import { defaultProgress, loadProgress, saveProgress } from '@/services/storage';
import type { UserProgress } from '@/types';
export function useProgress(){ const [progress,setProgressState]=useState<UserProgress>(defaultProgress); useEffect(()=>setProgressState(loadProgress()),[]); const setProgress=(p:UserProgress)=>{setProgressState(p); saveProgress(p)}; return {progress,setProgress}; }
