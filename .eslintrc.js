// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@sherpa/configs/eslintconfig.json'],
  ignorePatterns: ['apps/**', 'packages/**'],
}
