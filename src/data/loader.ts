import type { Question } from '../types';

export interface CertificationMeta {
  id: string;
  code: string;
  name: string;
  nameShort: string;
  description: { en: string; pt: string };
  questionCount: number;
  timeLimit: number;
  passingScore: number;
  color: string;
  icon: string;
}

export interface CertificationFile {
  _meta: CertificationMeta;
  questions: Question[];
}

interface CertificationEntry extends CertificationMeta {
  questions: Question[];
}

const modules = import.meta.glob<{ default: CertificationFile }>(
  './certifications/*.json',
  { eager: true },
);

export const certifications: CertificationEntry[] = Object.values(modules)
  .map((mod) => mod.default)
  .map((file) => ({
    ...file._meta,
    questionCount: file.questions.length,
    questions: file.questions,
  }));

export function getCertificationById(id: string): CertificationEntry | undefined {
  return certifications.find((c) => c.id === id);
}
