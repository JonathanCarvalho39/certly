import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import { calculateScore } from '../../utils/score';
import ScoreRing from '../ui/ScoreRing';
import LangToggle from '../ui/LangToggle';
import styles from './Results.module.css';

export default function Results() {
  const { state, dispatch } = useApp();
  const { config, questions, answers } = state;
  const t = UI[config.lang];

  const score = calculateScore(questions, answers);

  const retry = () => {
    dispatch({ type: 'START_QUIZ' });
  };

  const goHome = () => {
    dispatch({ type: 'GO_TO', payload: 'welcome' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div />
        <LangToggle />
      </div>

      <h1 className={styles.title}>
        {config.mode === 'exam' ? t.examComplete : t.practiceComplete}
      </h1>

      <ScoreRing percentage={score.percentage} />

      {config.mode === 'exam' && (
        <div className={`${styles.banner} ${score.passed ? styles.passed : styles.failed}`}>
          {score.passed ? t.passed : t.failed}
        </div>
      )}

      <p className={styles.answered}>
        {t.youAnswered.replace('{n}', String(questions.length))}
      </p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{score.correct}</span>
          <span className={styles.statLabel}>{t.correct}</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.wrongVal}`}>{score.wrong}</span>
          <span className={styles.statLabel}>{t.wrong}</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.skippedVal}`}>{score.skipped}</span>
          <span className={styles.statLabel}>{t.skipped}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.homeBtn} onClick={goHome}>{t.backHome}</button>
        <button className={styles.retryBtn} onClick={retry}>{t.tryAgain}</button>
      </div>
    </div>
  );
}
