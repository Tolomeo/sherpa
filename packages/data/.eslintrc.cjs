module.exports = {
  root: true,
  extends: [require.resolve('@sherpa/configs/eslintrc.lib')],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['dist/**'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
}
