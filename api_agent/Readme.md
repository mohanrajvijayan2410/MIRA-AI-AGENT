# MIRA AI Agent

A conversational, agentic AI data generator. Uses multiple LLM backends (Groq, Gemini) as tools.

## Structure

- **config/settings.yaml**: API keys & defaults
- **data/sample_tasks.json**: Example inputs
- **mira/**: Core agent code
- **main.py**: Flask endpoint

## Usage

1. Copy your API keys into `.env`:
   ```ini
   GROQ_API_KEY=your_groq_key
   GENAI_API_KEY=your_gemini_key

   pip install -r requirements.txt

2. python main.py

3. POST JSON task objects to /run-task
