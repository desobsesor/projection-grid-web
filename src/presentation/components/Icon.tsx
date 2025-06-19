import React from 'react';

/**
 * Props for the Icon component.
 * @property svgPath - The SVG path data for the icon.
 * @property className - Tailwind CSS classes for styling the icon (e.g., size, color).
 */
interface IconProps {
  svgPath: string;
  className?: string;
}

/**
 * A reusable React component for displaying SVG icons.
 * It takes an SVG path and applies Tailwind CSS classes for styling.
 *
 * @param {IconProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered SVG icon.
 */
export const Icon: React.FC<IconProps> = ({ svgPath, className }) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={svgPath} />
    </svg>
  );
};