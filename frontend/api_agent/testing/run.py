from openai import OpenAI

client = OpenAI(
    api_key="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",
    base_url="https://api.groq.com/openai/v1"
)

response = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[
        {"role": "user", "content": "What is LangChain?"}
    ]
)

print(response.choices[0].message.content)
