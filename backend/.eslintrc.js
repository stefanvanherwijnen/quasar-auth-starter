module.exports = {
    "parser": '@typescript-eslint/parser',
    "plugins": ['@typescript-eslint'],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "rules": {
        "eol-last": ["error", "always"],
        "quotes": ["error", "single"],
        "semi": ["error", "never"],
        "indent": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "(next|res|req)" }],
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/member-delimiter-style": ["error", {
            "singleline": {
                "delimiter": "comma"
            },
            "multiline": {
                "delimiter": "comma"
            }
        }]
    }
};