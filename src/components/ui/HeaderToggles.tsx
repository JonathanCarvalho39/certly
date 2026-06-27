import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './HeaderToggles.module.css';

export default function HeaderToggles() {
  const { state, dispatch } = useApp();
  const lang = state.quizLang;
  const { theme, toggleTheme } = useTheme();

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
      <div className={styles.divider} />
      <button
        className={styles.themeBtn}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
