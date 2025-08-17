import { SequencingMethod } from '../types';

export const createPrompt = (task: string, method: SequencingMethod): string => {
  const methodDescription = method === 'sequential' 
    ? 'Sequential Completion Method: Complete each object\'s full process before starting the next object.'
    : 'Step-by-Step Parallel Method: Group all similar actions together (e.g., gather all items first, then process all items in parallel steps).';

  return `
You are a task planning specialist. I need you to break down the following task into a structured, step-by-step plan using the ${methodDescription}

Task: "${task}"

**CRITICAL REQUIREMENT: Generate EXACTLY 6-7 steps only. Do not exceed 7 steps under any circumstances. If the task seems complex, consolidate related actions into single steps.**

Please provide a detailed execution plan following this exact format:

TASK BREAKDOWN AND EXECUTION PLAN
=====================================

**Task**: ${task}
**Method**: ${method === 'sequential' ? 'Sequential Completion Method' : 'Step-by-Step Parallel Method'}
**Generated**: ${new Date().toLocaleString()}

EXECUTION STEPS:
---------------

Step 1:
- Required State: [What conditions must be met before this step]
- Instruction: [Clear, actionable instruction]
- Instruction Type: [Simple Instruction/Instruction with Purpose/Conditional Instruction]
- Resulting State: [What will be achieved after this step]
- Dependencies: None (or Step X, Y, Z)

Step 2:
- Required State: [What conditions must be met before this step]
- Instruction: [Clear, actionable instruction]
- Instruction Type: [Simple Instruction/Instruction with Purpose/Conditional Instruction]
- Resulting State: [What will be achieved after this step]
- Dependencies: Step 1 (or relevant step numbers)

[Continue for exactly 6-7 steps total...]

DEPENDENCY TABLE:
----------------
| Step | Depends On |  Objects             |
|------|------------|-------------------------|
| 1    | None       | Clothes, utensils, etc. |                    
| 2    | Step 3     | object 1, object 2, etc.|                   
| 3    | Step 1     | object 1, object 2, etc.| 
[Continue for exactly 6-7 steps total...]

EXECUTION SUMMARY:
-----------------
- Total Steps: [Must be 6 or 7]
- Estimated Time: [Your estimate]
- Critical Path: [Steps that cannot be parallelized]
- Parallel Opportunities: [Steps that can run simultaneously if applicable]

**IMPORTANT CONSTRAINTS:**
- Generate EXACTLY 6-7 steps (no more, no less)
- If the task requires more steps, combine related actions
- If the task requires fewer steps, add preparation or cleanup steps
- Each step should be substantial and meaningful
- Maintain logical flow and dependencies

Please ensure each step is:
1. Clear and actionable
2. Properly sequenced based on the chosen method
3. Includes all necessary state transitions
4. Accounts for dependencies between steps
5. **LIMITED TO EXACTLY 6-7 STEPS TOTAL**

Generate the complete plan with exactly 6-7 steps now.
`;
};