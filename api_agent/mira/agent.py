import yaml
from langchain.agents import Tool, initialize_agent
from langchain.llms.base import LLM
from langchain.memory import ConversationBufferMemory

from mira.prompt_builder import build_prompt
from mira.tools import groq_tool, gemini_tool

# 1) Load config
with open("config/settings.yaml", "r") as f:
    cfg = yaml.safe_load(f)

# 2) Wrap your two endpoints as Tools
tools = [
    Tool(name="groq",   func=groq_tool,   description="Generate datas via Groq."),
    Tool(name="gemini", func=gemini_tool, description="Generate datas via Google Gemini."),
]

# 3) Make a minimal LLM that uses groq_tool for “reasoning”
class GroqLLM(LLM):
    @property
    def _llm_type(self) -> str:
        return "groq-reasoning"
    def _call(self, prompt: str, **kwargs) -> str:
        # use the same Groq endpoint for reasoning
        return groq_tool(prompt)

llm = GroqLLM()

# 4) Memory for conversational state
memory = ConversationBufferMemory(memory_key="chat_history")

# 5) Initialize the LangChain agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=cfg.get("agent_type", "conversational-react-description"),
    memory=memory,
    verbose=True
)




def run_agent(data_name: str, language_option: str, model: str = None) -> str:
    # Build the task prompt

    prompt = build_prompt(language_option, data_name, model)
    # print("prompt got")
    # Let the agent choose & call the right tool
    return agent.invoke(prompt)
