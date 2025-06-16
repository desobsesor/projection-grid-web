// Export named exports to match the actual comlink module
export const wrap = jest.fn(() => ({}));
export const expose = jest.fn();
export const proxy = jest.fn((obj) => obj);

// Also export as default for modules that might use default import
export default {
  wrap,
  expose,
  proxy
};