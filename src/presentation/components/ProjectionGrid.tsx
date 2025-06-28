import React, { useState, useRef, useMemo } from 'react';
import { FixedSizeGrid } from 'react-window';
import { useProductStore } from '../../application/store/productStore';
import { GridCell } from './GridCell';
import { ColorSummary } from './ColorSummary';
import { Icon } from './Icon';

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
    updateMakeToOrder: updateMakeToOrderInStore,
    selectDate
  } = useProductStore();

  // Constants for grid layout
  const COLUMN_WIDTH = 100;
  const REFERENCE_COLUMN_WIDTH = 150; // Increased width for Reference column
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 40;
  const FIXED_COLUMNS = 2; // CenterCode and Reference columns

  // Calculate grid dimensions
  const gridWidth = width - 300; // Reserve space for summary
  const gridHeight = height - HEADER_HEIGHT;
  // Calculate visible columns considering the wider reference column
  const visibleColumns = Math.floor((gridWidth - REFERENCE_COLUMN_WIDTH) / COLUMN_WIDTH) + 1;

  // State for tracking which dates are visible
  const [, setVisibleDateRange] = useState<[number, number]>([0, visibleColumns - FIXED_COLUMNS]);

  // Handle scrolling to update visible date range
  /**
   * Handles the scroll event of the grid to update the visible date range.
   * @param {object} params - The scroll event parameters.
   * @param {number} params.scrollLeft - The horizontal scroll position.
   */
  const handleScroll = ({ scrollLeft }: { scrollLeft: number }) => {
    const startIndex = Math.floor(scrollLeft / COLUMN_WIDTH);
    const endIndex = startIndex + visibleColumns - FIXED_COLUMNS;
    setVisibleDateRange([startIndex, endIndex]);
  };

  /**
   * Derives unique center codes from the product references.
   * This is used to display the Center Code column.
   * @type {string[]}
   */
  const centerCodes = useMemo(() => {
    const centerCodeMap = new Map<string, string>();

    // First pass: build a map of reference to center code
    for (const [, dateMap] of organizedData) {
      for (const [, product] of dateMap) {
        if (!centerCodeMap.has(product.Reference)) {
          centerCodeMap.set(product.Reference, product.CenterCode);
        }
      }
    }

    // Second pass: get center codes in reference order
    return references.map(ref => centerCodeMap.get(ref) || '');
  }, [organizedData, references]);

  /**
   * Cell renderer for the FixedSizeGrid.
   * Renders header cells and data cells based on columnIndex and rowIndex.
   * @param {object} params - Cell rendering parameters.
   * @param {number} params.columnIndex - The column index of the cell.
   * @param {number} params.rowIndex - The row index of the cell.
   * @param {React.CSSProperties} params.style - The style object for positioning the cell.
   * @returns {JSX.Element}
   */
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
            <div style={style} className="border-b border-r border-gray-300 text-sm font-medium">
              <GridCell
                product={product}
                isEditable={true}
                onValueChange={updateMakeToOrderInStore}
              />
            </div>
          );
        }
      }
    }

    return <div style={style} className="border-b border-r border-gray-300"></div>;
  };

  /**
   * Ref for the header's scrollable div, used to synchronize scroll with the grid.
   * @type {React.RefObject<HTMLDivElement>}
   */
  const headerScrollRef = useRef<HTMLDivElement>(null);
  /**
   * Ref for the FixedSizeGrid component, used to access its instance methods.
   * @type {React.RefObject<FixedSizeGrid>}
   */
  const gridRef = useRef<FixedSizeGrid>(null);

  /**
   * Handles the scroll event of the main grid and synchronizes the header's scroll position.
   * Also updates the visible date range.
   * @param {object} params - The scroll event parameters.
   * @param {number} params.scrollLeft - The horizontal scroll position.
   * @param {number} params.scrollTop - The vertical scroll position.
   */
  const handleGridScroll = ({ scrollLeft }: { scrollLeft: number; scrollTop: number }) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft;
    }
    handleScroll({ scrollLeft });
  };

  return (
    <div className="flex h-full">
      {/* Summary panel */}
      <div className="w-300 p-4 bg-gray-50 border-r border-gray-300">
        <h2 className="text-lg font-xl mb-2 ml-2">
          {selectedDate ? (
            <span className='text-sm flex items-center text-center'>Summary for:
              <Icon svgPath="M7 11h2v2H7zm12-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14zm0-12H5V6h14zm-4 3h2v2h-2zm-4 0h2v2h-2z" className="h-5 w-5 mr-1 ml-3 text-gray-400" />
              <span className='font-medium'>{new Date(selectedDate).toLocaleDateString()}</span>
            </span>
          ) : (
            <span>Summary general</span>
          )}
        </h2>
        <ColorSummary summary={colorSummary} />
      </div>

      {/* Grid panel */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Scrollable grid content */}
        <div className="flex-1">
          <FixedSizeGrid
            columnCount={FIXED_COLUMNS + dates.length}
            columnWidth={COLUMN_WIDTH}
            height={gridHeight}
            rowCount={references.length + 1}
            rowHeight={ROW_HEIGHT}
            width={gridWidth}
            onScroll={handleGridScroll}
            className="scrollbar-hide"
            ref={gridRef}
          >
            {Cell}
          </FixedSizeGrid>
        </div>
      </div>
    </div>
  );
};