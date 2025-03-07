const { resolve } = require('node:path')

module.exports = {
  root: true,
  extends: [require.resolve('@sherpa/configs/eslintrc.lib')],
  parserOptions: {
    project: resolve(__dirname, 'tsconfig.json'),
  },
  ignorePatterns: ['dist/**'],
  rules: {
    'no-console': 'off',
    'no-await-in-loop': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/prefer-reduce-type-parameter': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
      },
    },
  ],
}
