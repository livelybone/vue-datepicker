module.exports = {
  'parserOptions': {
    'parser': 'babel-eslint',
  },
  'plugins': [
    'vue',
    'prettier'
  ],
  'extends': [
    'airbnb-base',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
  ],
  'rules': {
    'prettier/prettier': 'error',
  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', 'jsx', '.vue'],
      },
    },
  },
}
