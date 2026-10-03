import {
	GroqResponse,
	GeminiResponse,
	MistralResponse,
	TogetherResponse,
	DeepSeekResponse,
	AIProvider,
	AIProviderOption,
} from "../types";

// API Keys
const GROQ_KEYS = [
	"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",
	"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",
];

const API_KEYS = {
	groq: GROQ_KEYS[0],
	gemini: "",
	mistral: "",
	together: "",
	deepseek: "",
};

const createPrompt = (
	description: string,
	actions: string,
	objects: string
): string => {
	return `You are MIRA AI Agent for structured task sequencing and dependency analysis.
Based on the following task information, generate clean and concise step-by-step instructions following the MIRA Protocol.

Task Description: ${description}
Available Actions: ${actions}
Available Objects: ${objects}

**MIRA Protocol Rules:**
1. Each instruction must specify the action and object(s).
2. For each instruction, state the required and resulting object states.
3. Classify each instruction into one of the MIRA Instruction Types:
   - Simple Instruction: Single action on object(s). (e.g., Fetch Diagnostic Tool)
   - Instruction with Purpose: Action stating a goal or intention. (e.g., Initialize Power Supply if you want to test the circuit)
   - Instruction with Reason: Action stating why it is needed. (e.g., Add lubricant because friction is high)
   - Instruction in Sequence: Two sequential actions using 'then'. (e.g., Power off system then disconnect cable)
   - Exclusive Instruction: Choice between alternative objects or actions using 'or'. (e.g., Use Copper Wire or Fiber Cable)
   - Mandatory Instruction: Both actions must be performed using 'and'. (e.g., Wear safety gear and check power status)
4. Ensure logical consistency across state transitions between consecutive steps.

**CRITICAL OUTPUT FORMAT - STRICTLY FOLLOW THIS FORMAT:**

#### Stepwise Instructions with Classification

1. [Action description]
   Required state: [Object states before step]
   Resulting state: [Object states after step]
   Type: [Instruction Type]
   Dependencies: [Step numbers or "none"]
   Consistency: [Yes/No/N/A]

2. [Action description]
   Required state: [Object states before step]
   Resulting state: [Object states after step]
   Type: [Instruction Type]
   Dependencies: [Step numbers or "none"]
   Consistency: [Yes/No/N/A]

#### Dependency Table

| Step | Depends On | Objects Involved | Classification | Consistency Condition Satisfied? |
|------|------------|------------------|----------------|----------------------------------|
| 1 | None | [Objects] | Simple Instruction | N/A |
| 2 | 1 | [Objects] | Instruction in Sequence | Yes |

#### Final Sequenced Plan

1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

Generate 5 to 8 steps total. Strictly output your answer using the exact section headers and markdown formats shown above.`;
};

const generateWithGroq = async (
	description: string,
	actions: string,
	objects: string
): Promise<string> => {
	let lastError: Error | null = null;

	for (const key of GROQ_KEYS) {
		try {
			const response = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${key}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "qwen/qwen3.8-27b",
						messages: [
							{
								role: "system",
								content:
									"You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.",
							},
							{
								role: "user",
								content: createPrompt(description, actions, objects),
							},
						],
						max_tokens: 1500,
						temperature: 0.7,
					}),
				}
			);

			if (response.status === 429) {
				console.warn(
					`Groq 429 Rate Limit with key ending in ...${key.slice(-6)}. Trying fallback key...`
				);
				continue;
			}

			if (!response.ok) {
				throw new Error(
					`Groq API error: ${response.status} ${response.statusText}`
				);
			}

			const data: GroqResponse = await response.json();

			if (!data.choices || data.choices.length === 0) {
				throw new Error("No response from Groq API");
			}

			return data.choices[0].message.content.trim();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
		}
	}

	throw lastError || new Error("Failed to generate instructions with Groq");
};

const generateWithGemini = async (
	description: string,
	actions: string,
	objects: string
): Promise<string> => {
	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEYS.gemini}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{
								text: `You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.

${createPrompt(description, actions, objects)}`,
							},
						],
					},
				],
				generationConfig: {
					temperature: 0.7,
					maxOutputTokens: 1500,
				},
			}),
		}
	);

	if (!response.ok) {
		throw new Error(
			`Gemini API error: ${response.status} ${response.statusText}`
		);
	}

	const data: GeminiResponse = await response.json();

	if (
		!data.candidates ||
		data.candidates.length === 0 ||
		!data.candidates[0].content.parts[0]
	) {
		throw new Error("No response from Gemini API");
	}

	return data.candidates[0].content.parts[0].text.trim();
};

