export type Category = 'จรรยาบรรณ' | 'ความรู้ประกันชีวิต';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuestionType = 'multiple-choice' | 'scenario' | 'case-analysis' | 'situational-ethics';
export interface Question { id:string; category:Category; topic:string; difficulty:Difficulty; type:QuestionType; question:string; choices:[string,string,string,string]; answer:number; explanation:string; references:string[]; }
export interface AnswerRecord { questionId:string; selected:number|null; correct:boolean; timeSpent:number; answeredAt:string; }
export interface ExamSession { id:string; mode:'practice'|'mock'|'weak'|'wrong'|'bookmarked'; questionIds:string[]; answers:AnswerRecord[]; startedAt:string; completedAt?:string; durationSeconds:number; }
export interface TopicStats { attempts:number; correct:number; }
export interface UserProgress { sessions:ExamSession[]; topicStats:Record<string,TopicStats>; categoryStats:Record<string,TopicStats>; difficultyStats:Record<Difficulty,TopicStats>; wrongQuestionIds:string[]; bookmarks:string[]; achievements:string[]; studySeconds:number; streak:number; reviewQueue:Record<string,{misses:number; dueAt:number}>; }
export interface Analytics { readiness:number; passProbability:number; averageScore:number; ethicsAccuracy:number; knowledgeAccuracy:number; weakestTopics:string[]; strongestTopics:string[]; recommendations:string[]; }
