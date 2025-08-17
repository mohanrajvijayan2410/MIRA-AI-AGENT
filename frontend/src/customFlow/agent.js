import Groq from "groq-sdk";
import run from "../config/gemini";
const groq = new Groq({ 
  apiKey: "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",
  dangerouslyAllowBrowser: true 
});

import { buildPrompt } from "./prompt_builder";

export const generateInstructions = async (taskDescription) => {
  try {
    const built_prompt = buildPrompt(taskDescription);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: built_prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });
    const agent_response = run(built_prompt);
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
        type: "Simple Instruction"
      },
      {
        instruction: "Heat the water in a kettle then add coffee",
        type: "Sequential Instruction"
      },
      {
        instruction: "Pour the hot water over coffee grounds to extract flavor",
        type: "Instruction with Purpose"
      }
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
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: dependencyPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const raw = chatCompletion.choices[0]?.message?.content || "";
    // extract the JSON array
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error generating dependency table:", error);
    // Fallback sample
    return [
      {
        step: 1,
        dependsOn: [],
        objectsInvolved: ["rice"],
        classification: "Simple Instruction",
        consistency: "—"
      },
      {
        step: 4,
        dependsOn: [1],
        objectsInvolved: ["rice", "pot"],
        classification: "Instruction in Sequence",
        consistency: "Yes"
      }
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

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    

    // Clean the response to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const response = JSON.parse(jsonMatch[0]);
      response.dependencies = await generateDependencyTable(response.instructions);
      return response;
    }
    
    const response_obj = JSON.parse(response);
    response_obj.dependencies = await generateDependencyTable(response_obj.instructions);
    return response_obj;

  } catch (error) {
    console.error("Error finalizing instructions:", error);
    
    // Return sample results as fallback
    return {
      instructions: instructions,
      metrics: {
        averageProgressScore: "1.5 score",
        completionSpeed: "3 score/min",
        taskCompletionRate: "50%",
        averageCompletionTime: "1 min"
      },
      actions: ["Take", "Heat", "Pour", "Add"],
      objects: ["Water", "Coffee", "Cup", "Kettle"]
    };
  }
};