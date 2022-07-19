/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const nextJest = require('next/jest');
const rootConfig = require('../../jest.config');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './apps/web/',
});

module.exports = createJestConfig({
  ...rootConfig,
  rootDir: './',
  displayName: 'web',
  setupFilesAfterEnv: ['./jest.setup.ts'],
});
