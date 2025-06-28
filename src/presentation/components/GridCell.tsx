import React, { useState, useRef, useEffect } from 'react';
import { CellColor, type ProductData } from '../../domain/types/ProductData';
import { ProductDataService } from '../../domain/services/ProductDataService';

/**
 * Component for displaying and editing a grid cell
 * 
 * @property product - The product data to display
 * @property isEditable - Whether the cell is editable
 * @property onValueChange - Callback for when the value changes
 */
interface GridCellProps {
  product: ProductData;
  isEditable?: boolean;
  onValueChange: (reference: string, date: string, newValue: number, delta: number) => void;
}

/**
 * Maps cell colors to Tailwind CSS classes
 * 
 * @property RED - Red color
 * @property YELLOW - Yellow color
 * @property GREEN - Green color
 * @property BLACK - Black color
 * @property BLUE - Blue color
 */
const colorClasses: Record<CellColor, string> = {
  [CellColor.RED]: 'bg-red-500 text-white',
  [CellColor.YELLOW]: 'bg-yellow-400 text-black',
  [CellColor.GREEN]: 'bg-green-500 text-white',
  [CellColor.BLACK]: 'bg-black text-white',
  [CellColor.BLUE]: 'bg-blue-500 text-white',
};

/**
 * Component for displaying and editing a grid cell
 * 
 * @property product - The product data to display
 * @property isEditable - Whether the cell is editable
 * @property onValueChange - Callback for when the value changes
 */
export const GridCell: React.FC<GridCellProps> = ({
  product,
  isEditable = false,
  onValueChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(product.MakeToOrder.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate cell color based on product data
  const cellColor = ProductDataService.calculateCellColor(
    product.NetFlow,
    product.RedZone,
    product.YellowZone,
    product.GreenZone
  );

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(inputValue);

    if (!isNaN(numValue) && numValue !== product.MakeToOrder) {
      const delta = numValue - product.MakeToOrder;
      onValueChange(product.Reference, new Date(product.VisibleForecastedDate).toISOString().split('T')[0], numValue, delta);
    } else {
      setInputValue(product.MakeToOrder.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(product.MakeToOrder.toString());
    }
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-2 ${isEditable ? 'cursor-pointer' : ''} ${isEditing ? 'bg-white' : colorClasses[cellColor]}`}
      onClick={handleClick}
    >
      {isEditing && isEditable ? (
        <input
          ref={inputRef}
          type="text"
          className="w-full text-center text-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.replace(/[^-0-9]/g, ''))}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          {isEditable && (
            <span title={`${product.MakeToOrder} + ${product.NetFlow}`} className="text-md opacity-80">{product.MakeToOrder}</span>
          )}
        </div>
      )}
    </div>
  );
};