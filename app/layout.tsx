import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ติวสอบตัวแทนประกันชีวิต', description: 'แพลตฟอร์มฝึกสอบใบอนุญาตตัวแทนประกันชีวิตแบบปรับตัวได้' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th" suppressHydrationWarning><body>{children}</body></html>; }
