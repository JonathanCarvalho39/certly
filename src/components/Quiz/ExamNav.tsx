import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import styles from './ExamNav.module.css';

interface Props {
  onClose: () => void;
}

export default function ExamNav({ onClose }: Props) {
  const { state, dispatch } = useApp();
  const { questions, currentIndex, answers, config } = state;
  const t = UI[config.lang];

  const handleJump = (i: number) => {
    dispatch({ type: 'JUMP_TO', payload: i });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{t.showNav}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendCurrent}`} />
            {t.current}
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendSelected}`} />
            {t.selected}
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendReviewed}`} />
            {t.review}
          </span>
        </div>
        <div className={styles.grid}>
          {questions.map((_, i) => {
            const isCurrent = i === currentIndex;
            const hasSelected = (answers[i]?.selected?.length ?? 0) > 0;
            const isReviewed = answers[i]?.reviewed;
            return (
              <button
                key={i}
                className={`${styles.dot} ${isCurrent ? styles.current : ''} ${hasSelected ? styles.selected : ''} ${isReviewed ? styles.reviewed : ''}`}
                onClick={() => handleJump(i)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
