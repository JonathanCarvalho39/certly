import { useEffect, useCallback, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import QuestionCard from './QuestionCard';
import OptionItem from './OptionItem';
import Explanation from './Explanation';
import ExamNav from './ExamNav';
import Timer from './Timer';
import ProgressBar from '../ui/ProgressBar';
import LangToggle from '../ui/LangToggle';
import { useTimer } from '../../hooks/useTimer';
import styles from './Quiz.module.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function Quiz() {
  const { state, dispatch } = useApp();
  const { config, questions, currentIndex, answers, quizLang } = state;
  const t = UI[config.lang];
  const isExam = config.mode === 'exam';

  const finishQuiz = useCallback(() => {
    dispatch({ type: 'FINISH' });
  }, [dispatch]);

  const timer = useTimer(config.timeLimit, finishQuiz);
  const [showExitModal, setShowExitModal] = useState(false);
  const [timerVisible, setTimerVisible] = useState(true);
  const [showNavModal, setShowNavModal] = useState(false);

  useEffect(() => {
    if (isExam && config.showTimer) {
      timer.start();
    }
    return () => timer.stop();
  }, []);

  const question = questions[currentIndex];
  const answer = answers[currentIndex];
  const selected = answer?.selected ?? [];
  const confirmed = answer?.confirmed ?? false;

  const handleSelect = (optIndex: number) => {
    if (confirmed) return;
    let newSelected: number[];
    if (question.multi) {
      newSelected = selected.includes(optIndex)
        ? selected.filter((s) => s !== optIndex)
        : [...selected, optIndex];
    } else {
      newSelected = [optIndex];
    }
    dispatch({ type: 'SET_ANSWER', payload: { index: currentIndex, selected: newSelected } });
  };

  const handleConfirm = () => {
    dispatch({ type: 'CONFIRM_ANSWER', payload: currentIndex });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
      dispatch({ type: 'SET_QUIZ_LANG', payload: config.lang });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_QUESTION' });
    dispatch({ type: 'SET_QUIZ_LANG', payload: config.lang });
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    timer.stop();
    dispatch({ type: 'GO_TO', payload: 'welcome' });
  };

  const getOptionState = (optIndex: number): 'default' | 'selected' | 'correct' | 'wrong' => {
    if (!confirmed) {
      return selected.includes(optIndex) ? 'selected' : 'default';
    }
    const isCorrect = question.correct.includes(optIndex);
    const isSelected = selected.includes(optIndex);
    if (isCorrect) return 'correct';
    if (isSelected) return 'wrong';
    return 'default';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.exitBtn} onClick={handleExit}>✕</button>
        <span className={styles.counter}>
          Q{String(currentIndex + 1).padStart(2, '0')}/{questions.length}
        </span>
        {isExam && config.showTimer && (
          <>
            {timerVisible ? (
              <Timer seconds={timer.timeLeft} />
            ) : (
              <button className={styles.timerToggle} onClick={() => setTimerVisible(true)}>
                {t.showTimer}
              </button>
            )}
            <button
              className={styles.timerToggle}
              onClick={() => setTimerVisible((v) => !v)}
              title={timerVisible ? t.hideTimer : t.showTimer}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {timerVisible ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </>
                )}
              </svg>
            </button>
          </>
        )}
        <div className={styles.langToggle}>
          <LangToggle />
        </div>
        <div className={styles.progressWrap}>
          <ProgressBar current={currentIndex + 1} total={questions.length} />
        </div>
        {isExam && (
          <div className={styles.headerActions}>
            <button className={styles.navBtnFull} onClick={() => setShowNavModal(true)}>
              {t.showNav}
            </button>
            <button className={styles.finishBtnFull} onClick={finishQuiz}>
              {t.finishExam}
            </button>
          </div>
        )}
      </header>

      <div className={styles.body}>
        <QuestionCard
          number={currentIndex + 1}
          text={question.question[quizLang]}
          multi={question.multi}
          reviewed={answer?.reviewed ?? false}
          onToggleReview={() => dispatch({ type: 'TOGGLE_REVIEW', payload: currentIndex })}
          lang={quizLang}
        />

        <div className={styles.optionsWrap}>
          {question.options[quizLang].map((opt, i) => (
            <OptionItem
              key={i}
              letter={LETTERS[i]}
              text={opt}
              index={i}
              state={getOptionState(i)}
              disabled={confirmed}
              onClick={() => handleSelect(i)}
              animationDelay={i * 0.04}
            />
          ))}
        </div>

        {confirmed && (
          <Explanation
            question={question}
            selectedIndices={selected}
            quizLang={quizLang}
          />
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {isExam ? (
            <>
              <div className={styles.examRow1}>
                <button className={styles.navBtn} onClick={handlePrev} disabled={currentIndex === 0}>
                  {t.prev}
                </button>
                <button className={styles.navBtn} onClick={handleNext} disabled={currentIndex === questions.length - 1}>
                  {t.next}
                </button>
              </div>
              <div className={styles.mobileActions}>
                <button className={styles.navBtnFull} onClick={() => setShowNavModal(true)}>
                  {t.showNav}
                </button>
                <button className={styles.finishBtnFull} onClick={finishQuiz}>
                  {t.finishExam}
                </button>
              </div>
            </>
          ) : (
            <>
              <button className={styles.navBtn} onClick={handlePrev} disabled={currentIndex === 0}>
                {t.prev}
              </button>
              <div className={styles.footerRight}>
                {!confirmed ? (
                  <button className={styles.confirmBtn} onClick={handleConfirm} disabled={selected.length === 0}>
                    {t.confirm}
                  </button>
                ) : currentIndex === questions.length - 1 ? (
                  <button className={styles.finishBtn} onClick={finishQuiz}>
                    {t.finishExam}
                  </button>
                ) : (
                  <button className={styles.navBtn} onClick={handleNext}>
                    {t.next}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </footer>

      {showNavModal && (
        <ExamNav onClose={() => setShowNavModal(false)} />
      )}

      {showExitModal && (
        <div className={styles.overlay} onClick={() => setShowExitModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{t.exitQuiz}</h3>
            <p className={styles.modalText}>{t.exitConfirm}</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowExitModal(false)}>
                {t.cancel}
              </button>
              <button className={styles.modalConfirm} onClick={confirmExit}>
                {t.exit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
