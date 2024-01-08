const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

module.exports = {
  plugins: ['prettier'],
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
    require.resolve('eslint-config-turbo'),
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'prefer-named-capture-group': 'off',
    'prettier/prettier': 'warn',
    'eslint-comments/require-description': 'warn',
    'import/no-default-export': 'off',
    'unicorn/filename-case': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    'react/jsx-sort-props': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-no-leaked-render': 'off',
  },
}
