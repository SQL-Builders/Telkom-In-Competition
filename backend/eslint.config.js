import js from '@eslint/js';

const globals = {
  Buffer: 'readonly',
  __dirname: 'readonly',
  afterAll: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  beforeEach: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  fetch: 'readonly',
  it: 'readonly',
  jest: 'readonly',
  process: 'readonly',
  setTimeout: 'readonly',
  test: 'readonly',
  URL: 'readonly',
};

export default [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
