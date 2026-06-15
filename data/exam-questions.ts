import type { Category, Question } from '@/types';
import examData from '../life_insurance_exam.json';

const LETTER_TO_INDEX: Record<string, number> = { ก: 0, ข: 1, ค: 2, ง: 3 };

function topicToCategory(topic: string): Category {
  return topic === 'จรรยาบรรณ' ? 'จรรยาบรรณและศีลธรรม' : 'ความรู้ประกันชีวิต';
}

type RawQuestion = {
  number: number;
  question: string;
  choices: Record<string, string>;
  answer: string;
  topic: string;
};

type RawSet = {
  id: string;
  title: string;
  total_questions: number;
  questions?: RawQuestion[];
};

function parseQuestion(q: RawQuestion, setId: string, setTitle: string): Question | null {
  const keys = ['ก', 'ข', 'ค', 'ง'] as const;
  if (!q.choices || !keys.every((k) => q.choices[k])) return null;
  const choices: [string, string, string, string] = [q.choices['ก'], q.choices['ข'], q.choices['ค'], q.choices['ง']];
  const correctAnswer = LETTER_TO_INDEX[q.answer] ?? 0;
  const category = topicToCategory(q.topic ?? '');
  return {
    id: `json_${setId}_${q.number}`,
    category,
    topic: q.topic ?? 'ทั่วไป',
    subtopic: q.topic ?? '',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: q.question,
    choices,
    correctAnswer,
    answer: correctAnswer,
    explanation: `คำตอบที่ถูกต้องคือ "${q.answer}": ${choices[correctAnswer]}`,
    reference: setTitle,
    references: [setTitle],
    tags: [q.topic ?? ''],
    weight: 1,
    estimatedTime: 60,
    sourceDocumentId: setId,
  };
}

export interface ExamSetInfo {
  id: string;
  title: string;
  totalQuestions: number;
  questionCount: number;
}

const rawSets = examData.exam_sets as RawSet[];

export const examSets: ExamSetInfo[] = rawSets.map((set) => ({
  id: set.id,
  title: set.title,
  totalQuestions: set.total_questions,
  questionCount: (set.questions ?? []).length,
}));

export const jsonExamQuestions: Question[] = rawSets
  .flatMap((set) => (set.questions ?? []).map((q) => parseQuestion(q, set.id, set.title)))
  .filter((q): q is Question => q !== null);

export const studyGuide = examData.summary_content as {
  ethics: { title: string; items: string[] };
  life_insurance_principles: { title: string; key_points: string[] };
  civil_code: { title: string; key_points: string[] };
  insurance_act: { title: string; key_points: string[] };
};
