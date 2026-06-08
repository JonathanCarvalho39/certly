# Certly — AWS DVA-C02 Simulator

![Certly](https://img.shields.io/badge/Certly-AWS%20DVA--C02-blue)

A bilingual (EN/PT) exam simulator for the **AWS Certified Developer Associate (DVA-C02)** certification. Built with React + Vite, fully static, deployable to GitHub Pages.

## Features

- **Exam Mode** — timed simulation with 72% pass threshold
- **Practice Mode** — instant explanations after each answer
- Bilingual toggle (EN/PT) per question
- Animated score ring with pass/fail banner
- Mobile-first responsive design
- Zero runtime API calls — everything from `questions.json`

## Setup Local

```bash
git clone https://github.com/JonathanCarvalho039/certly.git
cd certly
npm install
npm run dev
```

## Adding Questions

Place your `questions.json` file in the `public/` folder. Each question must follow the schema:

```json
{
  "id": "DVA-C02-001",
  "question": { "en": "...", "pt": "..." },
  "options": { "en": [...], "pt": [...] },
  "correct": [0, 2],
  "multi": true,
  "explanation": {
    "en": { "correct": { "A": "..." }, "wrong": { "B": "..." } },
    "pt": { "correct": { "A": "..." }, "wrong": { "B": "..." } }
  }
}
```

- `correct` uses **zero-based** indices
- `multi: true` = multiple correct answers; `multi: false` = single answer

## Deploy Manual

```bash
npm run deploy
```

## Deploy Automático

Todo push na branch `main` dispara o GitHub Actions (`.github/workflows/deploy.yml`) que faz build e deploy automaticamente.

## GitHub Pages

A aplicação está publicada em:  
**https://jonathancarvalho039.github.io/certly/**
