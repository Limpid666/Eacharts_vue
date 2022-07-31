module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser', // 第一行代码飘红
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 'off',
    'vue/multi-word-component-names': 'off',
    'eol-last': 0,
    'no-unused-expressions': 'off',
    'no-var': 'off',
    'no-sequences': 'off',
    'no-use-before-define': 'off',
    'no-void': 'off',
    eqeqeq: 'off',
    // eslint-disable-next-line no-dupe-keys
    'no-sequences': 'off'
  }
}
