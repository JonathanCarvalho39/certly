import { useEffect, useState } from 'react';
import styles from './DonutChart.module.css';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  stroke?: number;
  centerLabel?: string;
  centerValue?: string;
}

export default function DonutChart({ segments, size = 140, stroke = 18, centerLabel, centerValue }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimated(true));
  }, []);

  let accumulated = 0;

  return (
    <div className={styles.wrapper}>
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
          {segments.map((seg) => {
            if (seg.value === 0) return null;
            const pct = total > 0 ? seg.value / total : 0;
            const dash = pct * circumference;
            const offset = circumference - dash;
            const rotation = (accumulated / total) * 360 - 90;
            accumulated += seg.value;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={animated ? offset : circumference}
                className={styles.arc}
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className={styles.center}>
            {centerValue && <span className={styles.value}>{centerValue}</span>}
            {centerLabel && <span className={styles.label}>{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className={styles.legend}>
        {segments.filter((s) => s.value > 0).map((seg) => (
          <div key={seg.label} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: seg.color }} />
            <span className={styles.legendLabel}>{seg.label}</span>
            <span className={styles.legendValue}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
