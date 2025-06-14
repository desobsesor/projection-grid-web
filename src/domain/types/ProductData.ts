/**
 * Represents the product projection data structure
 * 
 * @property CenterCode - The center code identifier
 * @property Reference - The product reference
 * @property VisibleForecastedDate - The forecasted date visible to users
 * @property NetFlow - The net flow value
 * @property GreenZone - The green zone threshold
 * @property YellowZone - The yellow zone threshold
 * @property RedZone - The red zone threshold
 * @property MakeToOrder - The make-to-order value
 */
export interface ProductData {
  CenterCode: string;
  Reference: string;
  VisibleForecastedDate: string;
  NetFlow: number;
  GreenZone: number;
  YellowZone: number;
  RedZone: number;
  MakeToOrder: number;
}

/**
 * Represents the JSON structure received from the data source
 * 
 * @property Datos - An array of product data
 */
export interface ProductDataResponse {
  Datos: ProductData[];
}

/**
 * Represents a cell's color based on calculation rules
 * 
 * @property RED - Red color
 * @property YELLOW - Yellow color
 * @property GREEN - Green color
 * @property BLACK - Black color
 * @property BLUE - Blue color
 */
export enum CellColor {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLACK = 'black',
  BLUE = 'blue'
}

/**
 * Represents a summary of cell colors for statistics
 * 
 * @property RED - The count of red cells
 * @property YELLOW - The count of yellow cells
 * @property GREEN - The count of green cells
 * @property BLACK - The count of black cells
 * @property BLUE - The count of blue cells
 * @property total - The total count of cells
 */
export interface ColorSummary {
  [CellColor.RED]: number;
  [CellColor.YELLOW]: number;
  [CellColor.GREEN]: number;
  [CellColor.BLACK]: number;
  [CellColor.BLUE]: number;
  total: number;
}
