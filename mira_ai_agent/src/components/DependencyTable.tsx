import React from 'react';
import { Network, ArrowRight, Zap } from 'lucide-react';

interface Step {
  number: number;
  dependencies: string;
}

interface DependencyTableProps {
  steps: Step[];
}

export const DependencyTable: React.FC<DependencyTableProps> = ({ steps }) => {
  const generateDependencyData = () => {
    return steps.map(step => {
      const deps = step.dependencies.toLowerCase();
      let dependsOn = 'None';
      let canRunParallel: string[] = [];
      
      if (!deps.includes('none')) {
        dependsOn = step.dependencies;
      }
      
      // Find steps that can run in parallel (same dependencies or no dependencies)
      steps.forEach(otherStep => {
        if (otherStep.number !== step.number) {
          const otherDeps = otherStep.dependencies.toLowerCase();
          if ((deps.includes('none') && otherDeps.includes('none')) ||
              (deps === otherStep.dependencies && !deps.includes('none'))) {
            canRunParallel.push(`Step ${otherStep.number}`);
          }
        }
      });
      
      return {
        step: step.number,
        dependsOn,
        canRunParallel: canRunParallel.length > 0 ? canRunParallel.join(', ') : 'N/A'
      };
    });
  };

  const dependencyData = generateDependencyData();

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Network className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        Dependency Visualization
      </h3>
      
      {/* Visual Dependency Graph */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-purple-200">
        <div className="mb-4">
          <h4 className="text-sm sm:text-base font-medium text-purple-800 mb-2">Step Dependencies Flow</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Independent</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Sequential</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Parallel Possible</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {dependencyData.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connection arrows */}
              {index < dependencyData.length - 1 && (
                <div className="absolute -right-1 sm:-right-1.5 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block">
                  <ArrowRight className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
                </div>
              )}
              
              <div className={`relative p-2 sm:p-3 rounded-lg border-2 text-center ${
                item.dependsOn === 'None' 
                  ? 'bg-green-100 border-green-300' 
                  : item.canRunParallel !== 'N/A'
                  ? 'bg-purple-100 border-purple-300'
                  : 'bg-blue-100 border-blue-300'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1 ${
                  item.dependsOn === 'None' 
                    ? 'bg-green-500' 
                    : item.canRunParallel !== 'N/A'
                    ? 'bg-purple-500'
                    : 'bg-blue-500'
                }`}>
                  {item.step}
                </div>
                <div className="text-xs text-gray-600">
                  {item.dependsOn === 'None' ? 'Start' : `After ${item.dependsOn.replace('Step ', '')}`}
                </div>
                {item.canRunParallel !== 'N/A' && (
                  <div className="absolute -top-1 -right-1">
                    <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Dependency Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
          <h4 className="text-sm sm:text-base font-medium text-gray-800">Dependency Table (Excerpt)</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Step
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Depends On
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Objects
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dependencyData.map((item, index) => (
                <tr key={item.step} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {item.step}
                      </div>
                      <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">Step {item.step}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.dependsOn === 'None' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.dependsOn}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                    {item.canRunParallel === 'N/A' ? (
                      <span className="text-gray-400">N/A</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {item.canRunParallel.split(', ').map((step, idx) => (
                          <span key={idx} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {step}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.dependsOn === 'None' ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs sm:text-sm text-green-800">Independent</span>
                        </>
                      ) : item.canRunParallel !== 'N/A' ? (
                        <>
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-xs sm:text-sm text-purple-800">Parallel Ready</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-xs sm:text-sm text-blue-800">Sequential</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};