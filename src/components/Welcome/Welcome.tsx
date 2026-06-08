import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import styles from './Welcome.module.css';

export default function Welcome() {
  const { state, dispatch } = useApp();
  const t = UI[state.config.lang];

  const setMode = (mode: 'exam' | 'practice') => {
    if (mode === 'exam') {
      dispatch({ type: 'SET_CONFIG', payload: { mode, timeLimit: 7800, questionCount: 65 } });
    } else {
      dispatch({ type: 'SET_CONFIG', payload: { mode } });
    }
    dispatch({ type: 'GO_TO', payload: 'config' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.langToggle}>
        <button
          className={`${styles.langBtn} ${state.config.lang === 'en' ? styles.active : ''}`}
          onClick={() => { dispatch({ type: 'SET_CONFIG', payload: { lang: 'en' } }); dispatch({ type: 'SET_QUIZ_LANG', payload: 'en' }); }}
        >
          EN
        </button>
        <button
          className={`${styles.langBtn} ${state.config.lang === 'pt' ? styles.active : ''}`}
          onClick={() => { dispatch({ type: 'SET_CONFIG', payload: { lang: 'pt' } }); dispatch({ type: 'SET_QUIZ_LANG', payload: 'pt' }); }}
        >
          PT
        </button>
      </div>

      <div className={styles.header}>
        <h1 className={styles.logo}>
          <span className={styles.logoIcon}>▸</span>Certly
        </h1>
        <span className={styles.badge}>AWS DVA-C02</span>
      </div>

      <div className={styles.cards}>
        <button className={styles.card} onClick={() => setMode('exam')}>
          <div className={styles.cardTag}>{t.examTag}</div>
          <h2 className={styles.cardTitle}>{t.examMode}</h2>
          <p className={styles.cardDesc}>{t.examDesc}</p>
          <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>

        <button className={styles.card} onClick={() => setMode('practice')}>
          <div className={styles.cardTag}>{t.practiceTag}</div>
          <h2 className={styles.cardTitle}>{t.practiceMode}</h2>
          <p className={styles.cardDesc}>{t.practiceDesc}</p>
          <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="9" y1="7" x2="16" y2="7"/>
            <line x1="9" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
