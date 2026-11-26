# ISAA: Instruction Sequencing AI Agent

AI-enabled autonomous agent platform for intelligent task decomposition, instruction classification, sequential-parallel workflow optimization, and dependency analysis.

hostage link: https://mira-ai-agent-web.vercel.app

## Dataset

TimeArena Task Benchmark Dataset:
[]()

Generic Administrative & Operational Tasks Dataset (100,000+ rows):
[]()

Generic Operational Tasks Dataset (60-row quick benchmark):
[]()

## Task Classification & ISAA Protocol Reference

ISAA Instruction Classification & Dependency Guidelines:
[]()

Action-Object Sequencing & State Transition Rules:
[]()

------------------------------------------------------------------------

# Project Overview

ISAA (Instruction Sequencing AI Agent) is an AI-assisted task planning and workflow optimization platform developed to automate the decomposition of complex natural language tasks into structured, dependency-aware execution sequences. 

The system formalizes task decomposition through the standardized **ISAA Protocol**, categorizing every atomic instruction into formal semantic types (Simple, Purpose-Driven, Reason-Based, Sequential, Exclusive, and Mandatory) while computing required and resulting object states.

It provides a comprehensive multi-method workflow spanning three core paradigms:
1. **CustomFlow**: Interactive human-in-the-loop task instruction generation, inline step editing, and dependency verification.
2. **ObjActSeq**: High-scale dataset search, action-object extraction, and automated execution duration estimation.
3. **SeqParallelo**: Comparative dual-paradigm execution planning contrasting **Sequential Completion Method** (object-by-object) against **Step-by-Step Parallel Method** (action-by-action stages) with feature trade-off matrices.

The application is built with a modern React + TypeScript + Vite architecture, featuring high-speed fuzzy search, multi-key Groq and Gemini AI provider failover, and responsive Tailwind CSS UI rendering.

------------------------------------------------------------------------

# Project Features

## Interactive Task Instruction Generation (CustomFlow)

-   Decomposes natural language tasks into ordered atomic instructions using LLM reasoning.
-   Assigns ISAA Protocol classifications to each generated step.
-   Provides step-by-step review mode with inline editing for instruction text and instruction types.
-   Calculates object state transitions (Required State → Resulting State) and validates sequence consistency.
-   Generates comprehensive dependency tables and extracted action/object catalogs.

## Action-Object Dataset Search & Duration Estimation (ObjActSeq)

-   Loads large-scale task execution datasets including `TimeArenaTask.csv` and `Generic_Admin_Tasks_100000_rows_.csv`.
-   Supports user CSV dataset upload with automated parsing via PapaParse.
-   Implements instant, typo-tolerant fuzzy searching powered by Fuse.js.
-   Extracts available actions and participating objects for any selected task.
-   Generates AI-powered execution duration estimates with confidence intervals and breakdown justifications.

## Comparative Sequential vs. Parallel Planning (SeqParallelo)

-   Decomposes tasks using the **Sequential Completion Method** (processes each item start-to-finish).
-   Decomposes tasks using the **Step-by-Step Parallel Method** (groups similar operations into synchronized execution stages).
-   Renders interactive, click-to-edit instruction type badges enabling real-time human modification.
-   Synchronizes custom badge edits across instruction lists and dependency tables.
-   Generates an automated **Feature Comparison Matrix** evaluating execution focus, parallel optimization, resource sharing, and failure impact.

## Intelligent Multi-Key AI Provider Engine

