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
	private apiKeys = [
		"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",
		"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",
	];
	private currentKeyIndex = 0;

	async callSequentialMethod(task: string): Promise<string> {
		const prompt = `You are a task planning specialist for ISAA. Break down the following task into a structured plan using the Sequential Completion Method.

**Sequential Completion Method**: Complete each object or sub-task fully before starting the next.
Task: "${task}"

**CRITICAL REQUIREMENT: Generate EXACTLY 5 to 6 steps only. Do not exceed 7 steps.**
Output ONLY clean HTML with the following structure, without any markdown backticks:

<div class="p-4 text-gray-800 font-sans space-y-6">
  <h2 class="text-2xl font-bold text-blue-700">🧠 Task: ${task}</h2>
  <p><strong>Sequencing Method:</strong> Sequential Completion Method<br>
  Complete each phase/item fully before proceeding to the next.</p>

  <h3 class="text-xl font-semibold text-green-700">✅ Sample Instructions</h3>
  <ol class="list-decimal list-inside space-y-1">
    <li><strong>gather primary materials</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: ungathered → Resulting state: gathered<br>Type: Simple Instruction<br>Dependencies: None</span>
    </li>
    <li><strong>prepare work area and components</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: gathered → Resulting state: ready<br>Type: Simple Instruction<br>Dependencies: Step 1</span>
    </li>
    <li><strong>position component for processing</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: ready → Resulting state: aligned<br>Type: Mandatory Instruction<br>Dependencies: Step 2</span>
    </li>
    <li><strong>activate process with explicit purpose</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: aligned → Resulting state: processed<br>Type: Instruction with Purpose<br>Dependencies: Step 3</span>
    </li>
    <li><strong>verify and store finished object</strong><br>
      <span class="ml-4 text-sm text-gray-600">Required state: processed → Resulting state: stored<br>Type: Simple Instruction<br>Dependencies: Step 4</span>
    </li>
  </ol>

  <h3 class="text-xl font-semibold text-indigo-700">✅ Final Sequenced Plan</h3>
  <ol class="list-decimal list-inside space-y-1">
    <li>gather primary materials</li>
    <li>prepare work area and components</li>
    <li>position component for processing</li>
    <li>activate process with explicit purpose</li>
    <li>verify and store finished object</li>
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
          <td class="border border-gray-300 px-4 py-1">materials</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">—</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border border-gray-300 px-4 py-1">2</td>
          <td class="border border-gray-300 px-4 py-1">1</td>
          <td class="border border-gray-300 px-4 py-1">work area</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-1">3</td>
          <td class="border border-gray-300 px-4 py-1">2</td>
          <td class="border border-gray-300 px-4 py-1">component</td>
          <td class="border border-gray-300 px-4 py-1">Mandatory Instruction</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border border-gray-300 px-4 py-1">4</td>
          <td class="border border-gray-300 px-4 py-1">3</td>
          <td class="border border-gray-300 px-4 py-1">process unit</td>
          <td class="border border-gray-300 px-4 py-1">Instruction with Purpose</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-1">5</td>
          <td class="border border-gray-300 px-4 py-1">4</td>
          <td class="border border-gray-300 px-4 py-1">finished item</td>
          <td class="border border-gray-300 px-4 py-1">Simple Instruction</td>
          <td class="border border-gray-300 px-4 py-1">Yes</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;

		return this.makeApiCall(prompt);
	}

	async callParallelMethod(task: string): Promise<string> {
		const prompt = `You are a task planning specialist for ISAA. Break down the following task using the Step-by-Step Parallel Method.

**Step-by-Step Parallel Method**: Group similar actions across all objects together by stage (e.g. gather all items in Stage A, position/prepare in Stage B, execute in Stage C).

Task: "${task}"

**CRITICAL REQUIREMENT: Generate 5 to 6 concise steps total across 2 to 3 stages. Keep it concise. Do not exceed 7 steps.**
Output ONLY clean HTML with the following structure, without any markdown backticks:

<div class="p-6 bg-white text-gray-800 font-sans space-y-8">
  <p class="text-sm italic text-gray-600">
    Definition: Perform each action across all objects. Purpose-Driven Instructions now clearly state the intent.
  </p>

  <h2 class="text-2xl font-bold text-blue-700">🔁 Stages of Execution (Grouped by Stage)</h2>

  <div>
    <h3 class="text-xl font-semibold text-green-700 mb-2">Stage A: Gather All Materials</h3>
    <ol class="list-decimal list-inside space-y-1">
      <li>gather item 1 <span class="text-sm text-gray-600">→ Simple Instruction</span></li>
      <li>gather item 2 <span class="text-sm text-gray-600">→ Simple Instruction</span></li>
    </ol>
  </div>

  <div>
    <h3 class="text-xl font-semibold text-yellow-700 mb-2">Stage B: Position & Prepare</h3>
    <ol start="3" class="list-decimal list-inside space-y-1">
      <li>position item 1 on workstation <span class="text-sm text-gray-600">→ Mandatory Instruction</span></li>
      <li>position item 2 on workstation <span class="text-sm text-gray-600">→ Mandatory Instruction</span></li>
    </ol>
  </div>

  <div>
    <h3 class="text-xl font-semibold text-red-700 mb-2">Stage C: Parallel Processing</h3>
    <ol start="5" class="list-decimal list-inside space-y-1">
      <li>execute processing across items <span class="text-sm text-gray-600">→ Instruction with Purpose</span></li>
    </ol>
  </div>

  <div>
    <h3 class="text-xl font-semibold text-indigo-700 mb-2">✅ Final Sequenced Plan</h3>
    <p class="ml-4 space-y-1 text-gray-700">
      <span>[Stage A] 1–2: Gather all materials</span><br>
      <span>[Stage B] 3–4: Position and prepare in parallel</span><br>
      <span>[Stage C] 5: Execute concurrent operation</span>
    </p>
  </div>

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
            <td class="border px-4 py-1">item 1</td>
            <td class="border px-4 py-1">Simple Instruction</td>
            <td class="border px-4 py-1">—</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">2</td>
            <td class="border px-4 py-1">—</td>
            <td class="border px-4 py-1">item 2</td>
            <td class="border px-4 py-1">Simple Instruction</td>
            <td class="border px-4 py-1">—</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">3</td>
            <td class="border px-4 py-1">1</td>
            <td class="border px-4 py-1">item 1</td>
            <td class="border px-4 py-1">Mandatory Instruction</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="border px-4 py-1">4</td>
            <td class="border px-4 py-1">2</td>
            <td class="border px-4 py-1">item 2</td>
            <td class="border px-4 py-1">Mandatory Instruction</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
          <tr>
            <td class="border px-4 py-1">5</td>
            <td class="border px-4 py-1">3, 4</td>
            <td class="border px-4 py-1">item 1, item 2</td>
            <td class="border px-4 py-1">Instruction with Purpose</td>
            <td class="border px-4 py-1">Yes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`;

		return this.makeApiCall(prompt);
	}

	async callFeatureComparison(task: string): Promise<string> {
		const prompt = `You are a task planning specialist for ISAA. Generate a comparison table between Sequential Completion Method and Step-by-Step Parallel Method for the task: "${task}".

Output ONLY the HTML container with no markdown code fences:

<div class="p-6 bg-white text-gray-800 font-sans">
  <h2 class="text-2xl font-bold text-blue-700 mb-4">Method Comparison: ${task}</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto border border-gray-300 text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2 text-left font-semibold">Feature</th>
          <th class="border px-4 py-2 text-left font-semibold">Sequential Completion Method</th>
          <th class="border px-4 py-2 text-left font-semibold">Step-by-Step Parallel Method</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white">
          <td class="border px-4 py-2 font-medium">Focus</td>
          <td class="border px-4 py-2">Per object (item-by-item)</td>
          <td class="border px-4 py-2">Per action (stage-by-stage)</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border px-4 py-2 font-medium">Execution Flow</td>
          <td class="border px-4 py-2">Linear serial completion</td>
          <td class="border px-4 py-2">Concurrent stage operations</td>
        </tr>
        <tr class="bg-white">
          <td class="border px-4 py-2 font-medium">Resource Utilization</td>
          <td class="border px-4 py-2">Repeated setup per item</td>
          <td class="border px-4 py-2">Batch setup shared across items</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="border px-4 py-2 font-medium">Parallel Optimization</td>
          <td class="border px-4 py-2">None (single-threaded)</td>
          <td class="border px-4 py-2">High (multi-component synchronization)</td>
        </tr>
        <tr class="bg-white">
          <td class="border px-4 py-2 font-medium">Failure Impact</td>
          <td class="border px-4 py-2">Isolated to current item</td>
          <td class="border px-4 py-2">May pause whole stage</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`;

		return this.makeApiCall(prompt);
	}

	private stripMarkdownFences(text: string): string {
		let cleaned = text.trim();
		if (cleaned.startsWith("```html")) {
			cleaned = cleaned.slice(7);
		} else if (cleaned.startsWith("```")) {
			cleaned = cleaned.slice(3);
		}
		if (cleaned.endsWith("```")) {
			cleaned = cleaned.slice(0, -3);
		}
		return cleaned.trim();
	}

	private async makeApiCall(prompt: string, maxRetries = 2): Promise<string> {
		const models = [
			"openai/gpt-oss-120b",
			"openai/gpt-oss-20b",
			"qwen/qwen3.8-27b",
		];
		let lastError: Error | null = null;

		// Rotate keys round-robin across calls so one key doesn't get flooded
		const startKeyIndex = this.currentKeyIndex;
		this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;

		// Build key list starting from the rotated index
		const orderedKeys = [
			this.apiKeys[startKeyIndex],
			...this.apiKeys.filter((_, i) => i !== startKeyIndex),
		];

		for (const model of models) {
			for (let keyIdx = 0; keyIdx < orderedKeys.length; keyIdx++) {
				const key = orderedKeys[keyIdx];

				for (let attempt = 0; attempt < maxRetries; attempt++) {
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
									model,
									messages: [
										{
											role: "system",
											content:
												"You are a helpful assistant for ISAA that creates task execution plans. Output strictly the requested HTML without code block delimiters.",
										},
										{
											role: "user",
											content: prompt,
										},
									],
									max_tokens: 2800,
									temperature: 0.6,
								}),
							}
						);

						if (response.status === 429) {
							console.warn(
								`Groq 429 Rate Limit on model ${model} with key ending in ...${key.slice(
									-6
								)}. Rotating to next key...`
							);
							// Break attempt loop to switch to next key immediately
							break;
						}

						if (!response.ok) {
							throw new Error(
								`API error: ${response.status} ${response.statusText}`
							);
						}

						const data = await response.json();

						if (!data.choices || data.choices.length === 0) {
							throw new Error("No response choices from API");
						}

						const content = data.choices[0].message?.content || "";
						if (!content.trim()) {
							throw new Error("Empty response received from model");
						}

						return this.stripMarkdownFences(content);
					} catch (error) {
						lastError =
							error instanceof Error ? error : new Error(String(error));

						if (attempt < maxRetries - 1) {
							await new Promise((resolve) =>
								setTimeout(resolve, 600 * (attempt + 1))
							);
						}
					}
				}
			}
		}

		console.error("Error making API call after trying all models and keys:", lastError);
		throw new Error(
			lastError instanceof Error
				? `Failed to generate plan: ${lastError.message}`
				: "Failed to generate plan due to rate limits or API availability. Please retry in a few moments."
		);
	}
}
