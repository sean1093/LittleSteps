import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Firebase functions
const mockRef = vi.fn();
const mockSet = vi.fn().mockResolvedValue(undefined);
const mockOnValue = vi.fn((_ref, callback) => {
  // Call callback with empty data
  callback({ val: () => null });
  // Return unsubscribe function
  return vi.fn();
});
const mockRemove = vi.fn().mockResolvedValue(undefined);

vi.mock('../lib/firebase', () => ({
  database: { _checkNotDeleted: vi.fn() },
  auth: { currentUser: null },
  analytics: {},
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

// Mock Firebase database functions
vi.mock('firebase/database', () => ({
  ref: mockRef,
  set: mockSet,
  onValue: mockOnValue,
  remove: mockRemove,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
