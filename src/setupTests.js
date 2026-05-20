import '@testing-library/jest-dom';

// Mock clipboard API (not available in jsdom by default)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: jest.fn().mockResolvedValue(undefined) },
  writable: true,
});

// Suppress window.alert calls in tests
window.alert = jest.fn();
