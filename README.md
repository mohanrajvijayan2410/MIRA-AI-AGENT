# FacultyAI Recruitment System

AI-enabled faculty recruitment platform for automated resume evaluation,
technical assessment, psychometric screening, and administrative
decision support.

hostage link: https://mira-ai-agent-web.vercel.app
Deployed URL: https://mira-ai-agent-web.vercel.app

## Dataset

Resume Dataset:
https://drive.google.com/drive/folders/1ce5eOycBV3gvPSAyXLM8hvEdEAUD2Qmn?usp=sharing

## Psychometric and Technical Questions

Psychometric Questions:
https://drive.google.com/file/d/1pwuxcAm-xKwMhaTQ1se1G55vtIWz19GJ/view?usp=sharing

Technical Questions:
https://docs.google.com/spreadsheets/d/1G6a6SJgLDzLPdkw8Z3VzvaxDUWzOZ_9A/edit?usp=sharing

------------------------------------------------------------------------

# Project Overview

FacultyAI Recruitment System is an AI-assisted recruitment platform
developed to automate faculty candidate evaluation. The system combines
resume analysis, skill matching, technical assessment, psychometric
evaluation, and result generation.

It provides a complete workflow from candidate application to final
recommendation while reducing manual screening effort and improving
evaluation consistency.

The application is developed using React + Vite with PDF processing,
automated scoring, browser storage, and analytics support.

------------------------------------------------------------------------

# Project Features

## AI Resume Analysis

-   Extracts text from uploaded PDF resumes.
-   Identifies skills and calculates resume-fit score.
-   Highlights missing skills.

## Candidate Application Flow

-   Collects candidate information.
-   Supports PDF resume upload.
-   Creates candidate profile.

## Technical Assessment

-   Loads department-specific questions from Excel.
-   Supports timed assessment.
-   Automatically calculates scores.

## Psychometric Evaluation

-   Loads questions from CSV.
-   Evaluates behavioral and professional suitability.

## Results Generation

-   Combines resume, technical, and psychometric scores.
-   Generates final score and recommendation.
-   Creates downloadable PDF reports.

## Admin Dashboard

-   Provides candidate history and ranking.
-   Displays analytics using charts.
-   Supports candidate record management.

------------------------------------------------------------------------

# Objectives

## Primary Objective

Build an end-to-end digital recruitment workflow for faculty hiring.

## Secondary Objectives

-   Automate candidate evaluation.
-   Provide consistent scoring.
-   Generate transparent reports.

------------------------------------------------------------------------

# Technologies Used

## Software Tools
- Python – Core backend development
- Flask – Web framework for routing & application logic
- Google Gemini API – AI-based resume evaluation & scoring
- PyPDF2 – Resume parsing (PDF)
- SQLite – Database for candidate data & analytics
- Pandas – Data handling & question upload via Excel
- HTML/CSS – Frontend UI rendering

## Hardware Tools
- CPU (i5 / Ryzen 5 or above) – Handles backend processing & AI calls
- RAM (8–16 GB) – Supports multiple candidate evaluations
- Storage (SSD 256 GB+) – Stores resumes & database
- Internet Connection – Required for Gemini API & web access
  
## Database

-   Browser localStorage for candidate persistence.

------------------------------------------------------------------------

# System Architecture

![Architecture](screenshots/Architecture.jpeg)

## Architecture Flow

```

[ User Browser ] 
      |
      v
[ React UI Layer ]
      |
      v
[ Routing / Pages ]
      |
      v
[ Recruitment Context ]
      |
      +--> [ Resume Analyzer ]
      +--> [ Question Loader ]
      +--> [ PDF Report Generator ]
      |
      v
[ Browser Storage (localStorage) ]
      |
      v
[ Admin Dashboard Visualization ]

```
------------------------------------------------------------------------

# Sample Video

https://drive.google.com/file/d/1Kjc71bvCJIMp842jGN7ySobfOKDh7LKv/view?usp=sharing

------------------------------------------------------------------------

# Project Workflow

1. User accesses the application through the browser.
2. User selects “Apply” and completes profile + resume upload.
3. The app validates the PDF, extracts text, and analyzes the resume.
4. Resume scoring is processed against department-specific skills.
5. The candidate proceeds to the technical assessment.
6. The system loads questions from Excel and auto-grades answers.
7. The candidate completes psychometric questions from CSV.
8. Final score is calculated, recommendation is determined, and results are shown.

------------------------------------------------------------------------

# Module Description

## Home Page
- **Purpose:** Marketing and introduction page.
- **Features:** Hero section, feature cards, workflow summary, CTA buttons.
- **Workflow:** Directs candidates to career listings and application form.
- **Input:** None.
- **Output:** Navigation to candidate flows.

## Apply Page
- **Purpose:** Candidate onboarding and resume submission.
- **Features:** Form fields, department selection, PDF upload.
- **Workflow:** Collects candidate details, extracts resume text, sets current candidate state.
- **Input:** Name, email, phone, department, resume PDF.
- **Output:** `currentCandidate` object and resume analysis route transition.

## Resume Analysis Page
- **Purpose:** Display AI resume evaluation.
- **Features:** Resume score, detected skills, missing skills, category breakdown.
- **Workflow:** Reads `currentCandidate.resumeAnalysis`, shows results, advances candidate.
- **Input:** Resume analysis data from `analyzeResume`.
- **Output:** Candidate progress to technical assessment.

## Technical Test Page
- **Purpose:** Department-specific exam module.
- **Features:** Subject selection, timed questions, answer tracking, auto submission.
- **Workflow:** Loads Excel-based questions, runs timed sections, calculates technical score.
- **Input:** Selected subjects, candidate answers.
- **Output:** Technical score and updated candidate state.

