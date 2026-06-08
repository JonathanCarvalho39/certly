import styles from './ProgressBar.module.css';

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = (current / total) * 100;

  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
