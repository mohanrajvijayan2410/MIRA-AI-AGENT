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
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(response);
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