import type { Question, Answer } from '../types';

export type Confidence = 'low' | 'medium' | 'high';

export type TopicStatus =
  | 'high_priority'
  | 'low_sample_error'
  | 'good_start'
  | 'likely_mastered'
  | 'neutral';

export interface TopicAnalysis {
  group: string;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  answered: number;
  percentage: number;
  errorRate: number;
  impactScore: number;
  confidence: Confidence;
  status: TopicStatus;
}

function getConfidence(answered: number): Confidence {
  if (answered >= 6) return 'high';
  if (answered >= 3) return 'medium';
  return 'low';
}

function getStatus(
  total: number,
  wrong: number,
  percentage: number,
): TopicStatus {
  if (wrong >= 3 && percentage < 70) return 'high_priority';
  if (total < 3 && percentage === 0) return 'low_sample_error';
  if (total < 3 && percentage === 100) return 'good_start';
  if (total >= 3 && percentage >= 80) return 'likely_mastered';
  return 'neutral';
}

export interface GroupStatsResult {
  topics: TopicAnalysis[];
  totalWrong: number;
  totalCorrect: number;
  totalSkipped: number;
  totalAnswered: number;
}

export function calculateGroupStats(
  questions: Question[],
  answers: Record<number, Answer>,
): GroupStatsResult {
  const map = new Map<string, { correct: number; wrong: number; skipped: number; total: number }>();

  questions.forEach((q, i) => {
    const entry = map.get(q.group) ?? { correct: 0, wrong: 0, skipped: 0, total: 0 };
    entry.total++;

    const ans = answers[i];
    if (!ans || ans.selected.length === 0) {
      entry.skipped++;
    } else {
      const isCorrect =
        ans.selected.length === q.correct.length &&
        ans.selected.every((s) => q.correct.includes(s));
      if (isCorrect) entry.correct++;
      else entry.wrong++;
    }

    map.set(q.group, entry);
  });

  const totalWrong = Array.from(map.values()).reduce((sum, e) => sum + e.wrong, 0);
  const totalCorrect = Array.from(map.values()).reduce((sum, e) => sum + e.correct, 0);
  const totalSkipped = Array.from(map.values()).reduce((sum, e) => sum + e.skipped, 0);
  const totalAnswered = totalCorrect + totalWrong;

  const topics = Array.from(map.entries())
    .map(([group, stats]) => {
      const answered = stats.correct + stats.wrong;
      const percentage = answered > 0 ? Math.round((stats.correct / answered) * 100) : 0;
      const errorRate = answered > 0 ? Math.round((stats.wrong / answered) * 100) : 0;
      const impactScore = totalWrong > 0 ? stats.wrong / totalWrong : 0;
      const confidence = getConfidence(answered);
      const status = getStatus(stats.total, stats.wrong, percentage);

      return {
        group,
        ...stats,
        answered,
        percentage,
        errorRate,
        impactScore,
        confidence,
        status,
      };
    })
    .sort((a, b) => {
      const statusOrder: Record<TopicStatus, number> = {
        high_priority: 0,
        low_sample_error: 1,
        good_start: 2,
        neutral: 3,
        likely_mastered: 4,
      };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return b.wrong - a.wrong;
    });

  return { topics, totalWrong, totalCorrect, totalSkipped, totalAnswered };
}
