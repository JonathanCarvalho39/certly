import { UI } from '../../i18n/ui';
import type { Lang } from '../../types';
import styles from './QuestionCard.module.css';

interface Props {
  number: number;
  text: string;
  multi: boolean;
  reviewed: boolean;
  onToggleReview: () => void;
  lang: Lang;
}

export default function QuestionCard({ number, text, multi, reviewed, onToggleReview, lang }: Props) {
  const t = UI[lang];

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.badges}>
          <span className={styles.qBadge}>Q{String(number).padStart(2, '0')}</span>
          {multi && <span className={styles.multiBadge}>{t.multiAnswer}</span>}
        </div>
        <button
          className={`${styles.reviewBtn} ${reviewed ? styles.reviewed : ''}`}
          onClick={onToggleReview}
          title={t.markForReview}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={reviewed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span>{reviewed ? t.reviewed : t.markReview}</span>
        </button>
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
