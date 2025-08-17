import React, { useState, useCallback } from "react";
import { Database, Search as SearchIcon } from "lucide-react";
import { CSVUploader } from "../components/CSVUploader";
import { SearchBox } from "../components/SearchBox";
import { ResultsTable, TaskDetails } from "../components/ResultsTable";
import { CSVSearcher } from "./searchUtils";

import { CSVRow, SearchResult } from "../types";

function App() {
	const [csvData, setCsvData] = useState<CSVRow[]>([]);
	const [searcher, setSearcher] = useState<CSVSearcher | null>(null);
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
	const [hasSearched, setHasSearched] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [currentQuery, setCurrentQuery] = useState("");
	const [duration, setDuration] = useState("");
	const [isGeneratingDuration, setIsGeneratingDuration] = useState(false);
	const [durationError, setDurationError] = useState<string | null>(null);

	const handleDataLoaded = useCallback((data: CSVRow[]) => {
		setCsvData(data);
		setSearcher(new CSVSearcher(data));
		setSearchResult(null);
		setHasSearched(false);
		setCurrentQuery("");
		setDuration("");
		setIsGeneratingDuration(false);
		setDurationError(null);
	}, []);

	const handleSearch = useCallback(
		async (query: string) => {
			if (!searcher) return;

			setIsSearching(true);
			setCurrentQuery(query);

			// Add a small delay to show loading state
			await new Promise((resolve) => setTimeout(resolve, 500));

			try {
				const result = searcher.search(query);
				setSearchResult(result);
				setHasSearched(true);
			} catch (error) {
				console.error("Search failed:", error);
				setSearchResult(null);
				setHasSearched(true);
			} finally {
				setIsSearching(false);
			}
		},
		[searcher]
	);

	const generateDuration = useCallback(async () => {
		if (!searchResult?.item) return;
		setIsGeneratingDuration(true);
		setDurationError(null);
		setDuration("");
		try {
			// Import generateDurationEstimate from utils/aiProviders
			const { generateDurationEstimate } = await import(
				"./aiProviders"
			);
			const estimatedDuration = await generateDurationEstimate(
				searchResult.item.Description,
				searchResult.item.Actions,
				searchResult.item.Objects
			);
			setDuration(estimatedDuration);
		} catch (error) {
			setDurationError(
				error instanceof Error
					? error.message
					: "Failed to generate duration estimate"
			);
		} finally {
			setIsGeneratingDuration(false);
		}
	}, [searchResult]);

	React.useEffect(() => {
		if (searchResult && searchResult.item) {
			generateDuration();
		} else {
			setDuration("");
			setDurationError(null);
			setIsGeneratingDuration(false);
		}
	}, [searchResult, generateDuration]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
				<div className="space-y-6 md:space-y-8">
					{/* Top Row: Upload CSV File, Select Description, and Task Details */}
					<div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
						{/* Upload CSV File */}
						<div className="lg:w-1/3 w-full space-y-2 md:space-y-4">
							<div className="flex items-center gap-2 md:gap-3">
								<div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
									1
								</div>
								<h2 className="text-lg md:text-xl font-semibold text-gray-900">
									Upload CSV File
								</h2>
							</div>
							<CSVUploader onDataLoaded={handleDataLoaded} />
						</div>

						{/* Select Description */}
						{csvData.length > 0 && (
							<div className="lg:w-1/3 w-full space-y-2 md:space-y-4">
								<div className="flex items-center gap-2 md:gap-3">
									<div className="w-7 h-7 md:w-8 md:h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
										2
									</div>
									<h2 className="text-lg md:text-xl font-semibold text-gray-900">
										Select Description
									</h2>
								</div>
								<SearchBox
									onSearch={handleSearch}
									isSearching={isSearching}
									disabled={!searcher}
									csvData={csvData}
								/>
							</div>
						)}

						{/* Task Details */}
						{csvData.length > 0 && hasSearched && (
							<div className="lg:w-1/3 w-full">
								<TaskDetails
									result={searchResult}
									hasSearched={hasSearched}
									duration={duration}
									isGeneratingDuration={isGeneratingDuration}
									durationError={durationError}
									generateDuration={generateDuration}
								/>
							</div>
						)}

						{/* Empty state when no CSV uploaded */}
						{csvData.length === 0 && (
							<div className="lg:w-2/3 w-full text-center py-16">
								<div className="w-full max-w-sm ml-9 text-left">
									<div className="w-16 h-16 bg-gray-00 rounded-full flex items-center justify-center mx-auto">
										{/* <Database className="w-8 h-8 text-gray-400" /> */}
									</div>
									<h3 className="text-2xl font-medium text-gray-900 -ml-5 -mt-2">
										Get started by uploading your CSV
									</h3>

									<p className="text-gray-600"></p>
								</div>
							</div>
						)}
					</div>

					{/* MIRA Protocol Instructions - Full Width Below */}
					{csvData.length > 0 && hasSearched && (
						<ResultsTable
							result={searchResult}
							hasSearched={hasSearched}
							query={currentQuery}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
