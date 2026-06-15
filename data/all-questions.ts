import { questionBank as generated } from './question-bank';
import { jsonExamQuestions } from './exam-questions';

export const questionBank = [...generated, ...jsonExamQuestions];
