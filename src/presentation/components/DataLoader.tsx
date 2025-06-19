import React, { useRef } from 'react';
import { useProductStore } from '../../application/store/productStore';
import { Icon } from './Icon';

/**
 * Component for loading JSON data into the application
 */
export const DataLoader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadProducts } = useProductStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        loadProducts(content);
      }
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleResetData = () => {
    loadProducts('');
  };

  const handleDemoData = () => {
    // Sample data for demonstration
    const demoData = {
      "Datos": [
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-20T00:00:00",
          "NetFlow": 200.0,
          "GreenZone": 20.0,
          "YellowZone": 20.0,
          "RedZone": 30.0,
          "MakeToOrder": -170
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-21T00:00:00",
          "NetFlow": 200.0,
          "GreenZone": 20.0,
          "YellowZone": 20.0,
          "RedZone": 30.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-22T00:00:00",
          "NetFlow": 180.0,
          "GreenZone": 18.0,
          "YellowZone": 18.0,
          "RedZone": 28.0,
          "MakeToOrder": -130
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-23T00:00:00",
          "NetFlow": 160.0,
          "GreenZone": 16.0,
          "YellowZone": 16.0,
          "RedZone": 26.0,
          "MakeToOrder": -130
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-24T00:00:00",
          "NetFlow": 140.0,
          "GreenZone": 14.0,
          "YellowZone": 14.0,
          "RedZone": 24.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-25T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-26T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-27T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-28T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-29T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-30T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "AKL",
          "Reference": "210003000015R30",
          "VisibleForecastedDate": "2025-03-31T00:00:00",
          "NetFlow": 120.0,
          "GreenZone": 12.0,
          "YellowZone": 12.0,
          "RedZone": 22.0,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-20T00:00:00",
          "NetFlow": 100.0,
          "GreenZone": 55.0,
          "YellowZone": 55.0,
          "RedZone": 50.0,
          "MakeToOrder": 23
        }, {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-21T00:00:00",
          "NetFlow": 1500.6344,
          "GreenZone": 121.768285,
          "YellowZone": 121.768285,
          "RedZone": 194.829256,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-22T00:00:00",
          "NetFlow": 1486.6344,
          "GreenZone": 122.84463,
          "YellowZone": 122.84463,
          "RedZone": 196.55140799999998,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-23T00:00:00",
          "NetFlow": 1460.2688,
          "GreenZone": 124.27097499999999,
          "YellowZone": 124.27097499999999,
          "RedZone": 198.83356,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-24T00:00:00",
          "NetFlow": 1433.9032,
          "GreenZone": 125.69731999999999,
          "YellowZone": 125.69731999999999,
          "RedZone": 201.11571199999997,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-25T00:00:00",
          "NetFlow": 1407.5376,
          "GreenZone": 125.873665,
          "YellowZone": 125.873665,
          "RedZone": 201.397864,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-26T00:00:00",
          "NetFlow": 1381.172,
          "GreenZone": 126.80001,
          "YellowZone": 126.80001,
          "RedZone": 202.880016,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-27T00:00:00",
          "NetFlow": 1354.8064,
          "GreenZone": 127.62635499999999,
          "YellowZone": 127.62635499999999,
          "RedZone": 204.202168,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-28T00:00:00",
          "NetFlow": 1328.4408,
          "GreenZone": 129.0527,
          "YellowZone": 129.0527,
          "RedZone": 206.48432,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-29T00:00:00",
          "NetFlow": 1302.0752,
          "GreenZone": 130.229045,
          "YellowZone": 130.229045,
          "RedZone": 208.366472,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-30T00:00:00",
          "NetFlow": 1275.7096,
          "GreenZone": 130.35539,
          "YellowZone": 130.35539,
          "RedZone": 208.568624,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV",
          "Reference": "210001000004R20",
          "VisibleForecastedDate": "2025-03-31T00:00:00",
          "NetFlow": 1249.344,
          "GreenZone": 131.33173499999998,
          "YellowZone": 131.33173499999998,
          "RedZone": 210.130776,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-20T00:00:00",
          "NetFlow": 500.0,
          "GreenZone": 121.768285,
          "YellowZone": 121.768285,
          "RedZone": 194.829256,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-21T00:00:00",
          "NetFlow": 500.0,
          "GreenZone": 121.768285,
          "YellowZone": 121.768285,
          "RedZone": 194.829256,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-22T00:00:00",
          "NetFlow": 1486.6344,
          "GreenZone": 122.84463,
          "YellowZone": 122.84463,
          "RedZone": 196.55140799999998,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-23T00:00:00",
          "NetFlow": 1460.2688,
          "GreenZone": 124.27097499999999,
          "YellowZone": 124.27097499999999,
          "RedZone": 198.83356,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-24T00:00:00",
          "NetFlow": 1433.9032,
          "GreenZone": 125.69731999999999,
          "YellowZone": 125.69731999999999,
          "RedZone": 201.11571199999997,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-25T00:00:00",
          "NetFlow": 1407.5376,
          "GreenZone": 125.873665,
          "YellowZone": 125.873665,
          "RedZone": 201.397864,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-26T00:00:00",
          "NetFlow": 1381.172,
          "GreenZone": 126.80001,
          "YellowZone": 126.80001,
          "RedZone": 202.880016,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-27T00:00:00",
          "NetFlow": 1354.8064,
          "GreenZone": 127.62635499999999,
          "YellowZone": 127.62635499999999,
          "RedZone": 204.202168,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-28T00:00:00",
          "NetFlow": 1328.4408,
          "GreenZone": 129.0527,
          "YellowZone": 129.0527,
          "RedZone": 206.48432,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-29T00:00:00",
          "NetFlow": 1302.0752,
          "GreenZone": 130.229045,
          "YellowZone": 130.229045,
          "RedZone": 208.366472,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-30T00:00:00",
          "NetFlow": 1275.7096,
          "GreenZone": 130.35539,
          "YellowZone": 130.35539,
          "RedZone": 208.568624,
          "MakeToOrder": 0
        },
        {
          "CenterCode": "BCV-X",
          "Reference": "210001000004R21",
          "VisibleForecastedDate": "2025-03-31T00:00:00",
          "NetFlow": 1249.344,
          "GreenZone": 131.33173499999998,
          "YellowZone": 131.33173499999998,
          "RedZone": 210.130776,
          "MakeToOrder": 0
        },
      ]
    };

    loadProducts(JSON.stringify(demoData));
  };

  return (
    <div className="flex space-x-4 mb-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="px-4 flex items-end justify-end py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <Icon svgPath="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4c0-2.05 1.53-3.76 3.56-3.97l1.07-.11l.5-.95A5.47 5.47 0 0 1 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5l1.53.11A2.98 2.98 0 0 1 22 15c0 1.65-1.35 3-3 3M8 13h2.55v3h2.9v-3H16l-4-4z" className="h-6 w-6  mr-1 text-white" />
        Upload JSON file
      </button>
      <button
        onClick={handleDemoData}
        className="px-4 flex items-end justify-end py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        <Icon svgPath="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2m-1 8V6h2v4h3l-4 4l-4-4zm6 7H7v-2h10z" className="h-6 w-6 text-white mr-1" />
        Load demo data
      </button>
      <button
        onClick={handleResetData}
        className="px-4 flex items-end justify-end py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        <Icon svgPath="M12 6v3l4-4l-4-4v3c-4.42 0-8 3.58-8 8c0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6m6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8c0 3.31-2.69 6-6 6v-3l-4 4l4 4v-3c4.42 0 8-3.58 8-8c0-1.57-.46-3.03-1.24-4.26" className="h-6 w-6 mr-1 text-white" /> Reset data
      </button>
    </div>
  );
};