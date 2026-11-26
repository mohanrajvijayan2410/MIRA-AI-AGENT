import React from 'react';

interface PlanRendererProps {
  content: string;
}

export const PlanRenderer: React.FC<PlanRendererProps> = ({ content }) => {
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};