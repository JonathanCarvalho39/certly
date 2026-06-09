import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, SessionConfig } from '../types';
import { shuffle } from '../utils/shuffle';

const defaultConfig: SessionConfig = {
  mode: 'exam',
  lang: 'en',
  questionCount: 65,
  timeLimit: 7800,
  showTimer: true,
  selectedGroups: [],
};

const initialState: AppState = {
  screen: 'welcome',
  config: defaultConfig,
  questions: [],
  allQuestions: [],
  currentIndex: 0,
  answers: {},
  quizLang: 'en',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ALL_QUESTIONS':
      return { ...state, allQuestions: action.payload };

    case 'GO_TO':
      return { ...state, screen: action.payload };

    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };

    case 'START_QUIZ': {
      const { selectedGroups } = state.config;
      const pool = selectedGroups.length > 0
        ? state.allQuestions.filter((q) => selectedGroups.includes(q.group))
        : state.allQuestions;
      const shuffled = shuffle(pool);
      const count = Math.min(state.config.questionCount, shuffled.length);
      const sliced = shuffled.slice(0, count);
      return {
        ...state,
        questions: sliced,
        currentIndex: 0,
        answers: {},
        quizLang: state.config.lang,
        screen: 'quiz',
      };
    }

    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.index]: {
            selected: action.payload.selected,
            confirmed: false,
            reviewed: state.answers[action.payload.index]?.reviewed ?? false,
          },
        },
      };

    case 'CONFIRM_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload]: {
            ...state.answers[action.payload],
            confirmed: true,
          },
        },
      };

    case 'TOGGLE_REVIEW':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload]: {
            selected: state.answers[action.payload]?.selected ?? [],
            confirmed: state.answers[action.payload]?.confirmed ?? false,
            reviewed: !(state.answers[action.payload]?.reviewed ?? false),
          },
        },
      };

    case 'JUMP_TO':
      return { ...state, currentIndex: action.payload };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
      };

    case 'PREV_QUESTION':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };

    case 'SET_QUIZ_LANG':
      return { ...state, quizLang: action.payload };

    case 'FINISH':
      return { ...state, screen: 'results' };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
