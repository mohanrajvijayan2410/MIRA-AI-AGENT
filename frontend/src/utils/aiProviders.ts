import { 
  GroqResponse, 
  GeminiResponse, 
  MistralResponse, 
  TogetherResponse, 
  DeepSeekResponse,
  AIProvider 
} from '../types';

// API Keys
const API_KEYS = {
  groq: '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',
  gemini: 'AIzaSyABTtAIlSwvPo_TRTRSV7hYmDUHT-AB0Io',
  mistral: 'uZBbj7146rvEdme8NrxLunXOLuNiSep8',
  together: 'tgp_v1_o2_1f2GiAh1hRU4QzCOVgMeneExwQCSOHArnTR8Lq-g',
  deepseek: 'sk-6cdeb51f10a4493fa0612737a836e233'
};

const createPrompt = (description: string, actions: string, objects: string): string => {
  return `Based on the following information, generate clean and concise step-by-step instructions on how to accomplish the task:

Description: ${description}
Actions: ${actions}
Objects: ${objects}

Use the following MIRA protocol.

**MIRA Protocol:**  
- Each instruction must specify action and object(s).
- For each instruction, state the required and resulting object states.
- Classify each instruction as: Simple Instruction, Instruction with Goal, Instruction with Reason, Instruction in Sequence, Exclusive Instruction, or Mandatory Instruction as per the following rules
**RULES**
 1. SIMPLE INSTRUCTION:
    - Generate one action per instruction.
    - Instructions can include one or more objects.
    - Examples:
      • Take pens → TYPE: SIMPLE INSTRUCTION
      • Take pens using hand → TYPE: SIMPLE INSTRUCTION

    2. INSTRUCTION WITH PURPOSE:
    - Include a goal or intention behind the action.
    - Examples:
      • Take pen if you want to write
      • Take pen if you have the intention of writing
      → TYPE: INSTRUCTION WITH PURPOSE

    3. EXCLUSIVE INSTRUCTION (OBJECTS):
    - Multiple objects given, only one to be chosen.
    - Example:
      • Take pen or pencil
      → TYPE: EXCLUSIVE INSTRUCTION

    4. EXCLUSIVE INSTRUCTION (ACTIONS):
    - Use 'or' between alternative actions.
    - Example:
      • Go by walk or take a car to reach destination
      → TYPE: EXCLUSIVE INSTRUCTION

      5. INSTRUCTION WITH SEQUENCE:
    - If two actions must be performed in order or sequence, use “then”.
    - Do NOT use “and”.
    - Example:
      • Take pen then write
      . Go left then right
      . Eat food then drink water
      → TYPE: INSTRUCTION WITH SEQUENCE

    6. MANDATORY INSTRUCTION:
    - Both actions must be performed, order does not matter.
    - Examples:
      • Take pen and paper 
      • Write test and be calm 
      . Add noodles and pick up tomato
      → TYPE: MANDATORY INSTRUCTION

- For every pair of dependent instructions (i_j, i_{j+1}), ensure there exists at least one object o^* such that o^* ∈ O_j ∩ O_{j+1} and s_j(o^*) = s_{j+1}^{req}(o^*). If not, revise the sequence.
- Map and explain dependencies between instructions, referencing objects and their states.
- Present a dependency table or graph.
- Output the final sequenced plan as an ordered list.
- If actions can be performed in parallel or iteratively, indicate this clearly and optimize for efficiency.
**Additionally, choose and apply one of the following sequencing methods as appropriate:**

- **Sequential Completion Method:**  
  For each object, perform the full sequence of actions before moving to the next object.  
  For each object (e.g., shirt1, towel2), perform the entire sequence of required actions from start to finish before moving to the next object. This method mimics real-world scenarios where objects are processed one-by-one to completion.
  Object Processing Order:
  shirt1 → shirt2 → shirt3 → shirt4 → shirt5 → towel1 → towel2 → towel3 → towel4 → towel5

  *Formula:*  
  \\[
  (a_1, o_j) \\rightarrow_i (a_2, o_j) \\rightarrow_i \\ldots \\rightarrow_i (a_n, o_j)
  \\]  
  *Example:* wash cup1 → scrub cup1 → rinse cup1; then repeat for cup2, cup3, etc.

- **Step-by-Step Parallel (Iterative) Method:**  
  For each action, perform it on all objects before moving to the next action.
  *Formula:*  
  \\[
  (a_k, o_1) \\rightarrow_i (a_k, o_2) \\rightarrow_i \\ldots \\rightarrow_i (a_k, o_N)
  \\]  
  *Example:* wash cup1, wash cup2, wash cup3; then scrub cup1, scrub cup2, scrub cup3; etc.

If you encounter any sequence that violates the consistency or dependency condition, explicitly state the issue and provide a corrected sequence.

**CRITICAL OUTPUT FORMAT - FOLLOW EXACTLY:**

#### Stepwise Instructions with Classification

1. [action description]
   Required state: [object states needed]
   Resulting state: [object states after action]
   Type: [instruction type]
   Dependencies: [step numbers or "none"]
   Consistency: [Yes/No/N/A]

2. [action description]
   Required state: [object states needed]
   Resulting state: [object states after action]
   Type: [instruction type]
   Dependencies: [step numbers or "none"]
   Consistency: [Yes/No/N/A]

[Continue for all steps...]

#### Dependency Table

| Step | Depends On | Objects Involved | Classification              | Consistency Condition Satisfied? |
|------|------------|------------------|-----------------------------|-------------------------------|
| 1    | —          | [objects]        | [type]                      | —                             |
| 2    | [steps]    | [objects]        | [type]                      | [Yes/No]                      |
| 3    | [steps]    | [objects]        | [type]                      | [Yes/No]                      |

#### Final Sequenced Plan

1. [step description]
2. [step description]
3. [step description]
[Continue for all steps...]

**Example**
#### Stepwise Instructions with Classification

description used - Make a dish of beef fried rice, which consists of cooked rice and fried beef.

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
   Type: Simple instruction
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

#### Dependency Table

| Step | Depends On | Objects Involved | Classification              | Consistency Condition Satisfied? |
|------|------------|------------------|-----------------------------|-------------------------------|
| 1    | —          | rice             | Simple Instruction          | —                             |
| 2    | 1          | rice, pot        | Instruction in Sequence     | Yes                           |
| 3    | 2          | rice, dish       | Instruction in Sequence     | Yes                           |

#### Final Sequenced Plan

1. pick rice
2. cook rice in pot
3. add rice to dish
...
- If actions can be performed in parallel or iteratively, indicate this clearly and optimize for efficiency.

**Output your answer in the format shown above.**

Generate 5 to 8 steps total. Make step with descriptions clear and actionable while following the exact format shown in the example.`;
};

