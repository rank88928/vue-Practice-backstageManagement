// eslint.config.js

module.exports = [
  // 忽略的文件或目錄
  {
    ignores: ['node_modules/', 'dist/', 'public/'],
  },

  // 主配置
  {
    files: ['**/*.js', '**/*.vue'], // 針對所有 JS 和 Vue 文件進行配置
    languageOptions: {
      ecmaVersion: 'latest', // 最新的 JS 語法
      sourceType: 'module', // 使用模塊化系統
      globals: {
        process: 'readonly', // 設定全局變數，`process` 為只讀
      },
      parserOptions: {
        ecmaVersion: 2020, // JS 解析器使用的版本
        sourceType: 'module', // 使用模塊化系統
      },
      // 將 parser 配置為對象
      parser: require('vue-eslint-parser'), // 使用 vue-eslint-parser 解析 .vue 文件
    },
    plugins: {
      vue: require('eslint-plugin-vue'), // 引入 Vue 插件
      prettier: require('eslint-plugin-prettier'), // 引入 Prettier 插件
    },
    rules: {
      // 使用自定義規則
      'vue/multi-word-component-names': 'off', // 關閉多單詞 Vue 組件名稱的規則
      semi: ['error', 'always'], // 強制使用分號
      quotes: ['error', 'single'], // 強制使用單引號
      indent: ['error', 2], // 強制使用 2 個空格縮排
      'prettier/prettier': ['error'], // 启用 Prettier 规则并與 ESLint 结合
      'dot-notation': 'off', // 關閉 dot-notation 規則
      'max-len': ['error', { code: 150, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }], // 允許 URL 或模板字符串超過行長
      // printWidth: 140,
    },
  },

  // 針對 .vue 文件的額外規則
  {
    files: ['*.vue'], // 只針對 .vue 文件
    rules: {
      'vue/attribute-hyphenation': ['error', 'always'], // 強制屬性使用連字符命名
    },
  },
];
