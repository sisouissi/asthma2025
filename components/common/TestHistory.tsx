
import React from 'react';
import { TestResult } from '../../types';
import { Calendar } from '../../constants/icons';

interface TestHistoryProps {
  history: TestResult[];
  testName: string;
}

const TestHistory: React.FC<TestHistoryProps> = ({ history, testName }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-slate-200">
      <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
        <Calendar size={18} className="mr-2 text-slate-500" />
        {testName} History
      </h4>
      <div className="max-h-40 overflow-y-auto pr-2">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2">Date</th>
              <th scope="col" className="px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {history
              .slice() // Create a copy to avoid mutating the original array
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by most recent first
              .map((result, index) => (
              <tr key={index} className="border-b border-slate-100">
                <td className="px-4 py-2">{new Date(result.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 font-medium">{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestHistory;