-   Integrates Groq ultra-low-latency models (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`) and Google Gemini.
-   Features round-robin API key balancing to stay strictly within rate limits.
-   Implements automatic failover on HTTP 429 rate-limiting and prompt token optimization.
-   Configurable multi-provider architecture ready for Mistral, Together AI, and DeepSeek.

------------------------------------------------------------------------

# Objectives

## Primary Objective

Build an end-to-end intelligent agentic workflow for automated instruction sequencing, semantic instruction classification, and comparative parallel execution planning.

## Secondary Objectives

-   Enforce logical consistency in state transitions across multi-step execution graphs.
-   Provide human-in-the-loop customization allowing users to modify instruction types and steps interactively.
-   Benchmark and contrast serial versus staged parallel execution patterns for complex operational workflows.
-   Provide fast fuzzy retrieval across 100,000+ benchmark task records with automated time estimation.

------------------------------------------------------------------------

# Technologies Used

## Software Tools
- React 18 – Modern frontend framework with component-based reactive architecture
- TypeScript & JSX – Type-safe application development and robust schema modeling
- Vite 5 – Next-generation high-speed build tool and frontend development server
- Tailwind CSS – Utility-first responsive design system
- Lucide React – Iconography suite for agent and workflow interfaces
- Groq Cloud API – High-performance LLM inference engine (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`)
- Google Gemini API – Multimodal and conversational instruction planning
- PapaParse – High-performance in-browser CSV parsing and streaming
- Fuse.js – Client-side lightweight fuzzy-search library for large task corpora
- React Router DOM v6 – Client-side multi-view routing and navigation

## Hardware Tools
- CPU (Intel Core i5 / AMD Ryzen 5 or above) – Handles local development server, client bundling, and fuzzy search
- RAM (8–16 GB) – Recommended for indexing 100k+ row datasets in memory
- Storage (SSD 256 GB+) – Fast asset loading and node_modules caching
- Internet Connection – Required for Groq and Gemini API inference

## Database

-   In-memory client state management with React hooks (`useState`, `useCallback`, `useMemo`, `useRef`).
-   Browser `localStorage` for user preferences, custom overrides, and active session persistence.

------------------------------------------------------------------------

# System Architecture

![Architecture](screenshots/Architecture.jpeg)

## Architecture Flow

```
[ User Input / Natural Language Task ] 
                    |
                    v
          [ React UI Layer ]
                    |
      +-------------+-------------+
      |                           |
      v                           v
[ Navigation / Router ]  [ Dataset Selector / Uploader ]
      |                           |
      +---> [ CustomFlow View ]   +---> [ PapaParse CSV Streamer ]
      |     (Interactive Review)  |
      |                           +---> [ Fuse.js Fuzzy Index ]
      +---> [ ObjActSeq View ]    |
      |     (Action-Object Map)   v
      |                  [ Results Table & Duration Card ]
      +---> [ SeqParallelo View ]
            (Comparative Matrix)
                    |
                    v
    [ AI Provider & Orchestration Layer ]
                    |
      +-------------+-------------+
      |                           |
      v                           v
[ Key Manager / Rotator ]  [ Prompt Engineering Engine ]
      |                    (ISAA Protocol & Few-Shot Templates)
      v                           |
[ Groq Cloud / Gemini API ] <-----+
(gpt-oss-120b / qwen3.8)
                    |
                    v
[ Instruction Parser & Badge Transformer ]
                    |
                    v
[ Rendered Plans + Dependency Tables + Comparison ]
```

------------------------------------------------------------------------

# Sample Video

[]()

------------------------------------------------------------------------

# Project Workflow

1. User opens the application via browser at `https://mira-ai-agent-web.vercel.app`.
2. Navigation bar allows seamless selection between **CustomFlow**, **ObjActSeq**, and **SeqParallelo** modules.
3. In **CustomFlow**:
   - User inputs a high-level task (e.g., "how to prepare a cake" or "assemble a computer motherboard").
   - Agent generates classified steps according to the ISAA Protocol.
   - User reviews steps in real time, optionally editing text or clicking instruction type badges.
   - Agent validates required and resulting states, producing the final plan and dependency table.
4. In **ObjActSeq**:
   - System loads the default `TimeArenaTask.csv` dataset or user-uploaded CSV.
   - User types a search query in the search bar; Fuse.js performs instant fuzzy matching.
   - System displays the matched task description, available actions, and required objects.
   - Agent automatically predicts the estimated execution duration with reasoning.
