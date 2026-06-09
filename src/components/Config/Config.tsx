import { useState, useMemo } from 'react';
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
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of state.allQuestions) {
      map.set(q.group, (map.get(q.group) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [state.allQuestions]);

  const availableGroups = useMemo(
    () => groups.filter(([group]) => !config.selectedGroups.includes(group)),
    [groups, config.selectedGroups],
  );

  const toggleGroup = (group: string) => {
    const current = config.selectedGroups;
    const next = current.includes(group)
      ? current.filter((g) => g !== group)
      : [...current, group];
    dispatch({ type: 'SET_CONFIG', payload: { selectedGroups: next } });
  };

  const clearGroups = () => {
    dispatch({ type: 'SET_CONFIG', payload: { selectedGroups: [] } });
  };

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
        <>
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

          <div className={styles.section}>
            <div className={styles.labelRow}>
              <label className={styles.label}>{t.groupFilter}</label>
              {config.selectedGroups.length > 0 && (
                <button className={styles.clearBtn} onClick={clearGroups}>
                  {t.clearGroups}
                </button>
              )}
            </div>
            <p className={styles.groupDesc}>{t.groupFilterDesc}</p>
            <button
              className={styles.groupSelectBtn}
              onClick={() => setShowGroupPicker(true)}
            >
              {availableGroups.length > 0 ? t.selectGroup : '—'}
              <span className={styles.groupSelectArrow}>▾</span>
            </button>
            {config.selectedGroups.length > 0 && (
              <div className={styles.tags}>
                {config.selectedGroups.map((group) => {
                  const entry = groups.find(([g]) => g === group);
                  const count = entry?.[1] ?? 0;
                  return (
                    <span key={group} className={styles.tag}>
                      <span className={styles.tagName}>{group}</span>
                      <span className={styles.tagCount}>{count}</span>
                      <button className={styles.tagRemove} onClick={() => toggleGroup(group)}>✕</button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <button className={styles.startBtn} onClick={handleStartClick}>
        {isExam ? t.startExam : t.startPractice}
      </button>

      {showGroupPicker && (
        <div className={styles.overlay} onClick={() => setShowGroupPicker(false)}>
          <div className={styles.pickerModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pickerHeader}>
              <h3 className={styles.pickerTitle}>{t.groupFilter}</h3>
              <button className={styles.closeBtn} onClick={() => setShowGroupPicker(false)}>✕</button>
            </div>
            <div className={styles.pickerList}>
              {availableGroups.map(([group, count]) => (
                <button
                  key={group}
                  className={styles.pickerItem}
                  onClick={() => {
                    toggleGroup(group);
                    setShowGroupPicker(false);
                  }}
                >
                  <span className={styles.pickerItemName}>{group}</span>
                  <span className={styles.pickerItemCount}>{count}</span>
                </button>
              ))}
              {availableGroups.length === 0 && (
                <p className={styles.pickerEmpty}>{t.allGroups}</p>
              )}
            </div>
          </div>
        </div>
      )}

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
