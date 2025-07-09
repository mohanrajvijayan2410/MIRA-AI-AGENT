import React, { useState, useRef, useEffect } from "react";
import { Send, User, ChevronDown, Bot } from "lucide-react";
import { generateInstructions, finalizeInstructions } from "./mira/agent";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentInstructions, setCurrentInstructions] = useState([]);
	const [editingIndex, setEditingIndex] = useState(-1);
	const [editingText, setEditingText] = useState("");
	const [editingType, setEditingType] = useState("");
	const [reviewMode, setReviewMode] = useState(false);
	const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
	const [finalResults, setFinalResults] = useState(null);
	const [dependencies, setDependencies] = useState([]);
	const messagesEndRef = useRef(null);

	const groqModels = [
		"llama-3.3-70b-versatile",
		"llama-3.1-70b-versatile",
		"llama-3.1-8b-instant",
		"mixtral-8x7b-32768",
		"gemma2-9b-it",
	];

	// Auto scroll to bottom when new messages are added
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, reviewMode, finalResults]);

	const handleSendMessage = async () => {
		if (!inputValue.trim() || isLoading) return;

		// Clear previous instruction-related messages and states
		setMessages((prev) => prev.filter((msg) => !msg.isInstructionRelated));
		setFinalResults(null);
		setReviewMode(false);
		setCurrentInstructions([]);

		// Add user message
		const userMessage = {
			id: Date.now(),
			type: "user",
			content: inputValue,
			timestamp: new Date(),
			isInstructionRelated: false,
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);

		try {
			// Generate instructions using Groq API
			const instructions = await generateInstructions(inputValue);
			setCurrentInstructions(instructions);

			// format instructions to string
			const all_instructions = instructions
				.map(
					(instruction, index) => `
				${index + 1}. ${instruction.instruction} 
				<p style="color:green; font-weight: bold;">Type: ${instruction.type}</p>
			`
				)
				.join("<br>");

			// Add bot response
			const botMessage = {
				id: Date.now() + 1,
				type: "bot",
				content: `<p>I've generated <strong>${instructions.length}</strong> instructions for "<strong>${inputValue}</strong>". Please review each instruction below:</p> <br>
		<ol style="padding-left: 20px;">
			${all_instructions}
		</ol>`,
				timestamp: new Date(),
				isInstructionRelated: true,
			};

			setMessages((prev) => [...prev, botMessage]);
			setReviewMode(true);
			setCurrentReviewIndex(0);
		} catch (error) {
			const errorMessage = {
				id: Date.now() + 1,
				type: "bot",
				content:
					"Sorry, I encountered an error generating instructions. Please try again.",
				timestamp: new Date(),
				isInstructionRelated: true,
			};
			setMessages((prev) => [...prev, errorMessage]);
		}

		setIsLoading(false);
	};

	const handleAcceptInstruction = () => {
		if (currentReviewIndex < currentInstructions.length - 1) {
			setCurrentReviewIndex(currentReviewIndex + 1);
		} else {
			// All instructions reviewed, finalize
			finalizeAllInstructions();
		}
	};

	const handleEditInstruction = () => {
		setEditingIndex(currentReviewIndex);
		setEditingText(currentInstructions[currentReviewIndex].instruction);
		setEditingType(currentInstructions[currentReviewIndex].type);
	};

	const handleUpdateInstruction = () => {
		const updatedInstructions = [...currentInstructions];
		updatedInstructions[currentReviewIndex] = {
			...updatedInstructions[currentReviewIndex],
			instruction: editingText,
			type: editingType,
		};
		setCurrentInstructions(updatedInstructions);
		setEditingIndex(-1);
		setEditingText("");
		setEditingType("");

		if (currentReviewIndex < currentInstructions.length - 1) {
			setCurrentReviewIndex(currentReviewIndex + 1);
		} else {
			// All instructions reviewed, finalize
			finalizeAllInstructions();
		}
	};

	const finalizeAllInstructions = async () => {
		setIsLoading(true);
		setReviewMode(false);

		try {
			const results = await finalizeInstructions(currentInstructions);
			setFinalResults(results);
			setDependencies(results.dependencies);
			// console.log(results);

			const finalMessage = {
				id: Date.now(),
				type: "bot",
				content: "Here are your finalized instructions with analysis:",
				timestamp: new Date(),
				isInstructionRelated: true,
			};

			setMessages((prev) => [...prev, finalMessage]);
		} catch (error) {
			const errorMessage = {
				id: Date.now(),
				type: "bot",
				content: "Error finalizing instructions. Please try again.",
				timestamp: new Date(),
				isInstructionRelated: true,
			};
			setMessages((prev) => [...prev, errorMessage]);
		}

		setIsLoading(false);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="h-[90vh] bg-gray-50 flex flex-col">
			{/* Scrollable Chat Area */}
			<div className="flex-1 overflow-y-auto">
				<div className="max-w-4xl mx-auto p-4">
					{/* Messages */}
					<div className="space-y-4 mb-6">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.type === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`flex items-start space-x-3 max-w-2xl ${
										message.type === "user"
											? "flex-row-reverse space-x-reverse"
											: ""
									}`}
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
											message.type === "user" ? "bg-blue-500" : ""
										}`}
									>
										{message.type === "user" ? (
											<User className="w-4 h-4 text-white" />
										) : (
											<div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
												<Bot className="w-5 h-5 text-white" />
											</div>
										)}
										<div className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center hidden">
											<span className="text-white text-sm font-bold">M</span>
										</div>
									</div>
									<div
										className={`rounded-lg p-4 shadow-sm ${
											message.type === "user"
												? "bg-blue-500 text-white"
												: "bg-white text-gray-800 border border-gray-200"
										}`}
									>
										{message.type === "bot" ? (
											<div
												dangerouslySetInnerHTML={{ __html: message.content }}
											/>
										) : (
											<p>{message.content}</p>
										)}
										<div className="text-xs opacity-70 mt-2">
											{message.timestamp.toLocaleTimeString()}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Review Mode */}
					{reviewMode && currentInstructions.length > 0 && (
						<div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm">
							<div className="mb-4">
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									Review Instruction {currentReviewIndex + 1} of{" "}
									{currentInstructions.length}
								</h3>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-500 h-2 rounded-full transition-all duration-300"
										style={{
											width: `${
												((currentReviewIndex + 1) /
													currentInstructions.length) *
												100
											}%`,
										}}
									></div>
								</div>
							</div>

							<div className="bg-blue-100 rounded-lg p-4 border border-gray-200 mb-4 shadow-sm">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-gray-600">
										Step {currentReviewIndex + 1}
									</span>
									<span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
										{currentInstructions[currentReviewIndex]?.type}
									</span>
								</div>

								{editingIndex === currentReviewIndex ? (
									<div className="space-y-3">
										<textarea
											value={editingText}
											onChange={(e) => setEditingText(e.target.value)}
											className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
											rows="3"
										/>
										<textarea
											value={editingType}
											onChange={(e) => setEditingType(e.target.value)}
											className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
											rows="1"
										/>

										<div className="flex space-x-2">
											<button
												onClick={handleUpdateInstruction}
												className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
											>
												Update
											</button>
											<button
												onClick={() => {
													setEditingIndex(-1);
													setEditingText("");
												}}
												className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div>
										<p className="text-gray-800 mb-4">
											{currentInstructions[currentReviewIndex]?.instruction}
										</p>
										<div className="flex space-x-2">
											<button
												onClick={handleAcceptInstruction}
												className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
											>
												Accept
											</button>
											<button
												onClick={handleEditInstruction}
												className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
											>
												Edit
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Final Results */}
					{finalResults && (
						<div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
							<h3 className="text-xl font-bold text-gray-800 mb-6">
								Final Analysis
							</h3>

							{/* Final Instructions - MOVED TO TOP */}
							<div className="mb-8">
								<h4 className="text-lg font-semibold text-gray-700 mb-4">
									Final Instructions
								</h4>
								<div className="space-y-3">
									{finalResults.instructions.map((instruction, index) => (
										<div
											key={index}
											className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm"
										>
											<div className="flex items-center justify-between mb-2">
												<span className="font-medium text-gray-800">
													Step {index + 1}
												</span>
												<span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
													{instruction.type}
												</span>
											</div>
											<p className="text-gray-600">{instruction.instruction}</p>
										</div>
									))}
								</div>
							</div>

							{/* Metrics Table */}
							<div className="overflow-x-auto">
								<table className="min-w-full table-auto border-collapse">
									<thead>
										<tr className="bg-gray-100">
											<th className="px-4 py-2 text-left">Step</th>
											<th className="px-4 py-2 text-left">Depends On</th>
											<th className="px-4 py-2 text-left">Objects Involved</th>
											<th className="px-4 py-2 text-left">Classification</th>
											<th className="px-4 py-2 text-left">Consistency</th>
										</tr>
									</thead>
									<tbody>
										{dependencies.map(
											({
												step,
												dependsOn,
												objectsInvolved,
												classification,
												consistency,
											}) => (
												<tr key={step} className="border-t hover:bg-gray-50">
													<td className="px-4 py-2">{step}</td>
													<td className="px-4 py-2">
														{dependsOn.length > 0 ? dependsOn.join(", ") : "—"}
													</td>
													<td className="px-4 py-2">
														{objectsInvolved.join(", ")}
													</td>
													<td className="px-4 py-2">{classification}</td>
													<td className="px-4 py-2">{consistency}</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
							{/* Actions and Objects */}
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<h4 className="text-lg font-semibold text-gray-700 mb-3">
										Actions
									</h4>
									<div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
										<div className="flex flex-wrap gap-2">
											{finalResults.actions.map((action, index) => (
												<span
													key={index}
													className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full shadow-sm"
												>
													{action}
												</span>
											))}
										</div>
									</div>
								</div>
								<div>
									<h4 className="text-lg font-semibold text-gray-700 mb-3">
										Objects
									</h4>
									<div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
										<div className="flex flex-wrap gap-2">
											{finalResults.objects.map((object, index) => (
												<span
													key={index}
													className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full shadow-sm"
												>
													{object}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Loading */}
					{isLoading && (
						<div className="flex justify-center py-4">
							<div className="flex items-center space-x-2 text-gray-600">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
								<span>Processing...</span>
							</div>
						</div>
					)}

					{/* Scroll anchor */}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Fixed Input Area */}
			<div className="border-t border-gray-200 p-4 bg-white flex-shrink-0 shadow-sm">
				<div className="max-w-4xl mx-auto flex space-x-4">
					<div className="flex-1">
						<textarea
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Enter your instruction (e.g., 'Make Coffee')"
							className="w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue resize-none bg-white shadow-sm"
							rows="1"
							disabled={isLoading || reviewMode}
						/>
					</div>
					<button
						onClick={handleSendMessage}
						disabled={!inputValue.trim() || isLoading || reviewMode}
						className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white pr-10 pl-10 rounded-lg transition-colors shadow-sm "
					>
						<Send className="w-5 h-5 text-black hover:text-white" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Chat;