5. In **SeqParallelo**:
   - User enters a task involving multiple items or repetitive actions.
   - System paces requests through round-robin API key rotation to prevent rate limiting.
   - Agent sequentially generates the **Sequential Completion Method**, the **Step-by-Step Parallel Method**, and the **Method Comparison Matrix**.
   - User can click any instruction type badge on either plan or dependency table to customize classifications interactively.

------------------------------------------------------------------------

# Module Description

## CustomFlow Module (`/`)
- **Purpose:** Interactive agentic instruction generation, review, and state-consistency validation.
- **Features:** Conversational input, dynamic instruction count, step review carousel, inline text editing, custom type dropdown, state transition modeling, action and object summary badges.
- **Workflow:** User submits task prompt → Groq/Gemini agent extracts steps and types → interactive review interface activates → user approves or edits steps → dependency table and consistency metrics render.
- **Input:** Task prompt string, model choice, human approval/edit events.
- **Output:** Sequenced instructions, dependency matrix, consistency checks, object and action lists.

## ObjActSeq Module (`/upload`)
- **Purpose:** Large-scale task dataset exploration, object-action decomposition, and duration estimation.
- **Features:** TimeArena and Generic Admin task dataset integrations, custom CSV file drag-and-drop uploader, instant client-side fuzzy search, action and object tag clouds, AI duration estimation card.
- **Workflow:** Dataset loaded into memory → user enters query → searcher matches top task → actions and objects parsed → AI model called to compute task duration → rendered in unified results view.
- **Input:** CSV file, search query string.
- **Output:** Top-ranked task record, action list, object list, estimated duration with reasoning breakdown.

## SeqParallelo Module (`/iterative`)
- **Purpose:** Comparative task sequencing across sequential and staged parallel execution paradigms.
- **Features:** Dual-paradigm generation, stage groupings (Gather, Prepare, Process, Finalize), automated feature comparison table, click-to-edit badge system with modal dialog, round-robin key balancing.
- **Workflow:** Task submitted → Sequential method generated → Parallel method generated by stage → Comparative trade-off matrix produced → interactive badges allow custom classification overrides.
- **Input:** Multi-object or multi-step task description.
- **Output:** Side-by-side sequential vs. parallel HTML plans, stage-grouped execution trees, dependency tables, comparative matrix.

------------------------------------------------------------------------

# User Roles

## System Operator / Planner

-   Inputs operational tasks and processes.
-   Evaluates sequential versus parallel execution trade-offs.
-   Customizes instruction classifications and dependency links.

## Quality & Process Auditor

-   Reviews state transition consistency (Required State → Resulting State).
-   Inspects dependency tables to ensure safety and prerequisite compliance.
-   Downloads benchmark datasets and analyzes step durations.

## System Administrator / Developer

-   Configures AI model providers (Groq, Gemini, Mistral).
-   Manages API key rotations and rate-limit thresholds.
-   Extends dataset schemas and benchmarks.

------------------------------------------------------------------------

# Screenshots

## CustomFlow View

![CustomFlow View](screenshots/customflow.png)

## ObjActSeq Dataset & Search View

![ObjActSeq View](screenshots/objactseq.png)

## SeqParallelo Sequential & Parallel Planning

![SeqParallelo View](screenshots/seqparallelo.png)

## Interactive Instruction Type Edit Modal

![Type Edit Modal](screenshots/type-edit.png)

## Method Comparison Matrix

![Method Comparison](screenshots/comparison.png)

------------------------------------------------------------------------

# API Documentation

The platform interfaces directly with high-speed LLM inference providers using OpenAI-compatible and Google Generative AI REST endpoints:

- **Groq API**:
  - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
  - Models: `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`
  - Authentication: Bearer token with multi-key round-robin rotation
  - Rate-limit handling: Automatic failover on HTTP 429
- **Google Gemini API**:
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
  - Authentication: API key parameter
