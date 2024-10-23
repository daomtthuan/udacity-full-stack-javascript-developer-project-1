/** @import {Config} from 'jest' */

/** @type {Config} */
export default {
  bail: 5,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/test/scripts'],
  slowTestThreshold: 5,
  testEnvironment: 'node',
  testLocationInResults: true,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  testRunner: 'jest-circus/runner',
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  transformIgnorePatterns: ['\\\\node_modules\\\\'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '~Controllers/(.*)': '<rootDir>/src/Controllers/$1',
    '~Core/(.*)': '<rootDir>/src/Core/$1',
    '~Middlewares/(.*)': '<rootDir>/src/Middlewares/$1',
    '~Models/(.*)': '<rootDir>/src/Models/$1',
    '~Services/(.*)': '<rootDir>/src/Services/$1',
    '~Utils/(.*)': '<rootDir>/src/Utils/$1',
  },
};
