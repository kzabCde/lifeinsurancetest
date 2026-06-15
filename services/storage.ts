import type { UserProgress } from '@/types';
const KEY='life-insurance-progress-v1';
export const defaultProgress:UserProgress={sessions:[],topicStats:{},categoryStats:{},difficultyStats:{easy:{attempts:0,correct:0},medium:{attempts:0,correct:0},hard:{attempts:0,correct:0},expert:{attempts:0,correct:0}},wrongQuestionIds:[],bookmarks:[],achievements:[],studySeconds:0,streak:0,reviewQueue:{}};
export function loadProgress():UserProgress{ if(typeof window==='undefined') return defaultProgress; const raw=localStorage.getItem(KEY); return raw?{...defaultProgress,...JSON.parse(raw)}:defaultProgress; }
export function saveProgress(p:UserProgress){ if(typeof window!=='undefined') localStorage.setItem(KEY,JSON.stringify(p)); }
