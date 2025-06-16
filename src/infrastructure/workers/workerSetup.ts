import * as Comlink from 'comlink';
import type { CalculationWorkerType } from './calculationWorker';

/**
 * Helper function to get the worker URL
 * This abstraction makes testing easier
 */
export function getWorkerUrl(): string {
  // In test environment, this will be mocked
  // In production, it will use the actual URL
  // Using window.location.origin to construct the URL to avoid import.meta.url issues
  return `${window.location.origin}/calculationWorker.ts`;
}

/**
 * Creates and initializes the calculation worker
 * @returns A proxy to the worker API
 */
export function createCalculationWorker(): Comlink.Remote<CalculationWorkerType> {
  const workerUrl = getWorkerUrl();
  const worker = new Worker(workerUrl, { type: 'module' });

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