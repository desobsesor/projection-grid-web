import { CellColor, type ProductData } from '../../types/ProductData';
import { ProductDataService } from '../ProductDataService';

describe('ProductDataService', () => {
  describe('loadProductData', () => {
    it('should parse valid JSON data with array', () => {
      // Arrange
      const jsonData = JSON.stringify({
        Datos: [
          { Reference: 'REF1', NetFlow: 10, MakeToOrder: 5 },
          { Reference: 'REF2', NetFlow: 20, MakeToOrder: 10 }
        ]
      });

      // Act
      const result = ProductDataService.loadProductData(jsonData);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].Reference).toBe('REF1');
      expect(result[1].Reference).toBe('REF2');
    });

    it('should parse valid JSON data with single object', () => {
      // Arrange
      const jsonData = JSON.stringify({
        Datos: { Reference: 'REF1', NetFlow: 10, MakeToOrder: 5 }
      });

      // Act
      const result = ProductDataService.loadProductData(jsonData);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].Reference).toBe('REF1');
    });

    it('should return empty array on invalid JSON', () => {
      // Arrange
      const jsonData = 'invalid json';

      // Act
      const result = ProductDataService.loadProductData(jsonData);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle missing Datos property', () => {
      // Arrange
      const jsonData = JSON.stringify({ OtherProperty: 'value' });

      // Act
      const result = ProductDataService.loadProductData(jsonData);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('calculateCellColor', () => {
    it('should return BLACK when total is 0', () => {
      // Act
      const result = ProductDataService.calculateCellColor(0, 0, 10, 20, 30);

      // Assert
      expect(result).toBe(CellColor.BLACK);
    });

    it('should return RED when total is between 1 and redZone', () => {
      // Act
      const result1 = ProductDataService.calculateCellColor(1, 0, 10, 20, 30);
      const result2 = ProductDataService.calculateCellColor(5, 5, 10, 20, 30);

      // Assert
      expect(result1).toBe(CellColor.RED);
      expect(result2).toBe(CellColor.RED);
    });

    it('should return YELLOW when total is between redZone and redZone+yellowZone', () => {
      // Act
      const result1 = ProductDataService.calculateCellColor(11, 0, 10, 20, 30);
      const result2 = ProductDataService.calculateCellColor(5, 15, 10, 20, 30);

      // Assert
      expect(result1).toBe(CellColor.YELLOW);
      expect(result2).toBe(CellColor.YELLOW);
    });

    it('should return GREEN when total is between redZone+yellowZone and redZone+yellowZone+greenZone', () => {
      // Act
      const result1 = ProductDataService.calculateCellColor(31, 0, 10, 20, 30);
      const result2 = ProductDataService.calculateCellColor(15, 25, 10, 20, 30);

      // Assert
      expect(result1).toBe(CellColor.GREEN);
      expect(result2).toBe(CellColor.GREEN);
    });

    it('should return BLUE when total exceeds all zones', () => {
      // Act
      const result = ProductDataService.calculateCellColor(50, 20, 10, 20, 30);

      // Assert
      expect(result).toBe(CellColor.BLUE);
    });
  });

  describe('organizeDataByDate', () => {
    it('should organize products by date', () => {
      // Arrange
      const products: ProductData[] = [
        {
          Reference: 'REF1',
          CenterCode: 'C1',
          VisibleForecastedDate: '2023-01-15T00:00:00',
          NetFlow: 10,
          MakeToOrder: 5,
          RedZone: 10,
          YellowZone: 20,
          GreenZone: 30
        },
        {
          Reference: 'REF2',
          CenterCode: 'C2',
          VisibleForecastedDate: '2023-01-15T00:00:00',
          NetFlow: 20,
          MakeToOrder: 10,
          RedZone: 15,
          YellowZone: 25,
          GreenZone: 35
        },
        {
          Reference: 'REF1',
          CenterCode: 'C1',
          VisibleForecastedDate: '2023-01-16T00:00:00',
          NetFlow: 30,
          MakeToOrder: 15,
          RedZone: 10,
          YellowZone: 20,
          GreenZone: 30
        }
      ];

      // Act
      const result = ProductDataService.organizeDataByDate(products);

      // Assert
      expect(result.size).toBe(2); // Two unique dates
      expect(result.has('2023-01-15')).toBe(true);
      expect(result.has('2023-01-16')).toBe(true);

      const jan15Map = result.get('2023-01-15')!;
      expect(jan15Map.size).toBe(2); // Two products on Jan 15
      expect(jan15Map.has('REF1')).toBe(true);
      expect(jan15Map.has('REF2')).toBe(true);
      expect(jan15Map.get('REF1')!.NetFlow).toBe(10);
      expect(jan15Map.get('REF2')!.NetFlow).toBe(20);

      const jan16Map = result.get('2023-01-16')!;
      expect(jan16Map.size).toBe(1); // One product on Jan 16
      expect(jan16Map.has('REF1')).toBe(true);
      expect(jan16Map.get('REF1')!.NetFlow).toBe(30);
    });

    it('should handle empty product array', () => {
      // Act
      const result = ProductDataService.organizeDataByDate([]);

      // Assert
      expect(result.size).toBe(0);
    });

    it('should correctly format date from VisibleForecastedDate', () => {
      // Arrange
      const products: ProductData[] = [
        {
          Reference: 'REF1',
          CenterCode: 'C1',
          VisibleForecastedDate: '2023-01-15T12:30:45',
          NetFlow: 10,
          MakeToOrder: 5,
          RedZone: 10,
          YellowZone: 20,
          GreenZone: 30
        }
      ];

      // Act
      const result = ProductDataService.organizeDataByDate(products);

      // Assert
      expect(result.has('2023-01-15')).toBe(true);
    });
  });
});