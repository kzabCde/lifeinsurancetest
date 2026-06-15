import type { Config } from 'tailwindcss';
const config: Config = { darkMode:'class', content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./features/**/*.{ts,tsx}'], theme:{extend:{fontFamily:{sans:['var(--font-sans)','system-ui']}, colors:{brand:{50:'#eff6ff',100:'#dbeafe',500:'#2563eb',600:'#1d4ed8',900:'#1e3a8a'}}}}, plugins:[]};
export default config;
