import { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { certifications } from './data/loader';
import Welcome from './components/Welcome/Welcome';
import Config from './components/Config/Config';
import Quiz from './components/Quiz/Quiz';
import Results from './components/Results/Results';

export default function App() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const cert = certifications.find((c) => c.id === state.config.certificationId);
    if (cert && cert.questions.length > 0) {
      dispatch({ type: 'SET_ALL_QUESTIONS', payload: cert.questions });
    }
  }, [state.config.certificationId, dispatch]);

  return (
    <>
      {state.screen === 'welcome' && <Welcome />}
      {state.screen === 'config' && <Config />}
      {state.screen === 'quiz' && <Quiz />}
      {state.screen === 'results' && <Results />}
    </>
  );
}
