import { expose } from 'comlink';
import { CellColor, type ProductData } from '../../domain/types/ProductData';

/**
 * Worker API for handling intensive calculations
 */
const workerApi = {
  /**
   * Calculates the color for a cell based on product data
   * 
   * @param netFlow - The NetFlow value
   * @param makeToOrder - The MakeToOrder value
   * @param redZone - The RedZone threshold
   * @param yellowZone - The YellowZone threshold
   * @param greenZone - The GreenZone threshold
   * @returns The appropriate CellColor
   */
  calculateCellColor(
    netFlow: number,
    redZone: number,
    yellowZone: number,
    greenZone: number
  ): CellColor {
    const total = netFlow;

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
  },

  /**
   * Calculates color summary statistics for a collection of products
   * 
   * @param products - The collection of products to analyze
   * @returns A record mapping cell colors to their counts
   */
  calculateColorSummary(products: ProductData[]): Record<CellColor, number> {
    const summary: Record<CellColor, number> = {
      [CellColor.RED]: 0,
      [CellColor.YELLOW]: 0,
      [CellColor.GREEN]: 0,
      [CellColor.BLACK]: 0,
      [CellColor.BLUE]: 0
    };

    products.forEach(product => {
      const color = this.calculateCellColor(
        product.NetFlow,
        product.RedZone,
        product.YellowZone,
        product.GreenZone
      );
      summary[color]++;
    });

    return summary;
  }
};

// Expose the worker API using Comlink
expose(workerApi);

export type CalculationWorkerType = typeof workerApi;