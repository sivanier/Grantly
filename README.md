# GRANTLY

**Your Future Deserves Funding.**

GRANTLY is a frontend demonstration of a unified scholarship discovery and management platform. It is designed to help students explore opportunities, compare listing criteria with a student profile, shortlist scholarships, organize preparation, and track demo application records.

## Problem

Scholarship information and application preparation can feel scattered. Students need a clear place to discover relevant opportunities, understand listed requirements, save options, and keep track of their next steps.

## Solution

GRANTLY brings those tasks together in a responsive student workspace. Its matching experience uses transparent, deterministic comparisons against the criteria in the included sample dataset. Scholarship listings and providers are fictional and are not official funding programs.

## Key features

- Dashboard with illustrative funding metrics, deadlines, sample activity, and category chart.
- Scholarship discovery with search, combined filters, sorting, and URL-synchronized state.
- Scholarship details with eligibility guidance, a per-scholarship document checklist, local reminder preference, and a clearly labeled demo application flow.
- Smart Match with explainable criteria results based on profile information.
- Application tracker with local demo records, status updates, notes, search, filters, and sorting.
- Student profile editor with field validation and profile completion guidance.
- Saved scholarships with search, sorting, and local persistence.
- In-app notifications derived from local reminders, saved scholarship deadlines, and tracker records.
- Responsive sidebar navigation and accessible keyboard focus styling.

## Tech stack

- React 18 and Vite
- JavaScript (ES modules)
- Tailwind CSS v3 and project CSS design tokens
- React Router DOM
- Lucide React
- Recharts
- Browser LocalStorage for frontend demo persistence

## Project structure

```text
src/
├── assets/
├── components/
│   ├── dashboard/
│   ├── layout/
│   ├── matching/
│   ├── scholarships/
│   ├── tracker/
│   └── ui/
├── context/
├── data/
├── hooks/
├── pages/
├── styles/
└── utils/
```

## Requirements

- Node.js 20.19+ or 22.12+ (supported by the installed Vite 6 toolchain)
- npm

## Install and run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy to Vercel

1. Push the project to a GitHub, GitLab, or Bitbucket repository.
2. Import that repository in Vercel.
3. Set the build command to `npm run build` and the output directory to `dist` (also configured in `vercel.json`).
4. Deploy. The rewrite configuration serves the React entry point for client-side routes.

Alternatively, install the Vercel CLI and run `vercel` from the project root, following its prompts.

## Deploy to Netlify

1. Push the project to a Git repository and import it in Netlify.
2. Set the build command to `npm run build` and publish directory to `dist` (also configured in `netlify.toml`).
3. Deploy. The SPA redirect serves the entry point for React Router routes.

Alternatively, build locally and publish the generated `dist/` directory with the Netlify CLI or dashboard.

## Demo data and limitations

- Every scholarship and provider in the bundled dataset is fictional demonstration content. Advertised amounts and deadlines are illustrative, not verified or guaranteed.
- Apply Now creates a local demo tracker record only after confirmation. It does not submit an application to a provider.
- Profile information, saved scholarships, document checklist progress, reminder preferences, application records, and notification read/dismiss state are stored in this browser's LocalStorage. They are not synchronized across devices and may be cleared by browser storage settings.
- Reminders and notifications are in-app demo behavior only. The app does not send push notifications, email, or SMS.
- Do not enter sensitive identity or banking information. There is no backend or account authentication.

## Submission checklist

- Confirm the production build with `npm run build`.
- Commit the source and deployment configuration to your Git repository.
- Import the repository into Vercel or Netlify and verify a direct refresh on a nested route, such as `/saved` or `/scholarships/aarohan-future-makers`.
- Share the resulting deployment URL after confirming it loads successfully.
