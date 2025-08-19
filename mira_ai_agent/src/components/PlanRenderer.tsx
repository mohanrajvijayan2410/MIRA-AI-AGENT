import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  Target,
  GitBranch,
  Timer,
  BarChart3,
  Network
} from 'lucide-react';
import { DependencyTable } from './DependencyTable';

interface PlanRendererProps {
  content: string;
}

interface ParsedStep {
  number: number;
  requiredState: string;
  instruction: string;
  instructionType: string;
  resultingState: string;
  dependencies: string;
}

interface ParsedPlan {
  task: string;
  method: string;
  generated: string;
  steps: ParsedStep[];
  totalSteps: number;
  estimatedTime: string;
  criticalPath: string;
  parallelOpportunities: string;
}

export const PlanRenderer: React.FC<PlanRendererProps> = ({ content }) => {

  console.log(content);
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header Section */}
      
        <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: content }}></div>

    </div>
  );
};