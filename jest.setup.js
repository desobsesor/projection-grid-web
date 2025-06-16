// jest.setup.js
// This file sets up the test environment for Jest

// Ensure global.window exists for jsdom environment
if (typeof global.window === 'undefined') {
  global.window = global;
}

// Mock Worker for tests
if (typeof global.Worker === 'undefined') {
  global.Worker = class MockWorker {
    constructor() {
      this.postMessage = jest.fn();
      this.addEventListener = jest.fn();
      this.removeEventListener = jest.fn();
      this.terminate = jest.fn();
    }
  };
}

// Mock URL.createObjectURL for tests
if (typeof global.URL === 'undefined') {
  global.URL = class MockURL {
    constructor(url) {
      this.url = url;
      this.toString = () => url;
      this.href = url;
    }

    static createObjectURL = jest.fn(() => 'mock-object-url');
    static revokeObjectURL = jest.fn();
  };
}

// Mock import.meta.url for tests
Object.defineProperty(global, 'import', {
  value: { meta: { url: 'http://localhost/test' } },
  writable: true
});

// Ensure global.window exists for jsdom environment
if (typeof global.window === 'undefined') {
  global.window = global;
}