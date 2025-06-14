import React, { useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import { useProductStore } from '../../application/store/productStore';
import { GridCell } from './GridCell';
import { ColorSummary } from './ColorSummary';

/** 
* Interface for ProjectionGrid component
* 
* @property width - The width of the grid
* @property height - The height of the grid
*/
interface ProjectionGridProps {
  width: number;
  height: number;
}

/**
 * Main component for displaying the product projection grid
 * 
 * @property width - The width of the grid
 * @property height - The height of the grid
 */
export const ProjectionGrid: React.FC<ProjectionGridProps> = ({ width, height }) => {
  const {
    organizedData,
    dates,
    references,
    colorSummary,
    selectedDate,
    updateMakeToOrder,
    selectDate
  } = useProductStore();

  // Constants for grid layout
  const COLUMN_WIDTH = 120;
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 40;
  const FIXED_COLUMNS = 2; // CenterCode and Reference columns

  // Calculate grid dimensions
  const gridWidth = width - 300; // Reserve space for summary
  const gridHeight = height - HEADER_HEIGHT;
  const visibleColumns = Math.floor(gridWidth / COLUMN_WIDTH);

  // State for tracking which dates are visible
  const [visibleDateRange, setVisibleDateRange] = useState<[number, number]>([0, visibleColumns - FIXED_COLUMNS]);

  // Handle scrolling to update visible date range
  const handleScroll = ({ scrollLeft }: { scrollLeft: number }) => {
    const startIndex = Math.floor(scrollLeft / COLUMN_WIDTH);
    const endIndex = startIndex + visibleColumns - FIXED_COLUMNS;
    setVisibleDateRange([startIndex, endIndex]);
  };

  // Get unique center codes for display
  const centerCodes = Array.from(new Set(references.map(ref => {
    // Find any product with this reference to get its center code
    for (const [, dateMap] of organizedData) {
      for (const [, product] of dateMap) {
        if (product.Reference === ref) {
          return product.CenterCode;
        }
      }
    }
    return '';
  })));

  // Cell renderer for the grid
  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    // Header row
    if (rowIndex === 0) {
      if (columnIndex === 0) {
        return (
          <div style={style} className="bg-gray-200 font-semibold flex items-center justify-center border-b border-r border-gray-300">
            Center Code
          </div>
        );
      }
      if (columnIndex === 1) {
        return (
          <div style={style} className="bg-gray-200 font-semibold flex items-center justify-center border-b border-r border-gray-300">
            Reference
          </div>
        );
      }

      // Date headers
      const dateIndex = columnIndex - FIXED_COLUMNS;
      if (dateIndex >= 0 && dateIndex < dates.length) {
        const date = dates[dateIndex];
        const isSelected = selectedDate === date;

        return (
          <div
            style={style}
            className={`text-md flex items-center justify-center border-b border-r border-gray-300 cursor-pointer transition-colors duration-150 hover:bg-blue-50 ${isSelected ? 'bg-blue-200 hover:bg-blue-200' : 'bg-gray-200'}`}
            onClick={() => selectDate(date)}
            title="Click to filter by this date"
          >
            {new Date(date).toLocaleDateString()}
          </div>
        );
      }

      return <div style={style} className="bg-gray-200 border-b border-r border-gray-300"></div>;
    }

    // Data rows
    const productIndex = rowIndex - 1;
    if (productIndex >= 0 && productIndex < references.length) {
      const reference = references[productIndex];
      const centerCode = centerCodes[productIndex];

      // CenterCode column
      if (columnIndex === 0) {
        return (
          <div style={style} className="bg-gray-100 flex items-center px-2 border-b border-r border-gray-300">
            {centerCode}
          </div>
        );
      }

      // Reference column
      if (columnIndex === 1) {
        return (
          <div style={style} className="bg-gray-100 text-xs flex items-center pl-2 border-b border-r border-gray-300">
            {reference}
          </div>
        );
      }

      // Data cells
      const dateIndex = columnIndex - FIXED_COLUMNS;
      if (dateIndex >= 0 && dateIndex < dates.length) {
        const date = dates[dateIndex];
        const dateMap = organizedData.get(date);
        const product = dateMap?.get(reference);

        if (product) {
          return (
            <div style={style} className="border-b border-r border-gray-300">
              <GridCell
                product={product}
                isEditable={true}
                onValueChange={(value) => updateMakeToOrder(reference, date, value)}
              />
            </div>
          );
        }
      }
    }

    return <div style={style} className="border-b border-r border-gray-300"></div>;
  };

  return (
    <div className="flex h-full">
      {/* Summary panel */}
      <div className="w-300 p-4 bg-gray-50 border-r border-gray-300">
        <h2 className="text-lg font-xl mb-2 ml-2">
          {selectedDate ? (
            <span>Summary for <span className='font-bold'>{new Date(selectedDate).toLocaleDateString()}</span></span>
          ) : (
            <span>Summary general</span>
          )}
        </h2>
        <ColorSummary summary={colorSummary} />
      </div>

      {/* Grid panel */}
      <div className="flex-1 overflow-hidden">
        {/*<div style={{ height: HEADER_HEIGHT }} className="bg-gray-200"></div>*/}

        <FixedSizeGrid
          className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          width={gridWidth}
          height={gridHeight + HEADER_HEIGHT}
          columnCount={FIXED_COLUMNS + dates.length}
          columnWidth={COLUMN_WIDTH}
          rowCount={1 + references.length}
          rowHeight={ROW_HEIGHT}
          onScroll={handleScroll}
        >
          {Cell}
        </FixedSizeGrid>
      </div>
    </div>
  );
};