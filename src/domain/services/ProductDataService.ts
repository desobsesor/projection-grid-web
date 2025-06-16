import { CellColor, type ProductData, type ProductDataResponse } from '../types/ProductData';

/**
 * Service for handling product data operations
 */
export class ProductDataService {
  /**
   * Loads product data from a JSON file
   * @param jsonData The JSON data to parse
   * @returns Array of ProductData objects
   */
  static loadProductData(jsonData: string): ProductData[] {
    try {
      const parsedData: ProductDataResponse = JSON.parse(jsonData);
      return Array.isArray(parsedData.Datos) ? parsedData.Datos : [parsedData.Datos];
    } catch (error) {
      return [];
    }
  }

  /**
   * Determines the cell color based on calculation rules
   * @param netFlow The NetFlow value
   * @param makeToOrder The MakeToOrder value
   * @param redZone The RedZone threshold
   * @param yellowZone The YellowZone threshold
   * @param greenZone The GreenZone threshold
   * @returns The appropriate CellColor
   */
  static calculateCellColor(
    netFlow: number,
    makeToOrder: number,
    redZone: number,
    yellowZone: number,
    greenZone: number
  ): CellColor {
    const total = netFlow + makeToOrder;

    if (total == 0) {
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
  }

  /**
   * Organizes product data by date for grid display
   * @param products Array of ProductData objects
   * @returns Organized data structure for grid display
   */
  static organizeDataByDate(products: ProductData[]): Map<string, Map<string, ProductData>> {
    const organizedData = new Map<string, Map<string, ProductData>>();

    products.forEach(product => {
      // Use local date parts instead of UTC conversion to prevent date shifting
      const dateObj = new Date(product.VisibleForecastedDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const date = `${year}-${month}-${day}`;

      if (!organizedData.has(date)) {
        organizedData.set(date, new Map<string, ProductData>());
      }

      const dateMap = organizedData.get(date)!;
      dateMap.set(product.Reference, product);
    });

    return organizedData;
  }
}