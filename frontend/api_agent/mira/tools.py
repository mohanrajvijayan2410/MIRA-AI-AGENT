import os
from dotenv import load_dotenv
from groq import Groq
import google.generativeai as genai

load_dotenv()

groq_client = Groq(api_key="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")
genai.configure(api_key="AIzaSyAnjiSf8r7kH5oOYkZbQNNhdS4AxxIgYCI")

def groq_tool(prompt: str) -> str:
    resp = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a professional chef and cooking assistant. And you should only answer in the described format"},
            {"role": "user",   "content": prompt}
        ],
    )
    return resp.choices[0].message.content

def gemini_tool(prompt: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    chat = model.start_chat()
    resp = chat.send_message(prompt)
    return resp.text


