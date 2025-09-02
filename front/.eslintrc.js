module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // 设置为 "off" 禁用所有规则
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    // 其他规则也设为 off
  }
}
