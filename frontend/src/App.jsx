import React from "react";
import Chat from "./customFlow/customFlow";
import CSV from "./ObjActSeq/ObjActSeq";
import Iterative from "./seqParallelo/seqParallelo";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

function App() {
	return (
		<Router>
			<div className="bg-blue-200 shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between">
						{/* Logo + Title */}
						<div className="flex items-center gap-5">
							<div className="p-1.5 bg-blue-100 rounded-lg">
								<Bot className="w-6 h-6 text-blue-600" />
							</div>
							<h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
								MIRA AGENT
							</h1>
						</div>

						{/* Nav Links */}
						<div className="flex gap-5">
							<Link
								to="/"
								className="text-black hover:text-white bg-green-300 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center"
							>
								CustomFlow
							</Link>
							<Link
								to="/upload"
								className="text-black hover:text-white bg-green-300 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center"
							>
								ObjActSeq
							</Link>
							<Link
								to="/iterative"
								className="text-black hover:text-white bg-green-300 hover:bg-green-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center"
							>
								SeqParallelo
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Routes>
				<Route path="/upload" element={<CSV />} />
				<Route path="/" element={<Chat />} />
				<Route path="/iterative" element={<Iterative />} />
			</Routes>
		</Router>
	);
}

export default App;
