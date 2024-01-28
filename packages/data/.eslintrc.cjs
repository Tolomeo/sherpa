module.exports = {
  root: true,
  extends: [require.resolve('@sherpa/configs/eslintrc.lib')],
  ignorePatterns: ['dist/**'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
}
