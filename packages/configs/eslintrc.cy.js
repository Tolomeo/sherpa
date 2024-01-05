const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

module.exports = {
  plugins: ['prettier', 'cypress'],
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('eslint-config-turbo'),
    'plugin:cypress/recommended',
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['node_modules/'],
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
  },
}
