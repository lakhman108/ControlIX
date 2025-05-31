import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/components/ui/**']
  },
  js.configs.recommended,
  {
    files: ['client/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      globals: {
        window: 'readonly', // Allow `window`
        console: 'readonly', // Allow `console`,
        process: 'readonly', // Allow `process`,
        document: 'readonly',
        Node: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLInputElement: 'readonly',
        fetch: "readonly",
        clearTimeout: "readonly",
        setTimeout: "readonly"
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused parameters prefixed with `_`
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
