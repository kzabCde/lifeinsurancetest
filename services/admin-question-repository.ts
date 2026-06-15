import { questionBank, validateQuestionBankUniqueness } from '@/data/question-bank';
import type { Question } from '@/types';

export type QuestionImportResult = { accepted: Question[]; rejected: { question: Question; reason: string }[] };

export function exportQuestions(): string {
  return JSON.stringify(questionBank, null, 2);
}

export function validateQuestionImport(questions: Question[]): QuestionImportResult {
  const existingIds = new Set(questionBank.map((question) => question.id));
  const seen = new Set<string>();
  const accepted: Question[] = [];
  const rejected: QuestionImportResult['rejected'] = [];

  for (const question of questions) {
    const semanticKey = `${question.category}|${question.topic}|${question.question}|${question.explanation}`;
    if (existingIds.has(question.id) || seen.has(question.id)) rejected.push({ question, reason: 'รหัสข้อสอบซ้ำ' });
    else if (seen.has(semanticKey)) rejected.push({ question, reason: 'วัตถุประสงค์หรือสถานการณ์ซ้ำ' });
    else if (question.choices.length !== 4) rejected.push({ question, reason: 'ตัวเลือกต้องมี 4 ตัวเลือก' });
    else {
      accepted.push(question);
      seen.add(question.id);
      seen.add(semanticKey);
    }
  }

  return { accepted, rejected };
}

export function getQuestionBankHealth() {
  return validateQuestionBankUniqueness();
}