- **Client-Side Data Feeds**:
  - Dataset fetch: `src/ObjActSeq/dataset/TimeArenaTask.csv`
  - Large dataset fetch: `src/ObjActSeq/dataset/Generic_Admin_Tasks_100000_rows_.csv`

------------------------------------------------------------------------

# Database Design

## Storage

In-browser state management with persistence for user customizations and dataset cache.

## Task and Instruction Schema

-   taskId
-   taskName
-   description
-   actions: string[]
-   objects: string[]
-   steps: Array<{
        number: number;
        instruction: string;
        instructionType: 'Simple Instruction' | 'Instruction with Purpose' | 'Instruction with Reason' | 'Instruction in Sequence' | 'Exclusive Instruction' | 'Mandatory Instruction';
        requiredState: string;
        resultingState: string;
        dependencies: string;
        consistency: string;
    }>
-   durationEstimate: string

## Relationship

    Task
     |
     +-- Action List
     +-- Object List
     +-- Instruction Sequence
     |     +-- State Transitions (Required -> Resulting)
     |     +-- Dependency Links
     |     +-- Classification Type
     +-- Method Comparison (Sequential vs. Parallel)

------------------------------------------------------------------------

## Folder Structure

```
.
├── dist/                                # Production build bundle
├── mira_ai_agent/                       # Main application workspace
│   ├── public/
│   │   ├── krama.png
│   │   └── mira.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIProviderSelector.tsx   # Provider configuration UI
│   │   │   ├── ApiSelector.tsx          # API endpoint dropdown
│   │   │   ├── ComparisonTable.tsx      # Feature comparison matrix
│   │   │   ├── CSVUploader.tsx          # Dataset file uploader
│   │   │   ├── DependencyTable.tsx      # Dependency & state table
│   │   │   ├── GenerateButton.tsx       # Action triggers
│   │   │   ├── MethodSelector.tsx       # Execution mode selector
│   │   │   ├── OutputDisplay.tsx        # Instruction card renderer
│   │   │   ├── PlanRenderer.tsx         # Structured plan view
│   │   │   ├── ResultsTable.tsx         # Search & duration results
│   │   │   ├── SearchBox.tsx            # Fuzzy search input
│   │   │   └── TaskInput.tsx            # Natural language prompt box
│   │   ├── config/
│   │   │   ├── aiProviders.ts           # Model configurations & keys
│   │   │   └── gemini.js                # Gemini SDK client
│   │   ├── customFlow/
│   │   │   ├── agent.js                 # Instruction generation agent
│   │   │   ├── customFlow.jsx           # CustomFlow main page
│   │   │   └── prompt_builder.js        # ISAA system prompt builder
│   │   ├── ObjActSeq/
│   │   │   ├── dataset/
│   │   │   │   ├── All_task_2.csv
│   │   │   │   ├── Generic_Admin_Tasks_100000_rows_.csv
│   │   │   │   ├── Generic_Admin_Tasks_60_rows_.csv
│   │   │   │   └── TimeArenaTask.csv    # Default benchmark dataset
│   │   │   ├── aiProviders.ts           # ObjActSeq duration agent
│   │   │   ├── csvParser.ts             # PapaParse wrapper
│   │   │   ├── ObjActSeq.tsx            # Dataset search page
│   │   │   └── searchUtils.ts           # Fuse.js fuzzy search engine
│   │   ├── seqParallelo/
│   │   │   ├── apiService.ts            # Fallback service
│   │   │   ├── iterativeService.ts      # Multi-key Groq planner
│   │   │   ├── promptService.ts         # Sequencing prompt helpers
│   │   │   └── seqParallelo.tsx         # SeqParallelo page & badge editor
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript type definitions
│   │   ├── App.jsx                      # Main router & top navbar
│   │   ├── index.css                    # Tailwind CSS imports
│   │   └── main.jsx                     # Application bootstrap
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json                         # Root package scripts
├── requirements.txt
└── README.md
```

