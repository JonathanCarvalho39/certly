import styles from './OptionItem.module.css';

interface Props {
  letter: string;
  text: string;
  index: number;
  state: 'default' | 'selected' | 'correct' | 'wrong';
  disabled: boolean;
  onClick: () => void;
  animationDelay: number;
}

export default function OptionItem({ letter, text, state, disabled, onClick, animationDelay }: Props) {
  const stateClass = styles[state];

  return (
    <button
      className={`${styles.option} ${stateClass}`}
      onClick={onClick}
      disabled={disabled}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <span className={styles.letter}>{letter}</span>
      <span className={styles.text}>{text}</span>
    </button>
  );
}
