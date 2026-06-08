import { useApp } from '../../context/AppContext';
import styles from './LangToggle.module.css';

export default function LangToggle() {
  const { state, dispatch } = useApp();
  const lang = state.quizLang;

  const toggle = (newLang: 'en' | 'pt') => {
    dispatch({ type: 'SET_CONFIG', payload: { lang: newLang } });
    dispatch({ type: 'SET_QUIZ_LANG', payload: newLang });
  };

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => toggle('en')}
      >
        EN
      </button>
      <button
        className={`${styles.btn} ${lang === 'pt' ? styles.active : ''}`}
        onClick={() => toggle('pt')}
      >
        PT
      </button>
    </div>
  );
}
