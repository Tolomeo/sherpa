module.exports = {
  root: true,
  extends: [require.resolve('@sherpa/configs/eslintrc.app')],
  ignorePatterns: ['node_modules/', 'dist/', 'cypress/'],
  rules: {
    '@typescript-eslint/no-var-requires': 'warn',
  },
}
