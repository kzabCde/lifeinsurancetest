import { questionBank } from '@/data/question-bank';
import { percent, shuffle } from '@/lib/utils';
import type { Question, UserProgress } from '@/types';

export type ReviewPriority = 'ทันที' | 'สูง' | 'ปกติ';

export function getWrongAnswerQueue(progress: UserProgress) {
  return Object.entries(progress.reviewQueue)
    .map(([questionId, review]) => ({ questionId, ...review, priority: (review.misses >= 3 ? 'ทันที' : review.misses === 2 ? 'สูง' : 'ปกติ') as ReviewPriority }))
    .sort((a, b) => b.misses - a.misses || a.dueAt - b.dueAt);
}

export function getWeakTopics(progress: UserProgress, threshold = 70) {
  return Object.entries(progress.topicStats)
    .filter(([, stat]) => stat.attempts >= 2 && percent(stat.correct, stat.attempts) < threshold)
    .map(([topic, stat]) => ({ topic, accuracy: percent(stat.correct, stat.attempts), attempts: stat.attempts }));
}

export function generateAdaptiveReview(progress: UserProgress, count = 20): Question[] {
  const dueIds = getWrongAnswerQueue(progress).filter((item) => item.dueAt <= Date.now() || item.priority === 'ทันที').map((item) => item.questionId);
  const weakTopics = getWeakTopics(progress).map((item) => item.topic);
  const pool = questionBank.filter((question) => dueIds.includes(question.id) || weakTopics.includes(question.topic));
  return shuffle(pool.length ? pool : questionBank).slice(0, count);
}
