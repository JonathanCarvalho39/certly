import { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useQuestions } from './hooks/useQuestions';
import { UI } from './i18n/ui';
import Welcome from './components/Welcome/Welcome';
import Config from './components/Config/Config';
import Quiz from './components/Quiz/Quiz';
import Results from './components/Results/Results';

function getBasePath() {
  const base = import.meta.env.BASE_URL;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export default function App() {
  const { state, dispatch } = useApp();
  const { questions, loading, error } = useQuestions(getBasePath());
  const t = UI[state.config.lang];

  useEffect(() => {
    if (questions.length > 0) {
      dispatch({ type: 'SET_ALL_QUESTIONS', payload: questions });
    }
  }, [questions, dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-dim)' }}>
        {t.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--red)', textAlign: 'center', padding: '2rem' }}>
        {t.loadError}
      </div>
    );
  }

  switch (state.screen) {
    case 'welcome':
      return <Welcome />;
    case 'config':
      return <Config />;
    case 'quiz':
      return <Quiz />;
    case 'results':
      return <Results />;
    default:
      return <Welcome />;
  }
}