## Psychometric Test Page
- **Purpose:** Behavioral and mindset measurement.
- **Features:** CSV question loading, progress tracking, option selection.
- **Workflow:** Presents psychometric questions, scores responses, computes final recommendation.
- **Input:** Candidate answers to psychometric questions.
- **Output:** Final candidate score and recommendation.

## Results Page
- **Purpose:** Final evaluation summary and report generation.
- **Features:** Score cards, final score breakdown, PDF download.
- **Workflow:** Reads completed candidate state and bundles results for presentation.
- **Input:** Candidate scores from prior assessments.
- **Output:** Downloadable PDF report.

### Admin Page
- **Purpose:** Recruitment analytics and candidate history.
- **Features:** Candidate rankings, bar chart, pie chart, KPIs, clear history.
- **Workflow:** Reads stored candidate history and presents aggregated metrics.
- **Input:** `candidates` from localStorage.
- **Output:** Data visualizations and administrative insights.

------------------------------------------------------------------------

# User Roles

## Candidate

-   Applies for faculty positions.
-   Uploads resume.
-   Completes assessments.
-   Views results.

## Admin

-   Reviews candidates.
-   Views analytics.
-   Manages recruitment records.

## Recruiter / Hiring Committee

-   Uses reports for decision support.

------------------------------------------------------------------------

# Screenshots

## Home Page

![Home](screenshots/home.png)

## Apply Page

![Apply](screenshots/apply.png)

## Resume Analysis Page

![Resume Analysis](screenshots/resume-analysis.png)

## Technical Test Page

![Technical Test](screenshots/technical-test.png)

## Psychometric Test Page

![Psychometric Test](screenshots/psychometric-test.png)

## Results Page

![Results](screenshots/results.png)

## Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

------------------------------------------------------------------------

# API Documentation

The workflow is implemented entirely in the browser using:

- Static asset fetch for `public/data/technical_questions.xlsx`
- Static asset fetch for `public/data/psychometric_questions.csv`
- Browser `localStorage` for candidate persistence

No `POST /api/*` or server-side endpoints are included in this frontend-only implementation.

------------------------------------------------------------------------

# Database Design

## Storage

Browser localStorage stores candidate records.

## Candidate Schema

-   id
-   name
-   email
-   department
-   resumeAnalysis
-   technicalScore
-   psychometricScore
-   finalScore
-   recommendation

## Relationship

    Candidate
     |
     +-- Resume Analysis
     +-- Technical Assessment
     +-- Psychometric Assessment
     +-- Final Result

------------------------------------------------------------------------

## Folder Structure

```
.
├── public
│   ├── data
│   │   ├── psychometric_questions.csv
│   │   └── technical_questions.xlsx
│   ├── _redirects
│   └── robots.txt
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── components
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── RecruitmentContext.tsx
│   ├── lib
│   │   ├── pdfGenerator.ts
│   │   ├── questionLoader.ts
│   │   ├── resumeAnalyzer.ts
│   │   └── utils.ts
│   ├── pages
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── ApplyPage.tsx
│   │   ├── CareersPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── PsychometricTestPage.tsx
│   │   ├── ResumeAnalysisPage.tsx
│   │   ├── ResultsPage.tsx
│   │   ├── TechnicalTestPage.tsx
│   │   └── NotFound.tsx
│   ├── data
│   │   └── questions.ts
│   ├── hooks
│   └── styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── bun.lockb

```
------------------------------------------------------------------------

# Installation Guide

``` bash
git clone <repository-url>
cd facultyai-recruitment-system
npm install
```

Run:

``` bash
npm run dev
```

Build:

``` bash
npm run build
```

------------------------------------------------------------------------

# Usage Guide

1.  Open the application.
2.  Submit candidate details.
3.  Upload resume.
4.  Complete assessments.
5.  View final report.
6.  Admin reviews dashboard.


------------------------------------------------------------------------

# Results

The repository includes candidate evaluation reports and comparison visuals for the project.

## Candidate Shortlisting Evaluation

![Candidate Shortlisting Results](screenshots/result.png)


## Candidate Score Breakdown

![Candidate Case Analysis](screenshots/case.png)

## Comparative Metrics Analysis

![Comparative Metrics Analysis](screenshots/comparative.jpg)

## Model Performance Comparison

![Model Performance Evaluation](screenshots/perf.png)



------------------------------------------------------------------------

# Security Features

-   Protected admin route.
-   Authentication handling.
-   Input validation.
-   Local resume processing.

------------------------------------------------------------------------

# Future Enhancements

1. Future Scope and Recommendations
2. Integrate Explainable AI (XAI) to improve transparency in candidate evaluation.
3. Extend the system with multimodal analysis (video and speech) for interview assessment.
4. Deploy using cloud-based infrastructure for scalable and real-time recruitment.
5. Expand to cross-domain recruitment beyond academic institutions.
6. Enhance performance using advanced models and larger datasets.
7. Implement bias detection and fairness mechanisms for ethical recruitment

------------------------------------------------------------------------

# Challenges Faced

-   Resume extraction accuracy.
-   Managing assessment data.
-   Maintaining workflow state.
-   Building analytics dashboard.

------------------------------------------------------------------------

# Learning Outcomes

-   React development.
-   Resume processing.
-   Context API state management.
-   Data visualization.
-   Frontend persistence.

------------------------------------------------------------------------

# Deployment

Supported platforms: 
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

------------------------------------------------------------------------
