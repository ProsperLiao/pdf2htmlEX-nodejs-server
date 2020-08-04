module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended', // 使用eslint推荐规则
    'airbnb-typescript/base', // 使用Airbnb的规则
    'plugin:jsdoc/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // 使用 @typescript-eslint/eslint-plugin 推荐规则
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // 使用推荐规则，与类型检查相关
    'prettier',
    'prettier/@typescript-eslint', // 使用 eslint-config-prettier 禁用来自 @typescript-eslint/eslint-plugin 与 prettier 冲突的eslint规则
    'plugin:prettier/recommended', // 开启 eslint-plugin-prettier 和 eslint-config-prettier. 这会把 prettier 的错误显示为 ESLint 的错误. 确保此配置总在最后!!
  ],
  parser: '@typescript-eslint/parser', // 指定解析器
  parserOptions: {
    project: 'tsconfig.eslint.json',
    ecmaVersion: 2020, // 允许解析最新的 ECMAScript 特性
    sourceType: 'module', // 允许使用 imports
  },
  plugins: ['@typescript-eslint', 'jsdoc', 'prefer-arrow', 'import'],
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    // 指定规则，或覆盖推荐集中已存在的规则
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
      },
    ],
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: false, allowPattern: '^[a-z]+(_[a-z]+)+$' }],
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit',
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
      },
    ],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'always',
        types: 'prefer-import',
        lib: 'always',
      },
    ],
    '@typescript-eslint/unbound-method': [
      'error',
      {
        ignoreStatic: true,
      },
    ],
    '@typescript-eslint/unified-signatures': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    camelcase: 'error',
    complexity: ['error', { max: 10 }],
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    // 'id-blacklist': ['error', 'data', 'err', 'e', 'cb', 'callback'],
    'import/no-deprecated': 'warn',
    'import/order': [
      'error',
      {
        groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
          },
          {
            pattern: '@app/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'max-classes-per-file': ['error', 3],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        comments: 65,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(',
      },
    ],
    'no-array-constructor': 'error',
    'no-bitwise': ['error', { allow: ['~'] }],
    'no-caller': 'error',
    'no-console': [
      'error',
      {
        allow: [
          'log',
          'warn',
          'dir',
          'timeLog',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupEnd',
          'table',
          'dirxml',
          'error',
          'groupCollapsed',
          'Console',
          'profile',
          'profileEnd',
          'timeStamp',
          'context',
        ],
      },
    ],
    'no-eval': ['error', { allowIndirect: true }],
    'no-invalid-this': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
      },
    ],
    'no-new-wrappers': 'error',
    'no-restricted-imports': ['error', 'rxjs/Rx'],
    'no-shadow': [
      'error',
      {
        hoist: 'all',
      },
    ],
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'off',
    'no-var': 'error',
    'object-shorthand': [
      'error',
      'always',
      { avoidQuotes: true, ignoreConstructors: true, avoidExplicitReturnArrows: true },
    ],
    'one-var': ['error', 'consecutive'],
    'prefer-arrow/prefer-arrow-functions': [
      'warn',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'prefer-const': ['error', { destructuring: 'all' }],
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'as-needed'],
    radix: ['error', 'as-needed'],
    'require-await': 'error',
    'space-in-parens': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ],
  },
  overrides: [],
};
