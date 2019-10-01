module.exports = {
  root: true,
  extends: [
    "plugin:jest/recommended"
  ],
  env: {
    es6: true,
    amd: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8, 
    sourceType: "module"
  },
  overrides: [
    {
      files: [
        "**/*.test.js"
      ],
      env: {
        jest: true // now **/*.test.js files' env has both es6 *and* jest
      },
      // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
      // "extends": ["plugin:jest/recommended"]
      plugins: ["jest"],
      rules: {
        "eol-last": ["error", "always"],
        "semi": ["error", "never"],
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
      }
    }
  ],
};