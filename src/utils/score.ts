import type { Question, Answer } from '../types';

export function calculateScore(questions: Question[], answers: Record<number, Answer>) {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  questions.forEach((q, i) => {
    const ans = answers[i];
    if (!ans || ans.selected.length === 0) {
      skipped++;
      return;
    }
    const isCorrect =
      ans.selected.length === q.correct.length &&
      ans.selected.every((s) => q.correct.includes(s));
    if (isCorrect) correct++;
    else wrong++;
  });

  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= 72;

  return { correct, wrong, skipped, total, percentage, passed };
}
