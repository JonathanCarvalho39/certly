import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import LangToggle from '../ui/LangToggle';
import styles from './Config.module.css';

const PRACTICE_COUNTS = [10, 20, 30, 40, 50];

export default function Config() {
  const { state, dispatch } = useApp();
  const { config } = state;
  const t = UI[config.lang];
  const isExam = config.mode === 'exam';
  const [showInfoModal, setShowInfoModal] = useState(false);

  const start = () => {
    dispatch({ type: 'START_QUIZ' });
  };

  const handleStartClick = () => {
    if (isExam) {
      setShowInfoModal(true);
    } else {
      start();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.back} onClick={() => dispatch({ type: 'GO_TO', payload: 'welcome' })}>
          ← {t.back}
        </button>
        <LangToggle />
      </div>

      <h1 className={styles.title}>{isExam ? t.configExam : t.configPractice}</h1>

      {isExam && (
        <>
          <div className={styles.section}>
            <label className={styles.label}>{t.examDuration}</label>
            <p className={styles.fixedValue}>130 min</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>{t.numQuestions}</label>
            <p className={styles.fixedValue}>65</p>
          </div>

          <div className={styles.section}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={config.showTimer}
                onChange={(e) => dispatch({ type: 'SET_CONFIG', payload: { showTimer: e.target.checked } })}
              />
              <span className={styles.toggleTrack} />
              <span>{t.showTimer}</span>
            </label>
          </div>
        </>
      )}

      {!isExam && (
        <div className={styles.section}>
          <label className={styles.label}>{t.numQuestions}</label>
          <div className={styles.options}>
            {PRACTICE_COUNTS.map((n) => (
              <button
                key={n}
                className={`${styles.optionBtn} ${config.questionCount === n ? styles.active : ''}`}
                onClick={() => dispatch({ type: 'SET_CONFIG', payload: { questionCount: n } })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className={styles.startBtn} onClick={handleStartClick}>
        {isExam ? t.startExam : t.startPractice}
      </button>

      {showInfoModal && (
        <div className={styles.overlay} onClick={() => setShowInfoModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{t.examInfoTitle}</h2>
              <button className={styles.closeBtn} onClick={() => setShowInfoModal(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <ul className={styles.infoList}>
                <li>{t.examInfo1}</li>
                <li>{t.examInfo2}</li>
                <li>{t.examInfo3}</li>
                <li>{t.examInfo4}</li>
                <li>{t.examInfo5}</li>
              </ul>

              <h3 className={styles.modalSubtitle}>{t.recommendationsTitle}</h3>
              <p className={styles.infoText}>{t.recIntro}</p>
              <p className={styles.infoText}>{t.recWhen}</p>
              <ul className={styles.infoList}>
                <li>{t.recSec}</li>
                <li>{t.recScal}</li>
                <li>{t.recAvail}</li>
                <li>{t.recPerf}</li>
                <li>{t.recLow}</li>
                <li>{t.recOps}</li>
                <li>{t.recCost}</li>
              </ul>

              <p className={styles.infoText}>{t.recBeforeTitle}</p>
              <ul className={styles.infoList}>
                <li>{t.recBefore1}</li>
                <li>{t.recBefore2}</li>
                <li>{t.recBefore3}</li>
                <li>{t.recBefore4}</li>
                <li>{t.recBefore5}</li>
              </ul>

              <p className={styles.goodLuck}>{t.goodLuck}</p>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setShowInfoModal(false)}>
                {t.cancel}
              </button>
              <button className={styles.modalStart} onClick={start}>
                {t.startExam}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
