module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['.next', 'node_modules'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/test.spec.[jt]s?(x)'],
  projects: ['**/apps/*'],
};
