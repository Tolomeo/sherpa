module.exports = {
  root: true,
  extends: ['sherpa/lib'],
  ignorePatterns: ['types/**', 'dist/**'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
}
