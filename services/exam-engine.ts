import { licensingExamBlueprint } from '@/data/exam-blueprint';
import { questionBank } from '@/data/question-bank';
import { percent, shuffle } from '@/lib/utils';
import type { Analytics, AnswerRecord, ExamSession, Question, UserProgress } from '@/types';

const difficultyDistribution = licensingExamBlueprint.difficultyDistribution;

function takeBalanced(pool: Question[], count: number, seed: number) {
  const out: Question[] = [];
  for (const difficulty of Object.keys(difficultyDistribution) as Question['difficulty'][]) {
    const target = Math.round(count * difficultyDistribution[difficulty]);
    const candidates = shuffle(pool.filter((question) => question.difficulty === difficulty), seed + target);
    for (const candidate of candidates) {
      if (out.filter((question) => question.difficulty === difficulty).length >= target) break;
      if (!out.some((question) => question.id === candidate.id || question.question === candidate.question)) out.push(candidate);
    }
  }
  return shuffle([...out, ...shuffle(pool.filter((question) => !out.some((selected) => selected.id === question.id)), seed).slice(0, Math.max(0, count - out.length))], seed).slice(0, count);
}

function takeByTopicDistribution(category: Question['category'], topicDistribution: Record<string, number>, seed: number) {
  const selected: Question[] = [];
  for (const [topic, count] of Object.entries(topicDistribution)) {
    const topicPool = questionBank.filter((question) => question.category === category && (question.topic === topic || question.subtopic === topic));
    selected.push(...takeBalanced(topicPool.length ? topicPool : questionBank.filter((question) => question.category === category), count, seed + selected.length));
  }
  return selected;
}

export function generateExam(mode: ExamSession['mode'], progress: UserProgress): Question[] {
  const seed = Date.now();
  let pool = questionBank;
  if (mode === 'mock') return licensingExamBlueprint.parts.flatMap((part, index) => takeByTopicDistribution(part.category, part.topicDistribution, seed + index));
  if (mode === 'wrong') pool = questionBank.filter((question) => progress.wrongQuestionIds.includes(question.id));
  if (mode === 'bookmarked') pool = questionBank.filter((question) => progress.bookmarks.includes(question.id));
  if (mode === 'weak') {
    const weak = Object.entries(progress.topicStats).filter(([, stat]) => percent(stat.correct, stat.attempts) < 70).map(([topic]) => topic);
    pool = weak.length ? questionBank.filter((question) => weak.includes(question.topic) || weak.includes(question.subtopic)) : questionBank;
  }
  return takeBalanced(pool.length ? pool : questionBank, Math.min(20, pool.length || 20), seed);
}

export function scoreSession(session: ExamSession, questions: Question[]) {
  const ethics = session.answers.filter((answer) => questions.find((question) => question.id === answer.questionId)?.category === 'จรรยาบรรณและศีลธรรม' && answer.correct).length;
  const knowledge = session.answers.filter((answer) => questions.find((question) => question.id === answer.questionId)?.category === 'ความรู้ประกันชีวิต' && answer.correct).length;
  return { ethics, knowledge, passed: ethics >= 14 && knowledge >= 24, total: session.answers.filter((answer) => answer.correct).length };
}

export function applyAnswers(progress: UserProgress, session: ExamSession, answers: AnswerRecord[]): UserProgress {
  const next = structuredClone(progress);
  session.answers = answers;
  next.sessions.unshift(session);
  for (const answer of answers) {
    const question = questionBank.find((item) => item.id === answer.questionId);
    if (!question) continue;
    for (const key of [question.topic, question.category, question.difficulty]) {
      const bucket = key === question.difficulty ? next.difficultyStats[question.difficulty] : key === question.category ? (next.categoryStats[key] ??= { attempts: 0, correct: 0 }) : (next.topicStats[key] ??= { attempts: 0, correct: 0 });
      bucket.attempts++;
      if (answer.correct) bucket.correct++;
    }
    if (!answer.correct) {
      if (!next.wrongQuestionIds.includes(question.id)) next.wrongQuestionIds.push(question.id);
      const old = next.reviewQueue[question.id]?.misses ?? 0;
      const repeatAfterQuestions = old >= 2 ? 0 : old === 1 ? 5 : 10;
      next.reviewQueue[question.id] = { misses: old + 1, dueAt: Date.now() + repeatAfterQuestions * 60_000, lastSeenAt: answer.answeredAt };
      next.streak = 0;
    } else next.streak++;
  }
  const correct = answers.filter((answer) => answer.correct).length;
  if (next.sessions.length === 1) next.achievements.push('ทำข้อสอบครั้งแรก');
  if (next.streak >= 10) next.achievements.push('ตอบถูกติดกัน 10 ข้อ');
  if (correct / answers.length >= 0.9) next.achievements.push('คะแนนเกิน 90%');
  return next;
}

export function analytics(progress: UserProgress): Analytics {
  const accuracy = (stat?: { attempts: number; correct: number }) => percent(stat?.correct ?? 0, stat?.attempts ?? 0);
  const topicAccuracy = Object.entries(progress.topicStats).map(([topic, stat]) => [topic, accuracy(stat)] as const).sort((a, b) => a[1] - b[1]);
  const averageScore = progress.sessions.length ? Math.round(progress.sessions.reduce((sum, session) => sum + percent(session.answers.filter((answer) => answer.correct).length, session.answers.length), 0) / progress.sessions.length) : 0;
  const readiness = Math.round((averageScore + accuracy(progress.categoryStats['จรรยาบรรณและศีลธรรม']) + accuracy(progress.categoryStats['ความรู้ประกันชีวิต'])) / 3) || 0;
  const weakestTopics = topicAccuracy.slice(0, 5).map(([topic]) => topic);
  return {
    readiness,
    passProbability: Math.min(98, Math.max(5, readiness + 10)),
    averageScore,
    ethicsAccuracy: accuracy(progress.categoryStats['จรรยาบรรณและศีลธรรม']),
    knowledgeAccuracy: accuracy(progress.categoryStats['ความรู้ประกันชีวิต']),
    weakestTopics,
    strongestTopics: [...topicAccuracy].reverse().slice(0, 3).map(([topic]) => topic),
    recommendations: weakestTopics.map((topic) => `คุณควรทบทวนหัวข้อ${topic} และทำแบบฝึกหัดจากข้อที่เคยตอบผิด`),
  };
}
