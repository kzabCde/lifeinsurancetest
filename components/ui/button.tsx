import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export function Button({className,...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn('focus-ring rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50',className)} {...props}/>}
