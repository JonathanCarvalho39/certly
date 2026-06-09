export type Lang = 'en' | 'pt';
export type Mode = 'exam' | 'practice';
export type Screen = 'welcome' | 'config' | 'quiz' | 'results';

export interface QuestionText {
  en: string;
  pt: string;
}

export interface ExplanationEntries {
  [letter: string]: string;
}

export interface ExplanationLang {
  correct: ExplanationEntries;
  wrong: ExplanationEntries;
}

export interface Question {
  id: string;
  question: QuestionText;
  options: { en: string[]; pt: string[] };
  correct: number[];
  multi: boolean;
  explanation: {
    en: ExplanationLang;
    pt: ExplanationLang;
  };
  group: string;
}

export interface Answer {
  selected: number[];
  confirmed: boolean;
  reviewed: boolean;
}

export interface SessionConfig {
  mode: Mode;
  lang: Lang;
  questionCount: number;
  timeLimit: number;
  showTimer: boolean;
  selectedGroups: string[];
}

export interface AppState {
  screen: Screen;
  config: SessionConfig;
  questions: Question[];
  allQuestions: Question[];
  currentIndex: number;
  answers: Record<number, Answer>;
  quizLang: Lang;
}

export type AppAction =
  | { type: 'SET_ALL_QUESTIONS'; payload: Question[] }
  | { type: 'GO_TO'; payload: Screen }
  | { type: 'SET_CONFIG'; payload: Partial<SessionConfig> }
  | { type: 'START_QUIZ' }
  | { type: 'SET_ANSWER'; payload: { index: number; selected: number[] } }
  | { type: 'CONFIRM_ANSWER'; payload: number }
  | { type: 'TOGGLE_REVIEW'; payload: number }
  | { type: 'JUMP_TO'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_QUIZ_LANG'; payload: Lang }
  | { type: 'FINISH' };
