export interface SequentialMethodResponse {
	task: string;
	method: string;
	generated: string;
	steps: Array<{
		number: number;
		requiredState: string;
		instruction: string;
		instructionType: string;
		resultingState: string;
		dependencies: string;
	}>;
	totalSteps: number;
	estimatedTime: string;
	criticalPath: string;
	parallelOpportunities: string;
}

export interface ParallelMethodResponse {
	task: string;
	method: string;
	generated: string;
	steps: Array<{
		number: number;
		requiredState: string;
		instruction: string;
		instructionType: string;
		resultingState: string;
		dependencies: string;
	}>;
	totalSteps: number;
	estimatedTime: string;
	criticalPath: string;
	parallelOpportunities: string;
}

export interface ComparisonResponse {
	sequential: string;
	parallel: string;
}

export class IterativeService {
	private apiKey = "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";

	async callSequentialMethod(task: string): Promise<SequentialMethodResponse> {
		const prompt = `You are a task planning specialist. I need you to break down the following task into a structured, step-by-step plan using the Sequential Completion Method.

**Sequential Completion Method**: Complete each object's full process before starting the next object. For each object (e.g., shirt1, towel2), perform the entire sequence of required actions from start to finish before moving to the next object. This method mimics real-world scenarios where objects are processed one-by-one to completion.

Object Processing Order: object1 → object2 → object3 → object4 → object5
Task: "${task}"

**CRITICAL REQUIREMENT: Generate EXACTLY 5-6 steps only. Do not exceed 7 steps under any circumstances.**


You should strictly follow this output format you should strictly follow this order
The response should be exactly like this.. and should be strictly followed You should just give me this html content and nothing other than this.. 

<div class="p-4 text-gray-800 font-sans space-y-6">

  <h2 class="text-2xl font-bold text-blue-700">🧠 Task: Wash and Hang 5 Shirts and 5 Towels</h2>
  <p><strong>Sequencing Method:</strong> Sequential Completion Method<br>
  Each item (shirt1 to towel5) is fully processed before moving to the next.</p>

  <h3 class="text-xl font-semibold text-green-700">✅ Sample Instructions for shirt1</h3>
  <ol class="list-decimal list-inside space-y-1">
    <li><strong>gather shirt1</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: shirt1 is uncollected → Resulting state: shirt1 is gathered<br>Type: Simple Instruction<br>Dependencies: None</span>
    </li>
    <li><strong>gather detergent</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: detergent is available → Resulting state: detergent is gathered<br>Type: Simple Instruction<br>Dependencies: None</span>
    </li>
    <li><strong>place shirt1 and detergent in washing</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: shirt1 and detergent → Resulting state: shirt1 and detergent<br>Type: Mandatory Instruction<br>Dependencies: Steps 1, 2</span>
    </li>
    <li><strong>activate washing machine to wash shirt1</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: shirt1 and detergent → Resulting state: shirt1 is washed<br>Type: Instruction with Purpose<br>Dependencies: Step 3</span>
    </li>
    <li><strong>gather washed shirt1</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: shirt1 is washed → Resulting state: washed shirt1 is gathered<br>Type: Simple Instruction<br>Dependencies: Step 4</span>
    </li>
    <li><strong>hang shirt1</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: washed shirt1 is gathered → Resulting state: shirt1 is hanging<br>Type: Simple Instruction<br>Dependencies: Step 5</span>
    </li>
  </ol>

  <p class="italic text-gray-500">🔁 Repeat steps 1–6 for:<br>
  shirt2 → shirt3 → shirt4 → shirt5 → towel1 → towel2 → towel3 → towel4 → towel5</p>

  <h3 class="text-xl font-semibold text-indigo-700">✅ Final Sequenced Plan (with Purpose Made Explicit)</h3>

  <h4 class="text-lg font-medium text-gray-800">🧥 Shirts</h4>
  <ol class="list-decimal list-inside space-y-1">
    <li>gather shirt1</li>
    <li>gather detergent</li>
    <li>place shirt1 and detergent in washing machine</li>
    <li>activate washing machine to wash shirt1</li>
    <li>gather washed shirt1</li>
    <li>hang shirt1</li>
    <li>gather shirt2</li>
    <li>gather detergent</li>
    <li>place shirt2 and detergent in washing machine</li>
    <li>activate washing machine to wash shirt2</li>
    <li>gather washed shirt2</li>
    <li>hang shirt2</li>
    <!-- Continue similarly through shirt5 -->
  </ol>

  <h4 class="text-lg font-medium text-gray-800 mt-4">🧻 Towels</h4>
  <ol start="31" class="list-decimal list-inside space-y-1">
    <li>gather towel1</li>
    <li>gather detergent</li>
    <li>place towel1 and detergent in washing machine</li>
    <li>activate washing machine to wash towel1</li>
    <li>gather washed towel1</li>
    <li>hang towel1</li>
    <!-- Continue to towel5 -->
  </ol>

  <h3 class="text-xl font-semibold text-purple-700 mt-6">🔗 Dependency Table (Excerpt)</h3>
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 text-left">Step</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Depends On</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Objects</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Classification</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Consistency</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-gray-300 px-4 py-1">1</td>
          <td class="border border-gray-300 px-4 py-1">—</td>
          <td class="border border-gray-300 px-4 py-1">shirt1</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">—</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border border-gray-300 px-4 py-1">2</td>
          <td class="border border-gray-300 px-4 py-1">—</td>
          <td class="border border-gray-300 px-4 py-1">detergent</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">—</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-1">3</td>
          <td class="border border-gray-300 px-4 py-1">1, 2</td>
          <td class="border border-gray-300 px-4 py-1">shirt1, detergent</td>
          <td class="border border-gray-300 px-4 py-1">Mandatory Instruction</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border border-gray-300 px-4 py-1">4</td>
          <td class="border border-gray-300 px-4 py-1">3</td>
          <td class="border border-gray-300 px-4 py-1">shirt1</td>
          <td class="border border-gray-300 px-4 py-1">Instruction with Purpose</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-1">5</td>
          <td class="border border-gray-300 px-4 py-1">4</td>
          <td class="border border-gray-300 px-4 py-1">shirt1</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border border-gray-300 px-4 py-1">6</td>
          <td class="border border-gray-300 px-4 py-1">5</td>
          <td class="border border-gray-300 px-4 py-1">shirt1</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


The table also should be generated like this and should be strictly followed.
`;

		return this.makeApiCall(prompt);
	}