const generateWithGroq = async (description: string, actions: string, objects: string): Promise<string> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.groq}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.'
        },
        {
          role: 'user',
          content: createPrompt(description, actions, objects)
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }

  const data: GroqResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Groq API');
  }

  return data.choices[0].message.content.trim();
};

const generateWithGemini = async (description: string, actions: string, objects: string): Promise<string> => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEYS.gemini}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.

${createPrompt(description, actions, objects)}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0]) {
    throw new Error('No response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text.trim();
};

const generateWithMistral = async (description: string, actions: string, objects: string): Promise<string> => {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.mistral}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.'
        },
        {
          role: 'user',
          content: createPrompt(description, actions, objects)
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
  }

  const data: MistralResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Mistral API');
  }

  return data.choices[0].message.content.trim();
};

const generateWithTogether = async (description: string, actions: string, objects: string): Promise<string> => {
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.together}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-8b-chat-hf',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.'
        },
        {
          role: 'user',
          content: createPrompt(description, actions, objects)
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Together AI error: ${response.status} ${response.statusText}`);
  }

  const data: TogetherResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Together AI');
  }

  return data.choices[0].message.content.trim();
};

const generateWithDeepSeek = async (description: string, actions: string, objects: string): Promise<string> => {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.deepseek}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, step-by-step instructions for tasks following the MIRA protocol. Always follow the exact formatting requirements provided by the user. Generate detailed, structured instructions with proper classification and dependency analysis.'
        },
        {
          role: 'user',
          content: createPrompt(description, actions, objects)
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data: DeepSeekResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from DeepSeek API');
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

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.groq}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate time estimates for tasks. Always respond with just the time estimate in a clear format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Groq API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating duration estimate:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to generate duration estimate: ${error.message}`
        : 'Failed to generate duration estimate'
    );
  }
};

export const generateInstructions = async (
  description: string,
  actions: string,
  objects: string,
  provider: AIProvider = 'groq'
): Promise<string> => {
  try {
    switch (provider) {
      case 'groq':
        return await generateWithGroq(description, actions, objects);
      case 'gemini':
        return await generateWithGemini(description, actions, objects);
      case 'mistral':
        return await generateWithMistral(description, actions, objects);
      case 'together':
        return await generateWithTogether(description, actions, objects);
      case 'deepseek':
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
    id: 'groq' as AIProvider,
    name: 'Groq',
    description: 'Fast inference with Llama 3'
  },
  {
    id: 'gemini' as AIProvider,
    name: 'Gemini 1.5',
    description: 'Google\'s advanced AI model'
  },
  {
    id: 'mistral' as AIProvider,
    name: 'Mistral',
    description: 'European AI with strong reasoning'
  },
  {
    id: 'together' as AIProvider,
    name: 'Together AI',
    description: 'Open-source models at scale'
  },
  {
    id: 'deepseek' as AIProvider,
    name: 'DeepSeek',
    description: 'Advanced reasoning capabilities'
  }
];
