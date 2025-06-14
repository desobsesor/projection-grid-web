import * as Comlink from 'comlink';
import type { CalculationWorkerType } from './calculationWorker';

/**
 * Creates and initializes the calculation worker
 * @returns A proxy to the worker API
 */
export function createCalculationWorker(): Comlink.Remote<CalculationWorkerType> {
  const worker = new Worker(
    new URL('./calculationWorker.ts', import.meta.url),
    { type: 'module' }
  );

  return Comlink.wrap<CalculationWorkerType>(worker);
}

// Create a singleton instance of the worker
let calculationWorker: Comlink.Remote<CalculationWorkerType> | null = null;

/**
 * Gets the calculation worker instance, creating it if necessary
 * @returns The calculation worker proxy
 */
export function getCalculationWorker(): Comlink.Remote<CalculationWorkerType> {
  if (!calculationWorker) {
    calculationWorker = createCalculationWorker();
  }

  return calculationWorker;
}