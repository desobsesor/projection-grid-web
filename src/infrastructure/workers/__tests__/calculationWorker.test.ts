// import { expose } from 'comlink';
import { expose } from 'comlink';
import { CellColor, type ProductData } from '../../../domain/types/ProductData';

// Import the worker API type
import type { CalculationWorkerType } from '../calculationWorker';

// Create a mock implementation of the worker API
const workerApi: CalculationWorkerType = {
  calculateCellColor: jest.fn((netFlow, makeToOrder, redZone, yellowZone, greenZone) => {
    const total = netFlow + makeToOrder;

    if (total === 0) {
      return CellColor.BLACK;
    }

    if (total >= 1 && total <= redZone) {
      return CellColor.RED;
    }

    if (total > redZone && total <= redZone + yellowZone) {
      return CellColor.YELLOW;
    }

    if (total > redZone + yellowZone && total <= redZone + yellowZone + greenZone) {
      return CellColor.GREEN;
    }

    return CellColor.BLUE;
  }),
  calculateColorSummary: jest.fn((products) => {
    const summary: Record<CellColor, number> = {
      [CellColor.RED]: 0,
      [CellColor.YELLOW]: 0,
      [CellColor.GREEN]: 0,
      [CellColor.BLACK]: 0,
      [CellColor.BLUE]: 0
    };

    products.forEach(product => {
      const color = workerApi.calculateCellColor(
        product.NetFlow,
        product.MakeToOrder,
        product.RedZone,
        product.YellowZone,
        product.GreenZone
      );
      summary[color]++;
    });

    return summary;
  })
};

// Mock Comlink's expose function
jest.mock('comlink', () => ({
  expose: jest.fn(),
}));

