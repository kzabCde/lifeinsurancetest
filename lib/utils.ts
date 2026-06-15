import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const percent = (n:number,d:number) => d ? Math.round((n/d)*100) : 0;
export const shuffle = <T,>(items:T[], seed = Date.now()):T[] => { const arr=[...items]; let s=seed; const rnd=()=>{s=(s*9301+49297)%233280; return s/233280}; for(let i=arr.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; };
