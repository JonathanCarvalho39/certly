import { useEffect, useState } from 'react';
import styles from './ScoreRing.module.css';

interface Props {
  percentage: number;
  size?: number;
  stroke?: number;
}

export default function ScoreRing({ percentage, size = 160, stroke = 10 }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimated(true));
  }, []);

  const color = percentage >= 72 ? 'var(--green)' : 'var(--red)';

  return (
    <div className={styles.ring}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          className={styles.arc}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.value}>{percentage}</span>
        <span className={styles.pct}>%</span>
      </div>
    </div>
  );
}
