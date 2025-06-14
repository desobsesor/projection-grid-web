import React from 'react';
import { CellColor, type ColorSummary as ColorSummaryType } from '../../domain/types/ProductData';

interface ColorSummaryProps {
  summary: ColorSummaryType;
}

/**
 * Maps color enum values to display names
 * 
 * @param summary - The color summary statistics
 * @returns A record mapping cell colors to their display names
 */
const colorNames: Record<CellColor, string> = {
  [CellColor.RED]: 'Red',
  [CellColor.YELLOW]: 'Yellow',
  [CellColor.GREEN]: 'Green',
  [CellColor.BLACK]: 'Black',
  [CellColor.BLUE]: 'Blue',
};

/**
 * Maps color enum values to Tailwind CSS classes
 * 
 * @param summary - The color summary statistics
 * @returns A record mapping cell colors to their corresponding Tailwind CSS classes
 */
const colorClasses: Record<CellColor, string> = {
  [CellColor.RED]: 'bg-red-500',
  [CellColor.YELLOW]: 'bg-yellow-400',
  [CellColor.GREEN]: 'bg-green-500',
  [CellColor.BLACK]: 'bg-black',
  [CellColor.BLUE]: 'bg-blue-500',
};

/**
 * Component for displaying color summary statistics
 */
export const ColorSummary: React.FC<ColorSummaryProps> = ({ summary }) => {
  // Calculate percentages for each color
  const getPercentage = (count: number): number => {
    return summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
  };

  // Colors to display in the summary (order matters for display)
  const colorsToDisplay: CellColor[] = [
    CellColor.BLUE,
    CellColor.GREEN,
    CellColor.YELLOW,
    CellColor.RED,
    CellColor.BLACK,
  ];

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Summary</h2>

      <div className="space-y-3">
        {colorsToDisplay.map((color) => {
          const count = summary[color];
          const percentage = getPercentage(count);

          return (
            <div key={color} className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
              <span className="w-6 text-gray-700">{colorNames[color]}</span>
              <span className="w-12 text-right text-gray-700">{count}</span>
              <div className="flex-grow h-4 bg-gray-200 rounded-xs overflow-hidden">
                <div
                  className={`h-full ${colorClasses[color]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-right text-gray-700">{percentage}%</span>
            </div>
          );
        })}

        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 mt-2">
          <span className="w-20 font-medium text-gray-700">Total</span>
          <span className="w-12 text-right font-medium text-gray-700">{summary.total}</span>
          <div className="flex-grow"></div>
          <span className="w-12 text-right font-medium text-gray-700">100%</span>
        </div>
      </div>
    </div>
  );
};