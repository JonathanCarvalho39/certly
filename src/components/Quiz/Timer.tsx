import styles from './Timer.module.css';

interface Props {
  seconds: number;
}

export default function Timer({ seconds }: Props) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const isLow = seconds <= 60;

  return (
    <div className={`${styles.timer} ${isLow ? styles.low : ''}`}>
      {String(hrs).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}
