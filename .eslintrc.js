module.exports = {
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
  },
  'plugins': [
    '@typescript-eslint',
    'vue',
    'prettier'
  ],
  'extends': [
    'airbnb-base',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
  ],
  'rules': {
    'no-useless-constructor': 0,
    'no-undef': 2,
    'import/prefer-default-export': 0,
    "@typescript-eslint/no-unused-vars": 1,
    'prettier/prettier': 2,
    'no-console': [2, { allow: ["warn", "error"] }],
    'no-shadow': 2,
    'import/extensions': 0,
    'no-param-reassign': 0,
    'no-nested-ternary': 0,
  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      },
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
  },
}
