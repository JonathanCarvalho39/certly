import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import { certifications } from '../../data/loader';
import HeaderToggles from '../ui/HeaderToggles';
import styles from './Welcome.module.css';

export default function Welcome() {
  const { state, dispatch } = useApp();
  const t = UI[state.config.lang];
  const [modalOpen, setModalOpen] = useState(false);

  const cert = certifications.find((c) => c.id === state.config.certificationId) ?? certifications[0];

  const selectCertification = (certId: string) => {
    const newCert = certifications.find((c) => c.id === certId);
    if (newCert) {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          certificationId: newCert.id,
          questionCount: newCert.questionCount,
          timeLimit: newCert.timeLimit,
        },
      });
    }
    setModalOpen(false);
  };

  const setMode = (mode: 'exam' | 'practice') => {
    dispatch({ type: 'SET_CONFIG', payload: { mode } });
    dispatch({ type: 'GO_TO', payload: 'config' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.langToggle}>
        <HeaderToggles />
      </div>

      <div className={styles.header}>
        <h1 className={styles.logo}>
          <span className={styles.logoIcon}>▸</span>Certly
        </h1>
      </div>

      <button
        className={styles.certBadge}
        onClick={() => setModalOpen(true)}
        style={{ '--cert-color': cert.color } as React.CSSProperties}
      >
        <span className={styles.certBadgeIcon}>{cert.icon}</span>
        <span className={styles.certBadgeName}>{cert.name}</span>
        <svg className={styles.certBadgeChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div className={styles.modeCards}>
        <button className={styles.modeCard} onClick={() => setMode('exam')}>
          <div className={styles.modeTag}>{t.examTag}</div>
          <h2 className={styles.modeTitle}>{t.examMode}</h2>
          <p className={styles.modeDesc}>{t.examDesc}</p>
          <svg className={styles.modeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>

        <button className={styles.modeCard} onClick={() => setMode('practice')}>
          <div className={styles.modeTag}>{t.practiceTag}</div>
          <h2 className={styles.modeTitle}>{t.practiceMode}</h2>
          <p className={styles.modeDesc}>{t.practiceDesc}</p>
          <svg className={styles.modeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="9" y1="7" x2="16" y2="7"/>
            <line x1="9" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>

      <div className={styles.meta}>
        <span>{cert.questionCount} {t.questions}</span>
        <span>•</span>
        <span>{Math.floor(cert.timeLimit / 60)} {t.minutes}</span>
        <span>•</span>
        <span>{t.passingScore} {cert.passingScore}%</span>
      </div>

      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{t.selectCertification}</h2>
            <div className={styles.modalList}>
              {certifications.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.modalItem} ${c.id === cert.id ? styles.modalItemActive : ''}`}
                  onClick={() => selectCertification(c.id)}
                  style={{ '--cert-color': c.color } as React.CSSProperties}
                >
                  <span className={styles.modalItemIcon}>{c.icon}</span>
                  <div className={styles.modalItemInfo}>
                    <span className={styles.modalItemCode}>{c.code}</span>
                    <span className={styles.modalItemName}>{c.name}</span>
                  </div>
                  <span className={styles.modalItemCount}>{c.questionCount} {t.questions}</span>
                  {c.id === cert.id && (
                    <svg className={styles.modalItemCheck} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