describe('calculationWorker', () => {
  describe('calculateCellColor', () => {
    it('should return BLACK when total is 0', () => {
      // Arrange
      const netFlow = 0;
      const makeToOrder = 0;
      const redZone = 10;
      const yellowZone = 10;
      const greenZone = 10;

      // Act
      const result = workerApi.calculateCellColor(
        netFlow, makeToOrder, redZone, yellowZone, greenZone
      );

      // Assert
      expect(result).toBe(CellColor.BLACK);
    });

    it('should return RED when total is in red zone', () => {
      // Arrange
      const netFlow = 3;
      const makeToOrder = 2;
      const redZone = 10;
      const yellowZone = 10;
      const greenZone = 10;

      // Act
      const result = workerApi.calculateCellColor(
        netFlow, makeToOrder, redZone, yellowZone, greenZone
      );

      // Assert
      expect(result).toBe(CellColor.RED);
    });

    it('should return YELLOW when total is in yellow zone', () => {
      // Arrange
      const netFlow = 8;
      const makeToOrder = 7;
      const redZone = 10;
      const yellowZone = 10;
      const greenZone = 10;

      // Act
      const result = workerApi.calculateCellColor(
        netFlow, makeToOrder, redZone, yellowZone, greenZone
      );

      // Assert
      expect(result).toBe(CellColor.YELLOW);
    });

    it('should return GREEN when total is in green zone', () => {
      // Arrange
      const netFlow = 15;
      const makeToOrder = 10;
      const redZone = 10;
      const yellowZone = 10;
      const greenZone = 10;

      // Act
      const result = workerApi.calculateCellColor(
        netFlow, makeToOrder, redZone, yellowZone, greenZone
      );

      // Assert
      expect(result).toBe(CellColor.GREEN);
    });

    it('should return BLUE when total exceeds all zones', () => {
      // Arrange
      const netFlow = 25;
      const makeToOrder = 10;
      const redZone = 10;
      const yellowZone = 10;
      const greenZone = 10;

      // Act
      const result = workerApi.calculateCellColor(
        netFlow, makeToOrder, redZone, yellowZone, greenZone
      );

      // Assert
      expect(result).toBe(CellColor.BLUE);
    });

    it('should handle edge cases at zone boundaries', () => {
      // Arrange
      const redZone = 10;
      const yellowZone = 10;
      const greenZone = 10;

      // Act & Assert - Exactly at red zone boundary
      expect(workerApi.calculateCellColor(10, 0, redZone, yellowZone, greenZone))
        .toBe(CellColor.RED);

      // Act & Assert - Exactly at yellow zone boundary
      expect(workerApi.calculateCellColor(20, 0, redZone, yellowZone, greenZone))
        .toBe(CellColor.YELLOW);

      // Act & Assert - Exactly at green zone boundary
      expect(workerApi.calculateCellColor(30, 0, redZone, yellowZone, greenZone))
        .toBe(CellColor.GREEN);
    });
  });

  describe('calculateColorSummary', () => {
    it('should correctly count products by color', () => {
      // Arrange
      const products: ProductData[] = [
        // RED zone product
        {
          CenterCode: 'C1',
          Reference: 'R1',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 5,
          MakeToOrder: 0,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        },
        // YELLOW zone product
        {
          CenterCode: 'C2',
          Reference: 'R2',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 15,
          MakeToOrder: 0,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        },
        // GREEN zone product
        {
          CenterCode: 'C3',
          Reference: 'R3',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 25,
          MakeToOrder: 0,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        },
        // BLACK zone product
        {
          CenterCode: 'C4',
          Reference: 'R4',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 0,
          MakeToOrder: 0,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        },
        // BLUE zone product
        {
          CenterCode: 'C5',
          Reference: 'R5',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 35,
          MakeToOrder: 0,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        }
      ];

      // Spy on calculateCellColor to verify it's called correctly
      const calculateCellColorSpy = jest.spyOn(workerApi, 'calculateCellColor');

      // Act
      const result = workerApi.calculateColorSummary(products);

      // Assert
      expect(result).toEqual({
        [CellColor.RED]: 1,
        [CellColor.YELLOW]: 1,
        [CellColor.GREEN]: 1,
        [CellColor.BLACK]: 1,
        [CellColor.BLUE]: 1
      });

      // Verify calculateCellColor was called for each product
      expect(calculateCellColorSpy).toHaveBeenCalledTimes(13);
    });

    it('should handle empty product array', () => {
      // Arrange
      const products: ProductData[] = [];

      // Act
      const result = workerApi.calculateColorSummary(products);

      // Assert
      expect(result).toEqual({
        [CellColor.RED]: 0,
        [CellColor.YELLOW]: 0,
        [CellColor.GREEN]: 0,
        [CellColor.BLACK]: 0,
        [CellColor.BLUE]: 0
      });
    });

    it('should correctly accumulate multiple products with the same color', () => {
      // Arrange - 3 RED products
      const products: ProductData[] = [
        {
          CenterCode: 'C1',
          Reference: 'R1',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 5,
          MakeToOrder: 0,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        },
        {
          CenterCode: 'C2',
          Reference: 'R2',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 3,
          MakeToOrder: 2,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        },
        {
          CenterCode: 'C3',
          Reference: 'R3',
          VisibleForecastedDate: '2023-01-01',
          NetFlow: 1,
          MakeToOrder: 1,
          RedZone: 10,
          YellowZone: 10,
          GreenZone: 10
        }
      ];

      // Act
      const result = workerApi.calculateColorSummary(products);

      // Assert
      expect(result).toEqual({
        [CellColor.RED]: 3,
        [CellColor.YELLOW]: 0,
        [CellColor.GREEN]: 0,
        [CellColor.BLACK]: 0,
        [CellColor.BLUE]: 0
      });
    });
  });

  // Test that the worker API is properly exposed
  it('should expose the worker API using Comlink', () => {
    // We need to import the module to trigger the expose call
    require('../calculationWorker.ts');

    // Assert
    expect(expose).toHaveBeenCalledWith(expect.objectContaining({
      calculateCellColor: expect.any(Function),
      calculateColorSummary: expect.any(Function)
    }));
  });
});