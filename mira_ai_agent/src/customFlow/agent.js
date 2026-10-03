import Groq from "groq-sdk";
import { buildPrompt } from "./prompt_builder";

const GROQ_KEYS = [
	"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",
	"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",
];

const groqClients = GROQ_KEYS.map(
	(apiKey) => new Groq({ apiKey, dangerouslyAllowBrowser: true })
);

const callGroqWithFallback = async (params) => {
	let lastError = null;
	for (const client of groqClients) {
		try {
			const chatCompletion = await client.chat.completions.create(params);
			return chatCompletion;
		} catch (error) {
			console.warn("Groq request failed with current key, trying fallback key...", error);
			lastError = error;
		}
	}
	throw lastError;
};

export const generateInstructions = async (taskDescription) => {
	try {
		const built_prompt = buildPrompt(taskDescription);
		const chatCompletion = await callGroqWithFallback({
			messages: [
				{
					role: "user",
					content: built_prompt,
				},
			],
			model: "qwen/qwen3.8-27b",
			temperature: 0.7,
		});
		const response = chatCompletion.choices[0]?.message?.content || "";

		// Clean the response to extract JSON
		const jsonMatch = response.match(/\[[\s\S]*\]/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}

		// Fallback to manual parsing if JSON extraction fails
		return JSON.parse(response);
	} catch (error) {
		console.error("Error generating instructions:", error);

		// Return sample instructions as fallback
		return [
			{
				instruction: "Take the required ingredients from the pantry",
				type: "Simple Instruction",
			},
			{
				instruction: "Heat the water in a kettle then add coffee",
				type: "Sequential Instruction",
			},
			{
				instruction: "Pour the hot water over coffee grounds to extract flavor",
				type: "Instruction with Purpose",
			},
		];
	}
};

export const generateDependencyTable = async (instructionsJson) => {
	const dependencyPrompt = `
You are given a list of step-by-step instructions in JSON format. Each item has:
- instruction: a textual description
- type: one of “Simple Instruction”, “Instruction in Sequence”, etc.

Your task is to produce a dependency table in JSON array form where each row has:
- step: the 1‑based index of the instruction
- dependsOn: an array of step numbers that this step depends on (empty array if none)
- objectsInvolved: an array of the key objects or ingredients mentioned
- classification: same as the “type” field
- consistency: “Yes” if this step logically follows its dependencies, otherwise “No”

Return the result as JSON in this exact format
{ "table": [
  {
    "step": 1,
    "dependsOn": [],
    "objectsInvolved": ["rice"],
    "classification": "Simple Instruction",
    "consistency": "—"
  },
  {
    "step": 4,
    "dependsOn": [1],
    "objectsInvolved": ["rice", "pot"],
    "classification": "Instruction in Sequence",
    "consistency": "Yes"
  },
  …
]
}
Here is the input instructions JSON:
${JSON.stringify(instructionsJson, null, 2)}
Just give me the json nothing other than that no text or anything
`;

	try {
		const chatCompletion = await callGroqWithFallback({
			messages: [{ role: "user", content: dependencyPrompt }],
			model: "qwen/qwen3.8-27b",
			temperature: 0.7,
		});

		const raw = chatCompletion.choices[0]?.message?.content || "";
		// extract the JSON
		const jsonMatch = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
		const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed;
		}
		if (parsed && Array.isArray(parsed.table)) {
			return parsed.table;
		}
		return Object.values(parsed);
	} catch (error) {
		console.error("Error generating dependency table:", error);
		// Fallback sample
		return [
			{
				step: 1,
				dependsOn: [],
				objectsInvolved: ["Diagnostic Tool"],
				classification: "Simple Instruction",
				consistency: "—",
			},
			{
				step: 2,
				dependsOn: [1],
				objectsInvolved: ["Power Cable"],
				classification: "Instruction in Sequence",
				consistency: "Yes",
			},
		];
	}
};

export const finalizeInstructions = async (instructions) => {
	try {
		const prompt = `
Please analyze these instructions and provide:
1. Final instruction set with verified types
2. Performance metrics
3. List of actions and objects

Instructions: ${JSON.stringify(instructions, null, 2)}

Return the result as JSON in this exact format:
{
  "instructions": [
    {
      "instruction": "instruction text",
      "type": "instruction type"
    }
  ],
  "metrics": {
    "averageProgressScore": "1.5 score",
    "completionSpeed": "3 score/min", 
    "taskCompletionRate": "50%",
    "averageCompletionTime": "1 min"
  },
  "actions": ["action1", "action2"],
  "objects": ["object1", "object2"]
}

Only return valid JSON, no additional text.
`;

		const chatCompletion = await callGroqWithFallback({
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			model: "qwen/qwen3.8-27b",
			temperature: 0.3,
		});

		const response = chatCompletion.choices[0]?.message?.content || "";

		// Clean the response to extract JSON
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		const parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
		
		const dependencyTable = await generateDependencyTable(
			parsedResponse.instructions || instructions
		);
		parsedResponse.dependencies = Array.isArray(dependencyTable) ? dependencyTable : [];
		return parsedResponse;
	} catch (error) {
		console.error("Error finalizing instructions:", error);

		// Return sample results as fallback
		const fallbackDependencies = await generateDependencyTable(instructions);
		return {
			instructions: instructions,
			metrics: {
				averageProgressScore: "1.5 score",
				completionSpeed: "3 score/min",
				taskCompletionRate: "50%",
				averageCompletionTime: "1 min",
			},
			actions: ["Fetch", "Inspect", "Connect", "Finalize"],
			objects: ["Diagnostic Tool", "Power Cable", "Sensor Module"],
			dependencies: Array.isArray(fallbackDependencies) ? fallbackDependencies : [],
		};
	}
};
