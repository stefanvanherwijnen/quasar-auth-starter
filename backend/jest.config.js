// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  clearMocks: true,

  globalSetup: "<rootDir>/test/environment/setup.js",

  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "jsx",
    "tsx",
    "node"
  ],

  testEnvironment: "<rootDir>/test/environment/env.js",
};
