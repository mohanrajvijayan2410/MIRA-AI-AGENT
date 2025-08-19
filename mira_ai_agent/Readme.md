# MIRA Agent 3


## Features

* Interactive chat UI with user/bot messages
* Instruction generation and step-by-step review
* Inline editing of instructions during review mode
* Final analysis with performance metrics, actions, and objects
* Selectable Groq AI models via dropdown

---

## Prerequisites

* Node.js v16 or higher
* Yarn or npm

---

## Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/mira-agent.git
   cd mira-agent
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

---

## Project Structure

```
├── public/            # Static assets
│   └── mira.jpg       # Bot avatar image
│
├── src/               # Source files
│   ├── App.jsx        # Main React component
│   ├── main.jsx       # Vite entry point
│   ├── mira/          # Agent logic (instruction generation)
│   │   ├── agent.js
│   │   └── prompt_builder.js
│   └── styles.css     # Global styles (Tailwind imported)
│
├── .env               # Environment variables file
├── index.html         # Vite HTML template
├── package.json       # Dependencies and scripts
└── vite.config.js     # Vite configuration
```

---


## License

This project is open source and available under the MIT License.