	async callParallelMethod(task: string): Promise<ParallelMethodResponse> {
		const prompt = `You are a task planning specialist. I need you to break down the following task into a structured, step-by-step plan using the Step-by-Step Parallel Method.

**Step-by-Step Parallel Method**: Group all similar actions together (e.g., gather all items first, then process all items in parallel steps). For each action, perform it on all objects before moving to the next action.

Action Processing Order: Action1 on all objects → Action2 on all objects → Action3 on all objects

Task: "${task}"
 
The format should be strictly of this format, the response should be strictly following this format.
<div class="p-6 bg-white text-gray-800 font-sans space-y-8">

  <!-- Definition -->
  <p class="text-sm italic text-gray-600">
    Definition: Perform each action across all objects. Purpose‐Driven Instructions now clearly state the intent.
  </p>

  <!-- Stages Header -->
  <h2 class="text-2xl font-bold text-blue-700">🔁 Stages of Execution (Grouped by Stage)</h2>

  <!-- Stage A -->
  <div>
    <h3 class="text-xl font-semibold text-green-700 mb-2">Stage A: Gather All Clothes</h3>
    <ol class="list-decimal list-inside space-y-1">
      <li>gather shirt1 <span class="text-sm text-gray-600">→ Simple Instruction</span></li>
      <li>gather shirt2</li>
      <li>gather shirt3</li>
      <li>gather shirt4</li>
      <li>gather shirt5</li>
      <li>gather towel1</li>
      <li>gather towel2</li>
      <li>gather towel3</li>
      <li>gather towel4</li>
      <li>gather towel5</li>
    </ol>
  </div>

  <!-- Stage B -->
  <div>
    <h3 class="text-xl font-semibold text-yellow-700 mb-2">Stage B: Gather Detergent</h3>
    <p class="ml-4">
      11. gather detergent<br>
      <span class="text-sm text-gray-600">Shared across all wash operations → Simple Instruction</span>
    </p>
  </div>

  <!-- Stage C -->
  <div>
    <h3 class="text-xl font-semibold text-red-700 mb-2">Stage C: Place Items and Wash Them Individually</h3>
    <p class="ml-4 mb-4 text-gray-700">
      Each item is placed with detergent into the washing machine, activated for its own wash cycle, then gathered and hung.
    </p>

    <!-- Shirts Table -->
    <h4 class="text-lg font-medium text-gray-800 mb-1">🧥 Shirts</h4>
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border border-gray-300 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">Item</th>
            <th class="border px-4 py-2 text-left">Steps</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-4 py-1">shirt1</td>
            <td class="border px-4 py-1">
              12. place shirt1 and detergent in washing machine<br>
              <span class="font-semibold">13. activate washing machine to wash shirt1</span><br>
              14. gather washed shirt1<br>
              15. hang shirt1
            </td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">shirt2</td>
            <td class="border px-4 py-1">16–19</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">shirt3</td>
            <td class="border px-4 py-1">20–23</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">shirt4</td>
            <td class="border px-4 py-1">24–27</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">shirt5</td>
            <td class="border px-4 py-1">28–31</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Towels Table -->
    <h4 class="text-lg font-medium text-gray-800 mt-6 mb-1">🧻 Towels</h4>
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border border-gray-300 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">Item</th>
            <th class="border px-4 py-2 text-left">Steps</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-4 py-1">towel1</td>
            <td class="border px-4 py-1">
              32. place towel1 and detergent in washing machine<br>
              <span class="font-semibold">33. activate washing machine to wash towel1</span><br>
              34. gather washed towel1<br>
              35. hang towel1
            </td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">towel2</td>
            <td class="border px-4 py-1">36–39</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">towel3</td>
            <td class="border px-4 py-1">40–43</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">towel4</td>
            <td class="border px-4 py-1">44–47</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">towel5</td>
            <td class="border px-4 py-1">48–51</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Final Sequenced Plan -->
  <div>
    <h3 class="text-xl font-semibold text-indigo-700 mb-2">✅ Final Sequenced Plan</h3>
    <p class="ml-4 space-y-1 text-gray-700">
      <span>[Gathering Phase] 1–10: gather all clothes</span><br>
      <span>11: gather detergent</span><br>
      <span>[Washing &amp; Hanging Phase]</span><br>
      <span>12. place shirt1 and detergent in washing machine</span><br>
      <span>13. activate washing machine to wash shirt1</span><br>
      <span>14. gather washed shirt1</span><br>
      <span>15. hang shirt1</span><br>
      <span>16–19: shirt2</span><br>
      <span>20–23: shirt3</span><br>
      <span>24–27: shirt4</span><br>
      <span>28–31: shirt5</span><br>
      <span>32–35: towel1</span><br>
      <span>36–39: towel2</span><br>
      <span>40–43: towel3</span><br>
      <span>44–47: towel4</span><br>
      <span>48–51: towel5</span>
    </p>
  </div>

  <!-- Dependency Table Excerpt -->
  <div>
    <h3 class="text-xl font-semibold text-purple-700 mb-2">🔗 Dependency Table (Excerpt)</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border border-gray-300 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2 text-left">Step</th>
            <th class="border px-4 py-2 text-left">Depends On</th>
            <th class="border px-4 py-2 text-left">Objects</th>
            <th class="border px-4 py-2 text-left">Classification</th>
            <th class="border px-4 py-2 text-left">Consistency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-4 py-1">1</td>
            <td class="border px-4 py-1">—</td>
            <td class="border px-4 py-1">shirt1</td>
            <td class="border px-4 py-1">Simple Instruction</td>
            <td class="border px-4 py-1">—</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">11</td>
            <td class="border px-4 py-1">—</td>
            <td class="border px-4 py-1">detergent</td>
            <td class="border px-4 py-1">Simple Instruction</td>
            <td class="border px-4 py-1">—</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">12</td>
            <td class="border px-4 py-1">1, 11</td>
            <td class="border px-4 py-1">shirt1, detergent</td>
            <td class="border px-4 py-1">Mandatory Instruction</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">13</td>
            <td class="border px-4 py-1">12</td>
            <td class="border px-4 py-1">shirt1</td>
            <td class="border px-4 py-1">Instruction with Purpose</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">14</td>
            <td class="border px-4 py-1">13</td>
            <td class="border px-4 py-1">shirt1</td>
            <td class="border px-4 py-1">Simple Instruction</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">15</td>
            <td class="border px-4 py-1">14</td>
            <td class="border px-4 py-1">shirt1</td>
            <td class="border px-4 py-1">Simple Instruction</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
`;

		return this.makeApiCall(prompt);
	}
		async callFeatureComparison(task: string): Promise<ParallelMethodResponse> {
		const prompt = `You should generate the entire table with respect to the task name given below in the following table format

Task: "${task}"

<div class="p-6 bg-white text-gray-800 font-sans">
  <h2 class="text-2xl font-bold text-blue-700 mb-4">Method Comparison</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto border border-gray-300 text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2 text-left">Feature</th>
          <th class="border px-4 py-2 text-left">Sequential Completion Method</th>
          <th class="border px-4 py-2 text-left">Step-by-Step Parallel Method</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white">
          <td class="border px-4 py-2">Focus</td>
          <td class="border px-4 py-2">Per object</td>
          <td class="border px-4 py-2">Per action</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border px-4 py-2">Total steps</td>
          <td class="border px-4 py-2">60</td>
          <td class="border px-4 py-2">51</td>
        </tr>
        <tr class="bg-white">
          <td class="border px-4 py-2">Washing machine use</td>
          <td class="border px-4 py-2">Serial (one item at a time)</td>
          <td class="border px-4 py-2">Serial (one item at a time)</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border px-4 py-2">Detergent handling</td>
          <td class="border px-4 py-2">Repeated gather (per object)</td>
          <td class="border px-4 py-2">Single gather shared for all</td>
        </tr>
        <tr class="bg-white">
          <td class="border px-4 py-2">Parallel optimization</td>
          <td class="border px-4 py-2">No (isolated, one-by-one)</td>
          <td class="border px-4 py-2">Yes (batch gather then process)</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border px-4 py-2">Activation phrasing</td>
          <td class="border px-4 py-2">Explicit purpose per object</td>
          <td class="border px-4 py-2">Explicit purpose per object</td>
        </tr>
        <tr class="bg-white">
          <td class="border px-4 py-2">Execution pattern</td>
          <td class="border px-4 py-2">Object1 → full sequence → Object2</td>
          <td class="border px-4 py-2">All objects: Action1 → Action2 → …</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

`;

		return this.makeApiCall(prompt);
	}

	private parseJsonResponse<T>(response: string): T {
		try {
			// Try to extract JSON from the response
			const jsonMatch = response.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}

			// If no JSON found, try parsing the entire response
			return JSON.parse(response);
		} catch (error) {
			console.error("Failed to parse JSON response:", error);
			throw new Error("Invalid JSON response from API");
		}
	}

	private async makeApiCall(prompt: string): Promise<string> {
		try {
			const response = await fetch(
				"https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "llama3-70b-8192",
						messages: [
							{
								role: "system",
								content:
									"You are a helpful assistant that creates detailed task execution plans. Always follow the exact formatting requirements provided by the user.",
							},
							{
								role: "user",
								content: prompt,
							},
						],
						max_tokens: 2000,
						temperature: 0.7,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();

			if (!data.choices || data.choices.length === 0) {
				throw new Error("No response from API");
			}

			return data.choices[0].message.content.trim();
		} catch (error) {
			console.error("Error making API call:", error);
			throw new Error(
				error instanceof Error
					? `Failed to generate plan: ${error.message}`
					: "Failed to generate plan"
			);
		}
	}
}
