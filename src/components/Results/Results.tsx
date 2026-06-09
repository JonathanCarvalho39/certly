import { useMemo, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useApp } from '../../context/AppContext';
import { UI } from '../../i18n/ui';
import { calculateScore } from '../../utils/score';
import { calculateGroupStats } from '../../utils/groupStats';
import type { TopicAnalysis, TopicStatus, Confidence } from '../../utils/groupStats';
import ScoreRing from '../ui/ScoreRing';
import LangToggle from '../ui/LangToggle';
import styles from './Results.module.css';

const STATUS_META: Record<TopicStatus, { cssClass: string }> = {
  high_priority: { cssClass: 'statusHigh' },
  low_sample_error: { cssClass: 'statusLowSample' },
  good_start: { cssClass: 'statusGoodStart' },
  likely_mastered: { cssClass: 'statusMastered' },
  neutral: { cssClass: 'statusNeutral' },
};

const CONFIDENCE_META: Record<Confidence, { cssClass: string }> = {
  high: { cssClass: 'confHigh' },
  medium: { cssClass: 'confMed' },
  low: { cssClass: 'confLow' },
};

export default function Results() {
  const { state, dispatch } = useApp();
  const { config, questions, answers } = state;
  const t = UI[config.lang];
  const exportRef = useRef<HTMLDivElement>(null);

  const score = calculateScore(questions, answers);
  const stats = useMemo(() => calculateGroupStats(questions, answers), [questions, answers]);

  const highPriorityTopics = useMemo(
    () => stats.topics.filter((t) => t.status === 'high_priority'),
    [stats],
  );

  const lowSampleTopics = useMemo(
    () => stats.topics.filter((t) => t.status === 'low_sample_error'),
    [stats],
  );

  const goodStartTopics = useMemo(
    () => stats.topics.filter((t) => t.status === 'good_start'),
    [stats],
  );

  const diagnosticText = useMemo(() => {
    const sentences: string[] = [];
    const highImpact = highPriorityTopics.filter((t) => t.impactScore >= 0.2);
    const zeroPercent = lowSampleTopics;

    if (highImpact.length > 0) {
      const names = highImpact.map((t) => t.group).join(', ');
      const totalErrors = highImpact.reduce((sum, t) => sum + t.wrong, 0);
      sentences.push(
        `${names} ${config.lang === 'pt' ? 'teve' : 'had'} the biggest impact, ${config.lang === 'pt' ? 'concentrando' : 'concentrating'} ${totalErrors} ${config.lang === 'pt' ? 'dos' : 'of'} ${stats.totalWrong} ${config.lang === 'pt' ? 'erros' : 'errors'}.`,
      );
    }

    if (zeroPercent.length > 0) {
      const names = zeroPercent.map((t) => t.group).join(', ');
      sentences.push(
        `${names} ${config.lang === 'pt' ? 'tiveram' : 'had'} 0% ${config.lang === 'pt' ? 'de acerto, mas com apenas' : 'accuracy but with only'} ${zeroPercent.map((t) => `${t.answered} ${config.lang === 'pt' ? 'questão(ões)' : 'question(s)'}`).join(config.lang === 'pt' ? ' e ' : ' and ')}, ${config.lang === 'pt' ? 'então precisam de mais amostra' : 'so they need more sample'}.`,
      );
    }

    if (goodStartTopics.length > 0) {
      const names = goodStartTopics.map((t) => t.group).join(', ');
      sentences.push(
        `${names} ${config.lang === 'pt' ? 'teve' : 'had'} good initial performance, ${config.lang === 'pt' ? 'mas ainda não pode ser considerado dominado' : 'but cannot be considered mastered yet'}.`,
      );
    }

    return sentences;
  }, [highPriorityTopics, lowSampleTopics, goodStartTopics, stats.totalWrong, config.lang]);

  const nextSteps = useMemo(() => {
    const steps: string[] = [];
    if (highPriorityTopics.length > 0) {
      const names = highPriorityTopics.map((t) => t.group).join(', ');
      steps.push(
        t.stepReviewTopics.replace('{topics}', names),
      );
    }
    if (score.wrong > 0) {
      steps.push(t.stepRetryWrong.replace('{n}', String(score.wrong)));
    }
    if (lowSampleTopics.length > 0) {
      const names = lowSampleTopics.map((t) => t.group).join(', ');
      steps.push(
        t.stepMoreQuestions.replace('{topics}', names),
      );
    }
    if (steps.length === 0 && score.percentage >= 72) {
      steps.push(t.stepGreatJob);
    }
    return steps;
  }, [highPriorityTopics, lowSampleTopics, score, t]);

  const handleExport = useCallback(async () => {
    if (!exportRef.current) return;
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `certly-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silently fail
    }
  }, []);

  const retry = () => dispatch({ type: 'START_QUIZ' });
  const goHome = () => dispatch({ type: 'GO_TO', payload: 'welcome' });

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div />
        <LangToggle />
      </div>

      <div ref={exportRef} className={styles.exportArea}>
        <h1 className={styles.title}>
          {config.mode === 'exam' ? t.examComplete : t.practiceComplete}
        </h1>

        <ScoreRing percentage={score.percentage} />

        {config.mode === 'exam' && (
          <div className={`${styles.banner} ${score.passed ? styles.passed : styles.failed}`}>
            {score.passed ? t.passed : t.failed}
          </div>
        )}

        <p className={styles.answered}>
          {t.youAnswered.replace('{n}', String(questions.length))}
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{score.correct}</span>
            <span className={styles.statLabel}>{t.correct}</span>
          </div>
          <div className={styles.stat}>
            <span className={`${styles.statValue} ${styles.wrongVal}`}>{score.wrong}</span>
            <span className={styles.statLabel}>{t.wrong}</span>
          </div>
          <div className={styles.stat}>
            <span className={`${styles.statValue} ${styles.skippedVal}`}>{score.skipped}</span>
            <span className={styles.statLabel}>{t.skipped}</span>
          </div>
        </div>

        {/* Diagnostic Card */}
        {diagnosticText.length > 0 && (
          <div className={styles.diagnosticCard}>
            <h3 className={styles.diagnosticTitle}>{t.diagnosticTitle}</h3>
            {diagnosticText.map((text, i) => (
              <p key={i} className={styles.diagnosticText}>{text}</p>
            ))}
          </div>
        )}

        {/* High Priority */}
        {highPriorityTopics.length > 0 && (
          <div className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>{t.highPriorityTitle}</h2>
            <p className={styles.sectionDesc}>{t.highPriorityDesc}</p>
            {highPriorityTopics.map((topic) => (
              <TopicCard key={topic.group} topic={topic} t={t} />
            ))}
          </div>
        )}

        {/* Low Sample with Error */}
        {lowSampleTopics.length > 0 && (
          <div className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>{t.lowSampleTitle}</h2>
            <p className={styles.sectionDesc}>{t.lowSampleDesc}</p>
            {lowSampleTopics.map((topic) => (
              <TopicCard key={topic.group} topic={topic} t={t} />
            ))}
          </div>
        )}

        {/* Good Start */}
        {goodStartTopics.length > 0 && (
          <div className={styles.categorySection}>
            <h2 className={styles.sectionTitle}>{t.goodStartTitle}</h2>
            <p className={styles.sectionDesc}>{t.goodStartDesc}</p>
            {goodStartTopics.map((topic) => (
              <TopicCard key={topic.group} topic={topic} t={t} />
            ))}
          </div>
        )}

        {/* All Topics Table */}
        {stats.topics.length > 1 && (
          <div className={styles.allTopicsSection}>
            <h2 className={styles.sectionTitle}>{t.allTopics}</h2>
            <div className={styles.topicsTable}>
              <div className={styles.tableHeader}>
                <span className={styles.thTopic}>{config.lang === 'pt' ? 'Tópico' : 'Topic'}</span>
                <span className={styles.thCorrect}>{t.correct}</span>
                <span className={styles.thWrong}>{t.wrong}</span>
                <span className={styles.thPct}>%</span>
                <span className={styles.thError}>{t.errorRateLabel}</span>
                <span className={styles.thConf}>{config.lang === 'pt' ? 'Confiança' : 'Confidence'}</span>
                <span className={styles.thStatus}>{config.lang === 'pt' ? 'Status' : 'Status'}</span>
              </div>
              {stats.topics.map((topic) => (
                <TopicRow key={topic.group} topic={topic} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div className={styles.nextStepsSection}>
            <h2 className={styles.sectionTitle}>{t.nextSteps}</h2>
            <div className={styles.nextStepsList}>
              {nextSteps.map((step, i) => (
                <div key={i} className={styles.nextStep}>
                  <span className={styles.stepNumber}>{i + 1}</span>
                  <span className={styles.stepText}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.homeBtn} onClick={goHome}>{t.backHome}</button>
        <button className={styles.retryBtn} onClick={retry}>{t.tryAgain}</button>
        <button className={styles.exportBtn} onClick={handleExport}>
          ↓ {t.exportResult}
        </button>
      </div>
    </div>
  );
}

function TopicCard({ topic, t }: { topic: TopicAnalysis; t: Record<string, string> }) {
  const sm = STATUS_META[topic.status];
  const cm = CONFIDENCE_META[topic.confidence];
  const impactPct = Math.round(topic.impactScore * 100);

  return (
    <div className={styles.topicCard}>
      <div className={styles.tcHeader}>
        <span className={styles.tcName}>{topic.group}</span>
        <span className={styles.tcStats}>
          {topic.correct}/{topic.answered} {t.correctLabel}
        </span>
      </div>
      <div className={styles.tcBar}>
        <div
          className={`${styles.tcBarFill} ${
            topic.percentage >= 72 ? styles.barGood : topic.percentage >= 50 ? styles.barWarn : styles.barBad
          }`}
          style={{ width: `${Math.max(topic.percentage, 2)}%` }}
        />
      </div>
      <div className={styles.tcMetrics}>
        <span className={styles.tcMetric}>
          {t.impactLabel}: <strong>{impactPct}%</strong>
        </span>
        <span className={styles.tcMetric}>
          {t.errorRateLabel}: <strong>{topic.errorRate}%</strong>
        </span>
        <span className={styles.tcMetric}>
          {t.wrongCount.replace('{n}', String(topic.wrong))}
        </span>
      </div>
      <div className={styles.tcMeta}>
        <span className={`${styles.statusBadge} ${styles[sm.cssClass]}`}>
          {t[`status_${topic.status}` as keyof typeof t]}
        </span>
        <span className={`${styles.confBadge} ${styles[cm.cssClass]}`}>
          {t[`conf_${topic.confidence}` as keyof typeof t]}
        </span>
      </div>
    </div>
  );
}

function TopicRow({ topic, t }: { topic: TopicAnalysis; t: Record<string, string> }) {
  const sm = STATUS_META[topic.status];

  return (
    <div className={styles.tableRow}>
      <span className={styles.tdTopic}>{topic.group}</span>
      <span className={styles.tdCorrect}>{topic.correct}/{topic.answered}</span>
      <span className={styles.tdWrong}>{topic.wrong}</span>
      <span className={styles.tdPct}>{topic.percentage}%</span>
      <span className={styles.tdError}>{topic.errorRate}%</span>
      <span className={`${styles.tdConf} ${styles[CONFIDENCE_META[topic.confidence].cssClass]}`}>
        {t[`conf_${topic.confidence}` as keyof typeof t]}
      </span>
      <span className={`${styles.tdStatus} ${styles[sm.cssClass]}`}>
        {t[`status_${topic.status}` as keyof typeof t]}
      </span>
    </div>
  );
}
