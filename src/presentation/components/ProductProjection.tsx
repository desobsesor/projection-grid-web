import React, { useEffect, useState } from 'react';
import { ProjectionGrid } from './ProjectionGrid';
import { DataLoader } from './DataLoader';
import { useProductStore } from '../../application/store/productStore';

/**
 * Main container component for the Product Projection application
 * 
 * @property products - The list of products to display
 */
export const ProductProjection: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { products } = useProductStore();

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 150 // Reserve space for header and controls
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between items-right p-4">
        <h1 className="text-2xl w-xl ml-4 font-bold mb-4 text-red-800">Daily product projection 📚</h1>
        <DataLoader />
      </div>
      {products.length > 0 ? (
        <div className="flex-1 border border-gray-300 rounded overflow-hidden">
          <ProjectionGrid width={dimensions.width} height={dimensions.height} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100 border border-gray-300 rounded">


          <div className="text-center p-8">
            <p className='flex justify-center'>
              <img src="/no-data-found.jpeg" alt="No data" className="border border-gray-300 rounded-md justify-center text-center items-center" />
            </p>
            <h2 className="text-xl font-semibold text-center mb-2 mt-4">No data loaded</h2>
            <p className="text-gray-600 text-center mb-4">
              Please upload a JSON file with projection data or use the demo data.
            </p>
          </div>
        </div>
      )}
      <footer className="text-center mx-auto pt-2 w-full">
        Daily product projection. Developed by desobsesor © 2025
      </footer>
    </div>
  );
};