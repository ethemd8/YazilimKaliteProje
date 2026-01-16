// Jest config - Coverage threshold sadece tüm testler birlikte çalıştırıldığında kontrol edilir
// Integration ve E2E testler ayrı çalıştırıldığında threshold kontrolü yapılmaz
// process.argv içinde test path kontrolü yaparak threshold'u koşullu olarak aktif ediyoruz
const testArgs = process.argv.join(' ');
const isIntegrationOrE2E = testArgs.includes('tests/integration') || testArgs.includes('tests/e2e');
const hasCoverage = testArgs.includes('--coverage');

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  // Coverage threshold sadece tüm testler birlikte çalıştırıldığında kontrol edilir
  ...(hasCoverage && !isIntegrationOrE2E && {
    coverageThreshold: {
      global: {
        branches: 45,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
  }),
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/database/migrate.js',
    '!src/database/seed.js',
    '!src/app.js',
    '!src/utils/validators.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  testMatch: ['**/tests/**/*.test.js'],
};
