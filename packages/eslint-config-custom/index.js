module.exports = {
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        browser: true,
        node: true,
        jquery: true,
        jest: true,
    },
  extends: [
      "airbnb-typescript",
      "prettier",
      "next/core-web-vitals",
      "plugin:jest/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  plugins: [
      "jest",
      "prettier",
      "html",
      "react-hooks"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
      "project": [
          "./tsconfig.json"
      ]
  },
  rules: {
    '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [1, { ignoreRestSiblings: true }],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': [
        'warn',
        {
          ignoreDeclarationMerge: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      'no-unused-vars': 0,
      "quotes": [
          2,
          "single",
          {
              "avoidEscape": true
          }
      ],
      "no-unused-expressions": [
          1,
          {
              "allowTernary": true
          }
      ],
      "arrow-body-style": [
          "error",
          "always"
      ],
      "prettier/prettier": [
          "error",
          {
              "trailingComma": "es5",
              "singleQuote": true,
              "printWidth": 80,
              "endOfLine": "auto"
          }
      ],
      "react/prop-types": 0,
      "jsx-a11y/label-has-associated-control": [
          "error",
          {
              "required": {
                  "some": [
                      "nesting",
                      "id"
                  ]
              }
          }
      ],
      "jsx-a11y/label-has-for": [
          "error",
          {
              "required": {
                  "some": [
                      "nesting",
                      "id"
                  ]
              }
          }
      ],
      "template-curly-spacing": "off",
      "indent": "off",
      "no-console": "error",
      "import/no-extraneous-dependencies": [
          "error",
          {
              "devDependencies": [
                  "**/*.test.ts",
                  "**/*.spec.ts",
                  "**/*.test.tsx",
                  "**/*.spec.tsx",
                  "jest.setup.ts"
              ]
          }
      ],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": [
          "error"
      ],
      'no-debugger': 0,
    'no-use-before-define': "off",
    'no-alert': 0,
    'no-await-in-loop': 0,
    'no-return-assign': ['error', 'except-parens'],
    'no-restricted-syntax': [
      2,
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-unused-vars': [
      1,
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: 'res|next|^err',
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'arrow-body-style': [2, 'as-needed'],
    'no-unused-expressions': [
      2,
      {
        allowTaggedTemplates: true,
      },
    ],
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'no-console': 0,
    'import/prefer-default-export': 0,
    'import': 0,
    'func-names': 0,
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'max-len': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'react/display-name': 1,
    'react/no-array-index-key': 0,
    'react/react-in-jsx-scope': 0,
    'react/prefer-stateless-function': 0,
    'react/forbid-prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react/function-component-definition': 0,
    'jsx-a11y/accessible-emoji': 0,
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'],
      },
    ],
    radix: 0,
    'no-shadow': [
      2,
      {
        hoist: 'all',
        allow: ['resolve', 'reject', 'done', 'next', 'err', 'error'],
      },
    ],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 80,
        // below line only for windows users facing CLRF and eslint/prettier error
        // non windows users feel free to delete it
        endOfLine: 'auto',
      },
    ],
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/comma-dangle': ['off'],
    'react/jsx-props-no-spreading': 'off',
  }
}