const generateWithMistral = async (
	description: string,
	actions: string,
	objects: string
): Promise<string> => {
	const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEYS.mistral}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "mistral-large-latest",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.",
				},
				{
					role: "user",
					content: createPrompt(description, actions, objects),
				},
			],
			max_tokens: 1500,
			temperature: 0.7,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`Mistral API error: ${response.status} ${response.statusText}`
		);
	}

	const data: MistralResponse = await response.json();

	if (!data.choices || data.choices.length === 0) {
		throw new Error("No response from Mistral API");
	}

	return data.choices[0].message.content.trim();
};

const generateWithTogether = async (
	description: string,
	actions: string,
	objects: string
): Promise<string> => {
	const response = await fetch("https://api.together.xyz/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEYS.together}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "meta-llama/Llama-3-8b-chat-hf",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.",
				},
				{
					role: "user",
					content: createPrompt(description, actions, objects),
				},
			],
			max_tokens: 1500,
			temperature: 0.7,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`Together AI error: ${response.status} ${response.statusText}`
		);
	}

	const data: TogetherResponse = await response.json();

	if (!data.choices || data.choices.length === 0) {
		throw new Error("No response from Together AI");
	}

	return data.choices[0].message.content.trim();
};

const generateWithDeepSeek = async (
	description: string,
	actions: string,
	objects: string
): Promise<string> => {
	const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEYS.deepseek}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "deepseek-chat",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.",
				},
				{
					role: "user",
					content: createPrompt(description, actions, objects),
				},
			],
			max_tokens: 1500,
			temperature: 0.7,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`DeepSeek API error: ${response.status} ${response.statusText}`
		);
	}

	const data: DeepSeekResponse = await response.json();

	if (!data.choices || data.choices.length === 0) {
		throw new Error("No response from DeepSeek API");
	}

	return data.choices[0].message.content.trim();
};

export const generateDurationEstimate = async (
	description: string,
	actions: string,
	objects: string
): Promise<string> => {
	const prompt = `Based on the following task information, provide an estimated duration for completing this task:

Description: ${description}
Actions: ${actions}
Objects: ${objects}

Please provide a realistic time estimate in a clear, concise format. Consider:
- Complexity of the task
- Number of steps involved
- Skill level required
- Tools or equipment needed

Respond with just the time estimate (e.g., "5-10 minutes", "2-3 hours", "30-45 minutes").`;

	let lastError: Error | null = null;

	for (const key of GROQ_KEYS) {
		try {
			const response = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${key}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "qwen/qwen3.8-27b",
						messages: [
							{
								role: "system",
								content:
									"You are a helpful assistant that provides accurate time estimates for tasks. Always respond with just the time estimate in a clear format.",
							},
							{
								role: "user",
								content: prompt,
							},
						],
						max_tokens: 100,
						temperature: 0.3,
					}),
				}
			);

			if (response.status === 429) {
				console.warn(
					`Groq 429 Rate Limit in duration estimate with key ending in ...${key.slice(-6)}. Trying fallback key...`
				);
				continue;
			}

			if (!response.ok) {
				throw new Error(
					`Groq API error: ${response.status} ${response.statusText}`
				);
			}

			const data: GroqResponse = await response.json();

			if (!data.choices || data.choices.length === 0) {
				throw new Error("No response from Groq API");
			}

			return data.choices[0].message.content.trim();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
		}
	}

	console.error("Error generating duration estimate:", lastError);
	throw new Error(
		lastError instanceof Error
			? `Failed to generate duration estimate: ${lastError.message}`
			: "Failed to generate duration estimate"
	);
};

export const generateInstructions = async (
	description: string,
	actions: string,
	objects: string,
	provider: AIProvider = "groq"
): Promise<string> => {
	try {
		switch (provider) {
			case "groq":
				return await generateWithGroq(description, actions, objects);
			case "gemini":
				return await generateWithGemini(description, actions, objects);
			case "mistral":
				return await generateWithMistral(description, actions, objects);
			case "together":
				return await generateWithTogether(description, actions, objects);
			case "deepseek":
				return await generateWithDeepSeek(description, actions, objects);
			default:
				throw new Error(`Unsupported AI provider: ${provider}`);
		}
	} catch (error) {
		console.error(`Error generating instructions with ${provider}:`, error);
		throw new Error(
			error instanceof Error
				? `Failed to generate instructions using ${provider}: ${error.message}`
				: `Failed to generate instructions using ${provider}`
		);
	}
};

export const AI_PROVIDERS = [
	{
		id: "groq" as AIProvider,
		name: "Groq",
		description: "Fast inference with Llama 3",
	},
	{
		id: "gemini" as AIProvider,
		name: "Gemini 1.5",
		description: "Google's advanced AI model",
	},
	{
		id: "mistral" as AIProvider,
		name: "Mistral",
		description: "European AI with strong reasoning",
	},
	{
		id: "together" as AIProvider,
		name: "Together AI",
		description: "Open-source models at scale",
	},
	{
		id: "deepseek" as AIProvider,
		name: "DeepSeek",
		description: "Advanced reasoning capabilities",
	},
];
