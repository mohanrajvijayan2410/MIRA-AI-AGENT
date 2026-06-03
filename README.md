# 🍳 MIRA: An Intelligent data Agent

Hosted Link: [https://mira-ai-agent-web.vercel.app/](https://mira-ai-agent-web.vercel.app/)
old version: [https://mira-ai-agent.web.app/]

**MIRA** is a powerful AI-driven data generation assistant that intelligently selects between different LLMs (Groq & Gemini) to produce structured datas. Designed with LangChain agents, Flask backend, and a Vite + Tailwind CSS frontend, MIRA is a full-stack showcase of modern agentic AI workflows.

---

## 🔧 Installation & Setup

### Pre-requisites:

1. Python 3.12 or higher
2. NPM (Node Package Manager)

### 1. Clone the Repository

```bash
git clone https://github.com/mohanrajvijayan2410/MIRA_AGENT.git
cd mira_agent
```

### 2. Complete Setup 

```bash
npm install
```

```bash
npm run install:all
```

```bash
npm run dev
```

## Optional separate setup
### 2. Backend Setup (Python)

```bash
cd api_agent
```

```bash
pip install -r requirements.txt
```

```bash
python main.py
```

### 3. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

## Sample Input and Output

### Input

**Instruction:** PREPARE TEA

### Output

To make a cup of tea, follow these steps:

1. **TYPE: SIMPLE INSTRUCTION**

   * Take teapot: The teapot is an essential object for making tea, so take it first.
2. **TYPE: SEQUENTIAL INSTRUCTION**

   * Take water then fill the teapot: Fill the teapot with water to prepare for boiling.
3. **TYPE: SIMPLE INSTRUCTION**

   * Heat teapot: Heat the filled teapot to boil the water.
4. **TYPE: INSTRUCTION WITH REASON**

   * Add tea leaves to the teapot because tea leaves are necessary for making tea.
5. **TYPE: SEQUENTIAL INSTRUCTION**

   * Wait for 3 minutes then strain the tea: Allow the tea leaves to steep in the water for a few minutes before straining.
6. **TYPE: SIMPLE INSTRUCTION**

   * Take cup: Prepare the cup to pour the tea into.
7. **TYPE: INSTRUCTION WITH PURPOSE**

   * Pour the tea into the cup if your intention is to serve the tea.
8. **TYPE: INSTRUCTION WITH REASON**

   * Add condiments such as sugar or milk to taste because adding condiments can enhance the flavor of the tea.

Available Objects = {Teapot, Water, Tea leaves, Cup, Condiments}
Valid Actions = {Take OBJ: DUR 1 minute, Heat OBJ: DUR 3 minutes, Wait: DUR 3 minutes, Pour: DUR 1 minute, Add: DUR 1 minute}

---

## 🚀 Features

* 🤖 **Agent-Based Reasoning** using LangChain
* 🔁 **Multimodal Tool Invocation** – Supports both Groq & Gemini
* 🌍 **Multilingual Data Generation**
* 🧠 **Conversational Memory** with contextual prompts
* ⚡ **Modern Frontend** with React, Vite, and Tailwind CSS
* 🔐 Secure API Keys using `.env`

---

## 🛠️ Project Structure

```
/MIRA-AI-AGENT
│
├── api_agent/
│   ├── main.py                # Flask backend entry
│   ├── requirements.txt
│   └── mira/
│       ├── agent.py           # LangChain agent logic
│       ├── init.py            # EvaluationMetrics module
│       ├── prompt_builder.py  # Custom prompt templates
│       └── tools.py           # Groq & Gemini tool wrappers
│
├── config/
│   └── settings.yaml          # Agent config (type etc.)
│
├── dataset/                   # (your dataset folder)
└── frontend/
    ├── .firebase/
    ├── dist/
    ├── node_modules/
    ├── public/
    └── src/
        ├── components/
        ├── config/
        ├── mira/
        ├── types/
        ├── utils/
        ├── App.jsx
        ├── chat.jsx
        ├── csv.tsx
        ├── index.css
        └── main.jsx

```

---

## 🧠 How It Works

1. User submits a data name and language preference from the frontend.
2. Flask backend invokes `run_agent()`, which builds a task prompt.
3. LangChain agent chooses the right tool (Groq or Gemini) and returns a response.
4. Evaluation metrics are computed.
5. Frontend receives the response and displays both data and performance.

---

## 📦 API Endpoint

### `POST /generate-data`

#### Payload

```json

  "data_name": "Pasta Alfredo",
  "language_option": "English",
  "model": "groq"
}
```


---

> All scores are auto-generated using the `EvaluationMetrics` module in `mira/init.py`.

---

## 🌍 Deployment

* **Frontend** is deployed on **Firebase Hosting**
  🌐 [`https://mira-ai-agent.web.app`](https://mira-ai-agent.web.app)

* **Backend** can be deployed to:

  * PythonAnywhere

> Make sure your environment variables are configured properly in the hosting dashboard.

---

## 📝 Classification & Sequencing Prompt Integration

MIRA’s second agent utilizes a classification and sequencing prompt to transform raw instructions into structured, dependency-aware steps. Below is the sample prompt and expected output format:

```text
Stepwise Instructions with Classification

1. pick rice
   Required state: rice is available
   Resulting state: rice is picked
   Type: Simple Instruction
   Dependencies: none
   Consistency: N/A

2. pick beef
   Required state: beef is available
   Resulting state: beef is picked
   Type: Simple Instruction
   Dependencies: none
   Consistency: N/A

3. wash dish
   Required state: dish is dirty
   Resulting state: dish is clean
   Type: Simple Instruction
   Dependencies: none
   Consistency: N/A

4. cook rice in pot
   Required state: rice is picked, pot is available
   Resulting state: rice is cooked, pot is occupied
   Type: Instruction in Sequence
   Dependencies: Step 1
   Consistency: Yes

5. chop beef
   Required state: beef is picked
   Resulting state: beef is chopped
   Type: Instruction with Reason
   Reason: Prepares beef for frying
   Dependencies: Step 2
   Consistency: Yes

6. fry beef in fryer
   Required state: beef is chopped, fryer is available
   Resulting state: beef is fried
   Type: Instruction in Sequence
   Dependencies: Step 5
   Consistency: Yes

7. add rice to dish
   Required state: rice is cooked, dish is clean
   Resulting state: dish contains rice
   Type: Instruction in Sequence
   Dependencies: Steps 3, 4
   Consistency: Yes

8. add beef to dish
   Required state: beef is fried, dish contains rice
   Resulting state: dish contains beef and rice (beef fried rice)
   Type: Instruction in Sequence
   Dependencies: Steps 6, 7
   Consistency: Yes
```

### Flowchart

<img src="https://github.com/user-attachments/assets/36a0d909-deb8-4a0a-997c-12bc126ecf54" 
     alt="flowchart diagram" 
     width="400px" />



### 📊 Dependency Table Example

| Step | Depends On | Objects Involved | Classification          | Consistency |
| ---- | ---------- | ---------------- | ----------------------- | ----------- |
| 1    | —          | rice             | Simple Instruction      | —           |
| 2    | —          | beef             | Simple Instruction      | —           |
| 3    | —          | dish             | Simple Instruction      | —           |
| 4    | 1          | rice, pot        | Instruction in Sequence | Yes         |
| 5    | 2          | beef             | Instruction with Reason | Yes         |
| 6    | 5          | beef, fryer      | Instruction in Sequence | Yes         |
| 7    | 3, 4       | rice, dish       | Instruction in Sequence | Yes         |
| 8    | 6, 7       | beef, dish       | Instruction in Sequence | Yes         |

```

These structured outputs are fed back into the LangChain agent to ensure clarity, dependency management, and consistency across generated data.q

```
