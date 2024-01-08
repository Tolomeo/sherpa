// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('@sherpa/configs/eslintrc.lib')],
  ignorePatterns: ['apps/**', 'packages/**'],
}
