# 🍳 MIRA: An Intelligent Recipe Agent

Hosted Link: [https://mira-ai-agent.web.app](https://mira-ai-agent.web.app)

**MIRA** is a powerful AI-driven recipe generation assistant that intelligently selects between different LLMs (Groq & Gemini) to produce structured recipes. Designed with LangChain agents, Flask backend, and a Vite + Tailwind CSS frontend, MIRA is a full-stack showcase of modern agentic AI workflows.

---

## 🔧 Installation & Setup\

### Pre-requisites: 
1. Python 3.12 or higher
2. NPM (Node Package Manager)

### 1. Clone the Repository

```bash
git clone https://github.com/mohanrajvijayan2410/MIRA_AGENT.git
cd mira_agent
```

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

1. TYPE: SIMPLE INSTRUCTION
Take teapot: The teapot is an essential object for making tea, so take it first.
2. TYPE: SEQUENTIAL INSTRUCTION
Take water then fill the teapot: Fill the teapot with water to prepare for boiling.
3. TYPE: SIMPLE INSTRUCTION
Heat teapot: Heat the filled teapot to boil the water.
4. TYPE: INSTRUCTION WITH REASON
Add tea leaves to the teapot because tea leaves are necessary for making tea.
5. TYPE: SEQUENTIAL INSTRUCTION
Wait for 3 minutes then strain the tea: Allow the tea leaves to steep in the water for a few minutes before straining.
6. TYPE: SIMPLE INSTRUCTION
Take cup: Prepare the cup to pour the tea into.
7. TYPE: INSTRUCTION WITH PURPOSE
Pour the tea into the cup if your intention is to serve the tea.
8. TYPE: INSTRUCTION WITH REASON
Add condiments such as sugar or milk to taste because adding condiments can enhance the flavor of the tea.

Available Objects = {Teapot, Water, Tea leaves, Cup, Condiments}
Valid Actions = {Take OBJ: DUR 1 minute, Heat OBJ: DUR 3 minutes, Wait: DUR 3 minutes, Pour: DUR 1 minute, Add: DUR 1 minute}
| Metric                    | Value       |
|---------------------------|-------------|
| Average Progress Score (AS) | 1 score     |
| Completion Speed (CS)       | 1 score/min |
| Task Completion Rate (TCR)  | 100%        |
| Average Completion Time (ACT) | 1 min     |


---

## 🚀 Features

* 🤖 **Agent-Based Reasoning** using LangChain
* 🔁 **Multimodal Tool Invocation** – Supports both Groq & Gemini
* 🌍 **Multilingual Recipe Generation**
* 🧠 **Conversational Memory** with contextual prompts
* 📊 **Real-Time Evaluation Metrics** (AS, CS, TCR, ACT)
* ⚡ **Modern Frontend** with React, Vite, and Tailwind CSS
* 🔐 Secure API Keys using `.env`

---

## 🛠️ Project Structure

```
/mira
│
├── main.py                # Flask backend entry
├── mira/
│   ├── agent.py           # LangChain agent logic
│   ├── prompt_builder.py  # Custom prompt templates
│   ├── sequencer.py       # Groq & Gemini tool wrappers
│   ├── init.py            # EvaluationMetrics module
│
├── config/
│   └── settings.yaml      # Agent config (type etc.)
│
├── .env                   # API credentials
└── frontend/              # Vite + React frontend
```



---

## 🧠 How It Works

1. User submits a recipe name and language preference from the frontend.
2. Flask backend invokes `run_agent()`, which builds a task prompt.
3. LangChain agent chooses the right tool (Groq or Gemini) and returns a response.
4. Evaluation metrics are computed.
5. Frontend receives the response and displays both recipe and performance.

---

## 📦 API Endpoint

### `POST /generate-recipe`

#### Payload

```json
{
  "recipe_name": "Pasta Alfredo",
  "language_option": "English",
  "model": "groq"
}
```

#### Response

```json
{
  "recipe": "1. Boil water...\n2. Add pasta...",
  "metrics": {
    "AS": 0.95,
    "CS": 0.98,
    "TCR": 0.92,
    "ACT": 0.87
  }
}
```

---

## 📊 Evaluation Metrics

* **AS (Accuracy Score)**: Correctness of output
* **CS (Clarity Score)**: How clearly the instructions are presented
* **TCR (Task Completion Rate)**: Whether the task is completed
* **ACT (Agent Confidence Threshold)**: Overall confidence of the model

> All scores are auto-generated using the `EvaluationMetrics` module in `mira/init.py`.

---

## 🌍 Deployment

* **Frontend** is deployed on **Firebase Hosting**
  🌐 [`https://mira-ai-agent.web.app`](https://mira-ai-agent.web.app)

* **Backend** can be deployed to:
  * PythonAnywhere
    
> Make sure your environment variables are configured properly in the hosting dashboard.

---