------------------------------------------------------------------------

# Installation Guide

``` bash
git clone https://github.com/mohanrajvijayan2410/MIRA_AGENT.git
cd mira-agent-mohan-sir/mira_ai_agent
npm install
```

Run development server:

``` bash
npm run dev
```

Build for production:

``` bash
npm run build
```

Preview production build:

``` bash
npm run preview
```

------------------------------------------------------------------------

# Usage Guide

1.  Open the application in your browser (local `http://localhost:5173` or deployed `https://mira-ai-agent-web.vercel.app`).
2.  **CustomFlow**: Enter a task description in the prompt box, click generate, review instructions step-by-step, edit any instruction text or type, and view the final dependency table.
3.  **ObjActSeq**: Search through benchmark tasks using keywords, view extracted actions and objects, and observe the AI-estimated execution duration.
4.  **SeqParallelo**: Submit any multi-object task, review the side-by-side **Sequential** and **Parallel** plans, click on any type badge to customize its ISAA classification, and analyze the method comparison matrix.

------------------------------------------------------------------------

# Results

The platform provides quantitative and qualitative evaluation across sequencing accuracy, dependency tracking, and execution efficiency.

## Method Comparison Breakdown

| Feature | Sequential Completion Method | Step-by-Step Parallel Method |
| :--- | :--- | :--- |
| **Execution Focus** | Per object (item-by-item completion) | Per action (stage-by-stage synchronization) |
| **Flow Pattern** | Linear serial execution | Concurrent stage operations |
| **Resource Efficiency** | Setup repeated per object | Setup shared across all batch items |
| **Parallel Optimization** | None (single-threaded) | High (multi-component synchronization) |
| **Failure Impact** | Isolated to current active object | May pause entire stage for resolution |

## Instruction Classification Distribution

- **Simple Instruction**: Single direct actions with no branching.
- **Mandatory Instruction**: Concurrently required actions ("and").
- **Instruction with Purpose**: Goal-oriented operations specifying intentionality.
- **Instruction with Reason**: Justified actions stating prerequisites.
- **Instruction in Sequence**: Ordered dependencies linked with temporal markers ("then").

------------------------------------------------------------------------

# Security Features

-   Client-side sanitized HTML rendering with XSS protection.
-   Safe API key rotation with environment variable isolation.
-   Failsafe HTTP 429 rate-limiting detection and backoff prevention.
-   Client-side dataset processing keeping user CSVs in local memory.

------------------------------------------------------------------------

# Future Enhancements

1. Integration of Explainable AI (XAI) to visualize the decision trees behind state transitions.
2. Real-world robotic execution interface using ROS2 action bridges.
3. Gantt chart visualization for critical-path timing in parallel workflows.
4. Multimodal video instruction ingestion to automatically generate ISAA steps from task demonstration videos.
5. Automated cycle detection and deadlock resolution in complex dependency graphs.

------------------------------------------------------------------------

# Challenges Faced

-   Handling Groq's 8,000 Tokens Per Minute (TPM) limit across rapid multi-method generation.
-   Managing reasoning token consumption with `openai/gpt-oss-120b` to avoid response truncation.
-   Ensuring seamless two-way synchronization between click-to-edit badges and dependency tables.
-   Indexing and fuzzy searching large 100,000+ row CSV datasets efficiently in the browser.

------------------------------------------------------------------------

# Learning Outcomes

-   Agentic task decomposition and prompt engineering design patterns.
-   Implementation of the formal ISAA instruction classification protocol.
-   Round-robin multi-key balancing and rate-limit resilience.
-   High-performance client-side fuzzy search and data streaming.
-   Dual-paradigm sequential vs. parallel comparative analysis.

------------------------------------------------------------------------

# Deployment

Supported platforms: 
- Vercel: https://mira-ai-agent-web.vercel.app
- Firebase Hosting: https://mira-ai-agent.web.app
- Netlify
- GitHub Pages

------------------------------------------------------------------------
