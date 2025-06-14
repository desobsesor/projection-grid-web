import { create } from 'zustand';
import { CellColor, type ColorSummary, type ProductData } from '../../domain/types/ProductData';
import { ProductDataService } from '../../domain/services/ProductDataService';

interface ProductState {
  // Raw data
  products: ProductData[];

  // Organized data for grid display
  organizedData: Map<string, Map<string, ProductData>>;

  // Unique dates and references for grid headers
  dates: string[];
  references: string[];

  // Color summary for statistics
  colorSummary: ColorSummary;

  // Selected date for summary view
  selectedDate: string | null;

  // Actions
  loadProducts: (jsonData: string) => void;
  updateMakeToOrder: (reference: string, date: string, value: number) => void;
  selectDate: (date: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  organizedData: new Map(),
  dates: [],
  references: [],
  colorSummary: {
    [CellColor.RED]: 0,
    [CellColor.YELLOW]: 0,
    [CellColor.GREEN]: 0,
    [CellColor.BLACK]: 0,
    [CellColor.BLUE]: 0,
    total: 0
  },
  selectedDate: null,

  loadProducts: (jsonData: string) => {
    const products = ProductDataService.loadProductData(jsonData);
    const organizedData = ProductDataService.organizeDataByDate(products);

    // Extract unique dates and references
    const dates = Array.from(organizedData.keys()).sort();

    const referenceSet = new Set<string>();
    products.forEach(product => {
      referenceSet.add(product.Reference);
    });
    const references = Array.from(referenceSet).sort();

    // Set initial selected date
    const initialSelectedDate = dates.length > 0 ? dates[0] : null;

    // Calculate initial color summary for the selected date
    const colorSummary = initialSelectedDate
      ? calculateColorSummaryForDate(products, initialSelectedDate)
      : calculateColorSummary(products);

    set({
      products,
      organizedData,
      dates,
      references,
      colorSummary,
      selectedDate: initialSelectedDate
    });
  },

  updateMakeToOrder: (reference: string, date: string, value: number) => {
    const { organizedData, products, selectedDate } = get();

    // Update in organized data
    const dateMap = organizedData.get(date);
    if (dateMap && dateMap.has(reference)) {
      const product = dateMap.get(reference)!;
      product.MakeToOrder = value;
      dateMap.set(reference, product);
    }

    // Update in raw products array
    const updatedProducts = products.map(product => {
      if (product.Reference === reference &&
        new Date(product.VisibleForecastedDate).toISOString().split('T')[0] === date) {
        return { ...product, MakeToOrder: value };
      }
      return product;
    });

    // Recalculate color summary based on selected date
    const colorSummary = selectedDate
      ? calculateColorSummaryForDate(updatedProducts, selectedDate)
      : calculateColorSummary(updatedProducts);

    set({
      products: updatedProducts,
      organizedData: new Map(organizedData),
      colorSummary
    });
  },

  selectDate: (date: string) => {
    const { products } = get();

    // Calculate color summary for the selected date
    const colorSummary = calculateColorSummaryForDate(products, date);

    set({
      selectedDate: date,
      colorSummary
    });
  }
}));

/**
 * Helper function to calculate color summary statistics for all products
 * 
 * @param products - The collection of products to analyze
 * @returns A record mapping cell colors to their counts
 */
function calculateColorSummary(products: ProductData[]): ColorSummary {
  const summary: ColorSummary = {
    [CellColor.RED]: 0,
    [CellColor.YELLOW]: 0,
    [CellColor.GREEN]: 0,
    [CellColor.BLACK]: 0,
    [CellColor.BLUE]: 0,
    total: products.length
  };

  products.forEach(product => {
    const color = ProductDataService.calculateCellColor(
      product.NetFlow,
      product.MakeToOrder,
      product.RedZone,
      product.YellowZone,
      product.GreenZone
    );
    summary[color]++;
  });

  return summary;
}

/**
 * Helper function to calculate color summary statistics for products of a specific date
 * 
 * @param products - The collection of products to analyze
 * @param date - The selected date for which to calculate the summary
 * @returns A record mapping cell colors to their counts
 */
function calculateColorSummaryForDate(products: ProductData[], date: string): ColorSummary {
  // Filter products for the selected date
  const dateProducts = products.filter(product => {
    const productDate = new Date(product.VisibleForecastedDate).toISOString().split('T')[0];
    return productDate === date;
  });

  const summary: ColorSummary = {
    [CellColor.RED]: 0,
    [CellColor.YELLOW]: 0,
    [CellColor.GREEN]: 0,
    [CellColor.BLACK]: 0,
    [CellColor.BLUE]: 0,
    total: dateProducts.length
  };

  dateProducts.forEach(product => {
    const color = ProductDataService.calculateCellColor(
      product.NetFlow,
      product.MakeToOrder,
      product.RedZone,
      product.YellowZone,
      product.GreenZone
    );
    summary[color]++;
  });

  return summary;
}