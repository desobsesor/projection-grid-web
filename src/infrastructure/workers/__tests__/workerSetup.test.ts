/**
 * @jest-environment jsdom
 */

import * as Comlink from 'comlink';
import { createCalculationWorker, getCalculationWorker, getWorkerUrl } from '../workerSetup';

// Mock the Worker constructor and Comlink.wrap
const mockWorkerInstance = {
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  terminate: jest.fn(),
};

const mockWrappedWorker = {};

global.Worker = jest.fn(() => mockWorkerInstance) as any;
// @ts-ignore
Comlink.wrap = jest.fn(() => mockWrappedWorker);

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-url');

describe('Worker setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getWorkerUrl returns the correct worker URL', () => {
    // Arrange
    const expectedUrl = `${window.location.origin}/calculationWorker.ts`;

    // Act
    const url = getWorkerUrl();

    // Assert
    expect(url).toBe(expectedUrl);
  });

  test('createCalculationWorker creates a worker and wraps it', () => {
    // Act
    const result = createCalculationWorker();

    // Assert
    expect(global.Worker).toHaveBeenCalledTimes(1);
    expect(global.Worker).toHaveBeenCalledWith(
      `${window.location.origin}/calculationWorker.ts`,
      { type: 'module' }
    );
    expect(Comlink.wrap).toHaveBeenCalledTimes(1);
    expect(Comlink.wrap).toHaveBeenCalledWith(mockWorkerInstance);
    expect(result).toBe(mockWrappedWorker);
  });

  test('getCalculationWorker returns a singleton worker', () => {
    // Act
    const worker1 = getCalculationWorker();
    const worker2 = getCalculationWorker();

    // Assert
    expect(worker1).toBe(worker2);
    expect(global.Worker).toHaveBeenCalledTimes(1);
    expect(Comlink.wrap).toHaveBeenCalledTimes(1);
  });
});