export type Category = 'จรรยาบรรณและศีลธรรม' | 'ความรู้ประกันชีวิต';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuestionType = 'multiple-choice' | 'understanding' | 'scenario' | 'case-analysis' | 'real-world-application' | 'legal-interpretation' | 'situational-ethics';

export interface Question {
  id: string;
  category: Category;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  choices: [string, string, string, string];
  correctAnswer: number;
  answer: number;
  explanation: string;
  reference: string;
  references: string[];
  tags: string[];
  weight: number;
  estimatedTime: number;
  sourceDocumentId: string;
}

export interface AnswerRecord {
  questionId: string;
  selected: number | null;
  correct: boolean;
  timeSpent: number;
  answeredAt: string;
}

export interface ExamSession {
  id: string;
  mode: 'practice' | 'mock' | 'weak' | 'wrong' | 'bookmarked' | 'set';
  setId?: string;
  questionIds: string[];
  answers: AnswerRecord[];
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
}

export interface TopicStats {
  attempts: number;
  correct: number;
}

export interface UserProgress {
  sessions: ExamSession[];
  topicStats: Record<string, TopicStats>;
  categoryStats: Record<string, TopicStats>;
  difficultyStats: Record<Difficulty, TopicStats>;
  wrongQuestionIds: string[];
  bookmarks: string[];
  achievements: string[];
  studySeconds: number;
  streak: number;
  reviewQueue: Record<string, { misses: number; dueAt: number; lastSeenAt?: string }>;
}

export interface Analytics {
  readiness: number;
  passProbability: number;
  averageScore: number;
  ethicsAccuracy: number;
  knowledgeAccuracy: number;
  weakestTopics: string[];
  strongestTopics: string[];
  recommendations: string[];
}
