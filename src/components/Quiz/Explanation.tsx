import { UI } from '../../i18n/ui';
import type { Question, Lang } from '../../types';
import styles from './Explanation.module.css';

interface Props {
  question: Question;
  selectedIndices: number[];
  quizLang: Lang;
}

export default function Explanation({ question, selectedIndices, quizLang }: Props) {
  const t = UI[quizLang];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isCorrect =
    selectedIndices.length === question.correct.length &&
    selectedIndices.every((s) => question.correct.includes(s));

  return (
    <div className={styles.container}>
      <div className={`${styles.pill} ${isCorrect ? styles.correctPill : styles.wrongPill}`}>
        {isCorrect ? `✓ ${t.correct}` : `✗ ${t.incorrect}`}
      </div>
      {question.options[quizLang].map((_, i) => {
        const letter = letters[i];
        const isCorrectOption = question.correct.includes(i);
        const explLang = question.explanation[quizLang] || question.explanation.pt || { correct: {}, wrong: {} };
        const explanation =
          explLang.correct?.[letter] ||
          explLang.wrong?.[letter] ||
          '';

        return (
          <div
            key={i}
            className={`${styles.explanationBlock} ${isCorrectOption ? styles.correctBg : styles.wrongBg}`}
          >
            <span className={styles.explLetter}>{letter}</span>
            <p className={styles.explText}>{explanation}</p>
          </div>
        );
      })}
    </div>
  );
}
